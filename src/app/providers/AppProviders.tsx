import { useEffect } from "react";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { ensureSeedData } from "../../services/storage/seed";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { useLocaleStore } from "../store/useLocaleStore";

type Props = {
  children: ReactNode;
};

export function AppProviders({ children }: Props) {
  const bootstrap = useAuthStore((state) => state.bootstrap);
  const hydrateTheme = useThemeStore((state) => state.hydrate);
  const hydrateLocale = useLocaleStore((state) => state.hydrate);

  useEffect(() => {
    ensureSeedData();
    hydrateTheme();
    hydrateLocale();
    bootstrap();
  }, [bootstrap, hydrateTheme, hydrateLocale]);

  return (
    <>
      {children}
      <Toaster position="top-right" richColors />
    </>
  );
}
