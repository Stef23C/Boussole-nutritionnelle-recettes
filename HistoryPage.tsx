import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDailySummary } from "@/hooks/useDailySummary";
import { DailySummaryCard } from "@/components/dashboard/DailySummaryCard";
import { MealsList } from "@/components/dashboard/MealsList";
import { todayIso } from "@/lib/utils";

/**
 * Storico: selezione di una data passata per rivedere il riepilogo di quel
 * giorno. Riusa useDailySummary/DailySummaryCard/MealsList già costruiti
 * per il dashboard di oggi — l'unica differenza è la data passata all'hook.
 */
export function HistoryPage() {
  const [selectedDate, setSelectedDate] = useState(todayIso());
  const { summary, loading, error } = useDailySummary(selectedDate);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Storico</h1>

      <Card>
        <CardContent className="pt-5">
          <div className="max-w-xs space-y-1.5">
            <Label htmlFor="history-date">Seleziona una data</Label>
            <Input
              id="history-date"
              type="date"
              max={todayIso()}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {loading && <p className="text-sm text-muted-foreground">Caricamento…</p>}
      {error && <p className="text-sm text-destructive">Impossibile caricare i dati: {error}</p>}

      {summary && (
        <>
          <DailySummaryCard summary={summary} />
          <MealsList meals={summary.meals} />
        </>
      )}

      {/* L'export CSV/PDF (funzionalità #6 del backlog) si aggancia qui con un
          pulsante che chiama un comando Tauri `export_range` passando
          selectedDate come range_start/range_end — vedi api/plans.ts come
          modello per il wrapper da aggiungere in src/api/export.ts. */}
    </div>
  );
}
