import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  CreditCard, 
  Settings, 
  TrendingUp, 
  Shield,
  Eye,
  UserPlus,
  DollarSign
} from "lucide-react";

interface User {
  id: string;
  email: string;
  role: string;
  subscription_status: string;
  plan: string;
  trial_ends_at: string;
  created_at: string;
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
  user_id: string;
  feature_id: string;
  enabled: boolean;
  user_email: string;
  feature_name: string;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [userFeatures, setUserFeatures] = useState<UserFeature[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    trialUsers: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Fetch features
      const { data: featuresData, error: featuresError } = await supabase
        .from('features')
        .select('*');

      if (featuresError) throw featuresError;

      // Fetch user features with user emails
      const { data: userFeaturesData, error: userFeaturesError } = await supabase
        .from('user_features')
        .select(`
          user_id,
          feature_id,
          enabled
        `);

      if (userFeaturesError) throw userFeaturesError;

      setUsers(usersData || []);
      setFeatures(featuresData || []);
      setUserFeatures(userFeaturesData?.map(uf => ({
        user_id: uf.user_id,
        feature_id: uf.feature_id,
        enabled: uf.enabled,
        user_email: '', // Will be populated from users array
        feature_name: ''
      })) || []);

      // Calculate stats
      const totalUsers = usersData?.length || 0;
      const activeSubscriptions = usersData?.filter(u => u.subscription_status === 'active').length || 0;
      const trialUsers = usersData?.filter(u => u.subscription_status === 'trial').length || 0;

      setStats({
        totalUsers,
        activeSubscriptions,
        trialUsers,
        revenue: activeSubscriptions * 29 // Exemple : 29€/mois
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données admin",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleUserFeature = async (userId: string, featureId: string, enabled: boolean) => {
    try {
      if (enabled) {
        // Enable feature
        const { error } = await supabase
          .from('user_features')
          .upsert({ 
            user_id: userId, 
            feature_id: featureId, 
            enabled: true,
            enabled_by: (await supabase.auth.getUser()).data.user?.id
          });
        if (error) throw error;
      } else {
        // Disable feature
        const { error } = await supabase
          .from('user_features')
          .delete()
          .match({ user_id: userId, feature_id: featureId });
        if (error) throw error;
      }

      toast({
        title: "Succès",
        description: `Fonctionnalité ${enabled ? 'activée' : 'désactivée'} pour l'utilisateur`,
      });
      
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error toggling feature:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la fonctionnalité",
        variant: "destructive",
      });
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'client' | 'super_admin') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Rôle utilisateur mis à jour",
      });
      
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le rôle",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement du dashboard admin...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
          <p className="text-muted-foreground">
            Gestion des utilisateurs, abonnements et fonctionnalités
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-primary" />
          <Badge variant="secondary" className="font-semibold">Super Admin</Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.trialUsers} en essai
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abonnements Actifs</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              Taux de conversion: {stats.totalUsers > 0 ? Math.round((stats.activeSubscriptions / stats.totalUsers) * 100) : 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Mensuels</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.revenue}€</div>
            <p className="text-xs text-muted-foreground">
              MRR (Monthly Recurring Revenue)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fonctionnalités</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{features.length}</div>
            <p className="text-xs text-muted-foreground">
              Fonctionnalités disponibles
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Gestion des Utilisateurs</span>
          </CardTitle>
          <CardDescription>
            Gérez les rôles et abonnements des utilisateurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg space-y-4 lg:space-y-0">
                <div className="flex-1">
                  <div className="font-medium">{user.email}</div>
                  <div className="text-sm text-muted-foreground">
                    Rôle: {user.role} • Plan: {user.plan} • Status: {user.subscription_status}
                  </div>
                  {user.trial_ends_at && (
                    <div className="text-xs text-muted-foreground">
                      Essai jusqu'au: {new Date(user.trial_ends_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value as 'admin' | 'client' | 'super_admin')}
                    className="px-3 py-1 border rounded text-sm"
                  >
                    <option value="client">Client</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                  
                  <Badge variant={user.subscription_status === 'active' ? 'default' : 'secondary'}>
                    {user.subscription_status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Gestion des Fonctionnalités</span>
          </CardTitle>
          <CardDescription>
            Activez ou désactivez des fonctionnalités pour chaque utilisateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {features.map((feature) => (
              <div key={feature.id} className="border rounded-lg p-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <h3 className="font-medium">{feature.display_name}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant={feature.enabled_by_default ? 'default' : 'secondary'}>
                        {feature.enabled_by_default ? 'Activée par défaut' : 'Optionnelle'}
                      </Badge>
                      {feature.requires_subscription && (
                        <Badge variant="outline">Abonnement requis</Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium">Utilisateurs avec cette fonctionnalité:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {users.map((user) => {
                      const hasFeature = userFeatures.some(
                        uf => uf.user_id === user.id && uf.feature_id === feature.id && uf.enabled
                      );
                      
                      return (
                        <div key={`${user.id}-${feature.id}`} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm">{user.email}</span>
                          <Switch
                            checked={hasFeature}
                            onCheckedChange={(checked) => toggleUserFeature(user.id, feature.id, checked)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;