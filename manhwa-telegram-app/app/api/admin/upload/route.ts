import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getCurrentUser } from "@/app/lib/auth";
import { put } from "@vercel/blob";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const form = await req.formData();
  const files = form.getAll("files");
  if (!files || files.length === 0) return NextResponse.json({ error: "No files" }, { status: 400 });

  const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL === "1";
  const saved: string[] = [];

  if (useBlob) {
    for (const entry of files) {
      if (!(entry instanceof File)) continue;
      const name = `chapters/${Date.now()}_${entry.name}`;
      const result = await put(name, entry, { access: "public", addRandomSuffix: true });
      saved.push(result.url);
    }
    return NextResponse.json({ files: saved });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  for (const entry of files) {
    if (!(entry instanceof File)) continue;
    const arrayBuffer = await entry.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const safeName = entry.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}_${safeName}`;
    const destPath = path.join(uploadDir, filename);
    await fs.writeFile(destPath, buffer);
    saved.push(`/uploads/${filename}`);
  }

  return NextResponse.json({ files: saved });
}