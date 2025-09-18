import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, AlertTriangle } from "lucide-react";

type UserRole = "admin" | "client" | "super_admin";

interface ProtectedRouteProps {
  children: ReactNode;
  requireRole?: UserRole;
  allowedRoles?: UserRole[];
  requireSubscription?: boolean;
  allowWhenRestricted?: boolean;
}

export const ProtectedRoute = ({
  children,
  requireRole,
  allowedRoles,
  requireSubscription = false,
  allowWhenRestricted = false,
}: ProtectedRouteProps) => {
  const { user, profile, loading, hasActiveSubscription, isInTrial, isRestricted } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Vérification des accès...</div>
      </div>
    );
  }

  if (!user) {
    window.location.href = "/auth";
    return null;
  }

  const role = profile?.role;

  if (allowedRoles && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="max-w-md">
            <CardContent className="p-6 text-center space-y-4">
              <Shield className="h-12 w-12 text-red-500 mx-auto" />
              <h2 className="text-xl font-semibold">Accès Refusé</h2>
              <p className="text-muted-foreground">
                Vous n'avez pas les permissions nécessaires pour accéder à cette page.
              </p>
              <p className="text-sm text-muted-foreground">
                Rôles autorisés: {allowedRoles.join(", ")} • Votre rôle: {role || "non défini"}
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  if (requireRole && role !== requireRole) {
    if (!(requireRole === "client" && (role === "admin" || role === "super_admin"))) {
      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="max-w-md">
            <CardContent className="p-6 text-center space-y-4">
              <Shield className="h-12 w-12 text-red-500 mx-auto" />
              <h2 className="text-xl font-semibold">Accès Refusé</h2>
              <p className="text-muted-foreground">
                Vous n'avez pas les permissions nécessaires pour accéder à cette page.
              </p>
              <p className="text-sm text-muted-foreground">
                Rôle requis: {requireRole} • Votre rôle: {role || "non défini"}
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  const restricted = isRestricted();

  if (restricted && !allowWhenRestricted) {
    if (requireSubscription || !hasActiveSubscription()) {
      if (!isInTrial()) {
        if (requireSubscription) {
          return (
            <div className="flex items-center justify-center min-h-screen p-4">
              <Card className="max-w-md">
                <CardContent className="p-6 text-center space-y-4">
                  <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto" />
                  <h2 className="text-xl font-semibold">Abonnement Requis</h2>
                  <p className="text-muted-foreground">
                    Cette fonctionnalité nécessite un abonnement actif.
                  </p>
                  <button
                    onClick={() => {
                      window.location.href = "/app/paywall";
                    }}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                  >
                    Mettre à niveau mon abonnement
                  </button>
                </CardContent>
              </Card>
            </div>
          );
        }

        if (window.location.pathname !== "/app/paywall") {
          window.location.href = "/app/paywall";
        }

        return null;
      }
    }
  }

  return <>{children}</>;
};
