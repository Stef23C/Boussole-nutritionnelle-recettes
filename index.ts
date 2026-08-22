// Tipi condivisi dal frontend, allineati allo schema SQLite / ai comandi Tauri
// definiti nel backend Rust (vedi documento di architettura).

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export const MEAL_TYPES: { value: MealType; label: string }[] = [
  { value: "breakfast", label: "Colazione" },
  { value: "lunch", label: "Pranzo" },
  { value: "dinner", label: "Cena" },
  { value: "snack", label: "Spuntino" },
];

export interface Food {
  id: number;
  source: "usda" | "openfoodfacts" | "custom";
  externalId?: string | null;
  barcode?: string | null;
  name: string;
  brand?: string | null;
  category?: string | null;
  servingSizeG?: number | null;
  caloriesKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  sugarG: number;
  sodiumMg: number;
}

export interface MealItem {
  id: number;
  mealId: number;
  foodId: number;
  food?: Food;
  quantityG: number;
}

export interface Meal {
  id: number;
  date: string; // 'YYYY-MM-DD'
  mealType: MealType;
  notes?: string | null;
  items: MealItem[];
}

/** Totale nutrienti di un pasto o di una giornata: stessa forma per poterli sommare. */
export interface NutrientTotals {
  caloriesKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  sodiumMg: number;
}

export const EMPTY_TOTALS: NutrientTotals = {
  caloriesKcal: 0,
  proteinG: 0,
  carbsG: 0,
  fatG: 0,
  fiberG: 0,
  sodiumMg: 0,
};

export interface DailyGoals {
  caloriesTarget?: number | null;
  proteinTargetG?: number | null;
  carbsTargetG?: number | null;
  fatTargetG?: number | null;
  fiberTargetG?: number | null;
  sodiumMaxMg?: number | null;
}

export interface DailySummary {
  date: string;
  consumed: NutrientTotals;
  goals: DailyGoals;
  meals: Meal[];
}

export interface DietType {
  id: number;
  code: string;
  label: string;
}

export interface WeeklyPlanMeal {
  id: number;
  dayOfWeek: number; // 0 = lunedì
  mealType: MealType;
  foodId?: number | null;
  recipeId?: number | null;
  quantityG?: number | null;
  status?: "ok" | "approximate"; // esito del generatore (vincolo macro rispettato o no)
}

export interface WeeklyPlan {
  id: number;
  weekStart: string; // 'YYYY-MM-DD', lunedì della settimana
  dietTypeId: number;
  name?: string | null;
  meals: WeeklyPlanMeal[];
}

export type Theme = "light" | "dark" | "system";
export type Units = "metric" | "imperial";
