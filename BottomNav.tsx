import { NavLink } from "react-router-dom";
import { LayoutDashboard, UtensilsCrossed, CalendarRange, History, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Oggi", icon: LayoutDashboard },
  { to: "/meals", label: "Pasti", icon: UtensilsCrossed },
  { to: "/plans", label: "Piani", icon: CalendarRange },
  { to: "/history", label: "Storico", icon: History },
  { to: "/settings", label: "Profilo", icon: Settings },
];

/**
 * Barra di navigazione inferiore per mobile/Android (nascosta da `md` in su).
 * `pb-[env(safe-area-inset-bottom)]` evita che la barra finisca sotto la
 * gesture bar dei telefoni con schermo edge-to-edge.
 */
export function BottomNav() {
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-20 flex items-stretch justify-around
                 border-t border-border bg-card pb-[env(safe-area-inset-bottom)]"
    >
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-medium",
              isActive ? "text-primary" : "text-muted-foreground",
            )
          }
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
