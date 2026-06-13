import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/app/seo-content";

export const metadata: Metadata = {
  title: "Artículos sobre comida real para perros | LOBO",
  description:
    "Guías claras sobre comida real cocinada para perros, mix feeding, comida húmeda, comida casera y porciones.",
  alternates: {
    canonical: "/articulos",
  },
  openGraph: {
    title: "Artículos sobre comida real para perros | LOBO",
    description:
      "Guías claras sobre comida real cocinada para perros, mix feeding, comida húmeda, comida casera y porciones.",
    url: "/articulos",
  },
  twitter: {
    title: "Artículos sobre comida real para perros | LOBO",
    description:
      "Guías claras sobre comida real cocinada para perros, mix feeding, comida húmeda, comida casera y porciones.",
  },
};

export default function ArticulosPage() {
  return (
    <main className="min-h-screen bg-[#F4EFE3] text-[#14110F]">
      <header className="border-b border-black/10 bg-[#14110F] px-4 py-4 text-[#F4EFE3] sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="font-black uppercase tracking-[0.35em]">
            LOBO
          </Link>
          <Link
            href="/calculadora"
            className="text-xs font-bold uppercase tracking-wide text-[#C9BDAA] transition hover:text-white"
          >
            Calculadora
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
        <nav className="text-xs font-bold uppercase tracking-[0.16em] text-black/45">
          <Link href="/" className="transition hover:text-black">
            Inicio
          </Link>{" "}
          / Artículos
        </nav>

        <div className="mt-12 max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#A93622]">
            Biblioteca LOBO
          </p>
          <h1 className="mt-5 text-4xl font-black uppercase leading-[0.92] sm:text-6xl md:text-7xl">
            Artículos sobre comida real para perros
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-black/65 md:text-xl md:leading-9">
            Guías directas para entender comida húmeda, comida casera, mix
            feeding y porciones sin caer en promesas infladas.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={article.slug}
              className="border border-black/10 bg-white/55 p-6 transition hover:bg-white"
            >
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#A93622]">
                {article.eyebrow}
              </p>
              <h2 className="mt-4 text-2xl font-black uppercase leading-tight">
                {article.h1}
              </h2>
              <p className="mt-4 text-sm leading-7 text-black/65">
                {article.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
