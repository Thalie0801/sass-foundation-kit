import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logoAeditus from "@/assets/logo-aeditus.jpg";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { toast } = useToast();
  const { user, profile, loading, subscription } = useAuth();

  const subscriptionLabel = () => {
    if (!profile || profile.role !== "client") return null;

    if (subscription.isTrialing) {
      return `Essai (${subscription.daysLeft} jours restants)`;
    }

    if (subscription.requiresPayment) {
      return "Abonnement requis";
    }

    return subscription.plan ? `Plan ${subscription.plan}` : "Client";
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt sur Aeditus",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <div className="flex items-center space-x-3">
                <img src={logoAeditus} alt="Aeditus" className="h-8 w-auto" />
                <span className="text-lg font-semibold bg-gradient-gold bg-clip-text text-transparent">
                  Aeditus
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-2">
                {profile?.role && (
                  <Badge variant="outline" className="border-border/40 text-xs capitalize">
                    {profile.role.replace("_", " ")}
                  </Badge>
                )}
                {subscriptionLabel() && (
                  <Badge
                    variant={subscription.requiresPayment && profile?.role === "client" ? "destructive" : "outline"}
                    className={
                      subscription.requiresPayment && profile?.role === "client"
                        ? "text-xs"
                        : "border-primary/40 text-xs text-primary"
                    }
                  >
                    {subscriptionLabel()}
                  </Badge>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {user?.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}