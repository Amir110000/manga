import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

function verifySignature(rawBody: string, signature: string | null, secret: string) {
  if (!signature) return false;
  const hmac = crypto.createHmac("sha512", secret);
  hmac.update(rawBody, "utf8");
  const digest = hmac.digest("hex");
  return digest === signature;
}

export async function POST(req: NextRequest) {
  try {
    const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET as string;
    const signature = req.headers.get("x-nowpayments-sig");

    const raw = await req.text();
    if (!verifySignature(raw, signature, ipnSecret)) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const body = JSON.parse(raw);
    const orderId: string | undefined = body.order_id;
    const paymentStatus: string | undefined = body.payment_status; // e.g., finished, partially_paid, failed, expired
    const payAmount: number | undefined = body.pay_amount ? Number(body.pay_amount) : undefined;
    const payCurrency: string | undefined = body.pay_currency;

    if (!orderId) return NextResponse.json({ ok: true });

    const payment = await prisma.payment.findUnique({ where: { orderId } });
    if (!payment) return NextResponse.json({ ok: true });

    if (paymentStatus === "finished") {
      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { orderId },
          data: {
            status: "CONFIRMED",
            providerPaymentId: body.payment_id?.toString?.(),
          },
        });

        // Wallet top-up
        if (payment.type === "WALLET_TOPUP") {
          await tx.wallet.update({
            where: { userId: payment.userId },
            data: { balance: { increment: Math.round((payAmount ?? 0) * 100) } },
          });
          await tx.transaction.create({
            data: {
              userId: payment.userId,
              amount: Math.round((payAmount ?? 0) * 100),
              type: "DEPOSIT",
              description: `NOWPayments ${payCurrency}`,
            },
          });
        }

        // Subscription activation
        if (payment.type === "SUBSCRIPTION" && payment.planId) {
          const plan = await tx.subscriptionPlan.findUnique({ where: { id: payment.planId } });
          if (plan) {
            const now = new Date();
            const ends = new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
            await tx.subscription.create({
              data: {
                userId: payment.userId,
                planId: plan.id,
                startsAt: now,
                endsAt: ends,
                isActive: true,
              },
            });
          }
        }
      });
    } else if (paymentStatus === "partially_paid") {
      await prisma.payment.update({ where: { orderId }, data: { status: "PARTIALLY_PAID" } });
    } else if (paymentStatus === "failed") {
      await prisma.payment.update({ where: { orderId }, data: { status: "FAILED" } });
    } else if (paymentStatus === "expired") {
      await prisma.payment.update({ where: { orderId }, data: { status: "EXPIRED" } });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}