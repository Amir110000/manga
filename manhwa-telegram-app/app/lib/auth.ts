import crypto from "crypto";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

const SESSION_COOKIE = "rh_session";

function getBotSecretKey(botToken: string) {
  return crypto.createHash("sha256").update(botToken).digest();
}

export function verifyTelegramInitData(initData: URLSearchParams, botToken: string): boolean {
  const hash = initData.get("hash");
  if (!hash) return false;
  const dataCheckArr: string[] = [];
  initData.sort();
  for (const [key, value] of initData.entries()) {
    if (key === "hash") continue;
    dataCheckArr.push(`${key}=${value}`);
  }
  const dataCheckString = dataCheckArr.join("\n");
  const secretKey = getBotSecretKey(botToken);
  const hmac = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");
  return hmac === hash;
}

export async function findOrCreateUserFromTelegram(data: Record<string, any>) {
  const telegramId = String(data.id);
  const username = data.username || null;
  const firstName = data.first_name || null;
  const lastName = data.last_name || null;
  const photoUrl = data.photo_url || null;

  const user = await prisma.user.upsert({
    where: { telegramId },
    update: { username, firstName, lastName, photoUrl },
    create: { telegramId, username, firstName, lastName, photoUrl, wallet: { create: {} } },
    include: { wallet: true },
  });
  return user;
}

export function signSession(payload: { userId: string }) {
  const secret = process.env.SESSION_SECRET as string;
  return jwt.sign(payload, secret, { expiresIn: "30d" });
}

export function verifySessionToken(token: string) {
  const secret = process.env.SESSION_SECRET as string;
  return jwt.verify(token, secret) as { userId: string };
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { userId } = verifySessionToken(token);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user;
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export async function setSessionCookie(userId: string) {
  const token = signSession({ userId });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
}