import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth, UserRole } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  allowWhenRestricted?: boolean;
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
  allowWhenRestricted = false,
}: ProtectedRouteProps) => {
  const { user, profile, loading, subscription } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  if (allowedRoles && profile?.role && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/app" replace />;
  }

  const restrictedPaths = ["/app/paywall", "/app/billing"];
  const isRestrictedPath = restrictedPaths.includes(location.pathname);

  if (
    !allowWhenRestricted &&
    profile?.role === "client" &&
    !subscription.hasAccess &&
    !isRestrictedPath
  ) {
    return <Navigate to="/app/paywall" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
