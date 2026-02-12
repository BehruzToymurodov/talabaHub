import { Link } from "react-router-dom";
import { NavLink } from "./NavLink";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";
import { LanguageSelect } from "./LanguageSelect";
import { useT } from "../../i18n";

export function AdminTopNav() {
  const t = useT();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="container flex items-center justify-between py-2 md:py-3">
        <Link to="/admin">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/admin" label={t("nav.dashboard")} />
          <NavLink to="/admin/verifications" label={t("nav.verifications")} />
          <NavLink to="/admin/deals" label={t("nav.deals")} />
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
