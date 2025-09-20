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
            <Route path="plan" element={<div>Plan éditorial</div>} />
            <Route path="calendar" element={<div>Calendrier</div>} />
            <Route path="contents" element={<div>Contenus</div>} />
            <Route path="tasks" element={<div>Tâches</div>} />
            <Route path="analytics" element={<div>Analytics</div>} />
            <Route path="fynk" element={<div>Fynk</div>} />
            <Route path="billing" element={<div>Facturation</div>} />
            <Route path="settings" element={<div>Paramètres</div>} />
            <Route path="help" element={<div>Aide</div>} />
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
