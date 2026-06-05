const faqs = [
  {
    question: "¿Qué es LOBO?",
    answer:
      "LOBO es comida real cocinada para perros. No es croqueta maquillada ni comida casera improvisada. Es alimento húmedo, porcionado y listo para servir o mezclar con su comida actual."
  },
  {
    question: "¿Qué ingredientes tiene?",
    answer:
      "Usamos ingredientes reconocibles como pollo, res, arroz integral, camote, zanahoria, chícharos, manzana verde, aceite de girasol, cáscara de huevo y sal yodada en cantidades controladas."
  },
  {
    question: "¿LOBO es balanceado?",
    answer:
      "LOBO está formulado con criterio nutricional y porciones controladas. Aun así, cada perro es distinto. Por eso recomendamos ajustar según peso, etapa, condición corporal, apetito, popó y respuesta individual."
  },
  {
    question: "¿LOBO reemplaza las croquetas?",
    answer:
      "Puede ser parte importante de su alimentación, pero no siempre recomendamos cambiar todo de golpe. Muchos perros empiezan con mix feeding: una parte LOBO y una parte croqueta, para mejorar el plato sin complicar la transición."
  },
  {
    question: "¿Qué es el Plan Mensual?",
    answer:
      "El Plan Mensual es para quienes quieren recibir LOBO de forma constante. Tú eliges el plan según las porciones que necesita tu perro y nosotros te ayudamos a calcular una cantidad realista."
  },
  {
    question: "¿Puedo comprar una sola vez?",
    answer:
      "Sí. Puedes hacer pago único si quieres probar LOBO sin activar un plan mensual. Es ideal para empezar, ver si le gusta y observar cómo le cae."
  },
  {
    question: "¿Cómo funciona la calculadora?",
    answer:
      "La calculadora estima un punto de partida usando peso, etapa, silueta, movimiento real y objetivo. Después traduce eso a porciones LOBO, croqueta diaria aproximada y mix feeding."
  },
  {
    question: "¿Qué es mix feeding?",
    answer:
      "Mix feeding es combinar LOBO con su comida actual. No se trata de cambiar todo de golpe. Se trata de mejorar el plato con criterio, usando una proporción realista para tu perro y tu presupuesto."
  },
  {
    question: "¿Cómo se sirve LOBO?",
    answer:
      "Mantén las porciones congeladas, descongela la que vas a usar y sírvela sola o mezclada con su alimento actual. La idea es que comer mejor no se vuelva más complicado."
  },
  {
    question: "¿Cómo sé qué plan le conviene a mi perro?",
    answer:
      "Depende de su peso, etapa, condición corporal, movimiento y objetivo. Puedes usar la calculadora o mandarnos su peso por WhatsApp para recomendarte una forma lógica de empezar."
  }
];

export default function FAQ() {
  return (
    <section id="faq" className="bg-[#F4EFE3] px-6 py-32 text-black">
      <div className="max-w-4xl mx-auto">

        <p className="uppercase tracking-[0.3em] text-sm font-bold text-[#A93622]">
          FAQ
        </p>

        <h2 className="text-5xl md:text-7xl font-black uppercase mt-4">
          ¿Dudas antes de pedir?
        </h2>

        <p className="mt-6 text-black/65 text-lg max-w-2xl">
          Respuestas rápidas sobre planes, porciones y entregas. Limpio, directo y sin vueltas.
        </p>

        <div className="mt-14 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl shadow-black/5">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              className="group border-t border-black/10 first:border-t-0 open:bg-[#FBF7EF]"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-6 text-left transition hover:bg-[#FBF7EF] md:px-8 [&::-webkit-details-marker]:hidden">
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

              <p className="px-6 pb-7 pr-20 text-base leading-7 text-black/65 md:px-8 md:text-lg">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-5 rounded-3xl border border-black/10 bg-white/60 p-6 shadow-xl shadow-black/5 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="uppercase tracking-[0.3em] text-xs font-bold text-[#A93622]">
              Atención LOBO
            </p>

            <h3 className="mt-3 text-2xl font-bold uppercase">
              Te ayudamos a elegir.
            </h3>
          </div>

          <a
            href="https://wa.me/5213330626243"
            target="_blank"
            className="inline-flex justify-center rounded-full bg-black px-7 py-4 text-sm font-bold uppercase text-[#F4EFE3] transition hover:bg-[#A93622]"
          >
            Escribir por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
