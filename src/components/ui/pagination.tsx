import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "./button";

const Pagination = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn("flex items-center gap-2", className)} {...props} />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

const PaginationLink = ({
  className,
  isActive,
  ...props
}: {
  isActive?: boolean;
} & React.ComponentProps<typeof Button>) => (
  <Button
    variant={isActive ? "default" : "outline"}
    size="sm"
    className={cn("h-9 w-9 p-0", className)}
    {...props}
  />
);

const PaginationPrevious = ({ className, ...props }: React.ComponentProps<typeof Button>) => (
  <Button variant="outline" size="sm" className={cn("h-9", className)} {...props} />
);

const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof Button>) => (
  <Button variant="outline" size="sm" className={cn("h-9", className)} {...props} />
);

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
};
