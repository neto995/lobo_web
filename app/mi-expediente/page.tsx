import type { Metadata } from "next";
import MiExpediente from "./MiExpediente";

export const metadata: Metadata = {
  title: "Mi LOBO | Expediente vivo",
  description: "Peso, alimentación y progreso de tu manada en un solo expediente.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Mi LOBO | Expediente vivo",
    description: "Tu manada, sin improvisar. Perfiles, alimentación e historial de peso.",
    url: "/mi-expediente",
  },
  twitter: {
    card: "summary",
    title: "Mi LOBO | Expediente vivo",
    description: "Perfiles, alimentación e historial de peso de tu manada.",
  },
};

export default function Page() {
  return <MiExpediente />;
}
