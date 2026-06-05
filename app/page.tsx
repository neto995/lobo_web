import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Plans from "@/components/Plans";
import Ingredients from "@/components/Ingredients";
import FAQ from "@/components/FAQ";

export const metadata: Metadata = {
  title: "LOBO | Comida real para perros",
  description:
    "Comida real cocinada para perros. Úsala como complemento de croquetas, mix feeding o plan mensual según el peso y objetivo de tu perro.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "LOBO | Comida real para perros",
    description:
      "Comida real cocinada para perros. Úsala como complemento de croquetas, mix feeding o plan mensual según el peso y objetivo de tu perro.",
    url: "/",
  },
  twitter: {
    title: "LOBO | Comida real para perros",
    description:
      "Comida real cocinada para perros. Úsala como complemento de croquetas, mix feeding o plan mensual según el peso y objetivo de tu perro.",
  },
};

export default function Home() {
  return (
    <main className="bg-black text-white">

      <Navbar />
      <Hero />
      <Plans />
      <Ingredients />
      <FAQ />

    </main>
  );
}
