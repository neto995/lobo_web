import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  const body = await request.json();

  const preference = new Preference(client);

  const response = await preference.create({
    body: {
      items: [
        {
          id: body.title.toLowerCase().replaceAll(" ", "-"),
          title: body.title,
          quantity: 1,
          currency_id: "MXN",
          unit_price: Number(body.price.replace("$", "")),
        },
      ],    
      back_urls: {
        success: "https://eatlikeawolf.vercel.app/success",
        failure: "https://eatlikeawolf.vercel.app/failure",
        pending: "https://eatlikeawolf.vercel.app/pending",
},
    },
  });

  return Response.json({
    id: response.id,
    init_point: response.init_point,
  });
}