import { useNavigate } from "react-router-dom";
import { LogOut, Settings, ShieldCheck } from "lucide-react";
import { useAuthStore } from "../../app/store/useAuthStore";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useT } from "../../i18n";
import { getUserDisplayName, getUserInitials } from "../../utils/user";

export function UserMenu() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const t = useT();

  if (!user) return null;
  const displayName = getUserDisplayName(user);
  const initials = getUserInitials(user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 rounded-full px-3">
          <span className="relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-semibold">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </span>
          <span className="max-w-[140px] truncate">{displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => navigate("/app/profile")}
          className="gap-2">
          <Settings className="h-4 w-4" />
          {t("nav.profile")}
        </DropdownMenuItem>
        {user.role === "admin" && (
          <DropdownMenuItem onSelect={() => navigate("/admin")}
            className="gap-2">
            <ShieldCheck className="h-4 w-4" />
            {t("nav.admin")}
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={async () => {
            await logout();
            navigate("/");
          }}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          {t("action.signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
