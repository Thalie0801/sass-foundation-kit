import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ContentItem,
  ContentStatus,
  mockContents,
} from "@/lib/mockAppData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Filter, MoveRight } from "lucide-react";

const columns: { status: ContentStatus; label: string }[] = [
  { status: "idea", label: "Idée" },
  { status: "draft", label: "Brouillon" },
  { status: "review", label: "Révision" },
  { status: "ready", label: "Prêt" },
  { status: "scheduled", label: "Planifié" },
  { status: "published", label: "Publié" },
];

const statusLabels: Record<ContentStatus, string> = {
  idea: "Idée",
  draft: "Brouillon",
  review: "Révision",
  ready: "Prêt",
  scheduled: "Planifié",
  published: "Publié",
  archived: "Archivé",
};

type Filters = {
  assignee: string;
  channel: string;
  tag: string;
  search: string;
};

const initialFilters: Filters = {
  assignee: "",
  channel: "",
  tag: "",
  search: "",
};

export default function PlanPage() {
  const [items, setItems] = useState<ContentItem[]>(() => mockContents.map((item) => ({ ...item })));
  const [filters, setFilters] = useState(initialFilters);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const assignees = useMemo(
    () => Array.from(new Set(mockContents.map((item) => item.assignee))).sort(),
    []
  );
  const channels = useMemo(
    () => Array.from(new Set(mockContents.map((item) => item.channel))).sort(),
    []
  );
  const tags = useMemo(
    () => Array.from(new Set(mockContents.flatMap((item) => item.tags))).sort(),
    []
  );

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filters.assignee && item.assignee !== filters.assignee) return false;
      if (filters.channel && item.channel !== filters.channel) return false;
      if (filters.tag && !item.tags.includes(filters.tag)) return false;
      if (filters.search && !item.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [items, filters]);

  const grouped = useMemo(() => {
    return columns.map(({ status }) => ({
      status,
      label: statusLabels[status],
      cards: filteredItems.filter((item) => item.status === status),
    }));
  }, [filteredItems]);

  const handleMove = (id: string, status: ContentStatus) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Plan éditorial</h1>
          <p className="text-sm text-muted-foreground">Glissez-déposez ou utilisez "Déplacer vers…" pour mettre à jour le statut.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Input
              value={filters.search}
              onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
              placeholder="Rechercher un titre"
              className="w-56"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            Filtres
          </div>
          <select
            className="rounded-md border bg-background px-3 py-2 text-sm"
            value={filters.assignee}
            onChange={(event) => setFilters((prev) => ({ ...prev, assignee: event.target.value }))}
          >
            <option value="">Tous les assignés</option>
            {assignees.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <select
            className="rounded-md border bg-background px-3 py-2 text-sm"
            value={filters.channel}
            onChange={(event) => setFilters((prev) => ({ ...prev, channel: event.target.value }))}
          >
            <option value="">Tous les canaux</option>
            {channels.map((channel) => (
              <option key={channel} value={channel}>
                {channel}
              </option>
            ))}
          </select>
          <select
            className="rounded-md border bg-background px-3 py-2 text-sm"
            value={filters.tag}
            onChange={(event) => setFilters((prev) => ({ ...prev, tag: event.target.value }))}
          >
            <option value="">Tous les tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          <Button variant="ghost" size="sm" onClick={() => setFilters(initialFilters)}>
            Réinitialiser
          </Button>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {grouped.map((column) => (
          <div
            key={column.status}
            className="flex flex-col rounded-xl border bg-card"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              const id = draggedId ?? event.dataTransfer.getData("text/plain");
              if (id) {
                handleMove(id, column.status);
              }
              setDraggedId(null);
            }}
          >
            <div className="flex items-center justify-between border-b px-3 py-2">
              <span className="font-medium">{column.label}</span>
              <Badge variant="secondary">{column.cards.length}</Badge>
            </div>
            <div className="flex-1 space-y-3 px-3 py-4">
              {column.cards.length > 0 ? (
                column.cards.map((card) => (
                  <article
                    key={card.id}
                    className="space-y-3 rounded-lg border bg-background p-3 shadow-sm"
                    draggable
                    onDragStart={(event) => {
                      setDraggedId(card.id);
                      event.dataTransfer.setData("text/plain", card.id);
                    }}
                    onDragEnd={() => setDraggedId(null)}
                  >
                    <div className="space-y-1">
                      <Link to={`/app/contents/${card.id}`} className="font-medium hover:underline">
                        {card.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {card.channel} • {card.assignee}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {card.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Priorité : {card.priority}</span>
                      {card.dueDate && <span>Échéance {card.dueDate}</span>}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                          Déplacer vers…
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        {columns.map(({ status, label }) => (
                          <DropdownMenuItem
                            key={status}
                            onSelect={() => handleMove(card.id, status)}
                            disabled={status === card.status}
                          >
                            <MoveRight className="mr-2 h-4 w-4" />
                            {label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </article>
                ))
              ) : (
                <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                  Aucun contenu ici
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
