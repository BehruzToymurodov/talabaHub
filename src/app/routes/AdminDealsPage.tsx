import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import type { Deal } from "../../types";
import { dealsApi } from "../../services/api/deals";
import { dealCategories, categoryLabelKeys } from "../../features/deals/constants";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { EmptyState } from "../../components/feedback/EmptyState";
import { useT } from "../../i18n";

const emptyDeal: Deal = {
  id: "",
  brand: "",
  category: "Food & Drink",
  title: "",
  description: "",
  terms: "",
  code: "",
  expiresAt: "",
  verifiedOnly: false,
  featured: false,
  createdAt: "",
  redemptionUrl: "",
  image: "",
  bannerImage: "",
};

export function AdminDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Deal>(emptyDeal);
  const isEditing = deals.some((deal) => deal.id === draft.id);
  const t = useT();

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const data = await dealsApi.list();
      setDeals(data);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const startCreate = () => {
    setDraft({ ...emptyDeal, id: `deal_${Math.random().toString(36).slice(2)}`, createdAt: new Date().toISOString() });
    setOpen(true);
  };

  const startEdit = (deal: Deal) => {
    setDraft(deal);
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      const exists = deals.some((deal) => deal.id === draft.id);
      if (exists) {
        await dealsApi.update(draft);
        toast.success(t("toast.dealUpdated"));
      } else {
        await dealsApi.create(draft);
        toast.success(t("toast.dealCreated"));
      }
      setOpen(false);
      fetchDeals();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleDelete = async (dealId: string) => {
    await dealsApi.remove(dealId);
    toast(t("toast.dealDeleted"));
    fetchDeals();
  };

  const sortedDeals = useMemo(() => {
    return [...deals].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [deals]);

  return (
    <div className="container space-y-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {t("admin.tag")}
          </p>
          <h1 className="text-2xl font-semibold">{t("admin.manageDeals")}</h1>
        </div>
        <Button onClick={startCreate} className="gap-2">
          <Plus className="h-4 w-4" /> {t("admin.newDeal")}
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">{t("label.loading")}</p>
      ) : sortedDeals.length === 0 ? (
        <EmptyState
          title={t("admin.noDealsTitle")}
          description={t("admin.noDealsDesc")}
          actionLabel={t("admin.newDeal")}
          onAction={startCreate}
        />
      ) : (
        <div className="grid gap-4">
          {sortedDeals.map((deal) => (
            <Card key={deal.id}>
              <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold">{deal.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {deal.brand} · {t(categoryLabelKeys[deal.category])} ·{" "}
                    {t("label.expiresAt", { date: deal.expiresAt })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => startEdit(deal)}>
                    {t("action.edit")}
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(deal.id)}>
                    {t("action.delete")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? t("admin.editDeal") : t("admin.newDeal")}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("label.brand")}</Label>
              <Input
                value={draft.brand}
                onChange={(event) => setDraft({ ...draft, brand: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("label.category")}</Label>
              <Select
                value={draft.category}
                onValueChange={(value) =>
                  setDraft({ ...draft, category: value as Deal["category"] })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("label.category")} />
                </SelectTrigger>
                <SelectContent>
                  {dealCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {t(categoryLabelKeys[category])}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>{t("label.title")}</Label>
              <Input
                value={draft.title}
                onChange={(event) => setDraft({ ...draft, title: event.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>{t("label.description")}</Label>
              <Input
                value={draft.description}
                onChange={(event) =>
                  setDraft({ ...draft, description: event.target.value })
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>{t("label.terms")}</Label>
              <Input
                value={draft.terms}
                onChange={(event) => setDraft({ ...draft, terms: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("label.code")}</Label>
              <Input
                value={draft.code}
                onChange={(event) => setDraft({ ...draft, code: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("label.expiry")}</Label>
              <Input
                value={draft.expiresAt}
                onChange={(event) =>
                  setDraft({ ...draft, expiresAt: event.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>{t("label.featured")}</Label>
              <Select
                value={draft.featured ? "yes" : "no"}
                onValueChange={(value) =>
                  setDraft({ ...draft, featured: value === "yes" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">{t("label.yes")}</SelectItem>
                  <SelectItem value="no">{t("label.no")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("label.verifiedOnly")}</Label>
              <Select
                value={draft.verifiedOnly ? "yes" : "no"}
                onValueChange={(value) =>
                  setDraft({ ...draft, verifiedOnly: value === "yes" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">{t("label.yes")}</SelectItem>
                  <SelectItem value="no">{t("label.no")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("label.redemptionUrl")}</Label>
              <Input
                value={draft.redemptionUrl ?? ""}
                onChange={(event) =>
                  setDraft({ ...draft, redemptionUrl: event.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>{t("label.logo")}</Label>
              <Input
                value={draft.image ?? ""}
                onChange={(event) => setDraft({ ...draft, image: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("label.bannerImage")}</Label>
              <Input
                value={draft.bannerImage ?? ""}
                onChange={(event) =>
                  setDraft({ ...draft, bannerImage: event.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t("action.cancel")}
            </Button>
            <Button onClick={handleSave}>{t("action.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
