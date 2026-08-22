import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

/**
 * Layout condiviso: sidebar fissa a sinistra su schermi larghi (desktop),
 * sostituita da una bottom navigation su schermi stretti (mobile/Android).
 * Il breakpoint `md` (768px) segue la convenzione Tailwind di default.
 */
export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col md:pl-64">
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 pb-24 md:pb-8">
          <div className="mx-auto w-full max-w-4xl">
            <Outlet />
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
