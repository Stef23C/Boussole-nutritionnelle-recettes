import { NavLink } from "react-router-dom";
import { LayoutDashboard, UtensilsCrossed, CalendarRange, History, Settings, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/meals", label: "Pasti", icon: UtensilsCrossed },
  { to: "/plans", label: "Piani", icon: CalendarRange },
  { to: "/history", label: "Storico", icon: History },
  { to: "/settings", label: "Impostazioni", icon: Settings },
];

/** Navigazione laterale, visibile solo da `md` in su (desktop). Su mobile viene sostituita da BottomNav. */
export function Sidebar() {
  return (
    <aside className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:w-64 md:flex-col border-r border-border bg-card">
      <div className="flex items-center gap-2 px-6 h-16 border-b border-border">
        <Compass className="h-5 w-5 text-primary" aria-hidden="true" />
        <span className="font-semibold tracking-tight">Boussole</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )
            }
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
