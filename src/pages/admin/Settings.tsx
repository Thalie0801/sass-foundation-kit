const toggles = [
  { id: "rls", label: "Row Level Security activée", description: "Protège toutes les tables Supabase par tenant." },
  { id: "sandbox", label: "Mode Sandbox", description: "Génère contenus fictifs et paiements Stripe test." },
  { id: "copilot", label: "Alfie Copilot", description: "Disponible pour tous les forfaits client." },
];

const AdminSettings = () => (
  <div className="rounded-2xl border bg-card p-6 shadow-elegant">
    <h1 className="text-lg font-semibold">Paramètres généraux</h1>
    <p className="mt-1 text-sm text-muted-foreground">
      Configurez les options globales : rôles, sandbox, exports et notifications multi-canaux.
    </p>
    <ul className="mt-6 space-y-4">
      {toggles.map((toggle) => (
        <li key={toggle.id} className="flex items-start justify-between gap-4 rounded-xl border bg-background p-4">
          <div>
            <p className="font-medium">{toggle.label}</p>
            <p className="text-sm text-muted-foreground">{toggle.description}</p>
          </div>
          <button className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Activé
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default AdminSettings;
