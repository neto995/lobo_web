const faqs = [
  {
    question: "¿LOBO reemplaza las croquetas?",
    answer: "Puede usarse como comida principal o como complemento, según las necesidades de cada perro."
  },
  {
    question: "¿Es comida cruda o BARF?",
    answer: "No. LOBO es comida húmeda cocinada, hecha para dar comida real sin complicar al dueño."
  },
  {
    question: "¿Cómo sé qué plan necesita mi perro?",
    answer: "Mándanos su peso, edad y nivel de actividad y te ayudamos a elegir el plan correcto."
  },
  {
    question: "¿Cómo se entrega?",
    answer: "Se entrega congelado, empacado y listo para guardar. La coordinación se hace después de la compra."
  },
  {
    question: "¿Cómo se sirve?",
    answer: "Solo descongela, sirve y listo. Muchos perros lo comen mezclado con croquetas."
  },
  {
    question: "¿Puedo empezar sin cambiarle toda la dieta?",
    answer: "Sí. Muchísimos clientes empiezan con dieta mixta para hacer una transición gradual."
  },
  {
  question: "¿Qué ingredientes tiene?",
  answer: "LOBO usa ingredientes reales y visibles: pollo, res, arroz, verduras, cáscara de huevo como microdosis de calcio y sal yodada. No es una dieta veterinaria ni está formulada para reemplazar alimentos terapéuticos para alergias, riñón u otros problemas de salud."
},
  {
    question: "¿Cuánto dura congelado?",
    answer: "Manteniéndolo congelado correctamente puede durar varias semanas sin problema."
  },
  {
    question: "¿Puedo comprar para varios perros?",
    answer: "Sí. Podemos ayudarte a calcular porciones y planes para cada uno."
  },
  {
    question: "¿Qué pasa si mi perro nunca ha probado comida húmeda?",
    answer: "Por eso existe el Premium Box. La idea es que pruebe LOBO antes de comprometerte a un plan mensual."
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
          Antes de comprar.
        </h2>

        <div className="mt-16 space-y-6">
          {faqs.map((faq) => (
            <div key={faq.question} className="border border-white/10 rounded-3xl p-8 bg-white/5">
              <h3 className="text-2xl font-bold">{faq.question}</h3>
              <p className="mt-4 text-gray-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}