import { Outlet } from "react-router-dom";
import { PublicNav } from "../../components/navigation/PublicNav";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main className="pb-16">
        <Outlet />
      </main>
    </div>
  );
}
