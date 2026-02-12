import type { ReactNode } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { cn } from "../../utils/cn";

type Props = {
  to: string;
  label: string;
  icon?: ReactNode;
  className?: string;
  end?: boolean;
};

export function NavLink({ to, label, icon, className, end }: Props) {
  return (
    <RouterNavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-muted",
          className
        )
      }
    >
      {icon}
      <span>{label}</span>
    </RouterNavLink>
  );
}
