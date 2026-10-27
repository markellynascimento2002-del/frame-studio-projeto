import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { PRODUCTS, type ProductKey } from "@/lib/products";

const schema = z.object({ email: z.string().email().transform(v => v.toLowerCase()), product: z.enum(["fotografia", "video", "social"]) });

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Dados de compra inválidos." }, { status: 400 });
    const lead = await prisma.lead.findUnique({ where: { email: parsed.data.email } });
    if (!lead?.emailVerified) return NextResponse.json({ error: "Verifique seu e-mail antes de pagar." }, { status: 403 });
    const product = PRODUCTS[parsed.data.product as ProductKey];
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) return NextResponse.json({ error: "Pagamento ainda não configurado." }, { status: 503 });

    const order = await prisma.order.create({
      data: { leadId: lead.id, productName: product.name, amountCents: product.amountCents }
    });
    const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });
    const preference = await new Preference(client).create({
      body: {
        items: [{ id: parsed.data.product, title: product.name, quantity: 1, unit_price: product.amountCents / 100, currency_id: "BRL" }],
        external_reference: order.id,
        notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/mercadopago`,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/sucesso?pedido=${order.id}`,
          failure: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?status=falha`,
          pending: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?status=pendente`
        },
        auto_return: "approved"
      }
    });
    await prisma.order.update({ where: { id: order.id }, data: { preferenceId: preference.id } });
    return NextResponse.json({ orderId: order.id, checkoutUrl: preference.init_point });
  } catch {
    return NextResponse.json({ error: "Não foi possível iniciar o pagamento." }, { status: 500 });
  }
}
