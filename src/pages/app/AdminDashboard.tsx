import { useEffect, useMemo, useState } from "react";
import { differenceInCalendarDays, isBefore } from "date-fns";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Users, Crown, Shield, Clock, Loader2, Lock } from "lucide-react";

type ManagedProfile = Database["public"]["Tables"]["profiles"]["Row"];

type ManagedFeature = Pick<
  Database["public"]["Tables"]["features"]["Row"],
  "id" | "name" | "display_name" | "description" | "requires_subscription" | "enabled_by_default"
>;

type UserFeatureRecord = Pick<
  Database["public"]["Tables"]["user_features"]["Row"],
  "id" | "user_id" | "feature_id" | "enabled"
>;

const AdminDashboard = () => {
  const { profile, user, refresh } = useAuth();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<ManagedProfile[]>([]);
  const [features, setFeatures] = useState<ManagedFeature[]>([]);
  const [userFeatures, setUserFeatures] = useState<UserFeatureRecord[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingFeature, setUpdatingFeature] = useState<string | null>(null);

  const isAdmin = profile?.role === "admin" || profile?.role === "super_admin";

  useEffect(() => {
    const loadData = async () => {
      if (!isAdmin) return;

      setIsLoading(true);
      try {
        const [{ data: profileData }, { data: featureData }, { data: userFeaturesData }] = await Promise.all([
          supabase
            .from("profiles")
            .select("user_id, full_name, email, role, subscription_status, trial_ends_at, plan")
            .order("created_at", { ascending: true }),
          supabase
            .from("features")
            .select("id, name, display_name, description, requires_subscription, enabled_by_default")
            .order("display_name", { ascending: true }),
          supabase
            .from("user_features")
            .select("id, user_id, feature_id, enabled")
        ]);

        setProfiles((profileData ?? []) as ManagedProfile[]);
        setFeatures((featureData ?? []) as ManagedFeature[]);
        setUserFeatures((userFeaturesData ?? []) as UserFeatureRecord[]);

        if (!selectedUserId && profileData && profileData.length > 0) {
          setSelectedUserId(profileData[0].user_id);
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données administrateur",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isAdmin, selectedUserId, toast]);

  const selectedProfile = useMemo(
    () => profiles.find((item) => item.user_id === selectedUserId) ?? null,
    [profiles, selectedUserId],
  );

  const selectedUserFeatures = useMemo(
    () => userFeatures.filter((item) => item.user_id === selectedUserId),
    [selectedUserId, userFeatures],
  );

  const subscriptionStats = useMemo(() => {
    const now = new Date();
    const total = profiles.length;
    const trials = profiles.filter((p) => p.subscription_status === "trial");
    const active = profiles.filter((p) => ["active", "paid", "subscribed"].includes(p.subscription_status ?? ""));
    const expiringTrials = trials.filter((profileItem) => {
      if (!profileItem.trial_ends_at) return false;
      const trialEnd = new Date(profileItem.trial_ends_at);
      const daysLeft = differenceInCalendarDays(trialEnd, now);
      return daysLeft >= 0 && daysLeft <= 3;
    });
    const expiredTrials = trials.filter((profileItem) => {
      if (!profileItem.trial_ends_at) return false;
      return isBefore(new Date(profileItem.trial_ends_at), now);
    });

    return {
      total,
      trials: trials.length,
      active: active.length,
      expiringTrials: expiringTrials.length,
      expiredTrials: expiredTrials.length,
    };
  }, [profiles]);

  const getUserFeatureState = (featureId: string) => {
    const userFeature = selectedUserFeatures.find((item) => item.feature_id === featureId);
    const feature = features.find((item) => item.id === featureId);
    if (!feature) return { enabled: false, overridden: false };

    if (!userFeature) {
      return {
        enabled: feature.enabled_by_default ?? false,
        overridden: false,
      };
    }

    return {
      enabled: userFeature.enabled ?? false,
      overridden: true,
    };
  };

  const handleToggleFeature = async (featureId: string, enabled: boolean) => {
    if (!selectedUserId) return;

    const feature = features.find((item) => item.id === featureId);
    if (!feature) return;

    const existing = selectedUserFeatures.find((item) => item.feature_id === featureId);

    setUpdatingFeature(featureId);
    try {
      if (existing) {
        const { data, error } = await supabase
          .from("user_features")
          .update({ enabled })
          .eq("id", existing.id)
          .select()
          .single();

        if (error) throw error;

        setUserFeatures((current) =>
          current.map((item) => (item.id === existing.id ? { ...item, enabled: data?.enabled ?? enabled } : item)),
        );
      } else {
        const { data, error } = await supabase
          .from("user_features")
          .insert({
            user_id: selectedUserId,
            feature_id: featureId,
            enabled,
          })
          .select()
          .single();

        if (error) throw error;

        if (data) {
          setUserFeatures((current) => [...current, data as UserFeatureRecord]);
        }
      }

      toast({
        title: enabled ? "Fonctionnalité activée" : "Fonctionnalité désactivée",
        description: `${feature.display_name} a été ${enabled ? "activée" : "désactivée"} pour l'utilisateur sélectionné`,
      });

      if (selectedUserId === user?.id) {
        await refresh();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la fonctionnalité",
        variant: "destructive",
      });
    } finally {
      setUpdatingFeature(null);
    }
  };

  if (!isAdmin) {
    return (
      <Alert className="m-6">
        <AlertTitle>Accès restreint</AlertTitle>
        <AlertDescription>
          Vous devez disposer d'un rôle administrateur pour accéder à cette page.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tableau de bord administrateur</h1>
          <p className="text-muted-foreground">
            Gérez les comptes clients, les essais gratuits et les fonctionnalités débloquées.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
          <Button asChild variant="outline">
            <Link to="/app">Vue générale</Link>
          </Button>
          <Button asChild variant="premium">
            <Link to="/app/billing">Gérer la facturation</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-card/80 border-border/30 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clients enregistrés</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">{subscriptionStats.total}</div>
            <p className="text-xs text-muted-foreground">Tous les comptes actifs et en essai.</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 border-border/30 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Essais en cours</CardTitle>
            <Clock className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">{subscriptionStats.trials}</div>
            <p className="text-xs text-muted-foreground">{subscriptionStats.expiringTrials} expirent dans 3 jours.</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 border-border/30 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Abonnements actifs</CardTitle>
            <Shield className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">{subscriptionStats.active}</div>
            <p className="text-xs text-muted-foreground">Clients avec abonnement valide.</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 border-border/30 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Essais expirés</CardTitle>
            <Lock className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">{subscriptionStats.expiredTrials}</div>
            <p className="text-xs text-muted-foreground">Clients nécessitant une relance commerciale.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_minmax(0,0.9fr)]">
        <Card className="bg-card/80 border-border/30 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Users className="h-5 w-5 text-primary" />
              Clients & rôles
            </CardTitle>
            <CardDescription>
              Visualisez les abonnements actifs et attribuez des rôles administrateur.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {profiles.length === 0 && (
              <div className="rounded-lg border border-dashed border-border/50 p-6 text-center text-sm text-muted-foreground">
                Aucun client enregistré pour le moment.
              </div>
            )}
            {profiles.map((profileItem) => {
              const isSelected = profileItem.user_id === selectedUserId;
              const trialEndsAt = profileItem.trial_ends_at
                ? new Date(profileItem.trial_ends_at)
                : null;
              const now = new Date();
              const trialStatus = trialEndsAt
                ? differenceInCalendarDays(trialEndsAt, now) >= 0
                  ? `${differenceInCalendarDays(trialEndsAt, now)} jours restants`
                  : "Essai expiré"
                : "";

              return (
                <button
                  type="button"
                  key={profileItem.user_id}
                  onClick={() => setSelectedUserId(profileItem.user_id)}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${
                    isSelected
                      ? "border-primary/60 bg-primary/5"
                      : "border-border/40 bg-background/40 hover:border-primary/40"
                  }`}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {profileItem.full_name ?? profileItem.email ?? "Utilisateur"}
                      </p>
                      <p className="text-xs text-muted-foreground">{profileItem.email}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="border-border/50 text-xs">
                        {profileItem.role ?? "client"}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {profileItem.subscription_status ?? "trial"}
                      </Badge>
                      {profileItem.subscription_status === "trial" && trialStatus && (
                        <Badge variant="outline" className="border-primary/40 text-xs text-primary">
                          {trialStatus}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card className="bg-card/80 border-border/30 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Crown className="h-5 w-5 text-primary" />
              Gestion des fonctionnalités
            </CardTitle>
            <CardDescription>
              Activez ou désactivez les intégrations disponibles pour chaque client.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedProfile && (
              <div className="rounded-lg border border-dashed border-border/50 p-6 text-center text-sm text-muted-foreground">
                Sélectionnez un client pour gérer ses fonctionnalités.
              </div>
            )}
            {selectedProfile && (
              <div className="space-y-4">
                <div className="rounded-lg border border-border/40 bg-background/40 p-4">
                  <p className="text-sm font-semibold text-foreground">{selectedProfile.full_name ?? selectedProfile.email}</p>
                  <p className="text-xs text-muted-foreground">Plan actuel : {selectedProfile.plan ?? "Starter"}</p>
                  {selectedProfile.subscription_status === "trial" && selectedProfile.trial_ends_at && (
                    <p className="text-xs text-muted-foreground">
                      Essai jusqu'au {new Date(selectedProfile.trial_ends_at).toLocaleDateString("fr-FR")}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  {features.map((feature) => {
                    const { enabled } = getUserFeatureState(feature.id);
                    return (
                      <div
                        key={feature.id}
                        className="flex items-start justify-between gap-4 rounded-lg border border-border/40 bg-background/40 p-4"
                      >
                        <div>
                          <p className="text-sm font-semibold text-foreground">{feature.display_name}</p>
                          {feature.description && (
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          )}
                          {feature.requires_subscription && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              Requiert un abonnement actif ou une activation manuelle.
                            </p>
                          )}
                        </div>
                        <Switch
                          checked={enabled}
                          onCheckedChange={(checked) => handleToggleFeature(feature.id, checked)}
                          disabled={updatingFeature === feature.id}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-lg border border-dashed border-border/50 p-4 text-sm text-muted-foreground">
                  Besoin d'accorder un accès complet ? Passez le statut de votre client à "active" dans Supabase pour débloquer toutes les intégrations premium.
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
