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

export function UserMenu() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const t = useT();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full px-4">
          {user.email}
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
