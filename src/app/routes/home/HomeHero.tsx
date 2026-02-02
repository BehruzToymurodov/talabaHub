import { Link } from "react-router-dom";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useT } from "../../../i18n";

const SEARCH_ID = "home-search";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  showVerifyCta: boolean;
  verifyHref: string;
};

export function HomeHero({
  search,
  onSearchChange,
  showVerifyCta,
  verifyHref,
}: Props) {
  const t = useT();
  return (
    <section className="rounded-3xl bg-gradient-to-br from-primary/10 via-background to-accent/10 py-10 md:py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 md:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t("home.heroTag")}
          </p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            {t("home.heroTitle")}
          </h1>
          <p className="max-w-xl text-base text-muted-foreground">
            {t("home.heroDescription")}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/deals">{t("home.heroSecondary")}</Link>
            </Button>
            {showVerifyCta && (
              <Button asChild variant="secondary" size="lg">
                <Link to={verifyHref}>{t("action.verifyToUnlock")}</Link>
              </Button>
            )}
          </div>
        </div>
        <div className="w-full max-w-md rounded-2xl border border-border bg-background/80 p-4 shadow-sm">
          <label htmlFor={SEARCH_ID} className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t("label.searchDeals")}
          </label>
          <Input
            id={SEARCH_ID}
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={t("label.searchDeals")}
            className="mt-2"
          />
          <p className="mt-3 text-xs text-muted-foreground">
            {t("home.heroSubtitle")}
          </p>
        </div>
      </div>
    </section>
  );
}
