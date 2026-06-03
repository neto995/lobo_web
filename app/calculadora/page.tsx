import Calculator from "@/components/Calculator";

export default function CalculadoraPage() {
  return (
    <main className="min-h-screen bg-black text-white px-5 py-24 md:px-6 md:py-32">      <section className="max-w-5xl mx-auto">

        <p className="uppercase tracking-[0.3em] text-sm text-gray-500">
          Calculadora LOBO
        </p>

        <h1 className="text-5xl md:text-7xl font-black uppercase mt-4 leading-[0.9]">
          Arma su plan con criterio.
        </h1>

        <p className="mt-6 max-w-2xl text-gray-400 text-lg">
          Dinos peso, edad, actividad y objetivo. Te damos una estimación inicial
          de porciones LOBO y el plan que más sentido tiene.
        </p>

        <div className="mt-16">
          <Calculator />
        </div>

      </section>
    </main>
  );
}