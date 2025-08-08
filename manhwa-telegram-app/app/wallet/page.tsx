"use client";
import { useEffect, useState } from "react";

export default function WalletPage() {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/wallet/me").then(async (r) => {
      const j = await r.json();
      if (j?.balanceCents !== undefined) setBalance(j.balanceCents);
    });
  }, []);

  async function topup(amountCents: number, payCurrency: "TRX" | "TON") {
    setLoading(true);
    try {
      const res = await fetch("/api/nowpayments/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "WALLET_TOPUP", amountCents, payCurrency }),
      });
      const j = await res.json();
      if (j.invoiceUrl) window.open(j.invoiceUrl, "_blank");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold">کیف پول</h2>
      <div className="rounded-xl border border-accent/30 p-4 flex items-center justify-between">
        <span>موجودی</span>
        <strong>{balance !== null ? `${(balance / 100).toFixed(2)} $` : "—"}</strong>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button disabled={loading} onClick={() => topup(500, "TRX")} className="rounded-full bg-accent text-accent-foreground px-4 py-2">شارژ 5$ (TRX)</button>
        <button disabled={loading} onClick={() => topup(500, "TON")} className="rounded-full bg-accent text-accent-foreground px-4 py-2">شارژ 5$ (TON)</button>
      </div>
    </main>
  );
}