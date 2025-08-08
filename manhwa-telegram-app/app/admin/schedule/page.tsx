"use client";
import { useEffect, useState } from "react";

type M = { id: string; title: string };

type S = { id: string; weekday: string; manhwa: M };

const DAYS = [
  { key: "MON", label: "دوشنبه" },
  { key: "TUE", label: "سه‌شنبه" },
  { key: "WED", label: "چهارشنبه" },
  { key: "THU", label: "پنجشنبه" },
  { key: "FRI", label: "جمعه" },
  { key: "SAT", label: "شنبه" },
  { key: "SUN", label: "یکشنبه" },
];

export default function AdminSchedulePage() {
  const [manhwas, setManhwas] = useState<M[]>([]);
  const [weekday, setWeekday] = useState("FRI");
  const [manhwaId, setManhwaId] = useState("");
  const [items, setItems] = useState<S[]>([]);

  async function load() {
    const [m, s] = await Promise.all([
      fetch("/api/admin/manhwas").then(r=>r.json()),
      fetch("/api/admin/schedule").then(r=>r.json()),
    ]);
    setManhwas(m.items||[]);
    setItems(s.items||[]);
  }
  useEffect(()=>{ load(); }, []);

  async function add() {
    await fetch("/api/admin/schedule", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ manhwaId, weekday }) });
    load();
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h2 className="text-xl font-bold">جدول هفتگی</h2>
      <div className="grid sm:grid-cols-3 gap-2 border border-accent/30 rounded-xl p-4">
        <select className="bg-transparent border-b border-accent/30 p-2" value={manhwaId} onChange={e=>setManhwaId(e.target.value)}>
          <option value="">انتخاب مانهوا</option>
          {manhwas.map(m=> <option key={m.id} value={m.id}>{m.title}</option>)}
        </select>
        <select className="bg-transparent border-b border-accent/30 p-2" value={weekday} onChange={e=>setWeekday(e.target.value)}>
          {DAYS.map(d=> <option key={d.key} value={d.key}>{d.label}</option>)}
        </select>
        <button onClick={add} className="rounded-full bg-accent text-accent-foreground px-4 py-2">افزودن</button>
      </div>
      <div className="space-y-2">
        {items.map(s => (
          <div key={s.id} className="flex items-center justify-between border border-accent/30 rounded-xl p-3">
            <span>{DAYS.find(d=>d.key===s.weekday)?.label}</span>
            <span className="font-bold">{s.manhwa.title}</span>
          </div>
        ))}
      </div>
    </main>
  );
}