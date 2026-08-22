import { useCallback, useEffect, useState } from "react";
import { getDailySummary } from "@/api/meals";
import type { DailySummary } from "@/types";
import { todayIso } from "@/lib/utils";

/**
 * Carica ed espone il riepilogo nutrizionale del giorno, con un `refresh()`
 * da richiamare dopo ogni scrittura (es. subito dopo addMealItem) così la
 * dashboard resta sincronizzata senza bisogno di uno store globale dedicato:
 * la fonte di verità resta il DB SQLite via il comando Tauri, questo hook
 * è solo la cache "per rendering" della pagina che lo usa.
 */
export function useDailySummary(date: string = todayIso()) {
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getDailySummary(date);
      setSummary(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { summary, loading, error, refresh };
}
