import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { requireUser } from "@/app/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const user = await requireUser();
    const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
    return NextResponse.json({ balanceCents: wallet?.balance ?? 0 });
  } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
}