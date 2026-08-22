import { invoke } from "@tauri-apps/api/core";
import type { DailyGoals } from "@/types";

/** Obiettivi correnti dell'utente (l'ultimo record valido, vedi tabella `daily_goals` versionata per data). */
export async function getGoals(): Promise<DailyGoals> {
  return invoke<DailyGoals>("get_goals");
}

/**
 * Aggiorna gli obiettivi. Lato Rust questo NON sovrascrive il record
 * esistente ma inserisce una nuova riga `daily_goals` con `valid_from`
 * = oggi, cosi lo storico/i grafici restano coerenti con gli obiettivi
 * che erano in vigore in ciascun giorno passato.
 */
export async function updateGoals(goals: DailyGoals): Promise<DailyGoals> {
  return invoke<DailyGoals>("update_goals", { goals });
}
