const faqs = [
  {
    question: "¿Qué es LOBO?",
    answer:
      "Comida real cocinada para perros: húmeda, porcionada y lista para servir sola o mezclada con croquetas.",
  },
  {
    question: "¿Tengo que cambiar todo?",
    answer:
      "No. Muchos perros empiezan con mix feeding: una parte LOBO y una parte de su alimento actual.",
  },
  {
    question: "¿Qué es mix feeding?",
    answer:
      "Es mezclar comida real con croquetas en un porcentaje claro. La idea es mejorar el plato sin improvisar.",
  },
  {
    question: "¿Cómo sé cuánto servir?",
    answer:
      "Usa la calculadora LOBO o mándanos peso, etapa y actividad. Te damos una estimación inicial.",
  },
  {
    question: "¿LOBO reemplaza croquetas?",
    answer:
      "Puede formar parte importante del plato, pero no siempre recomendamos cambiar todo de golpe.",
  },
  {
    question: "¿Entregan en GDL/Zapopan?",
    answer:
      "Sí. Escríbenos por WhatsApp para confirmar zona, horario y la forma más lógica de empezar.",
  },
];

export default function FAQ() {
  return (
    <section
      id="faq"
      className="bg-white px-4 py-16 text-[#14110F] sm:px-6 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#A93622]">
              FAQ
            </p>

            <h2 className="mt-4 text-4xl font-black uppercase leading-[0.92] sm:text-5xl md:text-6xl">
              Preguntas sin vueltas.
            </h2>
          </div>

          <div className="grid gap-px overflow-hidden bg-black/10">
            {faqs.map((faq) => (
              <details key={faq.question} className="group bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-4 py-5 text-left [&::-webkit-details-marker]:hidden md:px-6">
                  <h3 className="text-lg font-black uppercase leading-tight">
                    {faq.question}
                  </h3>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-black/10 text-xl leading-none transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="border-t border-black/10 px-4 pb-5 pt-4 text-sm leading-7 text-black/64 md:px-6 md:text-base">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
