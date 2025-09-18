import { Link } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, BarChart3, TrendingUp, ShieldCheck, Zap, Lock } from "lucide-react";

const stats = [
  {
    title: "Publications ce mois",
    value: "24",
    change: "+12%",
    icon: Calendar,
  },
  {
    title: "Collaborateurs",
    value: "5",
    change: "+1",
    icon: Users,
  },
  {
    title: "Engagement moyen",
    value: "4.2%",
    change: "+0.8%",
    icon: TrendingUp,
  },
  {
    title: "Portée totale",
    value: "15.2K",
    change: "+3.4K",
    icon: BarChart3,
  },
];

const ClientDashboard = () => {
  const { profile, user, subscription, features } = useAuth();

  const unlockedFeatures = features.filter((feature) => feature.enabled);
  const lockedFeatures = features.filter((feature) => !feature.enabled);

  const formattedTrialEnd = subscription.trialEndsAt
    ? format(new Date(subscription.trialEndsAt), "d MMMM yyyy", { locale: fr })
    : null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4 lg:items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Bonjour {profile?.full_name ?? user?.email}
          </h1>
          <p className="text-muted-foreground">
            Suivez vos performances et optimisez votre présence en ligne
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <Button asChild variant="outline" className="flex-1 sm:flex-none">
            <Link to="/app/settings">Paramètres</Link>
          </Button>
          <Button asChild variant="premium" className="flex-1 sm:flex-none">
            <Link to="/app/billing">Gérer l'abonnement</Link>
          </Button>
        </div>
      </div>

      {subscription.isTrialing && (
        <Alert className="border-border/40 bg-primary/5">
          <ShieldCheck className="h-4 w-4" />
          <AlertTitle>Essai gratuit en cours</AlertTitle>
          <AlertDescription>
            Il vous reste <strong>{subscription.daysLeft}</strong> jours d'accès complet. Terminez votre période d'essai le {formattedTrialEnd}.
          </AlertDescription>
        </Alert>
      )}

      {subscription.requiresPayment && !subscription.isTrialing && (
        <Alert variant="destructive" className="border-destructive/40">
          <AlertTitle>Votre abonnement est inactif</AlertTitle>
          <AlertDescription>
            Activez votre abonnement pour continuer à utiliser Aeditus et débloquer toutes les fonctionnalités.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-card/80 border-border/30 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change} par rapport au mois dernier</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="bg-card/80 border-border/30 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Zap className="h-5 w-5 text-primary" />
              Fonctionnalités disponibles
            </CardTitle>
            <CardDescription>
              Visualisez les services inclus dans votre plan actuel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {unlockedFeatures.length === 0 && (
              <div className="rounded-lg border border-dashed border-border/50 p-6 text-center text-sm text-muted-foreground">
                Aucune fonctionnalité activée pour le moment.
              </div>
            )}
            {unlockedFeatures.map((feature) => (
              <div
                key={feature.id}
                className="flex items-start justify-between gap-4 rounded-lg border border-border/40 bg-background/40 p-4"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{feature.displayName}</p>
                  {feature.description && (
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  )}
                </div>
                <Badge variant="outline" className="border-green-500/40 text-green-500">
                  Active
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card/80 border-border/30 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Lock className="h-5 w-5 text-primary" />
              Fonctionnalités à débloquer
            </CardTitle>
            <CardDescription>
              Débloquez des intégrations avancées et des outils premium
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {lockedFeatures.length === 0 && (
              <div className="rounded-lg border border-dashed border-border/50 p-6 text-center text-sm text-muted-foreground">
                Toutes les fonctionnalités disponibles sont activées.
              </div>
            )}
            {lockedFeatures.map((feature) => (
              <div
                key={feature.id}
                className="flex items-start justify-between gap-4 rounded-lg border border-border/40 bg-background/40 p-4"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{feature.displayName}</p>
                  {feature.description && (
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  )}
                  {feature.requiresSubscription && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Inclus dans les plans premium ou via activation manuelle.
                    </p>
                  )}
                </div>
                <Button asChild variant="secondary" size="sm">
                  <Link to="/app/paywall">Activer</Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;
