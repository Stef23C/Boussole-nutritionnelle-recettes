import { useEffect, useState } from "react";

/** Ritorna `value` solo dopo che è rimasto stabile per `delayMs` — usato per il campo di ricerca alimenti. */
export function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
