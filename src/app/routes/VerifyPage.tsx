import { useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "../store/useAuthStore";
import { verificationApi } from "../../services/api/verification";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useT } from "../../i18n";

export function VerifyPage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const t = useT();

  const [universityEmail, setUniversityEmail] = useState(user?.email ?? "");
  const [middleName, setMiddleName] = useState("");
  const [studyStartDate, setStudyStartDate] = useState("");
  const [studyEndDate, setStudyEndDate] = useState("");
  const [attachmentsInput, setAttachmentsInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;
    if (!universityEmail || !studyStartDate || !studyEndDate) {
      toast.error(t("toast.completeFields"));
      return;
    }
    setLoading(true);
    try {
      const verification = await verificationApi.submit({
        first_name: user.firstName ?? "",
        last_name: user.lastName ?? "",
        middle_name: middleName.trim() || undefined,
        university_email: universityEmail,
        study_start_date: studyStartDate,
        study_end_date: studyEndDate,
        attachments: attachmentsInput
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      });
      setUser({
        ...user,
        verificationStatus: verification.status,
        verification,
      });
      toast.success(t("toast.verificationSubmitted"));
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{t("verify.title")}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {t("verify.subtitle")}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {user?.verificationStatus === "pending" && (
            <div className="rounded-2xl border border-border bg-muted/40 p-4 text-sm">
              {t("verify.pending")}
            </div>
          )}
          {user?.verificationStatus === "verified" && (
            <div className="rounded-2xl border border-border bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-200">
              {t("verify.verified")}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="studentEmail">{t("label.studentEmail")}</Label>
            <Input
              id="studentEmail"
              value={universityEmail}
              onChange={(event) => setUniversityEmail(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="middleName">{t("label.middleName")}</Label>
            <Input
              id="middleName"
              value={middleName}
              onChange={(event) => setMiddleName(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="studyStartDate">{t("label.studyStartDate")}</Label>
            <Input
              id="studyStartDate"
              type="date"
              value={studyStartDate}
              onChange={(event) => setStudyStartDate(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="studyEndDate">{t("label.studyEndDate")}</Label>
            <Input
              id="studyEndDate"
              type="date"
              value={studyEndDate}
              onChange={(event) => setStudyEndDate(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="attachments">{t("label.attachments")}</Label>
            <Input
              id="attachments"
              value={attachmentsInput}
              onChange={(event) => setAttachmentsInput(event.target.value)}
              placeholder="https://storage.com/id_front.jpg, https://storage.com/id_back.jpg"
            />
          </div>
          <Button onClick={handleSubmit} disabled={loading} size="lg">
            {loading ? t("action.submitting") : t("action.submitVerification")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
