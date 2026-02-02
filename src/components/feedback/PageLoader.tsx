import { Skeleton } from "../ui/skeleton";

export function PageLoader() {
  return (
    <div className="container py-16">
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
