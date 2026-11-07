import { isRecord, normalizeDog, profileInput } from "@/lib/expediente/model";
import { jsonInput, listDogs, withExpediente } from "@/lib/expediente/server";

export async function GET(request: Request) {
  return withExpediente(request, async (client) => ({ dogs: await listDogs(client) }));
}

export async function POST(request: Request) {
  return withExpediente(request, async (client) => {
    const { profile, initialWeight } = profileInput(await jsonInput(request));
    const { data, error } = await client.rpc("create_dog_with_initial_weight", {
      p_name: profile.name, p_breed: profile.breed, p_sex: profile.sex,
      p_target_weight_kg: profile.target_weight_kg, p_birth_date: profile.birth_date,
      p_age_months_estimate: profile.age_months_estimate, p_age_estimated_at: profile.age_estimated_at,
      p_initial_weight_kg: initialWeight,
    }).retry(false).abortSignal(AbortSignal.timeout(10_000));
    if (error || !isRecord(data) || !isRecord(data.dog) || !isRecord(data.weight)) throw new Error("Unconfirmed create");
    return { dog: normalizeDog(data.dog, [data.weight]) };
  });
}
