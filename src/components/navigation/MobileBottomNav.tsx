import { NavLink, useLocation } from "react-router-dom";
import { Bookmark, Home, LayoutGrid, Search } from "lucide-react";
import { cn } from "../../utils/cn";
import { useT } from "../../i18n";

export function MobileBottomNav() {
  const t = useT();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const view = params.get("view");
  const isDealsPage = location.pathname === "/app/deals";
  const items = [
    { to: "/app", label: t("nav.home"), icon: Home, end: true },
    { to: "/app/deals", label: t("nav.explore"), icon: Search },
    { to: "/app/deals?view=categories", label: t("action.categories"), icon: LayoutGrid },
    { to: "/app/saved", label: t("nav.saved"), icon: Bookmark },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur md:hidden">
      <div className="flex items-center justify-around px-3 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isCategoriesItem = item.to.includes("view=categories");
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => {
                const active =
                  isDealsPage && item.to.startsWith("/app/deals")
                    ? isCategoriesItem
                      ? view === "categories"
                      : view !== "categories"
                    : isActive;
                return cn(
                  "flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold",
                  active ? "text-primary" : "text-muted-foreground"
                );
              }}
              aria-current={
                isDealsPage && item.to.startsWith("/app/deals")
                  ? isCategoriesItem
                    ? view === "categories"
                      ? "page"
                      : undefined
                    : view !== "categories"
                      ? "page"
                      : undefined
                  : undefined
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
