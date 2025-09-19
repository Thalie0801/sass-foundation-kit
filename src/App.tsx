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

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<NewLandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route element={<RequireAuth />}>
          <Route path="/app" element={<PlatformLayout />}>
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
