const faqs = [
  {
    question: "¿Cómo funciona LOBO mensual?",
    answer:
      "Activamos una entrega programada cada mes con las porciones que necesita tu perro. Tú no tienes que estar haciendo pedidos nuevos: LOBO queda programado."
  },
  {
    question: "¿Puedo comprar una sola vez?",
    answer:
      "Sí. Puedes elegir compra única si quieres probar LOBO sin activar un pago recurrente. Es ideal para conocer el producto y ver cómo le cae a tu perro."
  },
  {
    question: "¿Qué plan le conviene a mi perro?",
    answer:
      "Depende de su peso, apetito y si LOBO será su comida principal o un complemento. Si tienes duda, mándanos su peso por WhatsApp y te ayudamos a elegir."
  },
  {
    question: "¿Las porciones vienen listas para servir?",
    answer:
      "Sí. Vienen porcionadas y listas para guardar, descongelar y servir."
  },
  {
    question: "¿Puedo cancelar el plan mensual?",
    answer:
      "Sí. Puedes cancelar cuando quieras. LOBO mensual está hecho para simplificarte la vida, no para amarrarte a algo que ya no necesitas."
  },
  {
    question: "¿Cómo se paga?",
    answer:
      "El pago se procesa de forma segura con Mercado Pago. En compra única pagas una vez; en plan mensual se activa el cobro recurrente del plan elegido."
  },
  {
    question: "¿LOBO sirve para mix feeding?",
    answer:
      "Sí. Muchos clientes usan LOBO como complemento de croquetas o como parte de una transición a comida real. Te ayudamos a ajustar porciones según el caso."
  }
];

export default function FAQ() {
  return (
    <section id="faq" className="py-32 px-6 bg-black text-white">
      <div className="max-w-4xl mx-auto">

        <p className="uppercase tracking-[0.3em] text-sm text-gray-500">
          FAQ
        </p>

        <h2 className="text-5xl md:text-7xl font-black uppercase mt-4">
          ¿Dudas antes de pedir?
        </h2>

        <p className="mt-6 text-gray-400 text-lg max-w-2xl">
          Respuestas rápidas sobre planes, porciones y entregas. Limpio, directo y sin vueltas.
        </p>

        <div className="mt-14 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              className="group border-t border-white/10 first:border-t-0 open:bg-white/[0.06]"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-6 text-left transition hover:bg-white/[0.04] md:px-8 [&::-webkit-details-marker]:hidden">
                <h3 className="text-xl font-bold uppercase md:text-2xl">
                  {faq.question}
                </h3>

                <span
                  aria-hidden="true"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-yellow-500/40 bg-yellow-500/10 text-2xl leading-none text-yellow-300 transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>

              <p className="px-6 pb-7 pr-20 text-base leading-7 text-gray-400 md:px-8 md:text-lg">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-5 rounded-3xl border border-yellow-500/30 bg-yellow-500/10 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="uppercase tracking-[0.3em] text-xs text-yellow-300">
              Atención LOBO
            </p>

            <h3 className="mt-3 text-2xl font-bold uppercase">
              Te ayudamos a elegir.
            </h3>
          </div>

          <a
            href="https://wa.me/5213330626243"
            target="_blank"
            className="inline-flex justify-center rounded-full bg-white px-7 py-4 text-sm font-bold uppercase text-black transition hover:bg-gray-200"
          >
            Escribir por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
