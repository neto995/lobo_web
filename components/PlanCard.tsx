"use client";

type PlanCardProps = {
  title: string;
  price: string;
  duration: string;
  portions: string;
  promo: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
  checkoutUrl?: string;
};

export default function PlanCard({
  title,
  price,
  duration,
  portions,
  promo,
  features,
  popular,
  buttonText,
  checkoutUrl
}: PlanCardProps) {
  return (
    <div
      className={`
        rounded-3xl p-10 relative
        ${popular
          ? "border border-yellow-500 bg-yellow-500/10"
          : "border border-white/10 bg-white/5 backdrop-blur"}
      `}
    >
      {popular && (
        <div className="absolute top-4 right-4 text-xs uppercase bg-yellow-500 text-black px-3 py-1 rounded-full font-bold">
          Más elegido
        </div>
      )}

      <p className="uppercase text-sm text-gray-400">
        {title}
      </p>

      <h3 className="text-5xl font-bold mt-4">
        {price}
      </h3>

      <div className="mt-5 space-y-2">
        <p className="text-xl font-semibold text-white">
          {duration}
        </p>

        <p className="text-gray-400">
          {portions}
        </p>

        <p className="text-yellow-300 font-semibold">
          {promo}
        </p>
      </div>

      <ul className="mt-8 space-y-4 text-gray-300">
        {features.map((feature) => (
          <li key={feature}>
            • {feature}
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
              title,
              price,
              duration,
              portions,
              promo
            }),
          });

          const data = await response.json();

          window.location.href = data.init_point;
        }}
        className="mt-10 w-full bg-white text-black py-4 rounded-full font-semibold hover:bg-gray-200 transition"
      >
        {buttonText}
      </button>
    </div>
  );
}