import { create } from "zustand";
import type { DailyGoals } from "@/types";
import { getGoals, updateGoals } from "@/api/goals";

interface GoalsState {
  goals: DailyGoals | null;
  loading: boolean;
  error: string | null;

  loadGoals: () => Promise<void>;
  saveGoals: (goals: DailyGoals) => Promise<boolean>;
}

export const useGoalsStore = create<GoalsState>((set) => ({
  goals: null,
  loading: false,
  error: null,

  loadGoals: async () => {
    set({ loading: true, error: null });
    try {
      const goals = await getGoals();
      set({ goals, loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : String(err), loading: false });
    }
  },

  saveGoals: async (goals) => {
    set({ loading: true, error: null });
    try {
      const saved = await updateGoals(goals);
      set({ goals: saved, loading: false });
      return true;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : String(err), loading: false });
      return false;
    }
  },
}));
