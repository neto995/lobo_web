import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Plans from "@/components/Plans";
import Ingredients from "@/components/Ingredients";
import FAQ from "@/components/FAQ";
import {
  CalculatorSpotlight,
  CriterionSection,
  HomeFooter,
  HomeIntro,
  MixFeedingSection,
} from "@/components/HomeEditorial";

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
      <HomeIntro />
      <MixFeedingSection />
      <Ingredients />
      <Plans />
      <CalculatorSpotlight />
      <CriterionSection />
      <FAQ />
      <HomeFooter />

    </main>
  );
}
