import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TaskCreatePage() {
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Nouvelle tâche</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <label className="text-sm font-medium">Titre</label>
          <Input className="mt-1" placeholder="Décrire la tâche" />
        </div>
        <div>
          <label className="text-sm font-medium">Échéance</label>
          <Input type="date" className="mt-1" />
        </div>
        <Button>Créer</Button>
      </CardContent>
    </Card>
  );
}
