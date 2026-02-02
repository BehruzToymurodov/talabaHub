import { Outlet } from "react-router-dom";
import { AppTopNav } from "../../components/navigation/AppTopNav";
import { MobileBottomNav } from "../../components/navigation/MobileBottomNav";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <AppTopNav />
      <main className="pb-24">
        <Outlet />
      </main>
      <MobileBottomNav />
    </div>
  );
}
