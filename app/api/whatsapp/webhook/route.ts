const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("WhatsApp webhook verified");

    return new Response(challenge, {
      status: 200,
    });
  }

  return new Response("Forbidden", {
    status: 403,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const value = body?.entry?.[0]?.changes?.[0]?.value;
    const message = value?.messages?.[0];

    // Ignora eventos que no contienen un mensaje entrante.
    if (!message) {
      console.log("No inbound message found");

      return new Response("EVENT_RECEIVED", {
        status: 200,
      });
    }

    // Por ahora solo procesamos texto.
    if (message.type !== "text") {
      console.log("Ignoring non-text message:", message.type);

      return new Response("EVENT_RECEIVED", {
        status: 200,
      });
    }

    const from = message.from;
    const userText = message.text?.body;

    if (!userText) {
      console.log("Empty text message");

      return new Response("EVENT_RECEIVED", {
        status: 200,
      });
    }

    console.log("Incoming WhatsApp message:", {
      from,
      text: userText,
    });

    // 1. Mandamos el mensaje del cliente a GPT.
    const openAIResponse = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-5.6-sol",
          input: userText,
        }),
      }
    );

    if (!openAIResponse.ok) {
      const error = await openAIResponse.text();
      console.error("OpenAI API error:", error);

      return new Response("OpenAI API Error", {
        status: 500,
      });
    }

    const data = await openAIResponse.json();

    // 2. Extraemos el texto generado por GPT.
    const aiText = data?.output
      ?.flatMap((item: any) => item?.content ?? [])
      ?.find((content: any) => content?.type === "output_text")
      ?.text;

    if (!aiText) {
      console.error("No text returned by OpenAI");

      return new Response("OpenAI returned no text", {
        status: 500,
      });
    }

    console.log("LOBO AI response:", aiText);

    // 3. Mandamos la respuesta de GPT de regreso por WhatsApp.
    const whatsappResponse = await fetch(
      `https://graph.facebook.com/v24.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: from,
          type: "text",
          text: {
            preview_url: false,
            body: aiText,
          },
        }),
      }
    );

    if (!whatsappResponse.ok) {
      const error = await whatsappResponse.text();
      console.error("WhatsApp API error:", error);

      return new Response("WhatsApp API Error", {
        status: 500,
      });
    }

    const whatsappData = await whatsappResponse.json();

    console.log("WhatsApp message sent:", whatsappData);

    return new Response("EVENT_RECEIVED", {
      status: 200,
    });
  } catch (error) {
    console.error("WhatsApp webhook error:", error);

    return new Response("Bad Request", {
      status: 400,
    });
  }
}