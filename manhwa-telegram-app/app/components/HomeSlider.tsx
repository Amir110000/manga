import { PrismaClient } from "@/app/generated/prisma";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function HomeSlider() {
  const items = await prisma.sliderItem.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
  if (items.length === 0) return null;
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-4 min-w-full">
        {items.map((it) => (
          <Link key={it.id} href={it.href || "#"} className="relative block min-w-[280px] max-w-[320px]">
            <img src={it.imageUrl} alt={it.title} className="w-full h-40 sm:h-52 rounded-xl object-cover" />
            <div className="mt-2 text-sm opacity-85">{it.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}