import { profileInput } from "@/lib/expediente/model";
import { dogId, jsonInput, loadDog, updatedDog, withExpediente } from "@/lib/expediente/server";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: Context) {
  return withExpediente(request, async (client) => ({ dog: await loadDog(client, dogId((await context.params).id)) }));
}

export async function PATCH(request: Request, context: Context) {
  return withExpediente(request, async (client) => {
    const id = dogId((await context.params).id);
    const input = await jsonInput(request);
    const existing = await loadDog(client, id);
    const { profile } = profileInput(input, existing);
    return { dog: await updatedDog(client, id, profile) };
  });
}
