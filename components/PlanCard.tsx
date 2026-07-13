"use client";

import styles from "./PlanCard.module.css";

type PlanCardProps = {
  title: string;
  price: string;
  duration: string;
  portions: string;
  promo: string;
  features: string[];
  popular?: boolean;
  highlight?: boolean;
  variant?: "default" | "subscription";
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
  variant = "default",
  buttonText,
  checkoutUrl,
  planId
}: PlanCardProps) {
  const isSubscription = variant === "subscription";
  const portionCount = portions.split(" ")[0];

  return (
    <article
      className={
        isSubscription
          ? `${styles.subscriptionCard} ${
              popular ? styles.popular : styles.medium
            }`
          : `
              frosted-glass relative flex min-h-full flex-col rounded-lg p-5 text-carbon md:p-7
              ${popular
                ? "frosted-glass--accent"
                : highlight
                  ? "frosted-glass--ink"
                  : ""}
            `
      }
    >
      {isSubscription ? (
        <>
          <header className={styles.cardHeader}>
            <div className="min-w-0">
              <p className={styles.kicker}>Suscripción mensual</p>
              <h3 className={styles.planTitle}>{title}</h3>
            </div>

            <span className={styles.badge}>
              {popular ? "Más elegido" : portions}
            </span>
          </header>

          <div className={styles.priceBlock}>
            <div className="min-w-0">
              <p
                className={styles.price}
                aria-label={`${price} ${duration.toLowerCase()}`}
              >
                {price}
              </p>
              <p className={styles.duration}>{duration}</p>
            </div>

            <div className={styles.portionSeal} aria-label={portions}>
              <span className={styles.portionNumber}>{portionCount}</span>
              <span className={styles.portionLabel}>Porciones</span>
            </div>
          </div>

          <p className={styles.delivery}>
            <span aria-hidden="true" className={styles.deliveryDot} />
            {promo}
          </p>

          <div className={styles.benefitsPanel}>
            <p className={styles.benefitsTitle}>Tu suscripción incluye</p>
            <ul className={styles.benefitsList}>
              {features.map((feature, index) => (
                <li key={feature} className={styles.benefitItem}>
                  <span aria-hidden="true" className={styles.benefitIndex}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.benefitText}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <>
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
        </>
      )}

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
        aria-label={
          isSubscription
            ? `${buttonText} ${title}, ${portions}, ${price} ${duration.toLowerCase()}`
            : undefined
        }
        className={
          isSubscription
            ? styles.subscriptionCta
            : "glass-btn glass-btn--dark mt-auto w-full rounded-full px-6 py-4 text-xs font-black uppercase tracking-wide text-hueso hover:text-white"
        }
      >
        <span>{buttonText}</span>
        {isSubscription && (
          <span aria-hidden="true" className={styles.ctaArrow}>
            <svg viewBox="0 0 20 20" fill="none">
              <path d="M4 10h11M11 6l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </button>
    </article>
  );
}
