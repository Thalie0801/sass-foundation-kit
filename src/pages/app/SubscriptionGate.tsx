import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, CreditCard, Gift, ShieldCheck } from "lucide-react";

const SubscriptionGate = () => {
  const { subscription, profile } = useAuth();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
      <Card className="border-border/40 bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-foreground">Activez votre accès premium</CardTitle>
          <CardDescription>
            {subscription.isTrialing
              ? "Profitez pleinement de votre période d'essai, puis choisissez l'offre qui vous convient."
              : "Votre période d'essai est terminée. Sélectionnez un plan pour continuer à utiliser Aeditus."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border/40 bg-background/40 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Gift className="h-4 w-4 text-primary" />
                Essai gratuit de 7 jours
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Accédez à toutes les fonctionnalités pendant 7 jours sans engagement.
              </p>
            </div>
            <div className="rounded-lg border border-border/40 bg-background/40 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Sécurité & conformité
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Vos données sont stockées en toute sécurité et restent sous votre contrôle.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Ce que vous débloquez :</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Accès illimité au tableau de bord et à toutes les intégrations premium
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Activation de fonctionnalités avancées (Fynk, analytics approfondies...)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Support prioritaire et accompagnement sur-mesure
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Compte : {profile?.email}</p>
              <Badge variant="outline" className="border-primary/40 text-primary">
                Statut actuel : {subscription.status}
              </Badge>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild variant="outline">
                <Link to="/app">Retour au tableau de bord</Link>
              </Button>
              <Button asChild variant="premium" className="gap-2">
                <Link to="/app/billing">
                  <CreditCard className="h-4 w-4" />
                  Choisir un plan
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionGate;
