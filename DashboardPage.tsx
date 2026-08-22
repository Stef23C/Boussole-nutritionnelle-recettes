import { Loader2 } from "lucide-react";
import { useDailySummary } from "@/hooks/useDailySummary";
import { DailySummaryCard } from "@/components/dashboard/DailySummaryCard";
import { MealsList } from "@/components/dashboard/MealsList";

export function DashboardPage() {
  const { summary, loading, error } = useDailySummary();

  if (loading && !summary) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">Impossibile caricare il riepilogo: {error}</p>;
  }

  if (!summary) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Oggi</h1>
        <p className="text-sm text-muted-foreground">{summary.date}</p>
      </div>

      <DailySummaryCard summary={summary} />

      <div>
        <h2 className="mb-3 text-lg font-semibold tracking-tight">Pasti del giorno</h2>
        <MealsList meals={summary.meals} />
      </div>
    </div>
  );
}
