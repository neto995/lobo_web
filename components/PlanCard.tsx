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
  const isLight = popular || highlight;

  return (
    <div
      className={`
        relative flex min-h-full flex-col rounded-lg p-5 md:p-7
        ${isLight
          ? "border border-[#F4EFE3]/35 bg-[#F4EFE3] text-black"
          : "border border-white/10 bg-white/[0.045] text-[#F4EFE3]"}
      `}
    >
      {popular && (
        <div className="absolute right-4 top-4 rounded-full bg-black px-3 py-1 text-[10px] font-black uppercase tracking-wide text-[#F4EFE3]">
          Más elegido
        </div>
      )}

      <p
        className={`text-xs font-bold uppercase tracking-[0.24em] ${
          isLight ? "text-black/55" : "text-[#C9BDAA]"
        }`}
      >
        {title}
      </p>

      <h3 className="mt-4 text-5xl font-black uppercase leading-none">
        {price}
      </h3>

      <div className="mt-5 space-y-2">
        <p className="text-xl font-black uppercase leading-tight">
          {duration}
        </p>

        <p className={isLight ? "text-black/62" : "text-[#C9BDAA]"}>
          {portions}
        </p>

        <p className={isLight ? "font-bold text-black" : "font-bold text-white"}>
          {promo}
        </p>
      </div>

      <ul
        className={`mt-8 grid gap-3 text-sm leading-6 ${
          isLight ? "text-black/64" : "text-[#DED4C4]"
        }`}
      >
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
        className={`mt-auto w-full rounded-full px-6 py-4 text-xs font-black uppercase tracking-wide transition ${
          isLight
            ? "bg-black text-[#F4EFE3] hover:bg-[#A93622]"
            : "bg-[#F4EFE3] text-black hover:bg-white"
        }`}
      >
        {buttonText}
      </button>
    </div>
  );
}
