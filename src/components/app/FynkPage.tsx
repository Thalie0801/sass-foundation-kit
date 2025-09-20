import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fynkQueue, fynkCalendarHighlights } from "@/lib/mockAppData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, PlayCircle, PauseCircle } from "lucide-react";

export default function FynkPage() {
  const [autoPilot, setAutoPilot] = useState(true);
  const queue = useMemo(() => fynkQueue, []);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Fynk — Automatisation sociale</h1>
          <p className="text-sm text-muted-foreground">
            Gérez la file d'attente LinkedIn, les relances d'engagement et surveillez l'exécution automatique.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link to="/app/billing">Configurer la facturation</Link>
          </Button>
          <Button onClick={() => setAutoPilot((prev) => !prev)}>
            {autoPilot ? (
              <>
                <PauseCircle className="mr-2 h-4 w-4" /> Mettre en pause
              </>
            ) : (
              <>
                <PlayCircle className="mr-2 h-4 w-4" /> Relancer
              </>
            )}
          </Button>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>File d'attente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {queue.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between rounded border px-3 py-2">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {new Intl.DateTimeFormat("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(item.scheduledAt))} • {item.channel}
                </p>
              </div>
              <Badge variant={item.status === "Programmé" ? "secondary" : "outline"}>{item.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Points chauds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {fynkCalendarHighlights.map((highlight) => (
              <div key={highlight.date} className="rounded border px-3 py-2">
                <p className="font-medium">{highlight.date}</p>
                <p className="text-muted-foreground">{highlight.label}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Relances d'engagement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              Automatisation en cours. Fynk notifie les rédacteurs lorsque des réponses nécessitent un suivi humain.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>8 réponses LinkedIn analysées dans les dernières 24h</li>
              <li>3 messages proposés pour demain matin</li>
              <li>Score d'engagement moyen : 32 %</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statut de l'add-on</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            Add-on actif. Facturation via Stripe, prochaine facture le 01/02. Pour désactiver Fynk, utilisez le portail de facturation.
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link to="/app/billing">Accéder au portail Stripe</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
