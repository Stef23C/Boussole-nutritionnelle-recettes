import { invoke } from "@tauri-apps/api/core";
import type { DailySummary, Meal, MealType } from "@/types";

export interface AddMealItemInput {
  date: string; // 'YYYY-MM-DD'
  mealType: MealType;
  foodId: number;
  quantityG: number;
}

/**
 * Aggiunge un alimento a un pasto. Se per la data/mealType richiesti non
 * esiste ancora un `meal`, il comando Rust lo crea implicitamente (evita
 * un giro di andata/ritorno extra "crea pasto" + "aggiungi item" dal frontend).
 */
export async function addMealItem(input: AddMealItemInput): Promise<Meal> {
  return invoke<Meal>("add_meal_item", input);
}

/** Rimuove un singolo alimento da un pasto (es. dopo un errore di inserimento). */
export async function removeMealItem(mealItemId: number): Promise<void> {
  return invoke<void>("remove_meal_item", { mealItemId });
}

/** Tutti i pasti registrati per una data, con i relativi item e alimenti già risolti. */
export async function getMealsByDate(date: string): Promise<Meal[]> {
  return invoke<Meal[]>("get_meals_by_date", { date });
}

/**
 * Riepilogo giornaliero pre-aggregato: totale nutrienti consumati vs
 * obiettivi del giorno. Calcolato lato Rust (somma su meal_items + join
 * su foods/food_nutrients) per non dover ricalcolare somme in JS ad ogni render.
 */
export async function getDailySummary(date: string): Promise<DailySummary> {
  return invoke<DailySummary>("get_daily_summary", { date });
}
