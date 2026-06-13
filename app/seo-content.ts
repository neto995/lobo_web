import type { Metadata } from "next";

export const whatsappUrl = "https://wa.me/5213330626243";

export const sharedFaqs = [
  {
    question: "¿Qué es comida real cocinada para perros?",
    answer:
      "Es alimento hecho con ingredientes reconocibles y cocidos, servido en porciones húmedas. La clave no es solo que parezca comida: también importa calcular cantidades, observar respuesta y no improvisar todos los días.",
  },
  {
    question: "¿Puedo mezclar comida cocinada con croquetas?",
    answer:
      "Sí, muchos perros empiezan así. La mezcla debe hacerse con una proporción clara y ajustes graduales según apetito, popó, peso, saciedad y tolerancia.",
  },
  {
    question: "¿Qué es mix feeding?",
    answer:
      "Mix feeding es combinar comida real con croquetas u otro alimento actual. Sirve para mejorar el plato sin cambiar todo de golpe ni complicar la rutina.",
  },
  {
    question: "¿Cuánta comida debe comer mi perro?",
    answer:
      "Depende de peso, etapa, silueta, movimiento real y objetivo. La calculadora LOBO da una estimación inicial para empezar con más criterio.",
  },
  {
    question: "¿LOBO reemplaza las croquetas?",
    answer:
      "Puede usarse solo o mezclado, pero no siempre recomendamos reemplazar todo de golpe. Para muchos perros, un mix realista es una mejor forma de empezar.",
  },
  {
    question: "¿LOBO entrega en Guadalajara?",
    answer:
      "Sí. LOBO trabaja entregas en Guadalajara y Zapopan. Si tienes duda de cobertura, mándanos tu zona por WhatsApp.",
  },
  {
    question: "¿Cuál es la mejor forma de empezar?",
    answer:
      "Empieza con una porción clara, un porcentaje realista de mix feeding y observación durante la transición. Premium Box o la calculadora LOBO son buenos puntos de partida.",
  },
];

export type Faq = (typeof sharedFaqs)[number];

export type SeoPageContent = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  intro: string;
  sections: {
    title: string;
    body: string[];
  }[];
  cta: {
    label: string;
    href: string;
    secondaryLabel?: string;
    secondaryHref?: string;
  };
  faqs?: Faq[];
  related: {
    label: string;
    href: string;
  }[];
};

