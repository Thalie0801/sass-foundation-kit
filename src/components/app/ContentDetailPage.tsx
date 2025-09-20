import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  getContentById,
  alfieInsights,
  mockContents,
} from "@/lib/mockAppData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bot,
  Copy,
  Archive,
  Trash2,
  Share2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

export default function ContentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const content = id ? getContentById(id) : undefined;

  if (!content) {
    return (
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Contenu introuvable</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            La ressource demandée n'existe pas ou a été archivée. Retournez à la liste des contenus pour poursuivre.
          </p>
          <Button asChild>
            <Link to="/app/contents">Retour à la liste</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const checklistCount = Object.values(content.checklist).filter(Boolean).length;
  const checklistProgress = Math.round((checklistCount / 4) * 100);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold">{content.title}</h1>
            <Badge variant="outline">{content.channel}</Badge>
            <Badge variant="secondary">{content.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Slug : <span className="font-mono">{content.slug || "à définir"}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Copy className="mr-2 h-4 w-4" /> Dupliquer
          </Button>
          <Button variant="outline" size="sm">
            <Archive className="mr-2 h-4 w-4" /> Archiver
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="mr-2 h-4 w-4" /> Supprimer
          </Button>
          <Button size="sm" variant="secondary">
            <CheckCircle2 className="mr-2 h-4 w-4" /> Marquer comme publié
          </Button>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Métadonnées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Titre</label>
                  <Input defaultValue={content.title} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug</label>
                  <Input defaultValue={content.slug} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Assignee</label>
                  <Input defaultValue={content.assignee} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priorité</label>
                  <select defaultValue={content.priority} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                    <option value="low">Basse</option>
                    <option value="medium">Normale</option>
                    <option value="high">Haute</option>
                  </select>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium">Tags</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {content.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Planning & checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date de publication</label>
                  <Input type="datetime-local" defaultValue={content.plannedAt?.slice(0, 16)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Échéance interne</label>
                  <Input type="date" defaultValue={content.dueDate} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>Avancement</span>
                  <span>{checklistProgress}%</span>
                </div>
                <Progress value={checklistProgress} className="mt-2" />
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {Object.entries(content.checklist).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked={value} />
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Liens & pièces jointes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Liens</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-primary">
                  {content.links.length > 0 ? (
                    content.links.map((link) => (
                      <li key={link.url}>
                        <a href={link.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">
                          {link.label}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted-foreground">Aucun lien renseigné.</li>
                  )}
                </ul>
              </div>

              <div>
                <h3 className="font-medium">Pièces jointes</h3>
                <ul className="mt-2 space-y-2 text-sm">
                  {content.attachments.length > 0 ? (
                    content.attachments.map((attachment) => (
                      <li key={attachment.id} className="flex items-center justify-between rounded border px-3 py-2">
                        <span>{attachment.name}</span>
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          Ouvrir <ExternalLink className="h-3 w-3" />
                        </a>
                      </li>
                    ))
                  ) : (
                    <li className="rounded border border-dashed px-3 py-2 text-muted-foreground">
                      Aucune pièce jointe pour le moment.
                    </li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historique</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {content.history.length > 0 ? (
                content.history.map((entry) => (
                  <div key={entry.id} className="rounded border px-3 py-2">
                    <p className="font-medium">{entry.actor} {entry.action}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(entry.timestamp)}</p>
                    {entry.details && <p className="mt-1 text-xs text-muted-foreground">{entry.details}</p>}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">Aucun historique enregistré.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Commentaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {content.comments.length > 0 ? (
                  content.comments.map((comment) => (
                    <div key={comment.id} className="rounded border px-3 py-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">{formatDateTime(comment.timestamp)}</span>
                      </div>
                      <p className="mt-2 whitespace-pre-line">
                        {comment.message.split(" ").map((word) =>
                          word.startsWith("@") ? (
                            <span key={word} className="text-primary">
                              {word}{" "}
                            </span>
                          ) : (
                            `${word} `
                          )
                        )}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded border border-dashed px-3 py-6 text-center text-sm text-muted-foreground">
                    Aucun commentaire pour l'instant.
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Ajouter un commentaire</label>
                <textarea className="min-h-[90px] w-full rounded-md border bg-background px-3 py-2 text-sm" placeholder="@Nom pour mentionner un membre" />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    Prévisualiser
                  </Button>
                  <Button size="sm">
                    Publier
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          {content.antiOverlap?.hasConflict && (
            <Card className="border-warning/60 bg-warning/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-warning-foreground">
                  <AlertTriangle className="h-4 w-4" /> Risque de chevauchement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>{content.antiOverlap?.message}</p>
                <ul className="list-disc pl-4 text-sm">
                  {content.antiOverlap?.suggestions.map((suggestion) => (
                    <li key={suggestion}>{suggestion}</li>
                  ))}
                </ul>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/app/plan">Voir les autres sujets</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-4 w-4" /> Alfie Copilot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">Choisissez une action pour accélérer votre production.</p>
              <div className="grid gap-2">
                <Button variant="outline" size="sm">
                  Générer un plan détaillé
                </Button>
                <Button variant="outline" size="sm">
                  Réécrire en version courte
                </Button>
                <Button variant="outline" size="sm">
                  Adapter le ton (Mémoire tonale)
                </Button>
              </div>
              <div className="rounded-md bg-muted p-3">
                <p className="text-xs text-muted-foreground">Suggestion</p>
                <p className="text-sm">{alfieInsights[0]}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mémoire tonale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="space-y-1">
                <label className="text-xs uppercase text-muted-foreground">Formel ↔ Amical</label>
                <input type="range" defaultValue={content.brandVoice?.formel ?? 50} min={0} max={100} className="w-full" />
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase text-muted-foreground">Expert ↔ Accessible</label>
                <input type="range" defaultValue={content.brandVoice?.expert ?? 50} min={0} max={100} className="w-full" />
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase text-muted-foreground">Énergie</label>
                <input type="range" defaultValue={content.brandVoice?.energy ?? 50} min={0} max={100} className="w-full" />
              </div>
              <p className="text-xs text-muted-foreground">
                Les réglages sont appliqués aux prochaines suggestions d'Alfie et aux déclinaisons sociales.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contenus liés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {mockContents
                .filter((item) => item.channel === content.channel && item.id !== content.id)
                .slice(0, 3)
                .map((item) => (
                  <div key={item.id} className="rounded border px-3 py-2">
                    <Link to={`/app/contents/${item.id}`} className="font-medium hover:underline">
                      {item.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">Statut {item.status}</p>
                  </div>
                ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Partage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                Partagez ce contenu avec des parties prenantes externes via un lien sécurisé.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <Share2 className="mr-2 h-4 w-4" /> Générer un lien d'aperçu
              </Button>
              <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
                Historique partagé : 0 consultation • Expire dans 7 jours après activation.
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
