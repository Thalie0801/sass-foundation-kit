import { Crown, CreditCard, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const SubscriptionGate = () => {
  const { profile, getTrialDaysLeft, isInTrial, hasActiveSubscription } = useAuth();

  const trialDaysLeft = getTrialDaysLeft();
  const trialActive = isInTrial();
  const subscriptionActive = hasActiveSubscription();
  const status = profile?.subscription_status ?? "inactive";

  return (
    <div className="container mx-auto p-6 lg:p-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="border-primary/20 bg-card/80 backdrop-blur">
          <CardHeader className="space-y-3 text-center">
            <div className="flex justify-center">
              <ShieldAlert className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl">Accès limité</CardTitle>
            <CardDescription className="text-base">
              Votre abonnement ne permet pas encore d'accéder à toutes les fonctionnalités de la plateforme.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1 text-left">
                <p className="text-sm text-muted-foreground uppercase tracking-wider">Statut actuel</p>
                <div className="flex items-center gap-2">
                  <Badge variant={subscriptionActive ? "default" : "secondary"}>
                    {status?.toUpperCase()}
                  </Badge>
                  {profile?.plan && (
                    <span className="text-sm text-muted-foreground">Offre: {profile.plan}</span>
                  )}
                </div>
              </div>

              {trialActive && (
                <div className="bg-yellow-100/80 border border-yellow-200 rounded-lg px-4 py-2 text-sm text-yellow-700">
                  {trialDaysLeft} jours restants dans votre période d'essai
                </div>
              )}
            </div>

            <Card className="border-dashed">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Crown className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium">Passez à l'offre Premium</p>
                    <p className="text-sm text-muted-foreground">
                      Débloquez l'ensemble des fonctionnalités collaboratives, analytics avancés et automatisations.
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full sm:w-auto"
                  onClick={() => {
                    window.location.href = "/app/billing";
                  }}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Voir les offres disponibles
                </Button>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-6 text-sm text-muted-foreground space-y-2">
            <p>
              Besoin d'aide pour choisir la meilleure formule ? Contactez-nous à{" "}
              <a className="text-primary font-medium" href="mailto:hello@aeditus.fr">hello@aeditus.fr</a>.
            </p>
            <p>
              Votre accès sera automatiquement mis à jour dès que votre abonnement sera actif.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionGate;
