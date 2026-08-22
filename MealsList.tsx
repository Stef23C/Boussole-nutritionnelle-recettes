import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MEAL_TYPES, type Meal } from "@/types";
import { round } from "@/lib/utils";

interface MealsListProps {
  meals: Meal[];
}

/** Lista dei pasti del giorno con dettaglio degli alimenti registrati in ciascuno. */
export function MealsList({ meals }: MealsListProps) {
  if (meals.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          Nessun pasto registrato oggi — usa "Registra un alimento" per iniziare.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {MEAL_TYPES.map(({ value, label }) => {
        const meal = meals.find((m) => m.mealType === value);
        if (!meal || meal.items.length === 0) return null;

        const mealCalories = meal.items.reduce(
          (sum, item) => sum + (item.food ? item.food.caloriesKcal * (item.quantityG / 100) : 0),
          0,
        );

        return (
          <Card key={value}>
            <CardHeader className="flex-row items-baseline justify-between space-y-0">
              <CardTitle>{label}</CardTitle>
              <span className="text-sm text-muted-foreground tabular-nums">{round(mealCalories)} kcal</span>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-border">
                {meal.items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between py-2 text-sm">
                    <span>{item.food?.name ?? `Alimento #${item.foodId}`}</span>
                    <span className="text-muted-foreground tabular-nums">{item.quantityG} g</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
