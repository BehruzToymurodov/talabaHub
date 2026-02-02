import { cn } from "../../utils/cn";
import { useT } from "../../i18n";

export function Logo({ className }: { className?: string }) {
  const t = useT();
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex items-center justify-center">
        <img
          src="/talabaHub.png"
          alt="TalabaHub logo"
          className="h-20 w-auto object-contain"
        />
      </div>
      <div className="leading-tight">
        <p className="text-base font-semibold">TalabaHub</p>
        <p className="text-xs text-muted-foreground">{t("brand.tagline")}</p>
      </div>
    </div>
  );
}
