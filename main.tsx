import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* BrowserRouter funziona in Tauri perché la WebView serve l'app da
        un'origine locale fissa (non file://), quindi niente problemi con
        la history API come potrebbe capitare in altri contesti embedded. */}
    <BrowserRouter>
      <App />
      {/* Toaster montato una volta sola alla radice: qualsiasi componente
          può poi chiamare toast.success(...) / toast.error(...) da 'sonner'. */}
      <Toaster richColors position="top-center" />
    </BrowserRouter>
  </React.StrictMode>,
);
