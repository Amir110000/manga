"use client";
import { useEffect, useState } from "react";

type M = { id: string; title: string; slug: string; coverImageUrl?: string | null };

export default function AdminManhwas() {
  const [items, setItems] = useState<M[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [cover, setCover] = useState("");

  async function load() {
    const r = await fetch("/api/admin/manhwas");
    const j = await r.json();
    setItems(j.items||[]);
  }
  useEffect(()=>{ load(); }, []);

  async function create() {
    await fetch("/api/admin/manhwas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, slug, coverImageUrl: cover }) });
    setTitle(""); setSlug(""); setCover(""); load();
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h2 className="text-xl font-bold">مدیریت مانهوا</h2>
      <div className="grid sm:grid-cols-3 gap-2 border border-accent/30 rounded-xl p-4">
        <input className="bg-transparent border-b border-accent/30 p-2" placeholder="عنوان" value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="bg-transparent border-b border-accent/30 p-2" placeholder="slug" value={slug} onChange={e=>setSlug(e.target.value)} />
        <input className="bg-transparent border-b border-accent/30 p-2" placeholder="کاور (URL)" value={cover} onChange={e=>setCover(e.target.value)} />
        <button onClick={create} className="sm:col-span-3 rounded-full bg-accent text-accent-foreground px-4 py-2">ایجاد</button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {items.map((m) => (
          <div key={m.id} className="border border-accent/30 rounded-xl p-3 flex items-center gap-3">
            {m.coverImageUrl ? <img src={m.coverImageUrl} className="w-16 h-20 object-cover rounded" /> : <div className="w-16 h-20 bg-accent/10 rounded" />}
            <div>
              <div className="font-bold">{m.title}</div>
              <div className="opacity-70 text-sm">/{m.slug}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}