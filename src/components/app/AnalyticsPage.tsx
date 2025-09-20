import React, { useMemo, useState } from "react";
import { analyticsSnapshot, mockContents } from "@/lib/mockAppData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

export default function AnalyticsPage() {
  const [channelFilter, setChannelFilter] = useState<string>("");
  const [personFilter, setPersonFilter] = useState<string>("");
  const [period, setPeriod] = useState<string>("30");

  const filteredContents = useMemo(() => {
    return mockContents.filter((content) => {
      if (channelFilter && content.channel !== channelFilter) return false;
      if (personFilter && content.assignee !== personFilter) return false;
      return true;
    });
  }, [channelFilter, personFilter]);

  const created = filteredContents.length;
  const published = filteredContents.filter((content) => content.status === "published").length;
  const scheduled = filteredContents.filter((content) => content.status === "scheduled").length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Vélocité, respect des délais et charge par canal. Les filtres s'appliquent aux cartes et graphiques.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <select
            className="rounded-md border bg-background px-3 py-2"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
          >
            <option value="7">7 jours</option>
            <option value="30">30 jours</option>
            <option value="90">90 jours</option>
          </select>
          <select
            className="rounded-md border bg-background px-3 py-2"
            value={channelFilter}
            onChange={(event) => setChannelFilter(event.target.value)}
          >
            <option value="">Tous les canaux</option>
            {Array.from(new Set(mockContents.map((item) => item.channel))).map((channel) => (
              <option key={channel} value={channel}>
                {channel}
              </option>
            ))}
          </select>
          <select
            className="rounded-md border bg-background px-3 py-2"
            value={personFilter}
            onChange={(event) => setPersonFilter(event.target.value)}
          >
            <option value="">Toute l'équipe</option>
            {Array.from(new Set(mockContents.map((item) => item.assignee))).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Contenus créés ({period}j)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{created}</p>
            <p className="text-xs text-muted-foreground">dont {scheduled} planifiés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Contenus publiés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{published}</p>
            <p className="text-xs text-muted-foreground">Vs objectif {analyticsSnapshot.published}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Respect des délais</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{formatPercent(analyticsSnapshot.onTimeRate)}</p>
            <p className="text-xs text-muted-foreground">Tendance +4 % vs période précédente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Temps moyen de cycle</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">3,8 j</p>
            <p className="text-xs text-muted-foreground">Idée → Publication</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Vélocité par personne</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {analyticsSnapshot.velocity.map((item) => {
              const max = Math.max(...analyticsSnapshot.velocity.map((entry) => entry.value));
              return (
                <div key={item.user} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span>{item.user}</span>
                    <Badge variant="outline">{item.value}/semaine</Badge>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${Math.max(12, (item.value / max) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition statuts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {[
              { label: "Idées", count: filteredContents.filter((item) => item.status === "idea").length },
              { label: "Brouillons", count: filteredContents.filter((item) => item.status === "draft").length },
              { label: "Révision", count: filteredContents.filter((item) => item.status === "review").length },
              { label: "Prêts", count: filteredContents.filter((item) => item.status === "ready").length },
            ].map((entry) => (
              <div key={entry.label} className="flex items-center justify-between">
                <span>{entry.label}</span>
                <span className="font-medium">{entry.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Charge par canal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {analyticsSnapshot.loadByChannel.map((item) => {
            const max = Math.max(...analyticsSnapshot.loadByChannel.map((entry) => entry.planned));
            return (
              <div key={item.channel} className="space-y-2">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>{item.channel}</span>
                  <span>
                    {item.planned} planifiés • {item.published} publiés
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-secondary"
                    style={{ width: `${(item.planned / max) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
          <Button variant="outline" size="sm">
            Exporter les données détaillées
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
