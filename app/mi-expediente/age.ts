import type { Dog, DogFormValues } from "./types";

export function todayInMexicoCity(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "America/Mexico_City", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const part = (type: string) => parts.find((entry) => entry.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function validCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function elapsedMonths(start: string, end: string): number | null {
  if (!validCalendarDate(start) || !validCalendarDate(end) || start > end) return null;
  const [startYear, startMonth, startDay] = start.split("-").map(Number);
  const [endYear, endMonth, endDay] = end.split("-").map(Number);
  const monthEnd = new Date(0);
  monthEnd.setUTCFullYear(endYear, endMonth, 0);
  const anniversary = Math.min(startDay, monthEnd.getUTCDate());
  return (endYear - startYear) * 12 + endMonth - startMonth - (endDay < anniversary ? 1 : 0);
}

export function ageLabel(dog: Pick<Dog, "birthDate" | "ageMonthsEstimate" | "ageEstimatedAt">, today = todayInMexicoCity()): string {
  const elapsed = dog.birthDate ? elapsedMonths(dog.birthDate, today) : dog.ageEstimatedAt ? elapsedMonths(dog.ageEstimatedAt, today) : null;
  if (elapsed === null) return "Edad desconocida";
  const months = dog.birthDate ? elapsed : dog.ageMonthsEstimate === null ? null : dog.ageMonthsEstimate + elapsed;
  if (months === null) return "Edad desconocida";
  const years = Math.floor(months / 12);
  const remainder = months % 12;
  const parts = [years ? `${years} ${years === 1 ? "año" : "años"}` : "", remainder || !years ? `${remainder} ${remainder === 1 ? "mes" : "meses"}` : ""].filter(Boolean);
  return `${parts.join(" y ")}${dog.birthDate ? "" : " (aprox.)"}`;
}

export function dogToForm(dog: Dog): DogFormValues {
  return {
    name: dog.name, breed: dog.breed ?? "", sex: dog.sex,
    ageMode: dog.birthDate ? "birth_date" : dog.ageMonthsEstimate !== null ? "estimate" : "unknown",
    birthDate: dog.birthDate ?? "",
    ageYears: dog.ageMonthsEstimate === null ? "" : String(Math.floor(dog.ageMonthsEstimate / 12)),
    ageMonths: dog.ageMonthsEstimate === null ? "" : String(dog.ageMonthsEstimate % 12),
    ageEstimatedAt: dog.ageEstimatedAt ?? "",
    initialWeight: "", targetWeight: dog.targetWeight === null ? "" : String(dog.targetWeight),
  };
}
