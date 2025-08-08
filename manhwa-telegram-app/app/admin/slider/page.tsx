"use client";
import { useEffect, useState } from "react";

type S = { id: string; title: string; imageUrl: string; href?: string; sortOrder: number };

export default function AdminSliderPage() {
  const [items, setItems] = useState<S[]>([]);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [href, setHref] = useState("");
  const [sortOrder, setSortOrder] = useState(0);

  async function load() {
    const r = await fetch("/api/admin/slider");
    const j = await r.json();
    setItems(j.items||[]);
  }
  useEffect(()=>{ load(); }, []);

  async function create() {
    await fetch("/api/admin/slider", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, imageUrl, href, sortOrder }) });
    setTitle(""); setImageUrl(""); setHref(""); setSortOrder(0); load();
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h2 className="text-xl font-bold">اسلایدر</h2>
      <div className="grid sm:grid-cols-4 gap-2 border border-accent/30 rounded-xl p-4">
        <input className="bg-transparent border-b border-accent/30 p-2" placeholder="عنوان" value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="bg-transparent border-b border-accent/30 p-2" placeholder="تصویر (URL)" value={imageUrl} onChange={e=>setImageUrl(e.target.value)} />
        <input className="bg-transparent border-b border-accent/30 p-2" placeholder="لینک" value={href} onChange={e=>setHref(e.target.value)} />
        <input className="bg-transparent border-b border-accent/30 p-2" placeholder="ترتیب" type="number" value={sortOrder} onChange={e=>setSortOrder(Number(e.target.value))} />
        <button onClick={create} className="sm:col-span-4 rounded-full bg-accent text-accent-foreground px-4 py-2">ایجاد</button>
      </div>
      <div className="space-y-2">
        {items.map(it => (
          <div key={it.id} className="flex items-center gap-3 border border-accent/30 rounded-xl p-3">
            <img src={it.imageUrl} className="w-20 h-14 object-cover rounded" />
            <div className="flex-1">
              <div className="font-bold">{it.title}</div>
              <div className="opacity-70 text-sm">{it.href}</div>
            </div>
            <span className="opacity-70">{it.sortOrder}</span>
          </div>
        ))}
      </div>
    </main>
  );
}