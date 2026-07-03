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
      highlight: true,
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
      className="bg-negro px-4 py-16 text-hueso sm:px-6 md:py-24"
    >
      <div className="mx-auto max-w-6xl">

        <div className="grid gap-8 md:grid-cols-[0.95fr_1.05fr] md:items-end">
          <div>
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#C9BDAA]">
            Planes LOBO
          </p>

          <h2 className="mt-4 text-4xl font-black uppercase leading-[0.92] tracking-normal sm:text-5xl md:text-7xl">
            Hazlo constante
          </h2>
          </div>

          <p className="text-base leading-7 text-[#DED4C4] md:text-xl md:leading-8">
            Premium Box para empezar, compra única si quieres control y plan
            mensual cuando LOBO ya forma parte de su rutina.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
              highlight={plan.highlight}
              buttonText={plan.buttonText}
              checkoutUrl={plan.checkoutUrl}
              planId={plan.planId}
            />
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.045] p-5 md:p-7">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#C9BDAA]">
                Premium Box
              </p>
              <h3 className="mt-3 text-4xl font-black uppercase leading-none md:text-5xl">
                10 porciones
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#DED4C4]">
                Para probar sin comprar todo el mes. Ideal para ver apetito,
                tolerancia y rutina.
              </p>
            </div>

            <a
              href="https://wa.me/5213330626243"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center rounded-full border border-white/20 px-8 py-4 text-xs font-black uppercase tracking-wide text-[#F4EFE3] transition hover:bg-white/10 md:min-w-72"
            >
              Pedir por WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-10 grid gap-5 border-t border-white/10 pt-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
          <h3 className="text-2xl font-black uppercase">
            ¿No sabes cuál elegir?
          </h3>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#C9BDAA] md:text-base">
            Mándanos peso, actividad y qué come hoy. Te calculamos una entrada
            realista.
          </p>
          </div>

          <a
            href="https://wa.me/5213330626243"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center rounded-full bg-[#F4EFE3] px-7 py-4 text-xs font-black uppercase tracking-wide text-black transition hover:bg-white"
          >
            Armar plan por WhatsApp
          </a>
        </div>

      </div>
    </section>
  );
}
