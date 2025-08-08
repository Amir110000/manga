import { PrismaClient } from "@/app/generated/prisma";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function ManhwaDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = await prisma.manhwa.findUnique({ where: { slug }, include: { chapters: { orderBy: { number: "desc" } } } });
  if (!m) return <main className="p-6">یافت نشد</main>;
  return (
    <main className="max-w-3xl mx-auto p-4 space-y-4">
      <div className="flex gap-4 items-start">
        {m.coverImageUrl && <img src={m.coverImageUrl} className="w-28 h-36 object-cover rounded" />}
        <div>
          <h1 className="text-2xl font-bold">{m.title}</h1>
          <p className="opacity-80 text-sm mt-1">{m.description}</p>
        </div>
      </div>
      <div>
        <h3 className="font-bold mb-2">چپترها</h3>
        <ul className="space-y-2">
          {m.chapters.map(c => (
            <li key={c.id} className="flex items-center justify-between border border-accent/30 rounded-xl p-3">
              <span>چپتر {c.number}{c.isPremium? " (پریمیوم)": ""}</span>
              <Link className="text-accent" href={`/reader/${m.slug}/${c.number}`}>خواندن</Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}