// Os preços são definidos no backend. Nunca aceite o valor enviado pelo navegador.
export const PRODUCTS = {
  fotografia: { name: "Ensaio Fotográfico", amountCents: 25000, description: "Sessão fotográfica profissional" },
  video: { name: "Filmagem + Edição", amountCents: 45000, description: "Captação e edição de vídeo" },
  social: { name: "Pacote Conteúdo para Redes", amountCents: 65000, description: "Fotografia e vídeos curtos para marcas" }
} as const;

export type ProductKey = keyof typeof PRODUCTS;
