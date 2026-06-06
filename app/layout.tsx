import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Archivo_Black, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: "400",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eatlikeawolf.mx"),
  title: "LOBO | Comida real para perros en Guadalajara",
  description:
    "LOBO es comida real cocinada para perros. Porciones listas para servir, mix feeding y planes según peso, etapa y objetivo.",
  openGraph: {
    title: "LOBO | Comida real para perros en Guadalajara",
    description:
      "LOBO es comida real cocinada para perros. Porciones listas para servir, mix feeding y planes según peso, etapa y objetivo.",
    url: "https://eatlikeawolf.mx",
    siteName: "LOBO",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "LOBO | Comida real para perros en Guadalajara",
    description:
      "LOBO es comida real cocinada para perros. Porciones listas para servir, mix feeding y planes según peso, etapa y objetivo.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-MX"
      className={`${geistSans.variable} ${archivoBlack.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}