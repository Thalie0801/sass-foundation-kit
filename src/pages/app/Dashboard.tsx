import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, BarChart3, TrendingUp, Plus, Clock } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Publications ce mois",
      value: "24",
      change: "+12%",
      trend: "up",
      icon: Calendar,
    },
    {
      title: "Marques actives",
      value: "3",
      change: "+1",
      trend: "up",
      icon: Users,
    },
    {
      title: "Engagement moyen",
      value: "4.2%",
      change: "+0.8%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Portée totale",
      value: "15.2K",
      change: "+3.4K",
      trend: "up",
      icon: BarChart3,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "publication",
      title: "Nouveau post Instagram publié",
      brand: "Brand A",
      time: "Il y a 2 heures",
      status: "success",
    },
    {
      id: 2,
      type: "draft",
      title: "Brouillon LinkedIn en attente",
      brand: "Brand B",
      time: "Il y a 4 heures",
      status: "pending",
    },
    {
      id: 3,
      type: "scheduled",
      title: "Post Twitter programmé",
      brand: "Brand A",
      time: "Demain à 14h",
      status: "scheduled",
    },
  ];

  const upcomingPosts = [
    {
      id: 1,
      title: "Lancement nouveau produit",
      brand: "Brand A",
      platform: "Instagram",
      date: "Aujourd'hui 16h00",
      priority: "high",
    },
    {
      id: 2,
      title: "Article de blog - SEO",
      brand: "Brand B",
      platform: "LinkedIn",
      date: "Demain 09h00",
      priority: "medium",
    },
    {
      id: 3,
      title: "Story engagement",
      brand: "Brand A",
      platform: "Instagram",
      date: "Demain 18h00",
      priority: "low",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium":
        return "bg-primary/10 text-primary border-primary/20";
      case "low":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "scheduled":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Tableau de Bord
          </h1>
          <p className="text-muted-foreground">
            Vue d'ensemble de votre activité marketing
          </p>
        </div>
        <Button variant="premium" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouveau Contenu
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-card/80 backdrop-blur-sm border-border/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">
                  {stat.change}
                </span>{" "}
                par rapport au mois dernier
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/20">
          <CardHeader>
            <CardTitle className="text-foreground">Activités Récentes</CardTitle>
            <CardDescription>
              Dernières actions sur vos contenus
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg border border-border/20 bg-background/50">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.brand} • {activity.time}
                  </p>
                </div>
                <Badge className={getStatusColor(activity.status)}>
                  {activity.status === "success" && "Publié"}
                  {activity.status === "pending" && "En attente"}
                  {activity.status === "scheduled" && "Programmé"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Posts */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/20">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Publications Programmées
            </CardTitle>
            <CardDescription>
              Prochains contenus à publier
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-3 rounded-lg border border-border/20 bg-background/50">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {post.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {post.brand} • {post.platform} • {post.date}
                  </p>
                </div>
                <Badge className={getPriorityColor(post.priority)}>
                  {post.priority === "high" && "Urgent"}
                  {post.priority === "medium" && "Moyen"}
                  {post.priority === "low" && "Faible"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;