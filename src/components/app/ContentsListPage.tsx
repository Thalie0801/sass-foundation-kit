import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { mockContents, ContentItem, ContentStatus } from "@/lib/mockAppData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, Upload, Check, Trash2 } from "lucide-react";

const statusLabels: Record<ContentStatus, string> = {
  idea: "Idée",
  draft: "Brouillon",
  review: "Révision",
  ready: "Prêt",
  scheduled: "Planifié",
  published: "Publié",
  archived: "Archivé",
};

const priorityLabels: Record<ContentItem["priority"], string> = {
  low: "Basse",
  medium: "Normale",
  high: "Haute",
};

const formatDate = (value?: string) =>
  value ? new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit" }).format(new Date(value)) : "-";

export default function ContentsListPage() {
  const [items, setItems] = useState<ContentItem[]>(() => mockContents.map((item) => ({ ...item })));
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState("status-ready");

  const filtered = useMemo(() => {
    if (!search) return items;
    return items.filter((item) =>
      [item.title, item.channel, item.assignee, item.tags.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [items, search]);

  const toggleSelection = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    if (selected.length === filtered.length) {
      setSelected([]);
    } else {
      setSelected(filtered.map((item) => item.id));
    }
  };

  const exportCsv = () => {
    const headers = [
      "Titre",
      "Statut",
      "Canal",
      "Assigné",
      "Date cible",
      "Priorité",
      "Dernière mise à jour",
    ];
    const rows = items.map((item) => [
      item.title,
      statusLabels[item.status],
      item.channel,
      item.assignee,
      item.dueDate ?? "",
      priorityLabels[item.priority],
      item.lastUpdated,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(";"))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "aeditus-contents.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importCsv = () => {
    alert("Import CSV simulé — connecter Supabase pour l'upload réel.");
  };

  const applyBulk = () => {
    if (selected.length === 0) return;
    if (bulkAction.startsWith("status-")) {
      const status = bulkAction.replace("status-", "") as ContentStatus;
      setItems((prev) => prev.map((item) => (selected.includes(item.id) ? { ...item, status } : item)));
    }
    if (bulkAction.startsWith("delete")) {
      setItems((prev) => prev.filter((item) => !selected.includes(item.id)));
    }
    setSelected([]);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Contenus</h1>
          <p className="text-sm text-muted-foreground">
            Gérez vos sujets, articles et déclinaisons. Tous les titres mènent à la fiche détaillée.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher un contenu"
            className="w-64"
          />
          <Button variant="outline" onClick={importCsv}>
            <Upload className="mr-2 h-4 w-4" /> Import CSV
          </Button>
          <Button onClick={exportCsv}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-3 text-sm">
        <span className="font-medium">Actions groupées</span>
        <select
          className="rounded-md border bg-background px-3 py-2"
          value={bulkAction}
          onChange={(event) => setBulkAction(event.target.value)}
        >
          <option value="status-ready">Marquer comme prêt</option>
          <option value="status-scheduled">Planifier</option>
          <option value="status-published">Marquer comme publié</option>
          <option value="delete">Supprimer</option>
        </select>
        <Button variant="secondary" size="sm" onClick={applyBulk} disabled={selected.length === 0}>
          <Check className="mr-2 h-4 w-4" /> Appliquer ({selected.length})
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-3 py-2 text-left">
                <input type="checkbox" aria-label="Tout sélectionner" onChange={toggleAll} checked={selected.length === filtered.length && filtered.length > 0} />
              </th>
              <th className="px-3 py-2 text-left">Titre</th>
              <th className="px-3 py-2 text-left">Statut</th>
              <th className="px-3 py-2 text-left">Canal</th>
              <th className="px-3 py-2 text-left">Assigné</th>
              <th className="px-3 py-2 text-left">Date cible</th>
              <th className="px-3 py-2 text-left">Priorité</th>
              <th className="px-3 py-2 text-left">Dernière MAJ</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-b last:border-none">
                <td className="px-3 py-3">
                  <input
                    type="checkbox"
                    aria-label={`Sélectionner ${item.title}`}
                    checked={selected.includes(item.id)}
                    onChange={() => toggleSelection(item.id)}
                  />
                </td>
                <td className="px-3 py-3">
                  <Link to={`/app/contents/${item.id}`} className="font-medium hover:underline">
                    {item.title}
                  </Link>
                  <div className="text-xs text-muted-foreground">{item.tags.join(", ")}</div>
                </td>
                <td className="px-3 py-3">
                  <Badge variant="outline">{statusLabels[item.status]}</Badge>
                </td>
                <td className="px-3 py-3">{item.channel}</td>
                <td className="px-3 py-3">{item.assignee}</td>
                <td className="px-3 py-3">{formatDate(item.dueDate)}</td>
                <td className="px-3 py-3">{priorityLabels[item.priority]}</td>
                <td className="px-3 py-3">{formatDate(item.lastUpdated)}</td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/app/contents/${item.id}`}>Ouvrir</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => setItems((prev) => prev.filter((content) => content.id !== item.id))}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Supprimer
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Aucun contenu ne correspond à votre recherche.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
