import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { getCurrentUser } from "@/app/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  const items = await prisma.weeklySchedule.findMany({ include: { manhwa: true }, orderBy: { weekday: "asc" } });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const { manhwaId, weekday } = await req.json();
  const item = await prisma.weeklySchedule.create({ data: { manhwaId, weekday } });
  return NextResponse.json({ item });
}