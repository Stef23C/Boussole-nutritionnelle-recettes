import { create } from "zustand";
import type { Meal, MealType } from "@/types";
import { getMealsByDate, addMealItem, type AddMealItemInput } from "@/api/meals";
import { todayIso } from "@/lib/utils";

interface MealsState {
  date: string;
  meals: Meal[];
  loading: boolean;
  error: string | null;

  setDate: (date: string) => void;
  loadMeals: (date?: string) => Promise<void>;
  addItem: (input: AddMealItemInput) => Promise<boolean>;
  mealsByType: (mealType: MealType) => Meal[];
}

/**
 * Store dei pasti registrati per la data corrente. Tenuto volutamente
 * "sottile": SQLite via Tauri resta la fonte di verità, questo store è
 * la cache in memoria per evitare un invoke() ad ogni render dei
 * componenti che leggono i pasti del giorno (MealLogger, Dashboard, ecc.).
 */
export const useMealsStore = create<MealsState>((set, get) => ({
  date: todayIso(),
  meals: [],
  loading: false,
  error: null,

  setDate: (date) => {
    set({ date });
    get().loadMeals(date);
  },

  loadMeals: async (date) => {
    const targetDate = date ?? get().date;
    set({ loading: true, error: null });
    try {
      const meals = await getMealsByDate(targetDate);
      set({ meals, loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : String(err), loading: false });
    }
  },

  addItem: async (input) => {
    try {
      await addMealItem(input);
      await get().loadMeals(); // ricarica per restare coerenti col DB (niente merge ottimistico rischioso)
      return true;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : String(err) });
      return false;
    }
  },

  mealsByType: (mealType) => get().meals.filter((m) => m.mealType === mealType),
}));
