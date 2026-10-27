import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateOtp, hashOtp } from "@/lib/security";
import { sendOtpEmail } from "@/lib/email";

const schema = z.object({ email: z.string().email().transform(v => v.toLowerCase()) });

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
    const lead = await prisma.lead.findUnique({ where: { email: parsed.data.email } });
    if (!lead) return NextResponse.json({ error: "Não encontramos esse cadastro. Preencha o formulário primeiro." }, { status: 404 });
    if (lead.emailVerified) return NextResponse.json({ message: "E-mail já verificado." });
    const code = generateOtp();
    await prisma.emailOtp.upsert({
      where: { leadId: lead.id },
      update: { codeHash: hashOtp(code), expiresAt: new Date(Date.now() + 5 * 60 * 1000), attempts: 0, usedAt: null, createdAt: new Date() },
      create: { leadId: lead.id, codeHash: hashOtp(code), expiresAt: new Date(Date.now() + 5 * 60 * 1000) }
    });
    await sendOtpEmail(lead.email, code);
    return NextResponse.json({ message: "Código enviado. Ele expira em 5 minutos." });
  } catch {
    return NextResponse.json({ error: "Não foi possível enviar o código. Verifique a configuração de e-mail." }, { status: 500 });
  }
}
