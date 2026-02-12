import { Link } from "react-router-dom";
import { NavLink } from "./NavLink";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";
import { LanguageSelect } from "./LanguageSelect";
import { useT } from "../../i18n";

export function AppTopNav() {
  const t = useT();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="container flex items-center justify-between py-2 md:py-3">
        <Link to="/app">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/app" label={t("nav.dashboard")} end />
          <NavLink to="/app/deals" label={t("nav.explore")} />
          <NavLink to="/app/saved" label={t("nav.saved")} />
        </nav>
        <div className="flex items-center gap-1.5">
          <LanguageSelect />
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
