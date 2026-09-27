const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

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