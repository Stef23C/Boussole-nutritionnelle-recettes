import type { Config } from "tailwindcss";

// Palette et tokens shadcn/ui standard (variables CSS définies dans src/index.css).
// On garde le mapping par défaut shadcn pour rester compatible avec les
// composants générés par `shadcn add`, et on ajoute juste nos couleurs
// sémantiques nutrition (macro-nutriments) sous `nutrient.*`.
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Couleurs sémantiques par macro-nutriment, utilisées par les
        // barres de progression du dashboard (voir NutrientProgress.tsx).
        nutrient: {
          calories: "hsl(var(--nutrient-calories))",
          protein: "hsl(var(--nutrient-protein))",
          carbs: "hsl(var(--nutrient-carbs))",
          fat: "hsl(var(--nutrient-fat))",
          fiber: "hsl(var(--nutrient-fiber))",
          sodium: "hsl(var(--nutrient-sodium))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