export const seoPages: Record<string, SeoPageContent> = {
  "/comida-real-cocinada-para-perros": {
    slug: "/comida-real-cocinada-para-perros",
    title: "Comida real cocinada para perros | LOBO",
    description:
      "Qué es la comida real cocinada para perros, cómo se diferencia de las croquetas y cómo empezar con mix feeding sin cambiar todo de golpe.",
    eyebrow: "Guía LOBO",
    h1: "Comida real cocinada para perros",
    intro:
      "Comida real no significa discurso bonito. Significa ingredientes reconocibles, cocción, porciones claras y una forma de servir que puedas sostener en tu rutina.",
    sections: [
      {
        title: "Qué es la comida real cocinada para perros",
        body: [
          "Es comida húmeda preparada con ingredientes que reconoces, cocida y porcionada para servir sin tener que cocinar diario.",
          "La parte importante es el criterio: gramajes, transición, observación y ajustes. No basta con cambiar una etiqueta por otra.",
        ],
      },
      {
        title: "Por qué no es lo mismo que croqueta premium",
        body: [
          "La croqueta resuelve logística: dura, se mide fácil y cabe en cualquier rutina. LOBO juega otro papel: mejora el plato con humedad, olor, textura y comida real.",
          "No venimos a decir que todo lo demás no sirve. Venimos a darte una forma más clara de sumar comida al plato.",
        ],
      },
      {
        title: "Por qué comida real no siempre significa comida balanceada",
        body: [
          "Pollo con arroz puede verse sano, pero sin proporciones ni seguimiento puede quedarse corto o pasarse. La intención no reemplaza el cálculo.",
          "Por eso LOBO habla de porciones, mix feeding y ajustes. Menos marketing, más método.",
        ],
      },
      {
        title: "Cómo empezar sin cambiar todo",
        body: [
          "Empieza con 20%, 30% o 40% de LOBO en el plato y mantén una parte de su alimento actual mientras observas.",
          "Ajusta con calma: apetito, popó, peso, saciedad y energía real dicen más que cualquier promesa inflada.",
        ],
      },
      {
        title: "Qué es LOBO",
        body: [
          "LOBO es comida real cocinada para perros en Guadalajara: porciones húmedas, listas para servir o mezclar con croquetas.",
          "Está pensada para dueños que quieren mejorar el plato sin convertir la alimentación en una segunda jornada laboral.",
        ],
      },
    ],
    cta: {
      label: "Usa la calculadora LOBO",
      href: "/calculadora",
      secondaryLabel: "Empieza con Premium Box",
      secondaryHref: "/#planes",
    },
    faqs: sharedFaqs,
    related: [
      { label: "Mix feeding para perros", href: "/mix-feeding-para-perros" },
      { label: "Calculadora LOBO", href: "/calculadora" },
      {
        label: "Comida para perros en Guadalajara",
        href: "/comida-para-perros-guadalajara",
      },
    ],
  },
  "/mix-feeding-para-perros": {
    slug: "/mix-feeding-para-perros",
    title: "Mix feeding para perros | Cómo mezclar LOBO con croquetas",
    description:
      "Aprende qué es el mix feeding para perros, cómo mezclar comida real con croquetas y cómo calcular una transición gradual.",
    eyebrow: "Guía práctica",
    h1: "Mix feeding para perros",
    intro:
      "Mix feeding no es revolver comida al azar. Es mejorar el plato con comida real, mantener una base conocida y ajustar con datos simples.",
    sections: [
      {
        title: "Qué es mix feeding",
        body: [
          "Es combinar LOBO con croquetas u otro alimento actual en porcentajes claros: por ejemplo 20%, 30%, 40% o 50% de comida real por gramaje.",
          "Funciona porque no obliga a cambiar todo de golpe. Empiezas con una mejora concreta y medible.",
        ],
      },
      {
        title: "Por qué mezclar no es el problema",
        body: [
          "El problema no es mezclar. El problema es hacerlo sin saber cuánto poner, sin transición y sin observar cómo responde el perro.",
          "Con una mezcla gradual puedes cuidar rutina, presupuesto y tolerancia.",
        ],
      },
      {
        title: "El problema es hacerlo sin criterio",
        body: [
          "Cambiar comida por emoción suele terminar en porciones confusas. Un perro puede necesitar menos o más de lo que parece.",
          "Por eso LOBO calcula con peso, etapa, silueta, movimiento real y objetivo antes de recomendar una cantidad.",
        ],
      },
      {
        title: "Porcentajes comunes: 20%, 30%, 40%, 50%",
        body: [
          "20% sirve para probar y ver tolerancia. 30% o 40% suele ser un inicio realista para mejorar el plato sin cambiar toda la rutina.",
          "50% ya vuelve a LOBO una parte importante del día. Conviene calcularlo bien, sobre todo en perros chicos, cachorros, seniors o perros con necesidades especiales.",
        ],
      },
      {
        title: "Cómo observar apetito, popó, peso y saciedad",
        body: [
          "Durante la transición, observa si come con ganas, cómo se ve la popó, si mantiene peso y si queda satisfecho.",
          "Si hay enfermedad, alergias, bajo peso, sobrepeso importante o dieta especial, consulta a tu veterinario o nutricionista veterinario antes de ajustar.",
        ],
      },
    ],
    cta: {
      label: "Te calculamos un mix realista",
      href: "/calculadora",
      secondaryLabel: "Mándanos su peso",
      secondaryHref: whatsappUrl,
    },
    faqs: sharedFaqs,
    related: [
      {
        label: "Comida real cocinada para perros",
        href: "/comida-real-cocinada-para-perros",
      },
      {
        label: "Cuánta comida debe comer mi perro",
        href: "/articulos/cuanta-comida-debe-comer-mi-perro",
      },
      { label: "Calculadora LOBO", href: "/calculadora" },
    ],
  },
  "/comida-para-perros-guadalajara": {
    slug: "/comida-para-perros-guadalajara",
    title: "Comida para perros en Guadalajara | LOBO",
    description:
      "LOBO entrega comida real cocinada para perros en Guadalajara y Zapopan. Porciones listas para servir, planes mensuales y mix feeding.",
    eyebrow: "Guadalajara y Zapopan",
    h1: "Comida para perros en Guadalajara",
    intro:
      "LOBO cocina comida real para perros en Guadalajara y Zapopan: porciones húmedas, listas para servir, pedir una vez o recibir cada mes.",
    sections: [
      {
        title: "LOBO: comida real cocinada en GDL/Zapopan",
        body: [
          "LOBO existe para quienes quieren mejorar el plato de su perro sin caer en promesas enormes ni dietas improvisadas.",
          "La idea es simple: comida real, porciones claras, mix feeding cuando tenga sentido y seguimiento por WhatsApp.",
        ],
      },
      {
        title: "Entregas",
        body: [
          "Trabajamos entregas en Guadalajara y Zapopan. La cobertura puede variar por zona y horario, así que lo más práctico es mandarnos tu ubicación.",
          "Te decimos si llegamos, cuándo conviene entregar y qué formato te conviene según el consumo estimado.",
        ],
      },
      {
        title: "Premium Box",
        body: [
          "Premium Box es la forma más simple de probar LOBO: 10 porciones para empezar sin comprar todo el mes.",
          "Sirve para ver si le gusta, observar tolerancia y decidir si tiene sentido pasar a plan mensual.",
        ],
      },
      {
        title: "Plan mensual",
        body: [
          "El plan mensual ayuda cuando LOBO ya forma parte de la rutina. Puedes pedir compra única o entrega programada, según el plan disponible.",
          "No todos necesitan 100% LOBO para empezar. Muchas familias usan LOBO como una parte del plato.",
        ],
      },
      {
        title: "Cómo cotizar",
        body: [
          "Mándanos peso, edad aproximada, actividad y qué come hoy. Con eso te proponemos una entrada realista.",
          "También puedes usar la calculadora para llegar con una estimación inicial antes de escribirnos.",
        ],
      },
    ],
    cta: {
      label: "Mándanos su peso y te damos su plan",
      href: whatsappUrl,
      secondaryLabel: "Usa la calculadora LOBO",
      secondaryHref: "/calculadora",
    },
    faqs: sharedFaqs,
    related: [
      { label: "Premium Box", href: "/#planes" },
      { label: "Mix feeding", href: "/mix-feeding-para-perros" },
      { label: "Calculadora LOBO", href: "/calculadora" },
    ],
  },
  "/calculadora-comida-para-perros": {
    slug: "/calculadora-comida-para-perros",
    title: "Calculadora de comida para perros | LOBO",
    description:
      "Calcula una estimación inicial de comida para tu perro según peso, etapa, movimiento real y porcentaje de mix feeding.",
    eyebrow: "Calculadora",
    h1: "Calculadora de comida para perros",
    intro:
      "La calculadora LOBO estima un punto de partida con peso, etapa, silueta, movimiento real y porcentaje de mix feeding.",
    sections: [
      {
        title: "Qué toma en cuenta",
        body: [
          "No calcula solo por peso. También considera etapa, si está esterilizado o castrado, silueta, movimiento real y objetivo de alimentación.",
          "Después traduce esa estimación a gramos de LOBO, croqueta y porciones mensuales.",
        ],
      },
      {
        title: "Para qué sirve",
        body: [
          "Sirve para empezar con criterio, no para prometer exactitud. Cada perro responde distinto y puede necesitar ajustes.",
          "La idea es que llegues a una primera porción razonable y sepas qué observar después.",
        ],
      },
      {
        title: "Cómo usar el resultado",
        body: [
          "Usa el cálculo como punto de partida. Observa apetito, popó, peso, saciedad y tolerancia durante la transición.",
          "Si hay una condición médica o dieta especial, consulta antes con tu veterinario o nutricionista veterinario.",
        ],
      },
    ],
    cta: {
      label: "Usar calculadora LOBO",
      href: "/calculadora",
      secondaryLabel: "Leer sobre mix feeding",
      secondaryHref: "/mix-feeding-para-perros",
    },
    faqs: sharedFaqs,
    related: [
      { label: "Mix feeding", href: "/mix-feeding-para-perros" },
      {
        label: "Comida real cocinada",
        href: "/comida-real-cocinada-para-perros",
      },
      { label: "WhatsApp LOBO", href: whatsappUrl },
    ],
  },
};

