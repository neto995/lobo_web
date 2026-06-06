import PlanCard from "@/components/PlanCard";

export default function Plans() {
  const plans = [
      {
      title: "Plan Chico",
      price: "$630",
      duration: "Entrega programada",
      portions: "20 porciones",
      promo: "Cobro recurrente mensual",
      popular: true,
      features: [
        "LOBO llega cada mes",
        "No tienes que volver a pedir",
        "Ideal para mantener consistencia",
        "Puedes cancelar cuando quieras",
        "Pago recurrente con Mercado Pago"
      ],
      buttonText: "Activar suscripción",
      checkoutUrl: "https://www.mercadopago.com.mx/subscriptions/checkout?preapproval_plan_id=6aed20bbc8354a2fa37105890d50f4d7"
    },

    {
      title: "Plan Chico",
      price: "$630",
      duration: "Pago mensual",
      portions: "20 porciones",
      promo: "Compra única",
      features: [
        "Ideal para perros chicos",
        "También funciona para mix feeding",
        "Sin compromiso mensual",
        "Seguimiento personalizado",
        "Pago seguro con Mercado Pago"
      ],
      buttonText: "Compra única",
      planId: "plan-chico-unico"
    },
    {
      title: "Plan Mediano",
      price: "$945",
      duration: "Entrega programada",
      portions: "30 porciones",
      promo: "Cobro recurrente mensual",
      features: [
        "LOBO llega cada mes",
        "Más comida real disponible",
        "Ideal para perros medianos",
        "Puedes cancelar cuando quieras",
        "Pago recurrente con Mercado Pago"
      ],
      buttonText: "Activar suscripción",
      checkoutUrl: "https://www.mercadopago.com.mx/subscriptions/checkout?preapproval_plan_id=ec5904061c9c487ca87460e189e2a0a7"
    }
    ,
    {
      title: "Plan Mediano",
      price: "$945",
      duration: "Pago mensual",
      portions: "30 porciones",
      promo: "Compra única",
      features: [
        "Ideal para perros medianos",
        "Más porciones para el mes",
        "Sin compromiso mensual",
        "Seguimiento personalizado",
        "Pago seguro con Mercado Pago"
      ],
      buttonText: "Compra única",
      planId: "plan-mediano-unico"
    },

  ];

  return (
    <section
      id="planes"
      className="py-32 px-6 bg-black"
    >
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-20">
          <p className="uppercase tracking-[0.3em] text-sm text-gray-500">
            Planes LOBO
          </p>

          <h2 className="text-5xl md:text-7xl font-bold uppercase mt-4">
            Elige cómo quieres pedir.
          </h2>

          <p className="mt-6 text-gray-400 text-lg max-w-2xl mx-auto">
            Compra una vez o deja tu entrega programada cada mes.
            Comida real, lista para servir.
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
              checkoutUrl={plan.checkoutUrl}
              planId={plan.planId}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto mt-16 border border-white/10 rounded-3xl p-8 bg-white/5 text-center">
          <h3 className="text-2xl font-bold uppercase">
            ¿No sabes cuál elegir?
          </h3>

          <p className="mt-4 text-gray-400">
            Mándanos el peso de tu perro para un plan personalizado según:
            <br />
            su tamaño, actividad y alimentación actual.
          </p>

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
