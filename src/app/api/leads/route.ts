import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const leadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254).transform(v => v.toLowerCase()),
  whatsapp: z.string().trim().regex(/^[+()\-.\s\d]{10,25}$/)
});

export async function POST(request: Request) {
  try {
    const parsed = leadSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Confira nome, e-mail e WhatsApp." }, { status: 400 });
    const lead = await prisma.lead.upsert({
      where: { email: parsed.data.email },
      update: { name: parsed.data.name, whatsapp: parsed.data.whatsapp },
      create: parsed.data
    });
    return NextResponse.json({ id: lead.id, message: "Lead cadastrado. Solicite o código de verificação para continuar." }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Não foi possível salvar seus dados. Tente novamente." }, { status: 500 });
  }
}
