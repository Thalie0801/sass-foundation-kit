const highlights = [
  {
    title: "Plan éditorial",
    description: "12 articles SEO + 36 déclinaisons social déjà prêts pour validation.",
  },
  {
    title: "Visuels & vidéos",
    description: "Replicate / Fal.ai livrent 18 visuels + 4 vidéos HÉRO.",
  },
  {
    title: "Performance",
    description: "+32% clics vs mois précédent, Instagram ER 5.4%.",
  },
];

const ClientOverview = () => (
  <div className="space-y-6">
    <section className="rounded-2xl border bg-card p-6 shadow-gold">
      <h1 className="text-2xl font-semibold">Bonjour Marc 👋</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Votre copilot Alfie a généré le prochain cycle éditorial en tenant compte des tendances AI Overviews et mobiles.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {highlights.map((highlight) => (
          <article key={highlight.title} className="rounded-xl border bg-background p-4">
            <p className="text-sm font-medium text-primary uppercase tracking-wide">{highlight.title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{highlight.description}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="rounded-2xl border bg-card p-6 shadow-elegant">
      <h2 className="text-lg font-semibold">Actions rapides</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <button className="rounded-xl border bg-background px-4 py-6 text-left text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:shadow-gold">
          Valider le plan éditorial
          <span className="mt-1 block text-xs font-normal text-muted-foreground">12 contenus en attente</span>
        </button>
        <button className="rounded-xl border bg-background px-4 py-6 text-left text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:shadow-gold">
          Activer Fynk Engagement
          <span className="mt-1 block text-xs font-normal text-muted-foreground">400 interactions incluses</span>
        </button>
        <button className="rounded-xl border bg-background px-4 py-6 text-left text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:shadow-gold">
          Consulter les KPI détaillés
          <span className="mt-1 block text-xs font-normal text-muted-foreground">Exports CSV · PDF · PPT</span>
        </button>
      </div>
    </section>
  </div>
);

export default ClientOverview;
