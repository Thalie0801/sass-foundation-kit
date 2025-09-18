import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NewLandingPage from "./components/landing/NewLandingPage";
import AuthPage from "./components/auth/AuthPage";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/app/Dashboard";
import AdminDashboard from "./pages/app/AdminDashboard";
import ClientDashboard from "./pages/app/ClientDashboard";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NewLandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/app" element={
            <ProtectedRoute>
              <AppLayout>
                <ClientDashboard />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/app/admin" element={
            <ProtectedRoute requireRole="super_admin">
              <AppLayout>
                <AdminDashboard />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/app/dashboard" element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/app/calendar" element={
            <AppLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold">Calendrier Éditorial</h1>
                <p className="text-muted-foreground">Fonctionnalité en cours de développement...</p>
              </div>
            </AppLayout>
          } />
          <Route path="/app/brands" element={
            <AppLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold">Gestion des Marques</h1>
                <p className="text-muted-foreground">Fonctionnalité en cours de développement...</p>
              </div>
            </AppLayout>
          } />
          <Route path="/app/team" element={
            <AppLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold">Équipe</h1>
                <p className="text-muted-foreground">Fonctionnalité en cours de développement...</p>
              </div>
            </AppLayout>
          } />
          <Route path="/app/analytics" element={
            <AppLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold">Analytics & KPI</h1>
                <p className="text-muted-foreground">Fonctionnalité en cours de développement...</p>
              </div>
            </AppLayout>
          } />
          <Route path="/app/integrations" element={
            <AppLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold">Intégrations</h1>
                <p className="text-muted-foreground">Fonctionnalité en cours de développement...</p>
              </div>
            </AppLayout>
          } />
          <Route path="/app/projects" element={
            <AppLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold">Projets</h1>
                <p className="text-muted-foreground">Fonctionnalité en cours de développement...</p>
              </div>
            </AppLayout>
          } />
          <Route path="/app/billing" element={
            <AppLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold">Abonnement & Facturation</h1>
                <p className="text-muted-foreground">Fonctionnalité en cours de développement...</p>
              </div>
            </AppLayout>
          } />
          <Route path="/app/settings" element={
            <AppLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold">Paramètres</h1>
                <p className="text-muted-foreground">Fonctionnalité en cours de développement...</p>
              </div>
            </AppLayout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
