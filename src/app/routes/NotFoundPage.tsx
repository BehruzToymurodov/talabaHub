import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useT } from "../../i18n";

export function NotFoundPage() {
  const t = useT();
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-3xl font-semibold">{t("notFound.title")}</h1>
      <p className="text-sm text-muted-foreground">
        {t("notFound.desc")}
      </p>
      <Button asChild>
        <Link to="/">{t("action.goHome")}</Link>
      </Button>
    </div>
  );
}
