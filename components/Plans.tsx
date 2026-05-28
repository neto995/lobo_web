import PlanCard from "@/components/PlanCard";

export default function Plans() {
  const plans = [
    {
      title: "Hot Sale CH",
      price: "$2,090",
      duration: "3 meses",
      portions: "20 porciones",
      promo: "3 MSI + hasta 15% OFF",
      features: [
        "Ideal para perros chicos",
        "También funciona para mix feeding",
        "Precio congelado Hot Sale",
        "Seguimiento personalizado",
        "Pago seguro con Mercado Pago"
      ],
      buttonText: "Comprar CH · 3 meses"
    },

    {
      title: "Hot Sale CH",
      price: "$3,790",
      duration: "6 meses",
      portions: "20 porciones",
      promo: "6 MSI + hasta 15% OFF",
      popular: true,
      features: [
        "Ideal para perros chicos",
        "También funciona para mix feeding",
        "Precio congelado Hot Sale",
        "Seguimiento personalizado",
        "Pago seguro con Mercado Pago"
      ],
      buttonText: "Comprar CH · 6 meses"
    },

    {
      title: "Hot Sale M/G",
      price: "$2,835",
      duration: "3 meses",
      portions: "30 porciones",
      promo: "3 MSI + hasta 15% OFF",
      features: [
        "Ideal para perros medianos o grandes",
        "Más porciones, menos vueltas",
        "Precio congelado Hot Sale",
        "Premios naturales incluidos",
        "Pago seguro con Mercado Pago"
      ],
      buttonText: "Comprar M/G · 3 meses"
    },

    {
      title: "Hot Sale M/G",
      price: "$5,670",
      duration: "6 meses",
      portions: "30 porciones",
      promo: "6 MSI + hasta 15% OFF",
      features: [
        "Ideal para perros medianos o grandes",
        "Más porciones, menos vueltas",
        "Precio congelado Hot Sale",
        "Premios naturales incluidos",
        "Pago seguro con Mercado Pago"
      ],
      buttonText: "Comprar M/G · 6 meses"
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
            Hot Sale LOBO
          </p>

          <h2 className="text-5xl md:text-7xl font-bold uppercase mt-4">
            Elige según su talla.
          </h2>

          <p className="mt-6 text-gray-400 text-lg max-w-2xl mx-auto">
            Paga en MSI, congela precio y recibe comida real sin vueltas.
          </p>

        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <PlanCard
              key={`${plan.title}-${plan.duration}`}
              title={plan.title}
              price={plan.price}
              duration={plan.duration}
              portions={plan.portions}
              promo={plan.promo}
              features={plan.features}
              popular={plan.popular}
              buttonText={plan.buttonText}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto mt-16 border border-white/10 rounded-3xl p-8 bg-white/5 text-center">
          <p className="uppercase tracking-[0.3em] text-xs text-gray-500">
            Otras formas de empezar
          </p>

          <h3 className="text-2xl md:text-3xl font-bold uppercase mt-4">
            ¿Todavía no sabes qué plan elegir?
          </h3>

          <div className="mt-8 grid md:grid-cols-2 gap-6 text-left">

            <div className="border border-white/10 rounded-2xl p-6 bg-black/30">
              <h4 className="text-xl font-bold">
                Compra mensual
              </h4>

              <p className="mt-3 text-gray-400">
                Planes desde $630. Escríbenos y armamos el plan según su peso, talla y consumo.
              </p>
            </div>

            <div className="border border-white/10 rounded-2xl p-6 bg-black/30">
              <h4 className="text-xl font-bold">
                Premium Box
              </h4>

              <p className="mt-3 text-gray-400">
                10 porciones por $370. Ideal si es la primera vez que tu perro prueba LOBO.
              </p>
            </div>

          </div>

          <a
            href="https://wa.me/5213330626243"
            target="_blank"
            className="inline-block mt-8 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition"
          >
            Armar plan por WhatsApp
          </a>
        </div>

      </div>
    </section>
  );
}