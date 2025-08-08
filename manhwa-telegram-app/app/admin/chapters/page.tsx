"use client";
import { useEffect, useRef, useState } from "react";

type M = { id: string; title: string };

export default function AdminChaptersPage() {
  const [manhwas, setManhwas] = useState<M[]>([]);
  const [manhwaId, setManhwaId] = useState("");
  const [number, setNumber] = useState<number>(1);
  const [title, setTitle] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [uploaded, setUploaded] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/manhwas").then(r=>r.json()).then(j=> setManhwas(j.items || []));
  }, []);

  async function uploadFiles() {
    const files = fileRef.current?.files;
    if (!files || files.length === 0) return;
    const form = new FormData();
    for (const f of Array.from(files)) form.append("files", f);
    const r = await fetch("/api/admin/upload", { method: "POST", body: form });
    const j = await r.json();
    setUploaded(j.files || []);
  }

  async function createChapter() {
    await fetch("/api/admin/chapters", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ manhwaId, number, title, isPremium, pagePaths: uploaded }) });
    setUploaded([]);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h2 className="text-xl font-bold">ایجاد چپتر</h2>
      <div className="grid gap-2 border border-accent/30 rounded-xl p-4">
        <select className="bg-transparent border-b border-accent/30 p-2" value={manhwaId} onChange={e=>setManhwaId(e.target.value)}>
          <option value="">انتخاب مانهوا</option>
          {manhwas.map(m=> <option key={m.id} value={m.id}>{m.title}</option>)}
        </select>
        <input className="bg-transparent border-b border-accent/30 p-2" type="number" placeholder="شماره چپتر" value={number} onChange={e=>setNumber(Number(e.target.value))} />
        <input className="bg-transparent border-b border-accent/30 p-2" placeholder="عنوان (اختیاری)" value={title} onChange={e=>setTitle(e.target.value)} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isPremium} onChange={e=>setIsPremium(e.target.checked)} /> پریمیوم</label>
        <input ref={fileRef} multiple type="file" accept="image/*" className="p-2 bg-transparent" />
        <div className="flex gap-2">
          <button onClick={uploadFiles} className="rounded-full bg-accent text-accent-foreground px-4 py-2">آپلود صفحات</button>
          <button onClick={createChapter} className="rounded-full border border-accent/50 px-4 py-2">ایجاد چپتر</button>
        </div>
        {uploaded.length>0 && <div className="text-sm opacity-70">{uploaded.length} صفحه آپلود شد</div>}
      </div>
    </main>
  );
}