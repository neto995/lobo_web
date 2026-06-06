"use client";

import { useMemo, useState } from "react";

const faqs = [
  {
    question: "¿Qué es LOBO?",
    answer:
      "LOBO es comida real cocinada para perros. No es croqueta maquillada ni comida casera improvisada. Es alimento húmedo, porcionado y listo para servir solo o mezclado con su comida actual.",
  },
  {
    question: "¿Qué ingredientes tiene LOBO?",
    answer:
      "LOBO usa ingredientes reconocibles como pollo, res, arroz integral, camote, zanahoria, chícharos, manzana verde, aceite de girasol, cáscara de huevo y sal yodada en cantidades controladas.",
  },
  {
    question: "¿LOBO es comida balanceada para perros?",
    answer:
      "LOBO está formulado con criterio nutricional, porciones controladas e ingredientes reales. Aun así, cada perro es distinto: ajustamos según peso, etapa, condición corporal, apetito, popó y respuesta individual.",
  },
  {
    question: "¿LOBO reemplaza las croquetas?",
    answer:
      "Puede formar parte importante de su alimentación, pero no siempre recomendamos cambiar todo de golpe. Muchos perros empiezan con mix feeding: una parte LOBO y una parte croqueta, para mejorar el plato sin complicar la transición.",
  },
  {
    question: "¿Qué es mix feeding para perros?",
    answer:
      "Mix feeding es combinar LOBO con su comida actual, como croquetas o una dieta que ya manejes. No se trata de cambiar todo de golpe; se trata de mejorar el plato con una proporción realista para tu perro, tu rutina y tu presupuesto.",
  },
  {
    question: "¿Por qué no simplemente seguir con croquetas?",
    answer:
      "Puedes hacerlo. Las croquetas cumplen, pero para muchos perros son solo el mínimo aceptable. LOBO existe para quienes ya se preguntaron si pueden hacerlo mejor sin complicarse la vida ni improvisar comida casera todos los días.",
  },
  {
    question: "¿Qué diferencia hay entre LOBO y comida casera?",
    answer:
      "La comida casera suele empezar con buena intención, pero muchas veces termina siendo improvisada: pollo, arroz, sobras o cantidades sin control. LOBO busca dar comida real con porciones claras y una rutina más constante.",
  },
  {
    question: "¿Qué diferencia hay entre LOBO y BARF?",
    answer:
      "BARF tiene buena intención: comida real. Pero no todos logran sostener manejo, gramajes, logística y consistencia. LOBO es comida cocinada, porcionada y más práctica para el día a día.",
  },
  {
    question: "¿Qué es el Plan Mensual LOBO?",
    answer:
      "El Plan Mensual LOBO es para quienes quieren recibir comida real de forma constante. Tú eliges el plan según las porciones que necesita tu perro y nosotros te ayudamos a calcular una cantidad realista.",
  },
  {
    question: "¿Puedo comprar LOBO una sola vez?",
    answer:
      "Sí. Puedes hacer pago único si quieres probar LOBO sin activar un plan mensual. Es ideal para empezar, ver si le gusta a tu perro y observar cómo le cae antes de pedir más porciones.",
  },
  {
    question: "¿Qué incluye el Premium Box?",
    answer:
      "El Premium Box incluye 10 porciones de LOBO. Es la forma más simple de probar comida real sin comprar todo el mes ni cambiar la alimentación de golpe.",
  },
  {
    question: "¿Cómo sé qué plan LOBO le conviene a mi perro?",
    answer:
      "Depende de su peso, etapa, condición corporal, movimiento real y objetivo. Puedes usar la calculadora LOBO para estimar porciones, mix feeding y croqueta diaria, o mandarnos su peso por WhatsApp para recomendarte una forma lógica de empezar.",
  },
  {
    question: "¿Cómo funciona la calculadora LOBO?",
    answer:
      "La calculadora LOBO estima un punto de partida usando peso, etapa, silueta, movimiento real y objetivo. Después traduce esa información a porciones LOBO, croqueta diaria aproximada y porcentaje de mix feeding.",
  },
  {
    question: "¿Qué metodología usa la calculadora LOBO?",
    answer:
      "La calculadora usa RER/MER como referencia energética, ajusta según etapa, condición corporal y movimiento real, y después traduce esa estimación a un mix práctico entre LOBO y croqueta. Es un punto de partida, no una fórmula médica.",
  },
  {
    question: "¿El resultado de la calculadora LOBO es exacto?",
    answer:
      "No. Es una estimación inicial para empezar con más criterio, no una fórmula médica. Cada perro puede responder distinto, por eso ajustamos según apetito, popó, peso, saciedad y condición corporal.",
  },
  {
    question: "¿LOBO promete mejorar la salud de mi perro?",
    answer:
      "No prometemos curas ni resultados médicos. LOBO busca mejorar la calidad del plato con comida real, porciones claras y menos improvisación. Después observamos tolerancia, digestión, apetito, popó y respuesta individual.",
  },
  {
    question: "¿LOBO sirve para perros con alergias o condiciones médicas?",
    answer:
      "Depende del caso. Si tu perro tiene alergias, enfermedad, sobrepeso importante, bajo peso o necesita una dieta especial, lo responsable es consultar a tu veterinario o nutricionista veterinario antes de hacer cambios.",
  },
  {
    question: "¿LOBO es para cachorros o perros senior?",
    answer:
      "Puede tener sentido, pero hay que ser más cuidadosos. En cachorros importa la etapa de crecimiento y en perros senior importan peso, digestión, dientes, salud y recomendación veterinaria. Por eso siempre calculamos antes de recomendar.",
  },
  {
    question: "¿Cómo se sirve LOBO?",
    answer:
      "Mantén las porciones congeladas, descongela la que vas a usar y sírvela sola o mezclada con su alimento actual. La idea es que comer mejor no se vuelva otra cosa complicada en tu día.",
  },
  {
    question: "¿Por qué LOBO dice “Más comida. Menos marketing”?",
    answer:
      "Porque la industria habla mucho de etiquetas, empaques y promesas. LOBO prefiere regresar a lo básico: comida real, ingredientes reconocibles y decisiones con criterio. Si parece comida, es porque lo es.",
  },
];

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function getSearchScore(query: string, question: string, answer: string) {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return 0;
  }

  const normalizedQuestion = normalizeText(question);
  const normalizedAnswer = normalizeText(answer);
  const searchableText = `${normalizedQuestion} ${normalizedAnswer}`;
  const words = normalizedQuery.split(/\s+/).filter(Boolean);

  return words.reduce((score, word) => {
    if (normalizedQuestion.includes(word)) {
      return score + 4;
    }

    if (searchableText.includes(word)) {
      return score + 1;
    }

    return score;
  }, normalizedQuestion.includes(normalizedQuery) ? 8 : 0);
}

