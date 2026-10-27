"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";

const productInfo: Record<string, {name:string; price:string}> = {
  fotografia: { name: "Ensaio Fotográfico", price: "R$ 250,00" },
  video: { name: "Filmagem + Edição", price: "R$ 450,00" },
  social: { name: "Conteúdo para Marcas", price: "R$ 650,00" }
};

export default function CheckoutPage() {
  const params = useSearchParams();
  const product = params.get("produto") || "fotografia";
  const selected = productInfo[product] || productInfo.fotografia;
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function api(path: string, body: object) {
    const response = await fetch(path, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(body) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Não foi possível concluir a solicitação.");
    return data;
  }

  async function sendCode(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try { await api("/api/leads", { name, email, whatsapp }); const data = await api("/api/email/send-code", { email }); setMessage(data.message); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Erro ao enviar código."); }
    finally { setBusy(false); }
  }

  async function verifyCode(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try { const data = await api("/api/email/verify", { email, code }); setVerified(true); setMessage(data.message); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Erro ao verificar código."); }
    finally { setBusy(false); }
  }

  async function pay() {
    setBusy(true); setMessage("");
    try {
      const data = await api("/api/payments", { email, product });
      window.location.href = data.checkoutUrl;
    } catch (error) { setMessage(error instanceof Error ? error.message : "Erro ao iniciar pagamento."); setBusy(false); }
  }

  return <main className="checkout-page"><a className="brand" href="/"><span className="brand-mark">F.</span> FRAME<span className="brand-light">STUDIO</span></a>
    <div className="checkout-card"><p className="eyebrow">CONTRATAÇÃO SEGURA</p><h1>Seu próximo projeto<br/><em>começa aqui.</em></h1>
      <div className="checkout-product"><div><span>SEU PACOTE</span><h2>{selected.name}</h2></div><strong>{selected.price}</strong></div>
      <form onSubmit={sendCode} className="checkout-form"><label>Seu nome<input required minLength={2} value={name} onChange={e=>setName(e.target.value)} placeholder="Nome completo"/></label><label>WhatsApp<input required minLength={10} value={whatsapp} onChange={e=>setWhatsapp(e.target.value)} placeholder="(92) 99999-9999"/></label><label>Seu e-mail<input type="email" required value={email} onChange={e=>{setEmail(e.target.value);setVerified(false)}} placeholder="voce@email.com"/></label><button className="button button-outline full-button" disabled={busy}>Enviar código de verificação</button></form>
      <form onSubmit={verifyCode} className="checkout-form"><label>Código de 6 dígitos<input inputMode="numeric" maxLength={6} pattern="[0-9]{6}" required value={code} onChange={e=>setCode(e.target.value)} placeholder="000000"/></label><button className="button button-outline full-button" disabled={busy}>Verificar e-mail</button></form>
      <button className="button button-primary full-button" disabled={busy || !verified} onClick={pay}>Continuar para pagamento ↗</button>
      {!verified && <p className="checkout-hint">A verificação do e-mail é obrigatória antes do pagamento.</p>}
      {message && <p className="form-message" role="status">{message}</p>}
      <a className="back-link" href="/">← Voltar para a página inicial</a>
    </div>
  </main>;
}
