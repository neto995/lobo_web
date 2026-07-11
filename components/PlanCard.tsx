"use client";

type PlanCardProps = {
  title: string;
  price: string;
  duration: string;
  portions: string;
  promo: string;
  features: string[];
  popular?: boolean;
  highlight?: boolean;
  buttonText: string;
  checkoutUrl?: string;
  planId?: string;
};

export default function PlanCard({
  title,
  price,
  duration,
  portions,
  promo,
  features,
  popular,
  highlight,
  buttonText,
  checkoutUrl,
  planId
}: PlanCardProps) {
  return (
    <div
      className={`
        frosted-glass relative flex min-h-full flex-col rounded-lg p-5 text-carbon md:p-7
        ${popular
          ? "frosted-glass--accent"
          : highlight
          ? "frosted-glass--ink"
          : ""}
      `}
    >
      {popular && (
        <div className="absolute right-4 top-4 rounded-full bg-rojo px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white">
          Más elegido
        </div>
      )}

      <p className="text-xs font-bold uppercase tracking-[0.24em] text-carbon/65">
        {title}
      </p>

      <h3 className="mt-4 text-5xl font-black uppercase leading-none">
        {price}
      </h3>

      <div className="mt-5 space-y-2">
        <p className="text-xl font-black uppercase leading-tight">
          {duration}
        </p>

        <p className="text-carbon/62">{portions}</p>

        <p className="font-bold text-carbon">{promo}</p>
      </div>

      <ul className="mt-8 grid gap-3 text-sm leading-6 text-carbon/64">
        {features.map((feature) => (
          <li key={feature} className="border-t border-current/10 pt-3">
            {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={async () => {
          if (checkoutUrl) {
            window.location.href = checkoutUrl;
            return;
          }

          const response = await fetch("/api/checkout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              planId
            }),
          });

          const data = await response.json();

          window.location.href = data.init_point;
        }}
        className="mt-auto w-full rounded-full bg-carbon px-6 py-4 text-xs font-black uppercase tracking-wide text-hueso transition hover:bg-rojo hover:text-white"
      >
        {buttonText}
      </button>
    </div>
  );
}
