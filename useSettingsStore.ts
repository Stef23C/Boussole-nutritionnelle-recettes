import { create } from "zustand";
import { persist } from "zustand/middleware";
import { invoke } from "@tauri-apps/api/core";
import type { Theme, Units } from "@/types";

interface SettingsState {
  theme: Theme;
  units: Units;
  /** true/false soltanto: se una chiave USDA è salvata nel vault Stronghold. Mai il valore della chiave in questo store. */
  hasUsdaApiKey: boolean;

  setTheme: (theme: Theme) => void;
  setUnits: (units: Units) => void;

  /** Invia la chiave al backend Rust che la valida e la salva in Stronghold — non finisce mai in localStorage. */
  saveUsdaApiKey: (apiKey: string) => Promise<{ ok: boolean; error?: string }>;
  clearUsdaApiKey: () => Promise<void>;
  checkUsdaApiKeyPresence: () => Promise<void>;
}

/**
 * Impostazioni "leggere" (tema, unità) persistite via zustand/persist in
 * localStorage nella WebView — va bene perché non sono dati sensibili.
 * La chiave API USDA è deliberatamente ESCLUSA dalla persistenza qui
 * (vedi `partialize`): vive solo nel vault Stronghold lato Rust, questo
 * store tiene solo un booleano "è presente sì/no" per la UI.
 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "system",
      units: "metric",
      hasUsdaApiKey: false,

      setTheme: (theme) => {
        set({ theme });
        const root = document.documentElement;
        const effectiveDark =
          theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
        root.classList.toggle("dark", effectiveDark);
      },

      setUnits: (units) => set({ units }),

      saveUsdaApiKey: async (apiKey) => {
        try {
          // il comando Rust valida la chiave con una chiamata di test USDA
          // prima di salvarla in Stronghold (vedi documento approfondimenti, sez. 1)
          await invoke("save_usda_api_key", { apiKey });
          set({ hasUsdaApiKey: true });
          return { ok: true };
        } catch (err) {
          return { ok: false, error: err instanceof Error ? err.message : String(err) };
        }
      },

      clearUsdaApiKey: async () => {
        await invoke("clear_usda_api_key");
        set({ hasUsdaApiKey: false });
      },

      checkUsdaApiKeyPresence: async () => {
        const present = await invoke<boolean>("has_usda_api_key");
        set({ hasUsdaApiKey: present });
      },
    }),
    {
      name: "boussole-settings",
      partialize: (state) => ({ theme: state.theme, units: state.units }), // mai hasUsdaApiKey/la chiave stessa
    },
  ),
);
