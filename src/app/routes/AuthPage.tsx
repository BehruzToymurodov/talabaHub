import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { useAuthStore } from "../store/useAuthStore";
import { useT } from "../../i18n";

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
  const [registerEmail, setRegisterEmail] = useState("");
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
      await register(registerEmail, registerPassword);
      toast.success(t("toast.accountCreated"));
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
                <Label htmlFor="registerEmail">{t("label.email")}</Label>
                <Input
                  id="registerEmail"
                  value={registerEmail}
                  onChange={(event) => setRegisterEmail(event.target.value)}
                  placeholder="you@uni.uz"
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
