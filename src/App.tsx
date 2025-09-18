import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NewLandingPage from "./components/landing/NewLandingPage";
import AuthPage from "./components/auth/AuthPage";
import { AppLayout } from "./components/layout/AppLayout";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ClientDashboard from "./pages/app/ClientDashboard";
import AdminDashboard from "./pages/app/AdminDashboard";
import SubscriptionGate from "./pages/app/SubscriptionGate";

const queryClient = new QueryClient();

const RoleBasedDashboard = () => {
  const { profile } = useAuth();

  if (profile?.role === "admin" || profile?.role === "super_admin") {
    return <AdminDashboard />;
  }

  return <ClientDashboard />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<NewLandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <RoleBasedDashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/admin"
              element={
                <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
                  <AppLayout>
                    <AdminDashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/calendar"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Calendrier Éditorial</h1>
                      <p className="text-muted-foreground">Fonctionnalité en cours de développement...</p>
                    </div>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/brands"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Gestion des Marques</h1>
                      <p className="text-muted-foreground">Fonctionnalité en cours de développement...</p>
                    </div>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/team"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Équipe</h1>
                      <p className="text-muted-foreground">Fonctionnalité en cours de développement...</p>
                    </div>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/analytics"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Analytics & KPI</h1>
                      <p className="text-muted-foreground">Fonctionnalité en cours de développement...</p>
                    </div>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/integrations"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Intégrations</h1>
                      <p className="text-muted-foreground">Fonctionnalité en cours de développement...</p>
                    </div>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/projects"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Projets</h1>
                      <p className="text-muted-foreground">Fonctionnalité en cours de développement...</p>
                    </div>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/paywall"
              element={
                <ProtectedRoute allowWhenRestricted>
                  <AppLayout>
                    <SubscriptionGate />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/billing"
              element={
                <ProtectedRoute allowWhenRestricted>
                  <AppLayout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Abonnement & Facturation</h1>
                      <p className="text-muted-foreground">Fonctionnalité en cours de développement...</p>
                    </div>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/settings"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Paramètres</h1>
                      <p className="text-muted-foreground">Fonctionnalité en cours de développement...</p>
                    </div>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
