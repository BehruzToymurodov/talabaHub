import { useNavigate } from "react-router-dom";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { ThemeToggle } from "../../components/navigation/ThemeToggle";
import { useAuthStore } from "../store/useAuthStore";
import { useT } from "../../i18n";
import { LanguageSelect } from "../../components/navigation/LanguageSelect";

export function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const t = useT();

  if (!user) return null;

  return (
    <div className="container py-10">
      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <CardTitle>{t("label.account")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {t("label.email")}
              </p>
              <p className="text-sm font-semibold">{user.email}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {t("label.status")}
              </p>
              <Badge variant={user.role === "student_verified" ? "success" : "secondary"}>
                {user.role === "student_verified"
                  ? t("status.verified")
                  : t("status.unverified")}
              </Badge>
            </div>
            <Button
              variant="outline"
              onClick={async () => {
                await logout();
                navigate("/");
              }}
            >
              {t("profile.logout")}
            </Button>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("label.theme")}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{t("label.appearance")}</p>
                <p className="text-xs text-muted-foreground">
                  {t("profile.appearance")}
                </p>
              </div>
              <ThemeToggle />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("label.language")}</CardTitle>
            </CardHeader>
            <CardContent>
              <LanguageSelect />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
