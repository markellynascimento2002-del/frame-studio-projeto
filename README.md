# Frame Studio — Landing page de fotografia e vídeo

Projeto acadêmico para o Projeto 1: Landing Page de Vendas com Pagamento Online. Inclui landing page responsiva, formulário de leads, fluxo básico de OTP, checkout Mercado Pago, persistência PostgreSQL/Prisma, webhook, e-mail de confirmação, Docker Compose para o banco e CI via GitHub Actions.

## Requisitos

- Node.js 22+
- npm
- Docker Desktop (para PostgreSQL local)
- Conta de teste do Mercado Pago
- Conta SMTP ou serviço de e-mail compatível

## Instalação local

```bash
npm install
cp .env.example .env
docker compose up -d db
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Acesse http://localhost:3000.

## Variáveis de ambiente

Preencha `.env` com `DATABASE_URL`, `APP_SECRET`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, credenciais SMTP e `MERCADOPAGO_ACCESS_TOKEN`. Não compartilhe `.env` nem tokens privados no GitHub.

## Fluxo de teste

1. Preencha o formulário de contato para cadastrar um lead.
2. Abra um pacote e informe o mesmo e-mail usado no formulário.
3. Solicite o código OTP enviado por e-mail; ele expira em 5 minutos e tem até 5 tentativas.
4. Verifique o código.
5. Continue para o checkout do Mercado Pago em modo de teste.
6. O status do pedido deve ser confirmado pelo webhook/backend, não pela página de sucesso.

## Rotas implementadas

- `POST /api/leads` — valida e registra lead.
- `POST /api/email/send-code` — gera hash e envia OTP.
- `POST /api/email/verify` — verifica validade, uso único e tentativas.
- `POST /api/payments` — cria pedido e preferência de pagamento.
- `POST /api/webhooks/mercadopago` — consulta o pagamento e atualiza pedido.
- `GET /api/orders` — lista pedidos para desenvolvimento; **proteger antes de publicar**.

## Docker

`docker-compose.yml` sobe PostgreSQL. O `Dockerfile` constrói a aplicação. Para compor uma imagem funcional, configure variáveis no ambiente e execute as migrações antes de iniciar o serviço.


## Tecnologias

Next.js, React, TypeScript, CSS, Prisma, PostgreSQL, Zod, Nodemailer, Mercado Pago SDK, Docker, Vitest e GitHub Actions.
