const metrics = [
  { label: "Tenants actifs", value: "32", delta: "+5 cette semaine" },
  { label: "Contenus générés", value: "486", delta: "92% automatisé" },
  { label: "Taux approbation", value: "87%", delta: "Clients satisfaits" },
];

const workflows = [
  {
    name: "SEO Pipeline",
    status: "Opérationnel",
    description: "n8n → OpenAI → Postiz",
    badge: "Realtime",
  },
  {
    name: "Facturation Stripe",
    status: "Sync",
    description: "Abonnements + add-ons",
    badge: "Audité",
  },
  {
    name: "Sandbox QA",
    status: "Tests en cours",
    description: "Contenus fictifs + Postiz brouillon",
    badge: "Pré-prod",
  },
];

const AdminDashboard = () => (
  <div className="space-y-6">
    <section className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric) => (
        <article key={metric.label} className="rounded-2xl border bg-card p-4 shadow-elegant">
          <p className="text-sm text-muted-foreground">{metric.label}</p>
          <p className="mt-3 text-3xl font-semibold">{metric.value}</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-primary">{metric.delta}</p>
        </article>
      ))}
    </section>

    <section className="rounded-2xl border bg-card p-6 shadow-elegant">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Workflows critiques</h2>
          <p className="text-sm text-muted-foreground">
            Surveillez les intégrations n8n, Stripe et Postiz pour garantir la continuité de service.
          </p>
        </div>
        <button className="rounded-xl border border-primary/40 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          Ouvrir n8n Cloud
        </button>
      </header>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {workflows.map((item) => (
          <article key={item.name} className="rounded-xl border bg-background p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">{item.name}</h3>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] uppercase tracking-wide text-primary">
                {item.badge}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            <p className="mt-3 text-xs font-medium text-emerald-600 dark:text-emerald-400">{item.status}</p>
          </article>
        ))}
      </div>
    </section>
  </div>
);

export default AdminDashboard;
