# Boussole Nutritionnelle — Frontend (React + TypeScript)

Scaffold del frontend, pensato per essere copiato dentro un progetto Tauri
esistente (accanto a `src-tauri/`) o come base per `create-tauri-app`.

## Setup

```bash
npm install
npm run dev          # solo frontend (Vite), utile per iterare sulla UI
npm run tauri dev    # frontend + backend Rust, dentro la WebView Tauri
```

`components.json` di shadcn/ui non è incluso: i componenti in
`src/components/ui/` sono già scritti a mano nello stile shadcn (stessa
API, stesse classi Tailwind) per evitare la dipendenza dal CLI `shadcn add`
in questo scaffold. Se preferite gestirli col CLI in futuro, potete
rigenerarli con `npx shadcn@latest add button card input progress dialog
select label` e sostituire i file qui presenti.

## Cosa manca, volutamente, per restare uno scaffold

- I comandi Tauri invocati da `src/api/*.ts` (`search_foods`,
  `add_meal_item`, `get_daily_summary`, `generate_plan`, ecc.) devono
  esistere lato Rust con questi nomi e questa forma di argomenti/ritorno —
  vedi i due documenti di architettura per l'implementazione backend.
- `src/api/export.ts` (funzionalità #6, export CSV/PDF) non è incluso:
  segue lo stesso pattern degli altri wrapper in `src/api/`.
- Lo "spazio respirazione e benessere" (funzionalità #7) non è incluso:
  è UI pura (nessuna chiamata Tauri), da aggiungere come nuova pagina/route
  seguendo lo stesso schema di `src/pages/*.tsx` + voce in `App.tsx`,
  `Sidebar.tsx`, `BottomNav.tsx`.
- Il selettore di dieta nella pagina Piani (`PlansPage.tsx`) usa un
  `dietTypeId` fisso a `1`: da collegare a un vero selettore basato su
  `user_diet_preferences` una volta pronto il comando Rust corrispondente.
