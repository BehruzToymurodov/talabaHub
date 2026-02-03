import { Link } from "react-router-dom";
import { NavLink } from "./NavLink";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "../ui/button";
import { LanguageSelect } from "./LanguageSelect";
import { useT } from "../../i18n";

export function PublicNav() {
  const t = useT();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="container flex items-center justify-between py-3 md:py-4">
        <Link to="/">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/" label={t("nav.home")} />
          <NavLink to="/deals" label={t("nav.explore")} />
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSelect />
          <ThemeToggle />
          <Button asChild className="rounded-full">
            <Link to="/auth">{t("nav.login")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
