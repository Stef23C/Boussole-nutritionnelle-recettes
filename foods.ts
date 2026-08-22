import { invoke } from "@tauri-apps/api/core";
import type { Food } from "@/types";

/**
 * Cerca alimenti tramite il comando Rust `search_foods`, che internamente
 * interroga prima la cache SQLite locale, poi USDA FoodData Central, poi
 * OpenFoodFacts come fallback (vedi documento di architettura, sezione 4).
 * Nessuna chiamata di rete diretta da qui: il frontend non parla mai
 * direttamente con le API esterne, solo con il backend Rust.
 */
export async function searchFoods(query: string): Promise<Food[]> {
  const trimmed = query.trim();
  if (trimmed.length === 0) return [];
  return invoke<Food[]>("search_foods", { query: trimmed });
}

/** Recupera un singolo alimento per id (usato per mostrare il dettaglio di un meal_item già salvato). */
export async function getFoodById(foodId: number): Promise<Food> {
  return invoke<Food>("get_food_by_id", { foodId });
}
