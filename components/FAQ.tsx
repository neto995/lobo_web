const faqs = [
  {
    question: "¿Cómo funciona el descuento Hot Sale 2026?",
    answer:
      "El descuento se aplica directamente en Mercado Pago al momento de pagar, siempre que uses una tarjeta participante y la compra sea mayor a $2,000."
  },
  {
    question: "¿El descuento lo aplica LOBO?",
    answer:
      "No. El descuento lo aplica Mercado Pago según la tarjeta, banco participante y condiciones de la promoción. LOBO mantiene el precio Hot Sale y Mercado Pago aplica el beneficio si tu compra califica."
  },
  {
    question: "¿Cuál es la compra mínima para aplicar el descuento Hot Sale 2026?",
    answer:
      "La compra mínima es de $2,000. Por eso los planes Hot Sale están pensados para que puedas aprovechar MSI y posible descuento bancario."
  },
  {
    question: "¿Puedo pagar a meses sin intereses?",
    answer:
      "Sí. Los meses sin intereses dependen del banco, tarjeta y opciones que Mercado Pago muestre al momento del checkout. LOBO no controla directamente qué MSI aparecen."
  },
  {
    question: "¿Qué pasa si mi banco no aparece?",
    answer:
      "Puedes pagar normalmente con Mercado Pago, pero puede que no aplique el descuento bancario. Antes de confirmar el pago, revisa si Mercado Pago muestra el descuento o los MSI disponibles."
  },
  {
    question: "¿El precio ya incluye el descuento?",
    answer:
      "No. El precio mostrado es el precio LOBO. Si tu tarjeta participa, Mercado Pago puede aplicar el descuento adicional antes de finalizar el pago."
  },
  {
    question: "¿Qué plan me conviene?",
    answer:
      "Si tu perro es chico o quieres hacer mix feeding, empieza con Hot Sale CH. Si tu perro es mediano, grande o quieres más porciones, elige Hot Sale M/G."
  }
];

const bankPromos = [
  { bank: "Afirme", discount: "15% OFF", msi: "Todos" },
  { bank: "AMEX", discount: "15% OFF", msi: "Todos" },
  { bank: "Inbursa", discount: "15% OFF", msi: "Todos" },
  { bank: "BBVA", discount: "10% OFF", msi: "1x y 3x" },
  { bank: "HSBC", discount: "10% OFF", msi: "1x y 3x" },
  { bank: "Openbank", discount: "10% OFF", msi: "1x" },
  { bank: "Banamex", discount: "10% OFF", msi: "1x" },
  { bank: "Tarjeta Crédito MP", discount: "10% OFF", msi: "3x · 6x · 9x" },
  { bank: "Meses Sin Tarjeta", discount: "10% OFF", msi: "3x · 6x · 9x" }
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

        <p className="mt-6 text-gray-400 text-lg">
          Descuentos, MSI y condiciones de Mercado Pago.
        </p>

        {/* TABLA DE BANCOS */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="grid grid-cols-3 bg-white/10 px-4 py-3 text-sm font-bold uppercase text-gray-300">
            <span>Banco</span>
            <span>Descuento</span>
            <span>MSI</span>
          </div>

          {bankPromos.map((promo) => (
            <div
              key={promo.bank}
              className="grid grid-cols-3 border-t border-white/10 px-4 py-3 text-sm text-gray-300"
            >
              <span>{promo.bank}</span>
              <span className="text-yellow-400 font-semibold">
                {promo.discount}
              </span>
              <span>{promo.msi}</span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Promoción sujeta a términos, bancos participantes y validación final de Mercado Pago.
        </p>

        {/* FAQS */}
        <div className="mt-16 space-y-6">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="border border-white/10 rounded-3xl p-8 bg-white/5"
            >
              <h3 className="text-2xl font-bold">
                {faq.question}
              </h3>

              <p className="mt-4 text-gray-400">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}