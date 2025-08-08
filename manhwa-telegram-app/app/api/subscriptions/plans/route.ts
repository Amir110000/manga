import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  const plans = await prisma.subscriptionPlan.findMany({ where: { isActive: true }, orderBy: { priceCents: "asc" } });
  return NextResponse.json({ plans });
}