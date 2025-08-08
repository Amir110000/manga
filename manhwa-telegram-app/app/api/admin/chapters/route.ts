import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { getCurrentUser } from "@/app/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const { manhwaId, number, title, isPremium, pagePaths } = await req.json();
  if (!manhwaId || typeof number !== "number" || !Array.isArray(pagePaths) || pagePaths.length === 0) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const chapter = await prisma.chapter.create({
    data: {
      manhwaId,
      number,
      title: title || null,
      isPremium: Boolean(isPremium),
      pages: {
        create: pagePaths.map((p: string, idx: number) => ({ index: idx + 1, imagePath: p })),
      },
    },
    include: { pages: true },
  });

  return NextResponse.json({ chapter });
}