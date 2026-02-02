import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { cn } from "../../utils/cn";

type Props = {
  title: string;
  description: string;
  statusLabel: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export function StatusBanner({
  title,
  description,
  statusLabel,
  actionLabel,
  onAction,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 md:flex-row md:items-center md:justify-between",
        className
      )}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Badge variant="secondary">{statusLabel}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
