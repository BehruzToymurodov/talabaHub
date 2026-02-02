import { NavLink } from "react-router-dom";
import { Bookmark, Home, Search, User } from "lucide-react";
import { cn } from "../../utils/cn";
import { useT } from "../../i18n";

export function MobileBottomNav() {
  const t = useT();
  const items = [
    { to: "/app", label: t("nav.home"), icon: Home },
    { to: "/app/deals", label: t("nav.explore"), icon: Search },
    { to: "/app/saved", label: t("nav.saved"), icon: Bookmark },
    { to: "/app/profile", label: t("nav.profile"), icon: User },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur md:hidden">
      <div className="flex items-center justify-around px-3 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold",
                  isActive ? "text-primary" : "text-muted-foreground"
                )
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
