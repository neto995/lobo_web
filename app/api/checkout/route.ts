import { MercadoPagoConfig, Preference } from "mercadopago";

const checkoutPlans = {
  "plan-chico-unico": {
    id: "plan-chico-unico",
    title: "Plan Chico",
    unitPrice: 630,
  },
  "plan-mediano-unico": {
    id: "plan-mediano-unico",
    title: "Plan Mediano",
    unitPrice: 945,
  },
} as const;

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const planId =
    typeof body === "object" &&
    body !== null &&
    "planId" in body &&
    typeof body.planId === "string"
      ? body.planId
      : "";

  const plan = checkoutPlans[planId as keyof typeof checkoutPlans];

  if (!plan) {
    return Response.json({ error: "Invalid checkout plan" }, { status: 400 });
  }

  const preference = new Preference(client);

  const response = await preference.create({
    body: {
      items: [
        {
          id: plan.id,
          title: plan.title,
          quantity: 1,
          currency_id: "MXN",
          unit_price: plan.unitPrice,
        },
      ],
      back_urls: {
        success: "https://eatlikeawolf.mx/success",
        failure: "https://eatlikeawolf.mx/failure",
        pending: "https://eatlikeawolf.mx/pending",
      },
    },
  });

  return Response.json({
    id: response.id,
    init_point: response.init_point,
  });
}
