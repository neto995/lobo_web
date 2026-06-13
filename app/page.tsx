import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Plans from "@/components/Plans";
import Ingredients from "@/components/Ingredients";
import FAQ from "@/components/FAQ";

export const metadata: Metadata = {
  title: "LOBO | Comida real cocinada para perros en Guadalajara",
  description:
    "Comida real cocinada para perros. Porciones húmedas listas para servir o mezclar con croquetas. Calcula el plan ideal para tu perro.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "LOBO | Comida real cocinada para perros en Guadalajara",
    description:
      "Comida real cocinada para perros. Porciones húmedas listas para servir o mezclar con croquetas. Calcula el plan ideal para tu perro.",
    url: "/",
  },
  twitter: {
    title: "LOBO | Comida real cocinada para perros en Guadalajara",
    description:
      "Comida real cocinada para perros. Porciones húmedas listas para servir o mezclar con croquetas. Calcula el plan ideal para tu perro.",
  },
};

export default function Home() {
  return (
    <main className="bg-black text-white">

      <Navbar />
      <Hero />
      <section className="border-y border-white/10 bg-[#F4EFE3] px-6 py-14 text-black">
        <div className="mx-auto max-w-6xl">
          <p className="max-w-4xl text-2xl font-black uppercase leading-tight md:text-4xl">
            LOBO es comida real cocinada para perros en Guadalajara:
            porciones húmedas, listas para servir o mezclar con croquetas.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/comida-real-cocinada-para-perros"
              className="rounded-full bg-black px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#F4EFE3] transition hover:bg-[#A93622]"
            >
              Comida real cocinada para perros
            </Link>
            <Link
              href="/mix-feeding-para-perros"
              className="rounded-full border border-black/15 px-5 py-3 text-xs font-bold uppercase tracking-wide text-black/70 transition hover:bg-white hover:text-black"
            >
              Mix feeding
            </Link>
            <Link
              href="/calculadora"
              className="rounded-full border border-black/15 px-5 py-3 text-xs font-bold uppercase tracking-wide text-black/70 transition hover:bg-white hover:text-black"
            >
              Calculadora
            </Link>
            <Link
              href="/comida-para-perros-guadalajara"
              className="rounded-full border border-black/15 px-5 py-3 text-xs font-bold uppercase tracking-wide text-black/70 transition hover:bg-white hover:text-black"
            >
              Comida para perros en GDL
            </Link>
          </div>
        </div>
      </section>
      <Plans />
      <Ingredients />
      <FAQ />

    </main>
  );
}
