import PlanCard from "@/components/PlanCard";

export default function Plans() {
const plans = [
  {
    title: "Premium Box",
    price: "$370",
    portions: "10 porciones",
    features: [
      "La mejor forma de probar LOBO",
      "Seguimiento personalizado",
      "Sin compromiso"
    ]
  },

  {
    title: "Hot Sale - 3 Meses LOBO",
    price: "$2090",
    portions: "Hasta 3 MSI + hasta 15% OFF",
    popular: true,
    features: [
      "Alimentación constante",
      "Mejor costo por porción",
      "Ideal para crear hábito",
      "Precio congelado",
      "Descuento a través de Mercado Pago y TDC participantes"
    ]
  },

  {
    title: "Hot Sale - 6 Meses LOBO",
    price: "$3990",
    portions: "Hasta 6 MSI + hasta 15% OFF",
    features: [
      "Máximo ahorro",
      "Precio congelado",
      "Ideal para dueños comprometidos",
      "Premios Premium incluidos el primer mes",
      "Descuento a través de Mercado Pago y TDC participantes"
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