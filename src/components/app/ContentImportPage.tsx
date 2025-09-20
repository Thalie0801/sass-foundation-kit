import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ContentImportPage() {
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Import CSV</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p>
          Importez un CSV avec les colonnes <strong>titre</strong>, <strong>canal</strong>, <strong>date</strong> et <strong>assigné</strong>.
          Les lignes sont vérifiées pour détecter les chevauchements.
        </p>
        <Button variant="outline">Choisir un fichier</Button>
        <Button>Importer</Button>
      </CardContent>
    </Card>
  );
}
