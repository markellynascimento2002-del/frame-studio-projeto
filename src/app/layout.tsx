import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Frame Studio | Fotografia & Vídeo",
  description: "Fotografia profissional, filmagem e edição de vídeo para contar histórias que ficam.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
