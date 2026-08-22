import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTauriCommand } from "@/hooks/useTauriCommand";
import { generatePlan } from "@/api/plans";
import { MEAL_TYPES, type WeeklyPlan } from "@/types";

const DAY_LABELS = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];

/** Prossimo lunedì (o oggi se oggi è lunedì), usato come default per un nuovo piano. */
function nextMonday(): string {
  const d = new Date();
  const day = d.getDay(); // 0=domenica..6=sabato
  const diff = day === 1 ? 0 : ((8 - day) % 7);
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

export function PlansPage() {
  const [dietTypeId] = useState(1); // TODO: da collegare a un selettore dieta (vedi user_diet_preferences)
  const { data: plan, loading, error, run } = useTauriCommand(generatePlan);

  async function handleGenerate() {
    const result = await run({ weekStart: nextMonday(), dietTypeId });
    if (result) {
      toast.success("Piano generato", { description: `Settimana dal ${result.weekStart}` });
    } else {
      toast.error("Generazione non riuscita");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Piani settimanali</h1>
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Genera piano
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">Impossibile generare il piano: {error}</p>}

      {!plan && !loading && (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Nessun piano generato per la prossima settimana. Premi "Genera piano" per crearne uno,
            calcolato in locale in base alla dieta selezionata.
          </CardContent>
        </Card>
      )}

      {plan && <PlanGrid plan={plan} />}
    </div>
  );
}

function PlanGrid({ plan }: { plan: WeeklyPlan }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {DAY_LABELS.map((dayLabel, dayIndex) => {
        const dayMeals = plan.meals.filter((m) => m.dayOfWeek === dayIndex);
        if (dayMeals.length === 0) return null;

        return (
          <Card key={dayIndex}>
            <CardHeader>
              <CardTitle className="text-sm">{dayLabel}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {MEAL_TYPES.map(({ value, label }) => {
                const item = dayMeals.find((m) => m.mealType === value);
                if (!item) return null;
                return (
                  <div key={value} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="flex items-center gap-1.5">
                      {item.status === "approximate" && (
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-nutrient-carbs"
                          title="Approssimato: vincolo macro non pienamente rispettato, da rivedere"
                        />
                      )}
                      Alimento #{item.foodId ?? item.recipeId} · {item.quantityG ?? "—"} g
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
