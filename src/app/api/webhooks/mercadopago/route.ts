import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmation } from "@/lib/email";

// O status só é atualizado após consultar a API do Mercado Pago.
// Em produção, valide também a assinatura x-signature conforme a documentação oficial.
export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const body = await request.json().catch(() => ({}));
    const paymentId = String(url.searchParams.get("data.id") || body?.data?.id || "");
    const type = String(url.searchParams.get("type") || body?.type || body?.topic || "");
    if (!paymentId || (type && !["payment", "payments"].includes(type))) {
      return NextResponse.json({ received: true });
    }
    const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!token) return NextResponse.json({ error: "Pagamento não configurado." }, { status: 503 });

    const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`, {
      headers: { Authorization: `Bearer ${token}` }, cache: "no-store"
    });
    if (!paymentResponse.ok) return NextResponse.json({ error: "Não foi possível consultar o pagamento." }, { status: 502 });
    const payment = await paymentResponse.json();
    const orderId = payment.external_reference as string | undefined;
    if (!orderId) return NextResponse.json({ received: true });

    const order = await prisma.order.findUnique({ where: { id: orderId }, include: { lead: true } });
    if (!order) return NextResponse.json({ received: true });
    if (Number(payment.transaction_amount) !== order.amountCents / 100) {
      return NextResponse.json({ error: "Valor do pagamento não corresponde ao pedido." }, { status: 400 });
    }
    if (payment.status === "approved") {
      // paymentId é único: notificações repetidas não criam um segundo pedido.
      const updated = await prisma.order.update({
        where: { id: order.id },
        data: { status: "PAGO", paymentId: String(payment.id) }
      });
      if (order.status !== "PAGO") await sendOrderConfirmation(order.lead.email, updated);
    } else if (["rejected", "cancelled"].includes(String(payment.status)) && order.status === "PENDENTE") {
      await prisma.order.update({ where: { id: order.id }, data: { status: "CANCELADO" } });
    }
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Erro ao processar notificação." }, { status: 500 });
  }
}
