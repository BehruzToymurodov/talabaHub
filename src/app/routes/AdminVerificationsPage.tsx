import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { VerificationApplication } from "../../types";
import { verificationApi } from "../../services/api/verification";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { EmptyState } from "../../components/feedback/EmptyState";
import { useT } from "../../i18n";

export function AdminVerificationsPage() {
  const [pending, setPending] = useState<VerificationApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useT();

  const fetchPending = async () => {
    setLoading(true);
    try {
      const data = await verificationApi.listPending();
      setPending(data);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (applicationId: string) => {
    await verificationApi.approve(applicationId);
    toast.success(t("toast.approved"));
    fetchPending();
  };

  const handleReject = async (applicationId: string) => {
    await verificationApi.reject(applicationId, t("admin.rejectReason"));
    toast(t("toast.rejected"));
    fetchPending();
  };

  return (
    <div className="container space-y-6 py-10">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {t("admin.tag")}
        </p>
        <h1 className="text-2xl font-semibold">{t("admin.pendingTitle")}</h1>
      </div>
      {loading ? (
        <p className="text-sm text-muted-foreground">{t("label.loading")}</p>
      ) : pending.length === 0 ? (
        <EmptyState
          title={t("admin.pendingEmptyTitle")}
          description={t("admin.pendingEmptyDesc")}
        />
      ) : (
        <div className="grid gap-4">
          {pending.map((application) => (
            <Card key={application.id}>
              <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold">{application.user.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {application.universityEmail}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleReject(application.id)}>
                    {t("action.reject")}
                  </Button>
                  <Button onClick={() => handleApprove(application.id)}>
                    {t("action.approve")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
