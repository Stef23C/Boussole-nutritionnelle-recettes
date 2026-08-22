import { useEffect } from "react";
import { MealLogger } from "@/components/meals/MealLogger";
import { MealsList } from "@/components/dashboard/MealsList";
import { useMealsStore } from "@/stores/useMealsStore";

export function MealsPage() {
  const { meals, loadMeals } = useMealsStore();

  useEffect(() => {
    loadMeals();
  }, [loadMeals]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Pasti</h1>
      <MealLogger />
      <div>
        <h2 className="mb-3 text-lg font-semibold tracking-tight">Registrati oggi</h2>
        <MealsList meals={meals} />
      </div>
    </div>
  );
}
