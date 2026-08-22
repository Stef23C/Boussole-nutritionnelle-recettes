import { invoke } from "@tauri-apps/api/core";
import type { WeeklyPlan } from "@/types";

export interface GeneratePlanInput {
  weekStart: string; // lunedì della settimana target, 'YYYY-MM-DD'
  dietTypeId: number;
}

/**
 * Genera un nuovo piano settimanale con l'algoritmo deterministico
 * lato Rust (selezione greedy + penalità di ripetizione + backtracking
 * limitato — vedi documento di approfondimento, sezione 3). Può impiegare
 * qualche secondo: il chiamante deve gestire uno stato di loading (vedi
 * useTauriCommand più sotto).
 */
export async function generatePlan(input: GeneratePlanInput): Promise<WeeklyPlan> {
  return invoke<WeeklyPlan>("generate_plan", input);
}

/** Recupera un piano esistente per id. */
export async function getPlan(planId: number): Promise<WeeklyPlan> {
  return invoke<WeeklyPlan>("get_plan", { planId });
}

/**
 * Aggiorna un piano esistente (tipicamente: l'utente ha fatto lo swap
 * manuale di un singolo pasto segnato "da rivedere" dal generatore).
 * Invia il piano intero: più semplice da ragionare lato Rust che una
 * patch parziale, e il payload resta piccolo (una settimana di pasti).
 */
export async function updatePlan(plan: WeeklyPlan): Promise<WeeklyPlan> {
  return invoke<WeeklyPlan>("update_plan", { plan });
}
