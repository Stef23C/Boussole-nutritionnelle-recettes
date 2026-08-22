import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Config Vite adaptée aux besoins de Tauri :
// - port fixe (Tauri pointe dessus en dev via `tauri.conf.json` -> devUrl)
// - on ignore les évènements de watch venant du dossier Rust (gen/ et target/)
//   pour éviter des rebuilds inutiles quand `cargo` écrit des artefacts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    watch: { ignored: ["**/src-tauri/**"] },
  },
});
