import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { getCurrentUser } from "@/app/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const { name, priceCents, durationDays } = await req.json();
  const plan = await prisma.subscriptionPlan.create({ data: { name, priceCents, durationDays } });
  return NextResponse.json({ plan });
}