import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@/app/generated/prisma";
import { requireUser } from "@/app/lib/auth";

const prisma = new PrismaClient();

const bodySchema = z.object({
  type: z.enum(["WALLET_TOPUP", "SUBSCRIPTION"]),
  amountCents: z.number().int().nonnegative().default(0),
  payCurrency: z.enum(["TRX", "TON"]).default("TRX"),
  planId: z.string().optional(),
  orderId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const json = await req.json();
    const { type, payCurrency, planId } = bodySchema.parse(json);

    let amountCents = json.amountCents ?? 0;
    if (type === "SUBSCRIPTION") {
      if (!planId) return NextResponse.json({ error: "planId required" }, { status: 400 });
      const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
      if (!plan || !plan.isActive) return NextResponse.json({ error: "invalid plan" }, { status: 400 });
      amountCents = plan.priceCents;
    }

    if (type === "WALLET_TOPUP" && amountCents <= 0) {
      return NextResponse.json({ error: "amountCents > 0 required for topup" }, { status: 400 });
    }

    const orderId = json.orderId || `rh_${Date.now()}`;

    const apiKey = process.env.NOWPAYMENTS_API_KEY as string;
    const baseUrl = process.env.NOWPAYMENTS_BASE_URL || "https://api.nowpayments.io/v1";
    const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET as string;

    if (!apiKey || !ipnSecret) {
      return NextResponse.json({ error: "Misconfigured NOWPayments env" }, { status: 500 });
    }

    const priceAmount = amountCents / 100;

    const createPayload = {
      price_amount: priceAmount,
      price_currency: "USD",
      pay_currency: payCurrency,
      ipn_callback_url: `${process.env.TELEGRAM_BOT_WEBAPP_URL}/api/nowpayments/ipn`,
      order_id: orderId,
      order_description: type,
      success_url: `${process.env.TELEGRAM_BOT_WEBAPP_URL}/payment/success?orderId=${orderId}`,
      cancel_url: `${process.env.TELEGRAM_BOT_WEBAPP_URL}/payment/cancel?orderId=${orderId}`,
    } as const;

    const res = await fetch(`${baseUrl}/invoice`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createPayload),
      cache: "no-store",
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: "NOWPayments error", detail: err }, { status: 502 });
    }

    const data = await res.json();

    await prisma.payment.create({
      data: {
        userId: user.id,
        type: type as any,
        amountCents,
        priceCurrency: "USD",
        payCurrency,
        status: "PENDING",
        orderId,
        invoiceId: data.id?.toString?.() ?? data.invoice_id?.toString?.(),
        invoiceUrl: data.invoice_url,
        planId: planId ?? null,
      },
    });

    return NextResponse.json({
      orderId,
      invoiceId: data.id ?? data.invoice_id,
      invoiceUrl: data.invoice_url,
    });
  } catch (e: any) {
    return NextResponse.json({ error: "BAD_REQUEST", detail: e.message }, { status: 400 });
  }
}