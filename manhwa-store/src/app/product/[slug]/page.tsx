import Image from "next/image";
import { notFound } from "next/navigation";
import { manhwas } from "@/data/manhwas";
import { formatCurrencyFa } from "@/utils/format";
import { CartAddButton } from "./ui";

export async function generateStaticParams() {
  return manhwas.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = manhwas.find((m) => m.slug === slug);
  return {
    title: item ? `${item.titleFa} | مانهوا شاپ` : "محصول | مانهوا شاپ",
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = manhwas.find((m) => m.slug === slug);
  if (!item) return notFound();

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8 items-start">
      <div>
        <Image
          src={item.coverImage}
          alt={item.titleFa}
          width={600}
          height={900}
          className="w-full h-auto rounded-md border border-black/10"
        />
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">{item.titleFa}</h1>
        <div className="text-black/70">{formatCurrencyFa(item.price)}</div>
        <div className="text-sm text-black/60">امتیاز: {item.rating}</div>
        <div className="flex flex-wrap gap-2 text-xs text-black/60">
          {item.tags.map((t) => (
            <span key={t} className="border border-black/10 rounded-full px-2 py-1">{t}</span>
          ))}
        </div>
        <CartAddButton item={item} />
        <p className="text-sm leading-7 text-black/70">
          نسخه دیجیتال مانهوا جهت مطالعه آنلاین. پس از خرید، به محتوای قسمت‌ها دسترسی خواهید داشت.
        </p>
      </div>
    </main>
  );
}

// Client-only add button extracted to a separate file in the same route
// to keep this file as a server component by default.