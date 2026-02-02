import { useEffect, useState } from "react";
import type { Deal, User } from "../../types";
import { readStorage } from "../../services/storage/storage";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useT } from "../../i18n";

export function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const t = useT();

  useEffect(() => {
    setUsers(readStorage<User[]>("users", []));
    setDeals(readStorage<Deal[]>("deals", []));
  }, []);

  const pending = users.filter((user) => user.verificationStatus === "pending");
  const verified = users.filter((user) => user.role === "student_verified");

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
            <div className="text-3xl font-semibold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.verifiedStudents")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{verified.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.pending")}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <div className="text-3xl font-semibold">{pending.length}</div>
            {pending.length > 0 && <Badge variant="warning">{t("admin.review")}</Badge>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.dealsLive")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{deals.length}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
