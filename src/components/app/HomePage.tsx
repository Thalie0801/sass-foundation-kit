import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  AlertTriangle,
  TrendingUp,
  FileText,
  CheckSquare,
  Plus,
  Eye,
  Edit3
} from "lucide-react";

export default function HomePage() {
  const user = { firstName: "Nathalie" };
  
  const todayItems = [
    {
      id: "1",
      title: "Article SEO — Nouvelles tendances IA 2024",
      href: "/app/contents/1",
      time: "10:00",
      status: "ready",
      channel: "Blog"
    },
    {
      id: "2", 
      title: "Post LinkedIn — Retour d'expérience client",
      href: "/app/contents/2",
      time: "14:00",
      status: "draft", 
      channel: "LinkedIn"
    },
    {
      id: "3",
      title: "Story Instagram — Behind the scenes",
      href: "/app/contents/3", 
      time: "18:00",
      status: "scheduled",
      channel: "Instagram"
    }
  ];

  const pendingValidation = [
    {
      id: "4",
      title: "Carrousel Facebook — 5 astuces productivité",
      href: "/app/contents/4",
      channel: "Facebook",
      assignee: "Marc"
    },
    {
      id: "5", 
      title: "Vidéo YouTube — Tutorial complet",
      href: "/app/contents/5",
      channel: "YouTube", 
      assignee: "Sophie"
    }
  ];

  const overdue = [
    {
      id: "6",
      title: "Newsletter mensuelle — Janvier 2024", 
      href: "/app/contents/6",
      dueDate: "22/01",
      channel: "Email"
    }
  ];

  const upcoming = [
    {
      id: "7",
      title: "Article invité — Partenaire Tech",
      href: "/app/contents/7", 
      dueDate: "25/01",
      channel: "Blog"
    },
    {
      id: "8",
      title: "Campagne pub — Lancement produit",
      href: "/app/contents/8",
      dueDate: "28/01", 
      channel: "Ads"
    }
  ];

  const recentActivity = [
    { action: "Publication", content: "Post LinkedIn", time: "Il y a 2h", user: "Vous" },
    { action: "Validation", content: "Article blog", time: "Il y a 4h", user: "Marc" },
    { action: "Création", content: "Story Instagram", time: "Hier", user: "Sophie" },
    { action: "Modification", content: "Carrousel Facebook", time: "Hier", user: "Vous" }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      ready: { variant: "default" as const, label: "Prêt" },
      draft: { variant: "secondary" as const, label: "Brouillon" },
      scheduled: { variant: "outline" as const, label: "Planifié" }
    };
    
    const config = variants[status as keyof typeof variants] || variants.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bonjour, {user.firstName} 👋</h1>
          <p className="text-muted-foreground">Voici votre journée éditoriale</p>
        </div>
        
        <div className="flex gap-3">
          <Button asChild>
            <Link to="/app/contents/new">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau contenu
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aujourd'hui</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayItems.length}</div>
            <p className="text-xs text-muted-foreground">contenus planifiés</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">À valider</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingValidation.length}</div>
            <p className="text-xs text-muted-foreground">en attente</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En retard</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overdue.length}</div>
            <p className="text-xs text-muted-foreground">nécessitent attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cette semaine</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">publications prévues</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Today's schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Aujourd'hui
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayItems.length > 0 ? (
              <div className="space-y-3">
                {todayItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <Link to={item.href} className="font-medium hover:underline">
                        {item.title}
                      </Link>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>{item.time}</span>
                        <span>•</span>
                        <span>{item.channel}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(item.status)}
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={item.href}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun contenu prévu aujourd'hui</p>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <Link to="/app/calendar">Voir le calendrier</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending validation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              À valider
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingValidation.length > 0 ? (
              <div className="space-y-3">
                {pendingValidation.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <Link to={item.href} className="font-medium hover:underline">
                        {item.title}
                      </Link>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>{item.channel}</span>
                        <span>•</span>
                        <span>Par {item.assignee}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={item.href}>
                          <Edit3 className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Rien en attente de validation</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overdue items */}
        {overdue.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                En retard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {overdue.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-destructive/20 bg-destructive/5">
                    <div className="flex-1">
                      <Link to={item.href} className="font-medium hover:underline">
                        {item.title}
                      </Link>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>Échéance: {item.dueDate}</span>
                        <span>•</span>
                        <span>{item.channel}</span>
                      </div>
                    </div>
                    <Button variant="destructive" size="sm" asChild>
                      <Link to={item.href}>Traiter</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Prochaines échéances (7j)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcoming.length > 0 ? (
              <div className="space-y-3">
                {upcoming.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <Link to={item.href} className="font-medium hover:underline">
                        {item.title}
                      </Link>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>{item.dueDate}</span>
                        <span>•</span>
                        <span>{item.channel}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={item.href}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune échéance prochaine</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <span className="font-medium">{activity.action}</span>
                    <span className="text-muted-foreground"> de </span>
                    <span className="font-medium">{activity.content}</span>
                    <span className="text-muted-foreground"> par {activity.user}</span>
                  </div>
                  <span className="text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}