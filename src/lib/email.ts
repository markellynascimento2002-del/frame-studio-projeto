import nodemailer from "nodemailer";

function transporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error("Configure SMTP_HOST, SMTP_PORT, SMTP_USER e SMTP_PASS.");
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
}

export async function sendOtpEmail(to: string, code: string) {
  await transporter().sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject: "Seu código de verificação — Frame Studio",
    text: `Seu código é ${code}. Ele expira em 5 minutos. Se você não solicitou, ignore este e-mail.`,
    html: `<div style="font-family:Arial,sans-serif"><h2>Verifique seu e-mail</h2><p>Use o código abaixo para continuar:</p><p style="font-size:30px;font-weight:bold;letter-spacing:8px">${code}</p><p>Este código expira em 5 minutos e só pode ser usado uma vez.</p></div>`
  });
}

export async function sendOrderConfirmation(to: string, order: {
  id: string; productName: string; amountCents: number; createdAt: Date; status: string;
}) {
  await transporter().sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject: "Pagamento confirmado — Frame Studio",
    text: `Pedido: ${order.id}\nServiço: ${order.productName}\nValor: R$ ${(order.amountCents / 100).toFixed(2)}\nData: ${order.createdAt.toLocaleString("pt-BR")}\nStatus: ${order.status}`,
  });
}
