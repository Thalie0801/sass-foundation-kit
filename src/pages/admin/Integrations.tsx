const integrations = [
  {
    name: "Stripe Billing",
    status: "Connecté",
    description: "Paiements, abonnements & factures automatiques",
  },
  {
    name: "n8n Cloud",
    status: "Webhook OK",
    description: "Orchestration génération IA & monitoring",
  },
  {
    name: "Postiz",
    status: "File d'attente",
    description: "Publication jusqu'à 20 réseaux avec retries",
  },
  {
    name: "WordPress",
    status: "Connecteur",
    description: "Publication articles + SEO schema",
  },
];

const AdminIntegrations = () => (
  <div className="rounded-2xl border bg-card p-6 shadow-elegant">
    <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-lg font-semibold">Intégrations critiques</h1>
        <p className="text-sm text-muted-foreground">
          Vérifiez les connecteurs Stripe, Postiz, WordPress, Replicate/Fal.ai et configurez les clés API par tenant.
        </p>
      </div>
      <button className="rounded-xl border bg-background px-4 py-2 text-sm shadow-sm hover:bg-muted">
        Ajouter une intégration
      </button>
    </header>
    <ul className="mt-6 grid gap-4 md:grid-cols-2">
      {integrations.map((integration) => (
        <li key={integration.name} className="rounded-xl border bg-background p-4">
          <header className="flex items-center justify-between">
            <h2 className="text-base font-semibold">{integration.name}</h2>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              {integration.status}
            </span>
          </header>
          <p className="mt-2 text-sm text-muted-foreground">{integration.description}</p>
          <button className="mt-4 text-sm font-medium text-primary underline-offset-4 hover:underline">
            Tester la connexion
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default AdminIntegrations;
