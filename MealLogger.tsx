import { useState } from "react";
import { toast } from "sonner";
import { FoodSearch } from "./FoodSearch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMealsStore } from "@/stores/useMealsStore";
import { MEAL_TYPES, type Food, type MealType } from "@/types";
import { round } from "@/lib/utils";

/**
 * Componente principale di registrazione pasti:
 * 1. ricerca alimento (FoodSearch, debounce 300ms)
 * 2. l'utente specifica quantità e pasto
 * 3. "Salva" chiama il backend Tauri via useMealsStore.addItem
 * 4. toast di conferma/errore (sonner)
 */
export function MealLogger() {
  const { date, addItem } = useMealsStore();

  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantityG, setQuantityG] = useState(100);
  const [mealType, setMealType] = useState<MealType>("lunch");
  const [saving, setSaving] = useState(false);

  const previewFactor = selectedFood ? quantityG / 100 : 0;

  async function handleSave() {
    if (!selectedFood) return;

    setSaving(true);
    const ok = await addItem({
      date,
      mealType,
      foodId: selectedFood.id,
      quantityG,
    });
    setSaving(false);

    if (ok) {
      toast.success("Alimento aggiunto", {
        description: `${selectedFood.name} · ${quantityG} g · ${MEAL_TYPES.find((m) => m.value === mealType)?.label}`,
      });
      setSelectedFood(null);
      setQuantityG(100);
    } else {
      toast.error("Salvataggio non riuscito", {
        description: "Controlla la connessione al database locale e riprova.",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registra un alimento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label>Alimento</Label>
          <FoodSearch onSelect={setSelectedFood} />
        </div>

        {selectedFood && (
          <div className="rounded-md border border-border bg-secondary/40 p-3 text-sm">
            <p className="font-medium">{selectedFood.name}</p>
            <p className="mt-1 text-muted-foreground">
              Per {quantityG} g: {round(selectedFood.caloriesKcal * previewFactor)} kcal ·{" "}
              P {round(selectedFood.proteinG * previewFactor, 1)} g ·{" "}
              C {round(selectedFood.carbsG * previewFactor, 1)} g ·{" "}
              G {round(selectedFood.fatG * previewFactor, 1)} g
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="quantity">Quantità (g)</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              step={1}
              value={quantityG}
              onChange={(e) => setQuantityG(Math.max(1, Number(e.target.value) || 0))}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Pasto</Label>
            <Select value={mealType} onValueChange={(v) => setMealType(v as MealType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MEAL_TYPES.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleSave} disabled={!selectedFood || saving} className="w-full">
          {saving ? "Salvataggio…" : "Salva"}
        </Button>
      </CardContent>
    </Card>
  );
}
