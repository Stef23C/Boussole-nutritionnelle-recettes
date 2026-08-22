import { useCallback, useRef, useState } from "react";

interface UseTauriCommandState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Wrapper generico per invocare un comando Tauri (o qualsiasi promise async)
 * con stato di loading/errore gestito automaticamente. Pensato per azioni
 * scatenate da un'interazione utente (submit, click) — non per subscription
 * continue, per quelle vedi useDailySummary sotto.
 *
 * Uso tipico:
 *   const { run, loading, error } = useTauriCommand(addMealItem);
 *   await run({ date, mealType, foodId, quantityG });
 */
export function useTauriCommand<TArgs extends unknown[], TResult>(
  command: (...args: TArgs) => Promise<TResult>,
) {
  const [state, setState] = useState<UseTauriCommandState<TResult>>({
    data: null,
    loading: false,
    error: null,
  });

  // Evita di applicare il risultato di una chiamata "vecchia" se nel
  // frattempo ne è partita una più recente (race condition classica su
  // digitazione rapida / doppio click).
  const callId = useRef(0);

  const run = useCallback(
    async (...args: TArgs): Promise<TResult | null> => {
      const currentCall = ++callId.current;
      setState({ data: null, loading: true, error: null });

      try {
        const result = await command(...args);
        if (currentCall !== callId.current) return null; // superata da una chiamata più recente
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (err) {
        if (currentCall !== callId.current) return null;
        const message = err instanceof Error ? err.message : String(err);
        setState({ data: null, loading: false, error: message });
        return null;
      }
    },
    [command],
  );

  const reset = useCallback(() => setState({ data: null, loading: false, error: null }), []);

  return { ...state, run, reset };
}
