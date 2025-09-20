import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Aide & support</h1>
        <p className="text-sm text-muted-foreground">
          Accédez à la documentation, contactez l'équipe Æditus et découvrez la roadmap.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Guides étape par étape pour le plan éditorial, le calendrier et Alfie.</p>
            <Button variant="outline" size="sm" asChild>
              <a href="https://help.aeditus.com" target="_blank" rel="noreferrer">
                Ouvrir
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Chat en direct 24/7 et escalade vers l'équipe humaine en cas de besoin.</p>
            <Button variant="outline" size="sm" asChild>
              <a href="mailto:support@aeditus.com">Envoyer un email</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Roadmap</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Votez pour les prochaines fonctionnalités et suivez l'avancement.</p>
            <Button variant="outline" size="sm" asChild>
              <a href="/platform/roadmap">Voir la roadmap</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
