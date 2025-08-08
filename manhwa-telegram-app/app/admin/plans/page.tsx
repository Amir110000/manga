"use client";
import { useEffect, useState } from "react";

type Plan = { id: string; name: string; priceCents: number; durationDays: number; isActive: boolean };

export default function AdminPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(5);
  const [days, setDays] = useState(30);

  async function load() {
    const r = await fetch("/api/subscriptions/plans");
    const j = await r.json();
    setPlans(j.plans || []);
  }

  useEffect(() => { load(); }, []);

  async function create() {
    await fetch("/api/admin/plans", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, priceCents: Math.round(price*100), durationDays: days })});
    setName(""); setPrice(5); setDays(30); load();
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <h2 className="text-xl font-bold">پلنها</h2>
      <div className="border border-accent/30 rounded-xl p-4 grid sm:grid-cols-3 gap-2">
        <input className="bg-transparent border-b border-accent/30 p-2" placeholder="نام" value={name} onChange={e=>setName(e.target.value)} />
        <input className="bg-transparent border-b border-accent/30 p-2" placeholder="قیمت $" type="number" value={price} onChange={e=>setPrice(Number(e.target.value))} />
        <input className="bg-transparent border-b border-accent/30 p-2" placeholder="روز" type="number" value={days} onChange={e=>setDays(Number(e.target.value))} />
        <button onClick={create} className="sm:col-span-3 rounded-full bg-accent text-accent-foreground px-4 py-2">ایجاد</button>
      </div>
      <div className="space-y-2">
        {plans.map(p => (
          <div key={p.id} className="flex items-center justify-between border border-accent/30 rounded-xl p-3">
            <div className="flex items-center gap-3"><strong>{p.name}</strong><span className="opacity-80">{(p.priceCents/100).toFixed(2)}$ · {p.durationDays}روز</span></div>
            <span className="text-sm opacity-70">{p.isActive?"فعال":"غیرفعال"}</span>
          </div>
        ))}
      </div>
    </main>
  );
}