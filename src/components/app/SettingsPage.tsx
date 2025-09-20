import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppLayoutContext } from "./AppLayout";
import { teamMembers, supportedChannels } from "@/lib/mockAppData";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const { user, organization } = useAppLayoutContext();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Paramètres</h1>
        <p className="text-sm text-muted-foreground">Mettez à jour votre profil et configurez l'organisation.</p>
      </header>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Prénom</label>
                <Input defaultValue={user.firstName} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input defaultValue={user.email} className="mt-1" />
              </div>
            </div>
            <Button size="sm">Enregistrer</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Préférences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <label className="text-sm font-medium">Langue</label>
              <select className="mt-1 w-full rounded-md border bg-background px-3 py-2">
                <option>Français</option>
                <option>Anglais</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Format date</label>
              <select className="mt-1 w-full rounded-md border bg-background px-3 py-2">
                <option>JJ/MM/AAAA</option>
                <option>MM/JJ/AAAA</option>
              </select>
            </div>
            <Button size="sm" variant="outline">
              Sauvegarder
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organisation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Nom de l'organisation</label>
              <Input defaultValue={organization.name} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Quota mensuel total</label>
              <Input
                type="number"
                defaultValue={Object.values(organization.quotas.monthly).reduce((sum, value) => sum + value, 0)}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <p className="font-medium">Canaux activés</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {supportedChannels.map((channel) => {
                const isActive = Object.prototype.hasOwnProperty.call(organization.quotas.weekly, channel);
                return (
                  <Badge key={channel} variant={isActive ? "secondary" : "outline"}>
                    {channel}
                  </Badge>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rôles & accès</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <table className="w-full min-w-[480px] text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-3 py-2 text-left">Membre</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">Rôle</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.id} className="border-b last:border-none">
                  <td className="px-3 py-2">{member.name}</td>
                  <td className="px-3 py-2">{member.email}</td>
                  <td className="px-3 py-2">
                    <select
                      className="rounded-md border bg-background px-2 py-1 text-xs"
                      defaultValue={member.role}
                    >
                      <option value="owner">Owner</option>
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button size="sm" variant="outline">
            Inviter un membre
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
