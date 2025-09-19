import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import NewLandingPage from "./components/landing/NewLandingPage";
import PlatformLayout from "./components/platform/PlatformLayout";
import ClientExperience from "./components/platform/ClientExperience";
import AdminConsole from "./components/platform/AdminConsole";
import SandboxExperience from "./components/platform/SandboxExperience";
import RoadmapFeedback from "./components/platform/RoadmapFeedback";
import NotFound from "./components/platform/NotFound";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<NewLandingPage />} />
      <Route path="/app" element={<PlatformLayout />}>
        <Route index element={<Navigate to="client" replace />} />
        <Route path="client" element={<ClientExperience />} />
        <Route path="admin" element={<AdminConsole />} />
        <Route path="sandbox" element={<SandboxExperience />} />
        <Route path="roadmap" element={<RoadmapFeedback />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
