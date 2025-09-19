import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const LandingPage = lazy(() => import("@/components/landing/NewLandingPage"));
const Login = lazy(() => import("@/pages/auth/Login"));
const ClientLayout = lazy(() => import("@/layouts/ClientLayout"));
const AdminLayout = lazy(() => import("@/layouts/AdminLayout"));
const ClientOverview = lazy(() => import("@/pages/app/Overview"));
const ClientRoadmap = lazy(() => import("@/pages/app/Roadmap"));
const ClientTasks = lazy(() => import("@/pages/app/Tasks"));
const ClientFiles = lazy(() => import("@/pages/app/Files"));
const ClientDiscussions = lazy(() => import("@/pages/app/Discussions"));
const ClientSettings = lazy(() => import("@/pages/app/Settings"));
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminClients = lazy(() => import("@/pages/admin/Clients"));
const AdminRoadmaps = lazy(() => import("@/pages/admin/Roadmaps"));
const AdminBilling = lazy(() => import("@/pages/admin/Billing"));
const AdminIntegrations = lazy(() => import("@/pages/admin/Integrations"));
const AdminSettings = lazy(() => import("@/pages/admin/Settings"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const Fallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-gradient-subtle">
    <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      Chargement de l'expérience Æditus…
    </div>
  </div>
);

const App = () => (
  <BrowserRouter>
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/app"
          element={
            <ProtectedRoute role="client">
              <ClientLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ClientOverview />} />
          <Route path="roadmap" element={<ClientRoadmap />} />
          <Route path="tasks" element={<ClientTasks />} />
          <Route path="files" element={<ClientFiles />} />
          <Route path="discussions" element={<ClientDiscussions />} />
          <Route path="settings" element={<ClientSettings />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path="roadmaps" element={<AdminRoadmaps />} />
          <Route path="billing" element={<AdminBilling />} />
          <Route path="integrations" element={<AdminIntegrations />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="/app/*" element={<Navigate to="/app" replace />} />
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;
