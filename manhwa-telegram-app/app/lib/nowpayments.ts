export const NOWPAY_BASE_URL = process.env.NOWPAYMENTS_BASE_URL || "https://api.nowpayments.io/v1";

export const ALLOWED_COINS = (process.env.NOWPAYMENTS_ALLOWED_COINS || "TRX,TON").split(",").map((s) => s.trim().toUpperCase());

export function assertAllowedCoin(symbol: string) {
  if (!ALLOWED_COINS.includes(symbol.toUpperCase())) {
    throw new Error("Coin not allowed");
  }
}