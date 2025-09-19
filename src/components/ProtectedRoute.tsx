import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@/lib/query";
import { supabase } from "@/lib/supabaseClient";

export function ProtectedRoute({ children, role }: { children: JSX.Element; role?: "admin" | "client" }) {
  const { user, loading } = useAuth();
  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ["profiles", user?.id],
    queryFn: async () => {
      const response = await supabase.from("profiles").select("role").single();
      if (response.error) {
        throw response.error;
      }
      return response.data;
    },
    enabled: Boolean(user),
  });

  if (loading || isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center" aria-busy>
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <span className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p>Chargement de votre espace sécurisé…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isError) {
    return <Navigate to="/login" replace />;
  }

  if (role && profile?.role !== role) {
    return <Navigate to={profile?.role === "admin" ? "/admin" : "/app"} replace />;
  }

  return children;
}
