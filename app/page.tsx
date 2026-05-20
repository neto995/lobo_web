import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Plans from "@/components/Plans";
import Ingredients from "@/components/Ingredients";
import FAQ from "@/components/FAQ";

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