import { NextRequest, NextResponse } from "next/server";
import { findOrCreateUserFromTelegram, setSessionCookie, verifyTelegramInitData } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { initData } = await req.json();
    if (!initData) return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });

    const params = new URLSearchParams(initData);
    const userJson = params.get("user");
    const botToken = process.env.TELEGRAM_BOT_TOKEN as string;

    if (!botToken) return NextResponse.json({ error: "Server misconfig" }, { status: 500 });

    const ok = verifyTelegramInitData(params, botToken);
    if (!ok) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    if (!userJson) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    const userObj = JSON.parse(userJson);

    const user = await findOrCreateUserFromTelegram(userObj);
    await setSessionCookie(user.id);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}