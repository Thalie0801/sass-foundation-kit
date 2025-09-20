import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supportedChannels } from "@/lib/mockAppData";

export default function ContentCreatePage() {
  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>Nouveau contenu</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <label className="text-sm font-medium">Titre</label>
          <Input className="mt-1" placeholder="Titre du contenu" />
        </div>
        <div>
          <label className="text-sm font-medium">Canal</label>
          <select className="mt-1 w-full rounded-md border bg-background px-3 py-2">
            {supportedChannels.map((channel) => (
              <option key={channel}>{channel}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Date cible</label>
          <Input type="date" className="mt-1" />
        </div>
        <Button>Créer le sujet</Button>
      </CardContent>
    </Card>
  );
}
