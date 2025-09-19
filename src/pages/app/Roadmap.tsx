import { useMemo, useState } from "react";

const kanbanColumns = [
  {
    name: "Backlog",
    items: ["Études AI Overviews", "Landing page Fynk"],
  },
  {
    name: "En cours",
    items: ["Calendrier éditorial Octobre", "Série Reels 9:16"],
  },
  {
    name: "Prêt", 
    items: ["Newsletter premium", "Vidéo HERO studio"],
  },
];

const timeline = [
  { date: "Semaine 38", task: "Validation plan + assets visuels" },
  { date: "Semaine 39", task: "Programmation Postiz multi-réseaux" },
  { date: "Semaine 40", task: "Analyse KPI + recommandations" },
];

const tableRows = [
  { type: "Article", owner: "Æditus", status: "À valider", slot: "17 sept." },
  { type: "Reel IG", owner: "Æditus", status: "Planifié", slot: "19 sept." },
  { type: "Post LinkedIn", owner: "Client", status: "Brouillon", slot: "20 sept." },
];

const views = [
  { id: "kanban", label: "Kanban" },
  { id: "timeline", label: "Timeline" },
  { id: "table", label: "Table" },
] as const;

type ViewId = (typeof views)[number]["id"];

const ClientRoadmap = () => {
  const [view, setView] = useState<ViewId>(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("aeditus.roadmap-view");
      if (saved === "timeline" || saved === "table") return saved;
    }
    return "kanban";
  });

  const handleViewChange = (next: ViewId) => {
    setView(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("aeditus.roadmap-view", next);
    }
  };

  const content = useMemo(() => {
    switch (view) {
      case "kanban":
        return (
          <div className="grid gap-4 md:grid-cols-3">
            {kanbanColumns.map((column) => (
              <section key={column.name} className="rounded-2xl border bg-background p-4">
                <header className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {column.name}
                  </h3>
                  <span className="text-xs text-muted-foreground">{column.items.length}</span>
                </header>
                <ul className="mt-3 space-y-3">
                  {column.items.map((item) => (
                    <li key={item} className="rounded-xl border bg-card px-3 py-2 text-sm shadow-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        );
      case "timeline":
        return (
          <ol className="relative space-y-6 border-l border-dashed border-primary/40 pl-6">
            {timeline.map((entry) => (
              <li key={entry.date} className="relative">
                <span className="absolute -left-3 top-1.5 h-2.5 w-2.5 rounded-full border border-primary/50 bg-primary/10" />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{entry.date}</p>
                <p className="text-sm text-foreground">{entry.task}</p>
              </li>
            ))}
          </ol>
        );
      case "table":
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Responsable</th>
                  <th className="px-3 py-2 font-medium">Statut</th>
                  <th className="px-3 py-2 font-medium">Créneau</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row) => (
                  <tr key={`${row.type}-${row.slot}`} className="border-t border-border/60">
                    <td className="px-3 py-2 font-medium">{row.type}</td>
                    <td className="px-3 py-2">{row.owner}</td>
                    <td className="px-3 py-2">
                      <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs uppercase tracking-wide text-primary">
                        {row.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">{row.slot}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  }, [view]);

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-lg font-semibold">Roadmap éditoriale</h1>
          <p className="text-sm text-muted-foreground">
            Kanban, timeline ou table : choisissez votre vue, glissez-déposez et laissez Alfie recalculer les quotas.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border bg-background p-1 text-xs">
          {views.map((item) => (
            <button
              key={item.id}
              onClick={() => handleViewChange(item.id)}
              className={`rounded-full px-3 py-1 transition ${
                view === item.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>
      <div className="rounded-2xl border bg-card p-6 shadow-elegant">{content}</div>
    </div>
  );
};

export default ClientRoadmap;
