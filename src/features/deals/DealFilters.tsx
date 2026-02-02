import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { dealCategories, categoryLabelKeys, sortOptions } from "./constants";
import { useT } from "../../i18n";

type Filters = {
  search: string;
  category: string;
  sort: string;
};

type Props = {
  filters: Filters;
  onChange: (next: Filters) => void;
  showCategory?: boolean;
};

export function DealFilters({ filters, onChange, showCategory = true }: Props) {
  const t = useT();
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-3 md:flex-row">
        <Input
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
          placeholder={t("label.searchDeals")}
          aria-label={t("label.searchDeals")}
        />
        {showCategory && (
          <Select
            value={filters.category}
            onValueChange={(value) => onChange({ ...filters, category: value })}
          >
            <SelectTrigger className="md:w-56">
              <SelectValue placeholder={t("label.category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">{t("label.allCategories")}</SelectItem>
              {dealCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {t(categoryLabelKeys[category])}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Select
          value={filters.sort}
          onValueChange={(value) => onChange({ ...filters, sort: value })}
        >
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder={t("label.sort")} />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {t(option.labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        variant="outline"
        onClick={() =>
          onChange({ search: "", category: "All", sort: "trending" })
        }
      >
        {t("action.reset")}
      </Button>
    </div>
  );
}
