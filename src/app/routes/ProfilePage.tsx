import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { ThemeToggle } from "../../components/navigation/ThemeToggle";
import { useAuthStore } from "../store/useAuthStore";
import { useT } from "../../i18n";
import { LanguageSelect } from "../../components/navigation/LanguageSelect";
import { getUserInitials } from "../../utils/user";

export function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);
  const navigate = useNavigate();
  const t = useT();

  if (!user) return null;

  const [firstName, setFirstName] = useState(user.firstName ?? "");
  const [lastName, setLastName] = useState(user.lastName ?? "");
  const [username, setUsername] = useState(user.username ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? "");
  const initials = getUserInitials({ ...user, firstName, lastName, username });

  useEffect(() => {
    setFirstName(user.firstName ?? "");
    setLastName(user.lastName ?? "");
    setUsername(user.username ?? "");
    setAvatarUrl(user.avatarUrl ?? "");
  }, [user]);

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(t("toast.invalidImage"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(String(reader.result ?? ""));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim() || !username.trim()) {
      toast.error(t("toast.completeFields"));
      return;
    }
    try {
      await updateUser({
        ...user,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
        avatarUrl,
      });
      toast.success(t("toast.profileUpdated"));
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="container py-10">
      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <CardTitle>{t("label.account")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Label
                htmlFor="avatarUpload"
                className="relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-muted text-lg font-semibold"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={t("label.avatar")} className="h-full w-full object-cover" />
                ) : (
                  initials
                )}
              </Label>
              <div className="min-w-0">
                <p className="text-lg font-semibold">
                  {[firstName, lastName].filter(Boolean).join(" ") || user.username || user.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {user.universityName ?? t("label.university")}
                </p>
              </div>
              <Input
                id="avatarUpload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
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
            <div className="space-y-2">
              <Label htmlFor="username">{t("label.username")}</Label>
              <Input
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
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
            <Button onClick={handleSave} size="lg">
              {t("action.save")}
            </Button>
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
