import { PrismaClient } from "@/app/generated/prisma";
import Image from "next/image";
import { getCurrentUser } from "@/app/lib/auth";

const prisma = new PrismaClient();

export default async function ReaderPage({ params }: { params: Promise<{ slug: string; chapter: string }> }) {
  const { slug, chapter } = await params;
  const manhwa = await prisma.manhwa.findUnique({ where: { slug }, include: { chapters: { where: { number: Number(chapter) }, include: { pages: { orderBy: { index: "asc" } } } } } });
  if (!manhwa || manhwa.chapters.length === 0) return <main className="p-6">یافت نشد</main>;
  const ch = manhwa.chapters[0];

  // Access control: if premium chapter, require active subscription
  if (ch.isPremium) {
    const user = await getCurrentUser();
    if (!user) return <main className="p-6">برای دسترسی، وارد شوید</main>;
    const activeSub = await prisma.subscription.findFirst({ where: { userId: user.id, isActive: true, endsAt: { gt: new Date() } } });
    if (!activeSub) return <main className="p-6">برای دسترسی به این چپتر، اشتراک فعال لازم است</main>;
  }

  return (
    <main className="max-w-3xl mx-auto p-2 sm:p-4">
      <h1 className="text-xl font-bold mb-4">{manhwa.title} — چپتر {ch.number}</h1>
      <div className="flex flex-col gap-2">
        {ch.pages.map((p) => (
          <div key={p.id} className="relative w-full">
            <Image src={p.imagePath} alt="page" width={1080} height={1600} className="w-full h-auto" />
          </div>
        ))}
      </div>
    </main>
  );
}