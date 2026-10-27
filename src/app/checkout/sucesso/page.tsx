export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ pedido?: string }> }) {
  const { pedido } = await searchParams;
  return <main className="checkout-page"><a className="brand" href="/"><span className="brand-mark">F.</span> FRAME<span className="brand-light">STUDIO</span></a><div className="checkout-card"><p className="eyebrow">RETORNO DO CHECKOUT</p><h1>Recebemos seu <em>retorno.</em></h1><p className="checkout-hint">O redirecionamento não confirma o pagamento. O pedido só será marcado como pago depois da validação da notificação pelo servidor.</p>{pedido && <p className="order-id">Número do pedido: {pedido}</p>}<a className="button button-primary full-button" href="/">Voltar ao site ↗</a></div></main>;
}
