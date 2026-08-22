import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Helper standard shadcn/ui: unisce classi condizionali e risolve i conflitti Tailwind. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Arrotonda un numero a N decimali per la UI (evita 12.399999999 nei totali). */
export function round(value: number, decimals = 0): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/** Data odierna in formato 'YYYY-MM-DD', coerente col formato usato nel DB SQLite. */
export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
