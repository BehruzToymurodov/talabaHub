import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "../store/useAuthStore";
import { verificationApi } from "../../services/api/verification";
import { universitiesApi, type University } from "../../services/api/universities";
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
  const [universityOpen, setUniversityOpen] = useState(false);
  const [universityQuery, setUniversityQuery] = useState(user?.universityName ?? "");
  const [universityOptions, setUniversityOptions] = useState<University[]>([]);
  const [universityPage, setUniversityPage] = useState(0);
  const [universityHasMore, setUniversityHasMore] = useState(true);
  const [universityLoading, setUniversityLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(universityQuery);
  const universityRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(universityQuery.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [universityQuery]);

  useEffect(() => {
    setUniversityPage(0);
  }, [debouncedQuery]);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      setUniversityLoading(true);
      try {
        const response = await universitiesApi.list({
          search: debouncedQuery,
          page: universityPage,
          size: universitiesApi.pageSize,
        });
        if (!isActive) return;
        setUniversityOptions((prev) =>
          universityPage === 0 ? response.content : [...prev, ...response.content]
        );
        const hasMoreByPage =
          typeof response.totalPages === "number"
            ? universityPage + 1 < response.totalPages
            : response.content.length >= universitiesApi.pageSize;
        setUniversityHasMore(hasMoreByPage);
      } catch (error) {
        if (!isActive) return;
        toast.error((error as Error).message);
        setUniversityHasMore(false);
      } finally {
        if (isActive) setUniversityLoading(false);
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, [debouncedQuery, universityPage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!universityRef.current) return;
      if (!universityRef.current.contains(event.target as Node)) {
        setUniversityOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const normalizedQuery = universityQuery.trim().toLowerCase();
  const filteredUniversities = useMemo(() => {
    if (!normalizedQuery) return universityOptions;
    return universityOptions.filter((university) =>
      university.name.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery, universityOptions]);

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
        attachments,
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
            <div className="space-y-2" ref={universityRef}>
              <Label htmlFor="universityName">{t("label.university")}</Label>
              <div className="relative">
                <Input
                  id="universityName"
                  value={universityQuery}
                  onChange={(event) => {
                    const value = event.target.value;
                    setUniversityQuery(value);
                    setUniversityName(value);
                  }}
                  onFocus={() => setUniversityOpen(true)}
                  placeholder={t("verify.universityPlaceholder")}
                  autoComplete="off"
                />
                {universityOpen && (
                  <div className="absolute z-20 mt-2 w-full rounded-2xl border border-border bg-background shadow-lg">
                    <div className="max-h-64 overflow-y-auto py-2">
                      {universityLoading && universityOptions.length === 0 && (
                        <p className="px-4 py-2 text-xs text-muted-foreground">
                          {t("label.loading")}
                        </p>
                      )}
                      {!universityLoading && filteredUniversities.length === 0 && (
                        <p className="px-4 py-2 text-xs text-muted-foreground">
                          {t("verify.universityEmpty")}
                        </p>
                      )}
                      {filteredUniversities.map((university) => (
                        <button
                          key={university.id}
                          type="button"
                          className="flex w-full items-center justify-between px-4 py-2 text-left text-sm transition hover:bg-muted/70"
                          onClick={() => {
                            setUniversityName(university.name);
                            setUniversityQuery(university.name);
                            setUniversityOpen(false);
                          }}
                        >
                          <span>{university.name}</span>
                        </button>
                      ))}
                    </div>
                    {universityHasMore && (
                      <div className="border-t border-border px-3 py-2">
                        <button
                          type="button"
                          className="text-xs font-semibold text-primary"
                          onClick={() => setUniversityPage((prev) => prev + 1)}
                          disabled={universityLoading}
                        >
                          {universityLoading
                            ? t("label.loading")
                            : t("verify.universityLoadMore")}
                        </button>
                      </div>
                    )}
                    <p className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
                      {t("verify.universityHint")}
                    </p>
                  </div>
                )}
              </div>
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
