import { randomUUID } from "crypto";
import { put } from "@vercel/blob";
import sharp from "sharp";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return new Response("No file provided", { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return new Response("Unsupported file type", { status: 415 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const webpBuffer = await sharp(Buffer.from(arrayBuffer))
    .webp({ quality: 80 })
    .toBuffer();

  const filename = `${randomUUID()}.webp`;

  const blob = await put(`uploads/${session.user.id}/${filename}`, webpBuffer, {
    access: "public",
    contentType: "image/webp",
  });

  return Response.json({ url: blob.url });
}
