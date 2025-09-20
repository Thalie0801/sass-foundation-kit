import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import NewLandingPage from "./components/landing/NewLandingPage";
import PlatformLayout from "./components/platform/PlatformLayout";
import ClientExperience from "./components/platform/ClientExperience";
import AdminConsole from "./components/platform/AdminConsole";
import SandboxExperience from "./components/platform/SandboxExperience";
import RoadmapFeedback from "./components/platform/RoadmapFeedback";
import NotFound from "./components/platform/NotFound";
import { AuthProvider } from "./components/auth/AuthProvider";
import RequireAuth from "./components/auth/RequireAuth";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import AppLayout from "./components/app/AppLayout";
import HomePage from "./components/app/HomePage";
import PlanPage from "./components/app/PlanPage";
import CalendarPage from "./components/app/CalendarPage";
import ContentsListPage from "./components/app/ContentsListPage";
import ContentDetailPage from "./components/app/ContentDetailPage";
import ContentCreatePage from "./components/app/ContentCreatePage";
import ContentImportPage from "./components/app/ContentImportPage";
import TasksPage from "./components/app/TasksPage";
import TaskCreatePage from "./components/app/TaskCreatePage";
import AnalyticsPage from "./components/app/AnalyticsPage";
import FynkPage from "./components/app/FynkPage";
import BillingPage from "./components/app/BillingPage";
import SettingsPage from "./components/app/SettingsPage";
import HelpPage from "./components/app/HelpPage";

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<NewLandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route element={<RequireAuth />}>
          {/* New app structure */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="plan" element={<PlanPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="contents" element={<ContentsListPage />} />
            <Route path="contents/new" element={<ContentCreatePage />} />
            <Route path="contents/import" element={<ContentImportPage />} />
            <Route path="contents/:id" element={<ContentDetailPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="tasks/new" element={<TaskCreatePage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="fynk" element={<FynkPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="help" element={<HelpPage />} />
          </Route>
          {/* Legacy platform routes */}
          <Route path="/platform" element={<PlatformLayout />}>
            <Route index element={<Navigate to="client" replace />} />
            <Route path="client" element={<ClientExperience />} />
            <Route path="admin" element={<AdminConsole />} />
            <Route path="sandbox" element={<SandboxExperience />} />
            <Route path="roadmap" element={<RoadmapFeedback />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
