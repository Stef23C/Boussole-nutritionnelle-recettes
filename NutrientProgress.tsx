import { Progress } from "@/components/ui/progress";
import { round } from "@/lib/utils";

interface NutrientProgressProps {
  label: string;
  consumed: number;
  target?: number | null;
  unit: "kcal" | "g" | "mg";
  /** classe Tailwind del colore semantico, es. "bg-nutrient-protein" (vedi tailwind.config.ts) */
  colorClass: string;
  /** true per i nutrienti con un limite massimo anziché un obiettivo minimo (es. sodio) */
  isCeiling?: boolean;
}

/**
 * Una singola barra di progresso nutriente: mostra consumato/obiettivo e
 * colora la barra in ambra quando si supera il 100% — comportamento
 * diverso a seconda che il nutriente sia un "obiettivo da raggiungere"
 * (proteine, calorie) o un "tetto da non superare" (sodio).
 */
export function NutrientProgress({ label, consumed, target, unit, colorClass, isCeiling = false }: NutrientProgressProps) {
  const hasTarget = target != null && target > 0;
  const pct = hasTarget ? Math.round((consumed / target) * 100) : 0;
  const isOver = hasTarget && pct > 100;

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground tabular-nums">
          {round(consumed, unit === "g" ? 1 : 0)}
          {hasTarget && ` / ${round(target!, unit === "g" ? 1 : 0)}`} {unit}
        </span>
      </div>
      <Progress
        value={Math.min(100, pct)}
        indicatorClassName={isOver && isCeiling ? "bg-destructive" : colorClass}
        aria-label={`${label}: ${round(consumed)} di ${hasTarget ? round(target!) : "obiettivo non impostato"} ${unit}`}
      />
      {isOver && isCeiling && <p className="text-xs text-destructive">Sopra il limite giornaliero</p>}
    </div>
  );
}
