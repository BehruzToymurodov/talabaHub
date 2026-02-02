import { useEffect } from "react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../store/useAuthStore";
import { PageLoader } from "../../components/feedback/PageLoader";
import { useT } from "../../i18n";

type Props = {
  children: ReactNode;
};

export function RequireAuth({ children }: Props) {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const location = useLocation();
  const t = useT();

  useEffect(() => {
    if (!loading && !user) {
      toast(t("toast.loginRequired"));
    }
  }, [loading, user, t]);

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/auth" state={{ from: location }} replace />;
  return <>{children}</>;
}

export function RequireAdmin({ children }: Props) {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const t = useT();

  useEffect(() => {
    if (!loading && user && user.role !== "admin") {
      toast.error(t("toast.adminOnly"));
    }
  }, [loading, user, t]);

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role !== "admin") return <Navigate to="/app" replace />;
  return <>{children}</>;
}

export function RequireVerified({ children }: Props) {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const t = useT();

  useEffect(() => {
    if (!loading && user && user.role !== "student_verified") {
      toast(t("toast.verifyToUnlock"));
    }
  }, [loading, user, t]);

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role !== "student_verified") return <Navigate to="/app/verify" replace />;
  return <>{children}</>;
}
