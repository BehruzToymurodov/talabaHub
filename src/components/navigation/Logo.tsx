import { cn } from "../../utils/cn";
import { useT } from "../../i18n";

export function Logo({ className }: { className?: string }) {
  const t = useT();
  return (
    <div className={cn("flex items-center gap-2 md:gap-3", className)}>
      <div className="flex items-center justify-center">
        <img
          src="/talabaHub.png"
          alt="TalabaHub logo"
          className="h-12 w-auto object-contain sm:h-16 lg:h-20"
        />
      </div>
      <div className="leading-tight">
        <p className="text-base font-semibold">TalabaHub</p>
        <p className="text-xs text-muted-foreground">{t("brand.tagline")}</p>
      </div>
    </div>
  );
}
