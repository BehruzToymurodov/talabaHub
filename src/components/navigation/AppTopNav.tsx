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
      <div className="container flex items-center justify-between py-3 md:py-4">
        <Link to="/app">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/app" label={t("nav.dashboard")} />
          <NavLink to="/app/deals" label={t("nav.explore")} />
          <NavLink to="/app/saved" label={t("nav.saved")} />
          <NavLink to="/app/profile" label={t("nav.profile")} />
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSelect />
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
