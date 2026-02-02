import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useThemeStore } from "../../app/store/useThemeStore";
import { useT } from "../../i18n";

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggle = useThemeStore((state) => state.toggle);
  const t = useT();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggle}
      aria-label={t("action.toggleTheme")}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
