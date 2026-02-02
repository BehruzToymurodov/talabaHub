import { Outlet } from "react-router-dom";
import { AdminTopNav } from "../../components/navigation/AdminTopNav";

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      <AdminTopNav />
      <main className="pb-16">
        <Outlet />
      </main>
    </div>
  );
}
