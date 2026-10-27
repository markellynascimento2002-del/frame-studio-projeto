import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Endpoint demonstrativo para consulta. Antes de publicar, proteja-o com autenticação de administrador.
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      select: { id: true, productName: true, amountCents: true, status: true, createdAt: true, lead: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" }, take: 100
    });
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Não foi possível consultar pedidos." }, { status: 500 });
  }
}
