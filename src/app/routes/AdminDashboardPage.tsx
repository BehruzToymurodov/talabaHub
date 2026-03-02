import { useEffect, useState } from "react";
import { toast } from "sonner";
import { dealsApi } from "../../services/api/deals";
import { usersApi } from "../../services/api/users";
import { verificationApi } from "../../services/api/verification";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useT } from "../../i18n";

export function AdminDashboardPage() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [verifiedUsers, setVerifiedUsers] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [dealCount, setDealCount] = useState(0);
  const t = useT();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [usersResponse, pendingApplications, deals] = await Promise.all([
          usersApi.list(),
          verificationApi.listPending(),
          dealsApi.listAdmin(),
        ]);

        setTotalUsers(usersResponse.total);
        setVerifiedUsers(
          usersResponse.users.filter((user) => user.studentStatusVerified).length
        );
        setPendingCount(pendingApplications.length);
        setDealCount(deals.length);
      } catch (error) {
        toast.error((error as Error).message);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="container space-y-8 py-10">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {t("admin.tag")}
        </p>
        <h1 className="text-2xl font-semibold">{t("admin.overview")}</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.totalUsers")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.verifiedStudents")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{verifiedUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.pending")}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <div className="text-3xl font-semibold">{pendingCount}</div>
            {pendingCount > 0 && <Badge variant="warning">{t("admin.review")}</Badge>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.dealsLive")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{dealCount}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
