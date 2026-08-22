import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useGoalsStore } from "@/stores/useGoalsStore";

export function SettingsPage() {
  const { theme, setTheme, hasUsdaApiKey, saveUsdaApiKey, clearUsdaApiKey, checkUsdaApiKeyPresence } =
    useSettingsStore();
  const { goals, loadGoals, saveGoals } = useGoalsStore();

  const [apiKeyInput, setApiKeyInput] = useState("");
  const [savingKey, setSavingKey] = useState(false);
  const [goalsForm, setGoalsForm] = useState(goals ?? {});

  useEffect(() => {
    checkUsdaApiKeyPresence();
    loadGoals();
  }, [checkUsdaApiKeyPresence, loadGoals]);

  useEffect(() => {
    if (goals) setGoalsForm(goals);
  }, [goals]);

  async function handleSaveApiKey() {
    if (!apiKeyInput.trim()) return;
    setSavingKey(true);
    const result = await saveUsdaApiKey(apiKeyInput.trim());
    setSavingKey(false);

    if (result.ok) {
      toast.success("Chiave USDA salvata", { description: "Verrà usata per ampliare i risultati di ricerca." });
      setApiKeyInput("");
    } else {
      toast.error("Chiave non valida", { description: result.error ?? "Verifica la chiave e riprova." });
    }
  }

  async function handleSaveGoals() {
    const ok = await saveGoals(goalsForm);
    if (ok) toast.success("Obiettivi aggiornati");
    else toast.error("Impossibile salvare gli obiettivi");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Impostazioni</h1>

      <Card>
        <CardHeader>
          <CardTitle>Aspetto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs space-y-1.5">
            <Label>Tema</Label>
            <Select value={theme} onValueChange={(v) => setTheme(v as typeof theme)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">Sistema</SelectItem>
                <SelectItem value="light">Chiaro</SelectItem>
                <SelectItem value="dark">Scuro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Obiettivi giornalieri</CardTitle>
          <CardDescription>Usati per le barre di progresso nel dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="goal-calories">Calorie (kcal)</Label>
              <Input
                id="goal-calories"
                type="number"
                value={goalsForm.caloriesTarget ?? ""}
                onChange={(e) => setGoalsForm((f) => ({ ...f, caloriesTarget: Number(e.target.value) || undefined }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="goal-protein">Proteine (g)</Label>
              <Input
                id="goal-protein"
                type="number"
                value={goalsForm.proteinTargetG ?? ""}
                onChange={(e) => setGoalsForm((f) => ({ ...f, proteinTargetG: Number(e.target.value) || undefined }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="goal-carbs">Carboidrati (g)</Label>
              <Input
                id="goal-carbs"
                type="number"
                value={goalsForm.carbsTargetG ?? ""}
                onChange={(e) => setGoalsForm((f) => ({ ...f, carbsTargetG: Number(e.target.value) || undefined }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="goal-fat">Grassi (g)</Label>
              <Input
                id="goal-fat"
                type="number"
                value={goalsForm.fatTargetG ?? ""}
                onChange={(e) => setGoalsForm((f) => ({ ...f, fatTargetG: Number(e.target.value) || undefined }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="goal-fiber">Fibre (g)</Label>
              <Input
                id="goal-fiber"
                type="number"
                value={goalsForm.fiberTargetG ?? ""}
                onChange={(e) => setGoalsForm((f) => ({ ...f, fiberTargetG: Number(e.target.value) || undefined }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="goal-sodium">Sodio max (mg)</Label>
              <Input
                id="goal-sodium"
                type="number"
                value={goalsForm.sodiumMaxMg ?? ""}
                onChange={(e) => setGoalsForm((f) => ({ ...f, sodiumMaxMg: Number(e.target.value) || undefined }))}
              />
            </div>
          </div>
          <Button onClick={handleSaveGoals}>Salva obiettivi</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chiave API USDA FoodData Central</CardTitle>
          <CardDescription>
            Facoltativa: la ricerca funziona anche senza, tramite OpenFoodFacts. Ottenete una chiave gratuita su{" "}
            <a
              href="https://api.data.gov/signup/"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2"
            >
              api.data.gov/signup
            </a>
            . La chiave resta cifrata sul dispositivo, non viene mai inviata altrove.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {hasUsdaApiKey ? (
            <div className="flex items-center justify-between rounded-md border border-border bg-secondary/40 px-3 py-2 text-sm">
              <span>Una chiave è già salvata e attiva.</span>
              <Button variant="ghost" size="sm" onClick={() => clearUsdaApiKey().then(() => toast("Chiave rimossa"))}>
                Rimuovi
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Incolla qui la chiave USDA"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
              />
              <Button onClick={handleSaveApiKey} disabled={savingKey || !apiKeyInput.trim()}>
                {savingKey ? "Verifica…" : "Salva"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
