import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useAuthStore } from "../store/useAuthStore";
import { useT } from "../../i18n";
import { universities } from "../../data/universities";

export function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const user = useAuthStore((state) => state.user);
  const t = useT();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerUniversity, setRegisterUniversity] = useState("");
  const [registerAge, setRegisterAge] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  useEffect(() => {
    if (!user) return;
    navigate(user.role === "admin" ? "/admin" : "/app", { replace: true });
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      await login(loginEmail, loginPassword);
      toast.success(t("toast.welcomeBack"));
      const redirect = (location.state as { from?: { pathname?: string } } | null)
        ?.from?.pathname;
      const loggedIn = useAuthStore.getState().user;
      const fallback = loggedIn?.role === "admin" ? "/admin" : "/app";
      const target = redirect ?? fallback;
      navigate(target, { replace: true });
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleRegister = async () => {
    try {
      const ageValue = Number(registerAge);
      if (
        !registerFirstName.trim() ||
        !registerLastName.trim() ||
        !registerEmail.trim() ||
        !registerPassword ||
        !registerUniversity ||
        !Number.isFinite(ageValue) ||
        ageValue <= 0
      ) {
        toast.error(t("toast.completeFields"));
        return;
      }
      await register({
        email: registerEmail.trim(),
        password: registerPassword,
        firstName: registerFirstName.trim(),
        lastName: registerLastName.trim(),
        age: ageValue,
        universityName: registerUniversity,
      });
      toast.success(t("toast.accountCreated"));
      toast.success(t("toast.otpSent", { email: registerEmail.trim() }));
      navigate("/app", { replace: true });
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">{t("auth.title")}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {t("auth.subtitle")}
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{t("auth.login")}</TabsTrigger>
              <TabsTrigger value="register">{t("auth.register")}</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loginEmail">{t("label.email")}</Label>
                <Input
                  id="loginEmail"
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  placeholder="you@student.uz"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loginPassword">{t("label.password")}</Label>
                <Input
                  id="loginPassword"
                  type="password"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? t("auth.signingIn") : t("auth.login")}
              </Button>
            </TabsContent>
            <TabsContent value="register" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="registerFirstName">{t("label.firstName")}</Label>
                <Input
                  id="registerFirstName"
                  value={registerFirstName}
                  onChange={(event) => setRegisterFirstName(event.target.value)}
                  placeholder={t("label.firstName")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registerLastName">{t("label.lastName")}</Label>
                <Input
                  id="registerLastName"
                  value={registerLastName}
                  onChange={(event) => setRegisterLastName(event.target.value)}
                  placeholder={t("label.lastName")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registerEmail">{t("label.studentEmail")}</Label>
                <Input
                  id="registerEmail"
                  value={registerEmail}
                  onChange={(event) => setRegisterEmail(event.target.value)}
                  placeholder="you@uni.uz"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("label.university")}</Label>
                <Select value={registerUniversity} onValueChange={setRegisterUniversity}>
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
                <Label htmlFor="registerAge">{t("label.age")}</Label>
                <Input
                  id="registerAge"
                  type="number"
                  min={0}
                  value={registerAge}
                  onChange={(event) => setRegisterAge(event.target.value)}
                  placeholder="18"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registerPassword">{t("label.password")}</Label>
                <Input
                  id="registerPassword"
                  type="password"
                  value={registerPassword}
                  onChange={(event) => setRegisterPassword(event.target.value)}
                  placeholder={t("auth.passwordHint")}
                />
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? t("auth.creating") : t("auth.register")}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
