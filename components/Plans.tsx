import PlanCard from "@/components/PlanCard";
import Link from "next/link";

export default function Plans() {
  const subscriptionPlans = [
    {
      title: "Plan Chico",
      price: "$630",
      duration: "Cada mes",
      portions: "20 porciones",
      promo: "Entrega programada",
      popular: true,
      features: [
        "Cobro recurrente mensual",
        "Puedes cancelar cuando quieras",
        "Pago recurrente con Mercado Pago",
      ],
      buttonText: "Activar suscripción",
      checkoutUrl:
        "https://www.mercadopago.com.mx/subscriptions/checkout?preapproval_plan_id=6aed20bbc8354a2fa37105890d50f4d7",
    },
    {
      title: "Plan Mediano",
      price: "$945",
      duration: "Cada mes",
      portions: "30 porciones",
      promo: "Entrega programada",
      highlight: true,
      features: [
        "Cobro recurrente mensual",
        "Puedes cancelar cuando quieras",
        "Pago recurrente con Mercado Pago",
      ],
      buttonText: "Activar suscripción",
      checkoutUrl:
        "https://www.mercadopago.com.mx/subscriptions/checkout?preapproval_plan_id=ec5904061c9c487ca87460e189e2a0a7",
    },
  ];

  const oneTimePlans = [
    {
      title: "Plan Chico",
      price: "$630",
      duration: "Una sola compra",
      portions: "20 porciones",
      promo: "Sin suscripción",
      features: [
        "Úsalo para mix feeding",
        "Sin compromiso mensual",
        "Pago seguro con Mercado Pago",
      ],
      buttonText: "Compra única",
      planId: "plan-chico-unico",
    },
    {
      title: "Plan Mediano",
      price: "$945",
      duration: "Una sola compra",
      portions: "30 porciones",
      promo: "Sin suscripción",
      features: [
        "Más porciones disponibles",
        "Sin compromiso mensual",
        "Pago seguro con Mercado Pago",
      ],
      buttonText: "Compra única",
      planId: "plan-mediano-unico",
    },
  ];

  return (
    <section
      id="planes"
      className="aurora-surface scroll-mt-16 border-y border-carbon/10 bg-hueso px-4 py-16 text-carbon sm:px-6 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-[0.95fr_1.05fr] md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-rojo">
              Planes LOBO
            </p>

            <h2 className="mt-4 text-4xl font-black uppercase leading-[0.92] tracking-normal sm:text-5xl md:text-7xl">
              Empieza. Luego hazlo constante.
            </h2>
          </div>

          <p className="text-base leading-7 text-ceniza md:text-xl md:leading-8">
            Prueba 10 porciones o programa 20–30 para el mes. Sin esconder la
            decisión detrás de un plan complicado.
          </p>
        </div>

        <article
          id="premium-box"
          className="frosted-glass frosted-glass--ink mt-10 scroll-mt-24 p-5 text-carbon md:p-8"
        >
          <div className="grid gap-7 md:grid-cols-[0.7fr_1fr_auto] md:items-center">
            <div className="border-b border-carbon/20 pb-5 md:border-b-0 md:border-r md:pb-0 md:pr-7">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-rojo">
                Para probar
              </p>
              <p className="mt-3 text-7xl uppercase leading-none">10</p>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-carbon/60">
                Porciones
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-black uppercase leading-none md:text-5xl">
                Premium Box.
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-6 text-carbon/65 md:text-base">
                Ve si le gusta y cómo se integra a su rutina. Sin comprar todo
                el mes.
              </p>
            </div>

            <a
              href="https://wa.me/5213330626243"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-13 items-center justify-center rounded-full bg-carbon px-8 text-xs font-black uppercase tracking-wide text-hueso transition hover:bg-rojo md:min-w-56"
            >
              Pedir Premium Box
            </a>
          </div>
        </article>

        <div className="mt-12 flex items-end justify-between gap-5 border-b border-carbon/15 pb-5">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-rojo">
              Plan mensual
            </p>
            <h3 className="mt-2 text-2xl uppercase sm:text-3xl">
              Elige porciones.
            </h3>
          </div>
          <p className="hidden text-sm text-ceniza sm:block">20 o 30 por mes</p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {subscriptionPlans.map((plan) => (
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
            />
          ))}
        </div>

        <details className="frosted-glass frosted-glass--ink group mt-5">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-black uppercase tracking-[0.08em] text-carbon [&::-webkit-details-marker]:hidden">
            Prefiero compra única
            <span
              aria-hidden="true"
              className="grid h-8 w-8 place-items-center border border-carbon/20 text-xl leading-none transition group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="grid gap-4 border-t border-carbon/15 p-4 md:grid-cols-2">
            {oneTimePlans.map((plan) => (
              <PlanCard
                key={`${plan.title}-${plan.duration}`}
                title={plan.title}
                price={plan.price}
                duration={plan.duration}
                portions={plan.portions}
                promo={plan.promo}
                features={plan.features}
                buttonText={plan.buttonText}
                planId={plan.planId}
              />
            ))}
          </div>
        </details>

        <div className="mt-10 grid gap-5 border-t border-carbon/15 pt-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h3 className="text-2xl font-black uppercase">
              ¿No sabes cuál elegir?
            </h3>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-ceniza md:text-base">
              Usa su peso, etapa y objetivo para calcular una entrada realista.
            </p>
          </div>

          <Link
            href="/calculadora"
            className="inline-flex justify-center rounded-full bg-carbon px-7 py-4 text-xs font-black uppercase tracking-wide text-hueso transition hover:bg-rojo hover:text-white"
          >
            Calcular su mix
          </Link>
        </div>
      </div>
    </section>
  );
}
