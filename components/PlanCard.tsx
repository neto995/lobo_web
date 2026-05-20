"use client";

type PlanCardProps = {
  title: string;
  price: string;
  portions: string;
  features: string[];
  popular?: boolean;
};

export default function PlanCard({
  title,
  price,
  portions,
  features,
  popular
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
          Popular
        </div>
      )}

      <p className="uppercase text-sm text-gray-400">
        {title}
      </p>

      <h3 className="text-5xl font-bold mt-4">
        {price}
      </h3>

      <p className="mt-2 text-gray-400">
        {portions}
      </p>

      <ul className="mt-8 space-y-4 text-gray-300">

        {features.map((feature) => (
          <li key={feature}>
            • {feature}
          </li>
        ))}

      </ul>

<button
  onClick={async () => {

  const response = await fetch("/api/checkout", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      title,
      price,
      portions
    }),
  });

  const data = await response.json();

window.location.href = data.init_point;

}}
  className="mt-10 w-full bg-white text-black py-4 rounded-full font-semibold hover:bg-gray-200 transition"
>
  Comprar
</button>
    </div>
  );
}