export default function Ingredients() {
  return (
    <section id="ingredientes" className="py-32 px-6 bg-white text-black">
      <div className="max-w-6xl mx-auto">
        <p className="uppercase tracking-[0.3em] text-sm text-gray-500">
          Ingredientes
        </p>

        <h2 className="text-5xl md:text-7xl font-black uppercase mt-4 max-w-4xl">
          Ingredientes que sí puedes ver.
        </h2>

        <p className="mt-6 text-xl text-gray-700 max-w-2xl">
          Pollo, res, camote y vegetales reales. Sin teatro. Sin rellenos. Sin croquetas maquilladas.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {["Pollo y res", "Camote", "Vegetales"].map((item) => (
            <div key={item} className="border border-black/10 rounded-3xl p-8">
              <h3 className="text-2xl font-bold">{item}</h3>
              <p className="mt-4 text-gray-600">
                Comida real para perros que necesitan más que lo mínimo.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}