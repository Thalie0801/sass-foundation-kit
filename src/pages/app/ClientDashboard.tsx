import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Users, 
  BarChart3, 
  TrendingUp, 
  Plus, 
  Clock,
  Crown,
  CreditCard,
  CheckCircle,
  XCircle,
  Star
} from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  company: string;
  plan: string;
  subscription_status: string;
  trial_ends_at: string;
  role: string;
}

interface Feature {
  id: string;
  name: string;
  display_name: string;
  description: string;
  enabled_by_default: boolean;
  requires_subscription: boolean;
}

interface UserFeature {
  feature_id: string;
  enabled: boolean;
}

const ClientDashboard = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [userFeatures, setUserFeatures] = useState<UserFeature[]>([]);
  const [stats, setStats] = useState({
    publications: 12,
    brands: 3,
    engagement: 85,
    reach: 2400
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;

      // Fetch all features
      const { data: featuresData, error: featuresError } = await supabase
        .from('features')
        .select('*');

      if (featuresError) throw featuresError;

      // Fetch user's enabled features
      const { data: userFeaturesData, error: userFeaturesError } = await supabase
        .from('user_features')
        .select('feature_id, enabled')
        .eq('user_id', user.id);

      if (userFeaturesError) throw userFeaturesError;

      setProfile(profileData);
      setFeatures(featuresData || []);
      setUserFeatures(userFeaturesData || []);

    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTrialDaysLeft = () => {
    if (!profile?.trial_ends_at) return 0;
    const trialEnd = new Date(profile.trial_ends_at);
    const today = new Date();
    const diffTime = trialEnd.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const hasFeature = (featureName: string) => {
    const feature = features.find(f => f.name === featureName);
    if (!feature) return false;

    // Check if enabled by default
    if (feature.enabled_by_default) return true;

    // Check if user has it enabled
    const userFeature = userFeatures.find(uf => uf.feature_id === feature.id);
    return userFeature?.enabled || false;
  };

  const getSubscriptionStatusColor = () => {
    switch (profile?.subscription_status) {
      case 'active': return 'bg-green-500';
      case 'trial': return 'bg-yellow-500';
      case 'canceled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleUpgrade = async () => {
    // Ici on intégrerait Stripe
    toast({
      title: "Redirection vers Stripe",
      description: "Vous allez être redirigé vers notre page de paiement sécurisé",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement de votre dashboard...</div>
      </div>
    );
  }

  const trialDaysLeft = getTrialDaysLeft();
  const isTrialUser = profile?.subscription_status === 'trial';

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
      {/* Header with Subscription Status */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bienvenue, {profile?.full_name || profile?.email}
          </h1>
          <p className="text-muted-foreground">
            Gérez votre contenu et suivez vos performances
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          {isTrialUser && (
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">
                {trialDaysLeft} jours d'essai restants
              </span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getSubscriptionStatusColor()}`} />
            <Badge variant={profile?.subscription_status === 'active' ? 'default' : 'secondary'}>
              {profile?.plan?.toUpperCase() || 'TRIAL'}
            </Badge>
          </div>
          
          {isTrialUser && (
            <Button onClick={handleUpgrade} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Crown className="h-4 w-4 mr-2" />
              Passer à Premium
            </Button>
          )}
        </div>
      </div>

      {/* Trial Warning */}
      {isTrialUser && trialDaysLeft <= 3 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <h3 className="font-medium text-yellow-800">
                  Votre essai se termine bientôt !
                </h3>
                <p className="text-sm text-yellow-700">
                  Plus que {trialDaysLeft} jour{trialDaysLeft > 1 ? 's' : ''} pour profiter de toutes nos fonctionnalités.
                </p>
              </div>
              <Button onClick={handleUpgrade} size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                S'abonner maintenant
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publications ce mois</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publications}</div>
            <p className="text-xs text-muted-foreground">
              +2 depuis la semaine dernière
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marques actives</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.brands}</div>
            <p className="text-xs text-muted-foreground">
              Limite: {profile?.plan === 'premium' ? '∞' : '5'} marques
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.engagement}%</div>
            <Progress value={stats.engagement} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portée</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reach.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Vues ce mois-ci
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>Fonctionnalités Disponibles</span>
            </CardTitle>
            <CardDescription>
              Fonctionnalités incluses dans votre plan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {features.map((feature) => {
              const isEnabled = hasFeature(feature.name);
              const canAccess = !feature.requires_subscription || profile?.subscription_status === 'active' || isEnabled;
              
              return (
                <div key={feature.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{feature.display_name}</h3>
                      {isEnabled ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : canAccess ? (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Crown className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                    {feature.requires_subscription && !canAccess && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        Premium requis
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Actions Rapides</span>
            </CardTitle>
            <CardDescription>
              Créez du contenu rapidement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Post
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Planifier une Publication
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Voir les Analytics
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              disabled={!hasFeature('fynk')}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Fynk Integration
              {!hasFeature('fynk') && (
                <Crown className="h-3 w-3 ml-2 text-yellow-500" />
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Prompt for Trial Users */}
      {isTrialUser && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Crown className="h-12 w-12 text-yellow-500 mx-auto" />
              <h2 className="text-2xl font-bold">Débloquez tout le potentiel d'Aeditus</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Passez à Premium pour accéder à toutes les fonctionnalités, 
                des analytics avancées, l'intégration Fynk, et bien plus encore.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleUpgrade} size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Crown className="h-4 w-4 mr-2" />
                  Passer à Premium - 29€/mois
                </Button>
                <Button variant="outline" size="lg">
                  En savoir plus
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientDashboard;