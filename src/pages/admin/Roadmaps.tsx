const roadmapRows = [
  {
    feature: "Mode Sandbox complet",
    status: "En test",
    impact: "QA",
    votes: 18,
  },
  {
    feature: "Exports PowerPoint",
    status: "Prévu",
    impact: "Customer Success",
    votes: 26,
  },
  {
    feature: "Copilot Alfie multilingue",
    status: "Livré",
    impact: "AI",
    votes: 42,
  },
];

const AdminRoadmaps = () => (
  <div className="space-y-4">
    <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-lg font-semibold">Roadmap publique & feedback</h1>
        <p className="text-sm text-muted-foreground">
          Synchronisez les suggestions clients, votes et statuts pour piloter la roadmap visible depuis la plateforme.
        </p>
      </div>
      <button className="rounded-xl border bg-background px-4 py-2 text-sm shadow-sm hover:bg-muted">
        Exporter en CSV
      </button>
    </header>

    <section className="overflow-hidden rounded-2xl border bg-card">
      <div className="hidden border-b bg-muted/40 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid md:grid-cols-[2fr_1fr_1fr_80px]">
        <span>Feature</span>
        <span>Impact</span>
        <span>Statut</span>
        <span>Votes</span>
      </div>
      <ul className="divide-y divide-border/70">
        {roadmapRows.map((row) => (
          <li key={row.feature} className="grid gap-3 px-6 py-4 text-sm md:grid-cols-[2fr_1fr_1fr_80px]">
            <div>
              <p className="font-semibold">{row.feature}</p>
              <p className="text-xs text-muted-foreground">Aligné avec les besoins SEO & social automation.</p>
            </div>
            <span className="self-center rounded-full border px-3 py-1 text-xs uppercase tracking-wide text-muted-foreground">
              {row.impact}
            </span>
            <span className="self-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              {row.status}
            </span>
            <span className="self-center text-right text-base font-semibold">{row.votes}</span>
          </li>
        ))}
      </ul>
    </section>
  </div>
);

export default AdminRoadmaps;
