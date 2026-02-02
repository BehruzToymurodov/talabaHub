import { useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "../store/useAuthStore";
import { verificationApi } from "../../services/api/verification";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { useT } from "../../i18n";

const universities = [
  "Tashkent University of Information Technologies",
  "National University of Uzbekistan",
  "Westminster International University",
  "Tashkent State University of Economics",
  "Other",
];

export function VerifyPage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const t = useT();

  const [studentEmail, setStudentEmail] = useState(user?.email ?? "");
  const [universityName, setUniversityName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [proofFilename, setProofFilename] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const updated = await verificationApi.submit(user.id, {
        studentEmail,
        universityName,
        studentId,
        proofFilename,
      });
      setUser(updated);
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
              value={studentEmail}
              onChange={(event) => setStudentEmail(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("label.university")}</Label>
            <Select value={universityName} onValueChange={setUniversityName}>
              <SelectTrigger>
                <SelectValue placeholder={t("label.university")} />
              </SelectTrigger>
              <SelectContent>
                {universities.map((uni) => (
                  <SelectItem key={uni} value={uni}>
                    {uni}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="studentId">{t("label.studentId")}</Label>
            <Input
              id="studentId"
              value={studentId}
              onChange={(event) => setStudentId(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="proof">{t("label.proof")}</Label>
            <Input
              id="proof"
              value={proofFilename}
              onChange={(event) => setProofFilename(event.target.value)}
              placeholder={t("verify.placeholderProof")}
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
