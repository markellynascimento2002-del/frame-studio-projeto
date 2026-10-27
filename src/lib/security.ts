import { createHash, randomInt, timingSafeEqual } from "node:crypto";

export function generateOtp(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function hashOtp(code: string): string {
  const secret = process.env.APP_SECRET;
  if (!secret) throw new Error("APP_SECRET não configurado.");
  return createHash("sha256").update(`${secret}:${code}`).digest("hex");
}

export function safeHashEquals(a: string, b: string): boolean {
  const left = Buffer.from(a, "hex");
  const right = Buffer.from(b, "hex");
  return left.length === right.length && timingSafeEqual(left, right);
}
