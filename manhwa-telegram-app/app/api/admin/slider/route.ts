import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { getCurrentUser } from "@/app/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  const items = await prisma.sliderItem.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const { title, imageUrl, href, sortOrder } = await req.json();
  const item = await prisma.sliderItem.create({ data: { title, imageUrl, href, sortOrder: sortOrder ?? 0 } });
  return NextResponse.json({ item });
}