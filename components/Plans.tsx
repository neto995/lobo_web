import PlanCard from "@/components/PlanCard";

export default function Plans() {
    const plans = [
  {
    title: "Starter",
    price: "$370",
    portions: "10 porciones",
    features: [
      "Comida real",
      "Pollo y res",
      "Vegetales reales"
    ]
  },

  {
    title: "Mensual",
    price: "$630",
    portions: "20 porciones",
    popular: true,
    features: [
      "Más práctico",
      "Mejor costo",
      "Menos marketing"
    ]
  },

  {
    title: "Full",
    price: "$945",
    portions: "30 porciones",
    features: [
      "Máxima comodidad",
      "Más consistencia",
      "Mejor nutrición"
    ]
  }
];
  return (
    <section
      id="planes"
      className="py-32 px-6 bg-black"
    >

      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-20">

          <p className="uppercase tracking-[0.3em] text-sm text-gray-500">
            LOBO
          </p>

          <h2 className="text-5xl md:text-7xl font-bold uppercase mt-4">
            Planes
          </h2>

          <p className="mt-6 text-gray-400 text-lg">
            No es premium.
            Es lógico.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

{plans.map((plan) => (
  <PlanCard
    key={plan.title}
    title={plan.title}
    price={plan.price}
    portions={plan.portions}
    features={plan.features}
    popular={plan.popular}
  />
))}

        </div>

      </div>

    </section>
  );
}