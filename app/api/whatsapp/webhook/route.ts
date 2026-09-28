const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

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

    console.log(
      "WhatsApp webhook received:",
      JSON.stringify(body, null, 2)
    );
// TEMPORAL //
console.log(
  "OPENAI_API_KEY loaded:",
  Boolean(process.env.OPENAI_API_KEY),
  "length:",
  process.env.OPENAI_API_KEY?.length
);

    // Por ahora usamos un mensaje fijo para probar Vercel → OpenAI.
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
          input:
            "Responde únicamente: LOBO AI está conectado correctamente.",
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

    console.log(
      "LOBO AI response:",
      JSON.stringify(data, null, 2)
    );

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