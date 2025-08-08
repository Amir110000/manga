import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { getCurrentUser } from "@/app/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  const items = await prisma.manhwa.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const { title, slug, description, coverImageUrl, genres, isFeatured } = await req.json();
  const item = await prisma.manhwa.create({ data: { title, slug, description, coverImageUrl, genres, isFeatured } });
  return NextResponse.json({ item });
}