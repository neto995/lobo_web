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
      "Sí. Los planes Hot Sale permiten pagar hasta 3 o 6 meses sin intereses según el plan y las opciones disponibles en Mercado Pago al momento del checkout."
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
  { bank: "Afirme", discount: "15% OFF" },
  { bank: "AMEX", discount: "15% OFF" },
  { bank: "Inbursa", discount: "15% OFF" },
  { bank: "BBVA", discount: "10% OFF" },
  { bank: "HSBC", discount: "10% OFF" },
  { bank: "Openbank", discount: "10% OFF" },
  { bank: "Banamex", discount: "10% OFF" },
  { bank: "Tarjeta Crédito Mercado Pago", discount: "10% OFF" },
  { bank: "Meses Sin Tarjeta", discount: "10% OFF" }
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

        <div className="mt-16 border border-yellow-500/40 rounded-3xl p-8 bg-yellow-500/10">
          <h3 className="text-2xl font-bold uppercase">
            Bancos participantes Hot Sale
          </h3>

          <p className="mt-4 text-gray-300">
            El descuento se aplica en Mercado Pago en compras mayores a $2,000,
            usando tarjetas participantes.
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-left">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-6 py-4 text-sm uppercase tracking-[0.2em] text-gray-400">
                    Banco
                  </th>
                  <th className="px-6 py-4 text-sm uppercase tracking-[0.2em] text-gray-400">
                    Descuento
                  </th>
                </tr>
              </thead>

              <tbody>
                {bankPromos.map((promo) => (
                  <tr
                    key={promo.bank}
                    className="border-t border-white/10"
                  >
                    <td className="px-6 py-4 text-gray-200">
                      {promo.bank}
                    </td>
                    <td className="px-6 py-4 font-bold text-yellow-300">
                      {promo.discount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            Sujeto a términos, tarjetas participantes y validación directa de Mercado Pago.
          </p>
        </div>

        <div className="mt-10 space-y-6">
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