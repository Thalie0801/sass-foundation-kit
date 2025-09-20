import React, { useMemo } from "react";
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
  Edit3,
  BarChart3,
} from "lucide-react";
import { useAppLayoutContext } from "./AppLayout";
import {
  alfieInsights,
  mockActivity,
  mockContents,
  mockTasks,
} from "@/lib/mockAppData";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit" }).format(new Date(value));

const formatTime = (value: string) =>
  new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  ready: { label: "Prêt", variant: "default" },
  draft: { label: "Brouillon", variant: "secondary" },
  scheduled: { label: "Planifié", variant: "outline" },
  review: { label: "Révision", variant: "outline" },
};

export default function HomePage() {
  const { user } = useAppLayoutContext();
  const referenceDate = useMemo(() => new Date("2025-01-23T08:00:00.000Z"), []);

  const agenda = useMemo(() => {
    const startOfDay = new Date(referenceDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

    return mockContents
      .filter((content) => {
        if (!content.plannedAt) return false;
        const planned = new Date(content.plannedAt);
        return planned >= startOfDay && planned < endOfDay;
      })
      .sort((a, b) => (a.plannedAt ?? "").localeCompare(b.plannedAt ?? ""));
  }, [referenceDate]);

  const pendingValidation = useMemo(
    () => mockContents.filter((content) => ["review", "ready"].includes(content.status)),
    []
  );

  const overdue = useMemo(() => {
    const today = referenceDate.toISOString().slice(0, 10);
    return mockContents.filter(
      (content) =>
        content.dueDate &&
        content.dueDate < today &&
        !["published", "scheduled"].includes(content.status)
    );
  }, [referenceDate]);

  const upcoming = useMemo(() => {
    const start = referenceDate.toISOString().slice(0, 10);
    const end = new Date(referenceDate);
    end.setUTCDate(end.getUTCDate() + 7);
    const endIso = end.toISOString().slice(0, 10);

    return mockContents
      .filter((content) => content.dueDate && content.dueDate >= start && content.dueDate <= endIso)
      .sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? ""));
  }, [referenceDate]);

  const recentActivity = useMemo(() => mockActivity.slice(0, 6), []);

  const activeTasks = useMemo(() => mockTasks.filter((task) => task.status !== "done"), []);

  const totalWeekPlanned = agenda.length + upcoming.length + pendingValidation.length;

  const renderStatusBadge = (status: string) => {
    const config = statusConfig[status] ?? { label: status, variant: "secondary" as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bonjour, {user.firstName} 👋</h1>
          <p className="text-muted-foreground">Voici votre journée éditoriale</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/app/contents/new?type=sujet">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau sujet
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/app/contents/new?type=article">
              <FileText className="mr-2 h-4 w-4" />
              Article instantané
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/app/tasks/new">
              <CheckSquare className="mr-2 h-4 w-4" />
              Nouvelle tâche
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aujourd'hui</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agenda.length}</div>
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
            <p className="text-xs text-muted-foreground">à rattraper</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Charges semaine</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWeekPlanned}</div>
            <p className="text-xs text-muted-foreground">éléments dans la boucle</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Aujourd'hui
            </CardTitle>
          </CardHeader>
          <CardContent>
            {agenda.length > 0 ? (
              <div className="space-y-3">
                {agenda.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-lg border p-3 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex-1 space-y-1">
                      <Link to={`/app/contents/${item.id}`} className="font-medium hover:underline">
                        {item.title}
                      </Link>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatTime(item.plannedAt!)}</span>
                        <span>•</span>
                        <span>{item.channel}</span>
                        <span>•</span>
                        <span>{item.assignee}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStatusBadge(item.status)}
                      <Button variant="secondary" size="sm" asChild>
                        <Link to={`/app/contents/${item.id}`}>
                          <Eye className="mr-1 h-4 w-4" />
                          Ouvrir
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-sm text-muted-foreground">Aucun contenu planifié pour aujourd'hui.</p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <Link to="/app/contents/new">Programmer un contenu</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Insights Alfie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alfieInsights.map((insight, index) => (
              <p key={index} className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                {insight}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              À valider
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingValidation.length > 0 ? (
              <div className="space-y-3">
                {pendingValidation.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <Link to={`/app/contents/${item.id}`} className="font-medium hover:underline">
                        {item.title}
                      </Link>
                      <div className="text-sm text-muted-foreground">
                        {item.channel} • Assigné à {item.assignee}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/app/contents/${item.id}`}>
                        <Edit3 className="mr-1 h-4 w-4" />
                        Vérifier
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-sm text-muted-foreground">Pas de validation en attente.</p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <Link to="/app/plan">Voir le plan éditorial</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

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
                  <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <Link to={`/app/contents/${item.id}`} className="font-medium hover:underline">
                        {item.title}
                      </Link>
                      <div className="text-sm text-muted-foreground">
                        Échéance {formatDate(item.dueDate!)} • {item.channel}
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" asChild>
                      <Link to={`/app/contents/${item.id}`}>Préparer</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-sm text-muted-foreground">Aucun jalon dans les 7 prochains jours.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              En retard
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overdue.length > 0 ? (
              <div className="space-y-3">
                {overdue.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border border-destructive/30 p-3">
                    <div>
                      <Link to={`/app/contents/${item.id}`} className="font-medium text-destructive hover:underline">
                        {item.title}
                      </Link>
                      <div className="text-sm text-muted-foreground">
                        Échéance {formatDate(item.dueDate!)} • {item.channel}
                      </div>
                    </div>
                    <Button variant="destructive" size="sm" asChild>
                      <Link to={`/app/contents/${item.id}`}>Prioriser</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-sm text-muted-foreground">Tout est dans les temps.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Activité récente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex flex-col gap-1 rounded-lg border border-transparent p-2 hover:border-border">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{item.action} — {item.target}</p>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/app/analytics">Voir</Link>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Intl.RelativeTimeFormat("fr", { numeric: "auto" }).format(
                    Math.round(
                      (new Date(item.timestamp).getTime() - referenceDate.getTime()) / (1000 * 60 * 60)
                    ),
                    "hour"
                  )}
                  {" "}• {item.by}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Tâches à suivre
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTasks.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {activeTasks.map((task) => (
                <div key={task.id} className="rounded-lg border p-3">
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-muted-foreground">Assigné à {task.assignee}</p>
                  {task.contentId && (
                    <Link
                      to={`/app/contents/${task.contentId}`}
                      className="mt-2 inline-flex text-sm text-primary hover:underline"
                    >
                      Voir le contenu associé
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <p className="text-sm text-muted-foreground">Aucune tâche en cours.</p>
              <Button variant="outline" size="sm" className="mt-3" asChild>
                <Link to="/app/tasks">Ouvrir le board des tâches</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