export default function FAQ() {
  const [query, setQuery] = useState("");
  const [openQuestion, setOpenQuestion] = useState(faqs[0].question);

  const visibleFaqs = useMemo(() => {
    const cleanQuery = query.trim();

    if (!cleanQuery) {
      return faqs.map((faq, index) => ({
        ...faq,
        originalIndex: index,
        score: 0,
      }));
    }

    return faqs
      .map((faq, index) => ({
        ...faq,
        originalIndex: index,
        score: getSearchScore(cleanQuery, faq.question, faq.answer),
      }))
      .filter((faq) => faq.score > 0)
      .sort((a, b) => b.score - a.score || a.originalIndex - b.originalIndex);
  }, [query]);

  const bestMatch = query.trim() ? visibleFaqs[0]?.question : openQuestion;

  return (
    <section
      id="faq"
      className="bg-[#F4EFE3] px-4 py-24 text-black sm:px-6 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="uppercase tracking-[0.3em] text-xs font-bold text-[#A93622] md:text-sm">
            FAQ
          </p>

          <h2 className="mt-4 text-4xl font-black uppercase leading-[0.92] text-[#14110F] sm:text-5xl md:text-7xl">
            Preguntas frecuentes
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-black/65 md:text-lg">
            Respuestas claras sobre comida real para perros, mix feeding,
            planes, porciones y cómo empezar con LOBO sin cambiar todo de golpe.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-[2rem] border border-black/10 bg-white/70 p-3 shadow-2xl shadow-black/5 backdrop-blur sm:p-4">
          <label
            htmlFor="faq-search"
            className="block px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[#A93622] sm:px-3"
          >
            Pregunta lo que quieras
          </label>

          <div className="flex flex-col gap-3 rounded-3xl border border-black/10 bg-[#FBF7EF] p-3 sm:flex-row sm:items-center">
            <input
              id="faq-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ej. ¿qué es la calculadora lobo?"
              className="min-h-12 flex-1 bg-transparent px-2 text-sm text-[#14110F] outline-none placeholder:text-black/40 sm:text-base"
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="rounded-full border border-black/10 bg-white px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#14110F] transition hover:bg-[#F4EFE3]"
              >
                Limpiar
              </button>
            )}
          </div>

          {query.trim() && (
            <p className="px-3 pt-3 text-xs leading-5 text-black/55">
              {visibleFaqs.length > 0
                ? "Abrimos la respuesta más cercana a tu búsqueda."
                : "No encontramos una coincidencia clara. Intenta con palabras como mix feeding, ingredientes, plan o calculadora."}
            </p>
          )}
        </div>

        <div className="mx-auto mt-8 grid max-w-3xl gap-3">
          {visibleFaqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-3xl border border-black/10 bg-white shadow-xl shadow-black/5 open:bg-white"
              open={bestMatch === faq.question}
              onToggle={(event) => {
                if (query.trim()) {
                  return;
                }

                setOpenQuestion(event.currentTarget.open ? faq.question : "");
              }}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-left transition hover:bg-[#FBF7EF] sm:gap-6 sm:px-6 md:px-8 [&::-webkit-details-marker]:hidden">
                <div className="flex min-w-0 items-start gap-4 sm:gap-5">
                  <span className="pt-1 text-xs font-black tracking-[0.24em] text-[#A93622]">
                    {String(faq.originalIndex + 1).padStart(2, "0")}
                  </span>

                  <h3 className="text-base font-black uppercase leading-tight text-[#14110F] sm:text-xl md:text-2xl">
                    {faq.question}
                  </h3>
                </div>

                <span
                  aria-hidden="true"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#D9A441]/40 bg-[#D9A441]/15 text-2xl leading-none text-[#A93622] transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>

              <p className="px-5 pb-6 pl-[4.25rem] pr-6 text-sm leading-7 text-black/65 sm:pl-[5rem] sm:text-base md:px-8 md:pl-[5.75rem] md:pr-24 md:text-lg">
                {faq.answer}
              </p>
            </details>
          ))}

          {visibleFaqs.length === 0 && (
            <div className="rounded-3xl border border-black/10 bg-white p-6 text-center shadow-xl shadow-black/5">
              <p className="font-bold uppercase text-[#14110F]">
                No encontramos esa pregunta.
              </p>

              <p className="mt-3 text-sm leading-6 text-black/60">
                Escríbenos por WhatsApp y te ayudamos a elegir una forma lógica
                de empezar.
              </p>
            </div>
          )}
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-5 rounded-3xl border border-black/10 bg-white/60 p-6 shadow-xl shadow-black/5 md:flex-row md:items-center md:justify-between md:p-8">
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
            rel="noopener noreferrer"
            aria-label="Escribir a LOBO por WhatsApp para elegir un plan"
            className="inline-flex justify-center rounded-full bg-black px-7 py-4 text-sm font-bold uppercase text-[#F4EFE3] transition hover:bg-[#A93622]"
          >
            Escribir por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}