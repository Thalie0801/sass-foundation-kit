import { Loader2, ShieldQuestion } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "./AdminDashboard";
import ClientDashboard from "./ClientDashboard";
import Dashboard from "./Dashboard";

const RoleBasedDashboard = () => {
  const { loading, profile, isAdmin, isSuperAdmin, isClient } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (isSuperAdmin() || isAdmin()) {
    return <AdminDashboard />;
  }

  if (isClient()) {
    return <ClientDashboard />;
  }

  if (profile?.role) {
    return <Dashboard />;
  }

  return (
    <div className="flex items-center justify-center min-h-[50vh] p-6">
      <Card className="max-w-lg">
        <CardHeader className="flex flex-col items-center text-center space-y-3">
          <ShieldQuestion className="h-10 w-10 text-primary" />
          <CardTitle>Rôle utilisateur manquant</CardTitle>
          <CardDescription>
            Votre compte ne possède pas encore de rôle défini. Merci de contacter un administrateur pour finaliser votre accès.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground text-center">
          Une fois votre rôle attribué, vous serez automatiquement redirigé vers le tableau de bord adapté.
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleBasedDashboard;
