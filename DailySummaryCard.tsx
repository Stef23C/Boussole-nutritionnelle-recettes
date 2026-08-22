import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NutrientProgress } from "./NutrientProgress";
import type { DailySummary } from "@/types";

interface DailySummaryCardProps {
  summary: DailySummary;
}

/** Le sei barre di progresso richieste: calorie, proteine, carboidrati, grassi, fibre, sodio. */
export function DailySummaryCard({ summary }: DailySummaryCardProps) {
  const { consumed, goals } = summary;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Riepilogo di oggi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <NutrientProgress
          label="Calorie"
          consumed={consumed.caloriesKcal}
          target={goals.caloriesTarget}
          unit="kcal"
          colorClass="bg-nutrient-calories"
        />
        <NutrientProgress
          label="Proteine"
          consumed={consumed.proteinG}
          target={goals.proteinTargetG}
          unit="g"
          colorClass="bg-nutrient-protein"
        />
        <NutrientProgress
          label="Carboidrati"
          consumed={consumed.carbsG}
          target={goals.carbsTargetG}
          unit="g"
          colorClass="bg-nutrient-carbs"
        />
        <NutrientProgress
          label="Grassi"
          consumed={consumed.fatG}
          target={goals.fatTargetG}
          unit="g"
          colorClass="bg-nutrient-fat"
        />
        <NutrientProgress
          label="Fibre"
          consumed={consumed.fiberG}
          target={goals.fiberTargetG}
          unit="g"
          colorClass="bg-nutrient-fiber"
        />
        <NutrientProgress
          label="Sodio"
          consumed={consumed.sodiumMg}
          target={goals.sodiumMaxMg}
          unit="mg"
          colorClass="bg-nutrient-sodium"
          isCeiling
        />
      </CardContent>
    </Card>
  );
}
