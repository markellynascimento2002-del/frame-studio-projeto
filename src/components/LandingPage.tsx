"use client";

import { FormEvent, useState } from "react";

const services = [
  { number: "01", title: "Fotografia", text: "Ensaios, eventos e retratos com direção criativa e atenção aos detalhes.", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85" },
  { number: "02", title: "Vídeo & edição", text: "Imagens em movimento, edição dinâmica e histórias que prendem a atenção.", image: "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=900&q=85" },
  { number: "03", title: "Conteúdo para marcas", text: "Conteúdo visual pensado para destacar sua marca e fortalecer sua presença digital.", image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=85" }
];

const packages = [
  { id: "fotografia", name: "Ensaio fotográfico", price: "R$ 250,00", description: "Para retratos, casais e momentos especiais.", features: ["Planejamento do ensaio", "Sessão fotográfica", "Fotos editadas em alta resolução"] },
  { id: "video", name: "Filmagem + edição", price: "R$ 450,00", description: "Para eventos, projetos e vídeos pessoais.", features: ["Captação de vídeo", "Edição profissional", "Arquivo final digital"] },
  { id: "social", name: "Conteúdo para marcas", price: "R$ 650,00", description: "Para negócios que querem aparecer melhor.", features: ["Fotografia + vídeos curtos", "Edição para redes sociais", "Conteúdo pronto para publicar"] }
];

export default function LandingPage() {
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "" });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  function whatsappLink() {
    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5592999999999";
    const text = encodeURIComponent("Olá! Gostaria de saber mais sobre os serviços de fotografia e edição de vídeo.");
    return `https://wa.me/${number}?text=${text}`;
  }

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setBusy(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível enviar seus dados.");
      setMessage("Cadastro recebido! Confira seu e-mail para iniciar a verificação.");
      setForm({ name: "", email: "", whatsapp: "" });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Ocorreu um erro.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#inicio"><span className="brand-mark">F.</span> FRAME<span className="brand-light">STUDIO</span></a>
        <nav><a href="#servicos">Serviços</a><a href="#portfolio">Portfólio</a><a href="#pacotes">Pacotes</a><a href="#contato">Contato</a></nav>
        <a className="nav-cta" href="#pacotes">Contratar <span>↗</span></a>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow"><span className="dot" /> FOTOGRAFIA · FILMMAKING · EDIÇÃO</p>
          <h1>Histórias que<br />merecem ser <em>vistas.</em></h1>
          <p className="hero-text">Transformo momentos em imagens e ideias em vídeos com identidade, emoção e propósito.</p>
          <div className="hero-actions"><a className="button button-primary" href="#pacotes">Conheça os pacotes <span>↗</span></a><a className="text-link" href="#portfolio">Explorar portfólio ↓</a></div>
          <div className="hero-meta"><div><strong>01.</strong><span>Olhar criativo</span></div><div><strong>02.</strong><span>Detalhe em cada frame</span></div><div><strong>03.</strong><span>Entrega profissional</span></div></div>
        </div>
        <div className="hero-visual">
          <div className="hero-photo" role="img" aria-label="Fotógrafo trabalhando com câmera profissional" />
          <div className="photo-label"><span>FRAME / 001</span><span>CAPTURANDO O ESSENCIAL</span></div>
          <div className="vertical-note">VISUAL STORYTELLING — EST. 2026</div>
          <div className="floating-tag">Seu momento.<br /><b>Nosso olhar.</b></div>
        </div>
        <div className="hero-index">PORTFÓLIO CRIATIVO <span>✳</span> 2026</div>
      </section>

      <section className="intro section-wrap">
        <p className="eyebrow">01 / O QUE FAZEMOS</p>
        <div><h2>Imagem não é só<br />o que você vê. É o que <em>sente.</em></h2><p className="section-lead">Cada projeto começa com uma ideia e ganha vida por meio de luz, composição e edição cuidadosa. Criamos conteúdo visual para pessoas, eventos e marcas.</p></div>
      </section>

      <section className="services section-wrap" id="servicos">
        {services.map((service) => <article className="service-card" key={service.number}>
          <div className={`service-image service-image-${service.number}`} />
          <div className="service-info"><span>{service.number} / SERVIÇO</span><h3>{service.title}</h3><p>{service.text}</p><a href="#contato">Vamos conversar <span>↗</span></a></div>
        </article>)}
      </section>

      <section className="portfolio section-wrap" id="portfolio">
        <div className="section-heading"><div><p className="eyebrow">02 / SELEÇÃO DE TRABALHOS</p><h2>Feito para <em>marcar.</em></h2></div><p>Uma seleção visual de referências.</p></div>
        <div className="portfolio-grid"><div className="portfolio-item portfolio-one"><span>01 — RETRATO</span></div><div className="portfolio-item portfolio-two"><span>02 — EVENTO</span></div><div className="portfolio-item portfolio-three"><span>03 — BRANDING</span></div></div>
      </section>

      <section className="packages section-wrap" id="pacotes">
        <div className="section-heading"><div><p className="eyebrow">03 / ESCOLHA SUA EXPERIÊNCIA</p><h2>Seu projeto começa <em>aqui.</em></h2></div><p>Escolha o serviço ideal para você. O preço final e o escopo podem ser ajustados antes da contratação.</p></div>
        <div className="package-grid">{packages.map((pack, index) => <article className={`package-card ${index === 1 ? "package-featured" : ""}`} key={pack.id}>
          {index === 1 && <span className="popular">MAIS PROCURADO</span>}
          <p className="package-kicker">PACOTE 0{index + 1}</p><h3>{pack.name}</h3><p className="package-description">{pack.description}</p><p className="price">{pack.price}<small> / projeto</small></p>
          <ul>{pack.features.map(feature => <li key={feature}><span>+</span>{feature}</li>)}</ul>
          <a className={index === 1 ? "button button-primary full-button" : "button button-outline full-button"} href={`/checkout?produto=${pack.id}`}>Contratar pacote <span>↗</span></a>
        </article>)}</div>
        <p className="price-note">Os valores acima são demonstrativos para o projeto.</p>
      </section>

      <section className="about section-wrap">
        <div className="about-image" />
        <div className="about-copy"><p className="eyebrow">04 / POR TRÁS DA CÂMERA</p><h2>Seu projeto merece<br />um olhar <em>único.</em></h2><p>Mais do que registrar imagens, meu trabalho é entender a intenção por trás de cada projeto e transformá-la em uma experiência visual autêntica.</p><a className="text-link" href="#contato">Conte sua ideia ↗</a></div>
      </section>

      <section className="contact section-wrap" id="contato">
        <div className="contact-copy"><p className="eyebrow">05 / VAMOS CRIAR?</p><h2>Tem uma ideia?<br /><em>Vamos dar forma.</em></h2><p>Preencha seus dados para receber novidades e iniciar seu atendimento.</p><a className="button button-outline" href={whatsappLink()} target="_blank" rel="noreferrer">Conversar pelo WhatsApp ↗</a></div>
        <form className="lead-form" onSubmit={submitLead}>
          <label>Seu nome<input required minLength={2} value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Como podemos te chamar?" /></label>
          <label>E-mail<input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="voce@email.com" /></label>
          <label>WhatsApp<input required type="tel" minLength={10} value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} placeholder="(92) 99999-9999" /></label>
          <button className="button button-primary full-button" type="submit" disabled={busy}>{busy ? "Enviando..." : "Quero entrar em contato ↗"}</button>
          {message && <p className="form-message" role="status">{message}</p>}
          <small>Ao enviar, você concorda em ser contatado sobre este serviço.</small>
        </form>
      </section>

      <footer className="footer"><a className="brand" href="#inicio"><span className="brand-mark">F.</span> FRAME<span className="brand-light">STUDIO</span></a><p>Imagens com intenção. Histórias com identidade.</p><div><a href="#servicos">Serviços</a><a href="#portfolio">Portfólio</a><a href={whatsappLink()} target="_blank" rel="noreferrer">WhatsApp ↗</a></div><small>© 2026 Frame Studio. Projeto acadêmico demonstrativo.</small></footer>
    </main>
  );
}
