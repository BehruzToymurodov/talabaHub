import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PublicLayout } from "./app/layouts/PublicLayout";
import { AppLayout } from "./app/layouts/AppLayout";
import { AdminLayout } from "./app/layouts/AdminLayout";
import { HomePage } from "./app/routes/HomePage";
import { ExplorePage } from "./app/routes/ExplorePage";
import { DealDetailPage } from "./app/routes/DealDetailPage";
import { AuthPage } from "./app/routes/AuthPage";
import { DashboardPage } from "./app/routes/DashboardPage";
import { VerifyPage } from "./app/routes/VerifyPage";
import { StudentDealsPage } from "./app/routes/StudentDealsPage";
import { SavedDealsPage } from "./app/routes/SavedDealsPage";
import { ProfilePage } from "./app/routes/ProfilePage";
import { AppDealDetailPage } from "./app/routes/AppDealDetailPage";
import { AdminDashboardPage } from "./app/routes/AdminDashboardPage";
import { AdminVerificationsPage } from "./app/routes/AdminVerificationsPage";
import { AdminDealsPage } from "./app/routes/AdminDealsPage";
import { NotFoundPage } from "./app/routes/NotFoundPage";
import { RequireAdmin, RequireAuth } from "./app/routes/guards";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="deals" element={<ExplorePage />} />
          <Route path="deal/:id" element={<DealDetailPage />} />
          <Route path="auth" element={<AuthPage />} />
        </Route>

        <Route
          path="/app"
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="verify" element={<VerifyPage />} />
          <Route path="deals" element={<StudentDealsPage />} />
          <Route path="saved" element={<SavedDealsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="deal/:id" element={<AppDealDetailPage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="verifications" element={<AdminVerificationsPage />} />
          <Route path="deals" element={<AdminDealsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
