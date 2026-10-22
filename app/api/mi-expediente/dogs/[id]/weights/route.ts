import { InputError, isRecord, weightValue } from "@/lib/expediente/model";
import { dogId, jsonInput, loadDog, withExpediente } from "@/lib/expediente/server";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  return withExpediente(request, async (client) => {
    const id = dogId((await context.params).id);
    const input = await jsonInput(request);
    if (!isRecord(input) || Object.keys(input).length !== 1 || !("value" in input)) throw new InputError("Revisa los datos del peso.");
    const value = weightValue(input.value);
    await loadDog(client, id);
    const { error } = await client.from("weight_entries").insert({ dog_id: id, weight_kg: value, recorded_at: new Date().toISOString() }).retry(false).abortSignal(AbortSignal.timeout(10_000));
    if (error) throw new Error("Unconfirmed weight");
    return { dog: await loadDog(client, id) };
  });
}
