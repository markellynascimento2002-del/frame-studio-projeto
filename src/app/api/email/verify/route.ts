import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashOtp, safeHashEquals } from "@/lib/security";

const schema = z.object({ email: z.string().email().transform(v => v.toLowerCase()), code: z.string().regex(/^\d{6}$/) });

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Informe o e-mail e o código de 6 dígitos." }, { status: 400 });
    const lead = await prisma.lead.findUnique({ where: { email: parsed.data.email }, include: { otp: true } });
    if (!lead || !lead.otp) return NextResponse.json({ error: "Solicite um código antes de verificar." }, { status: 404 });
    const otp = lead.otp;
    if (otp.usedAt) return NextResponse.json({ error: "Este código já foi utilizado. Solicite outro." }, { status: 400 });
    if (otp.expiresAt < new Date()) return NextResponse.json({ error: "Código expirado. Solicite outro." }, { status: 400 });
    if (otp.attempts >= 5) return NextResponse.json({ error: "Limite de tentativas atingido. Solicite outro código." }, { status: 429 });
    const valid = safeHashEquals(otp.codeHash, hashOtp(parsed.data.code));
    if (!valid) {
      await prisma.emailOtp.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
      return NextResponse.json({ error: "Código incorreto." }, { status: 400 });
    }
    await prisma.$transaction([
      prisma.emailOtp.update({ where: { id: otp.id }, data: { usedAt: new Date() } }),
      prisma.lead.update({ where: { id: lead.id }, data: { emailVerified: true } })
    ]);
    return NextResponse.json({ message: "E-mail verificado. Você já pode iniciar a contratação." });
  } catch {
    return NextResponse.json({ error: "Não foi possível verificar o código." }, { status: 500 });
  }
}
