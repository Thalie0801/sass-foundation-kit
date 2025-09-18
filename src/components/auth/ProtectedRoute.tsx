import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireRole?: 'admin' | 'client' | 'super_admin';
  requireSubscription?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  requireRole,
  requireSubscription = false 
}: ProtectedRouteProps) => {
  const { user, profile, loading, hasActiveSubscription, isInTrial } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Vérification des accès...</div>
      </div>
    );
  }

  if (!user) {
    window.location.href = '/auth';
    return null;
  }

  // Check role requirements
  if (requireRole && profile?.role !== requireRole) {
    // Special case: admins can access client areas
    if (requireRole === 'client' && (profile?.role === 'admin' || profile?.role === 'super_admin')) {
      // Allow admin to access client areas
    } else {
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
                Rôle requis: {requireRole} • Votre rôle: {profile?.role || 'non défini'}
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // Check subscription requirements
  if (requireSubscription && !hasActiveSubscription() && !isInTrial()) {
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
              onClick={() => window.location.href = '/app/billing'}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Voir les options d'abonnement
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};