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

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [studentIdNumber, setStudentIdNumber] = useState("");
  const [universityName, setUniversityName] = useState(user?.universityName ?? "");
  const [universityEmail, setUniversityEmail] = useState(user?.email ?? "");
  const [middleName, setMiddleName] = useState("");
  const [studyStartDate, setStudyStartDate] = useState("");
  const [studyEndDate, setStudyEndDate] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;
    if (
      !firstName ||
      !lastName ||
      !studentIdNumber ||
      !universityName ||
      !universityEmail ||
      !studyStartDate ||
      !studyEndDate
    ) {
      toast.error(t("toast.completeFields"));
      return;
    }
    setLoading(true);
    try {
      const verification = await verificationApi.submit({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        middle_name: middleName.trim() || undefined,
        student_id_number: studentIdNumber.trim(),
        university_name: universityName.trim(),
        university_email: universityEmail,
        study_start_date: studyStartDate,
        study_end_date: studyEndDate,
        attachments: attachments.map((file) => file.name),
      });
      setUser({
        ...user,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        universityName: universityName.trim(),
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t("label.firstName")}</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t("label.lastName")}</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="studentIdNumber">{t("label.studentId")}</Label>
              <Input
                id="studentIdNumber"
                value={studentIdNumber}
                onChange={(event) => setStudentIdNumber(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="universityName">{t("label.university")}</Label>
              <Input
                id="universityName"
                value={universityName}
                onChange={(event) => setUniversityName(event.target.value)}
              />
            </div>
          </div>
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
              type="file"
              multiple
              onChange={(event) =>
                setAttachments(event.target.files ? Array.from(event.target.files) : [])
              }
            />
            {attachments.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {attachments.map((file) => file.name).join(", ")}
              </p>
            )}
          </div>
          <Button onClick={handleSubmit} disabled={loading} size="lg">
            {loading ? t("action.submitting") : t("action.submitVerification")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
