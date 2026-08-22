import { useEffect, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { searchFoods } from "@/api/foods";
import type { Food } from "@/types";
import { cn } from "@/lib/utils";

interface FoodSearchProps {
  onSelect: (food: Food) => void;
}

/**
 * Campo di ricerca alimenti con autocompletamento. Il debounce a 300ms
 * evita un invoke() Tauri (che a sua volta può arrivare a interrogare
 * USDA/OpenFoodFacts) ad ogni singolo tasto premuto — solo quando la
 * digitazione si ferma per 300ms parte davvero la ricerca.
 */
export function FoodSearch({ onSelect }: FoodSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    let cancelled = false;

    if (debouncedQuery.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    searchFoods(debouncedQuery)
      .then((foods) => {
        if (!cancelled) {
          setResults(foods);
          setOpen(true);
        }
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  function handleSelect(food: Food) {
    onSelect(food);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Cerca un alimento (es. petto di pollo, riso basmati...)"
          className="pl-9 pr-9"
          aria-label="Cerca un alimento"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {open && (query.trim().length >= 2) && (
        <ul
          className={cn(
            "absolute z-10 mt-1 max-h-72 w-full overflow-auto rounded-md border border-border",
            "bg-card shadow-md",
          )}
        >
          {!loading && results.length === 0 && (
            <li className="px-3 py-2.5 text-sm text-muted-foreground">Nessun risultato per "{query}".</li>
          )}
          {results.map((food) => (
            <li key={`${food.source}-${food.id}`}>
              <button
                type="button"
                onClick={() => handleSelect(food)}
                className="flex w-full items-start justify-between gap-3 px-3 py-2.5 text-left text-sm hover:bg-secondary"
              >
                <span>
                  <span className="block font-medium">{food.name}</span>
                  {food.brand && <span className="block text-xs text-muted-foreground">{food.brand}</span>}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {Math.round(food.caloriesKcal)} kcal / 100 g
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