export type ArticleContent = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  intro: string;
  sections: SeoPageContent["sections"];
  faqs?: Faq[];
};

export const articles: ArticleContent[] = [
  {
    slug: "/articulos/comida-humeda-vs-croquetas",
    title: "Comida húmeda vs croquetas | LOBO",
    description:
      "Diferencias prácticas entre comida húmeda y croquetas para perros: humedad, textura, rutina, mix feeding y cómo empezar sin exagerar.",
    eyebrow: "Artículo LOBO",
    h1: "Comida húmeda vs croquetas",
    intro:
      "No todo tiene que ser una guerra entre formatos. La pregunta útil es qué mejora el plato de tu perro y qué puedes sostener.",
    sections: [
      {
        title: "La croqueta resuelve logística",
        body: [
          "Dura, se mide fácil y cabe en cualquier rutina. Para muchas familias eso importa.",
          "El punto no es negar su utilidad, sino aceptar que no siempre es el plato más apetitoso o interesante.",
        ],
      },
      {
        title: "La comida húmeda suma comida real",
        body: [
          "Aporta humedad, olor, textura y una experiencia más parecida a comida. Eso puede ayudar a perros que comen con poco entusiasmo.",
          "También exige más criterio: refrigeración, porciones y seguimiento.",
        ],
      },
      {
        title: "Mix feeding como punto medio",
        body: [
          "Mezclar LOBO con croquetas puede ser una entrada práctica. Mejoras el plato sin cambiar toda la rutina.",
          "Empieza con un porcentaje claro y calcula antes de servir al tanteo.",
        ],
      },
    ],
    faqs: sharedFaqs,
  },
  {
    slug: "/articulos/comida-casera-para-perros",
    title: "Comida casera para perros | Qué cuidar antes de improvisar",
    description:
      "La comida casera para perros puede empezar con buena intención, pero necesita porciones, criterio y seguimiento para no improvisar.",
    eyebrow: "Artículo LOBO",
    h1: "Comida casera para perros",
    intro:
      "Cocinar para tu perro suena lógico. El detalle está en no confundir comida reconocible con una dieta bien calculada.",
    sections: [
      {
        title: "Buena intención no es fórmula",
        body: [
          "Pollo, arroz y verduras pueden verse correctos, pero las cantidades importan. También importan etapa, peso, actividad y tolerancia.",
          "Si vas a cocinar en casa, hazlo con guía profesional cuando el perro tenga necesidades especiales.",
        ],
      },
      {
        title: "Dónde se complica",
        body: [
          "La rutina se vuelve difícil cuando hay que comprar, cocinar, pesar, guardar y ajustar cada semana.",
          "Ahí LOBO entra como una forma práctica de sumar comida real sin cocinar diario.",
        ],
      },
      {
        title: "Cómo empezar con más orden",
        body: [
          "Calcula una porción inicial, prueba una transición gradual y observa la respuesta.",
          "No prometas milagros. Mide, ajusta y mantén lo que funcione.",
        ],
      },
    ],
    faqs: sharedFaqs,
  },
  {
    slug: "/articulos/cuanta-comida-debe-comer-mi-perro",
    title: "Cuánta comida debe comer mi perro | LOBO",
    description:
      "Cómo estimar cuánta comida debe comer un perro considerando peso, etapa, silueta, movimiento real y mix feeding.",
    eyebrow: "Artículo LOBO",
    h1: "Cuánta comida debe comer mi perro",
    intro:
      "La respuesta corta es: depende. La respuesta útil es calcular un punto de partida y observar cómo responde.",
    sections: [
      {
        title: "Peso no es todo",
        body: [
          "Dos perros de 10 kg pueden necesitar cantidades distintas si uno es cachorro, senior, más activo o tiene otra silueta.",
          "Por eso una tabla genérica rara vez cuenta toda la historia.",
        ],
      },
      {
        title: "Qué variables mirar",
        body: [
          "Peso, etapa, esterilización, condición corporal, movimiento real y objetivo de alimentación cambian la porción.",
          "También cambia si LOBO será todo el plato o parte de un mix con croquetas.",
        ],
      },
      {
        title: "Después del cálculo",
        body: [
          "El número inicial no es sentencia. Observa apetito, popó, peso y saciedad durante la transición.",
          "Ajusta poco a poco y busca apoyo veterinario si hay condiciones médicas o necesidades especiales.",
        ],
      },
    ],
    faqs: sharedFaqs,
  },
];

export function pageMetadata(content: {
  title: string;
  description: string;
  slug: string;
}): Metadata {
  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical: content.slug,
    },
    openGraph: {
      title: content.title,
      description: content.description,
      url: content.slug,
    },
    twitter: {
      title: content.title,
      description: content.description,
    },
  };
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
