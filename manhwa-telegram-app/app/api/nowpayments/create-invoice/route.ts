import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

const bodySchema = z.object({
  type: z.enum(["WALLET_TOPUP", "SUBSCRIPTION"]),
  amountCents: z.number().int().positive(),
  payCurrency: z.enum(["TRX", "TON"]).default("TRX"),
  planId: z.string().optional(),
  orderId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { type, amountCents, payCurrency, planId } = bodySchema.parse(json);

    // TODO: replace with real auth (Telegram WebApp initData)
    const userIdHeader = req.headers.get("x-user-id");
    if (!userIdHeader) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: userIdHeader } });
    if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

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
    };

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