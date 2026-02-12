import { cn } from "../../utils/cn";
import { useT } from "../../i18n";
import logo from "../../assets/logos/talabaHub.png";

export function Logo({ className }: { className?: string }) {
  const t = useT();
  return (
    <div className={cn("flex items-center gap-2 md:gap-3", className)}>
      <div className="flex items-center justify-center">
        <img
          src={logo}
          alt="TalabaHub logo"
          className="h-8 w-auto object-contain sm:h-10 lg:h-12"
        />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold">TalabaHub</p>
        <p className="text-xs text-muted-foreground">{t("brand.tagline")}</p>
      </div>
    </div>
  );
}
