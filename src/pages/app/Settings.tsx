const toggles = [
  { id: "autoschedule", label: "Auto-planification", description: "Remplir automatiquement les créneaux libres." },
  { id: "notifications", label: "Notifications multicanaux", description: "Email + Slack + WhatsApp." },
  { id: "alfie", label: "Suggestions Alfie", description: "Titres, formats, timing optimisé." },
];

const ClientSettings = () => (
  <div className="rounded-2xl border bg-card p-6 shadow-elegant">
    <h1 className="text-lg font-semibold">Paramètres du workspace</h1>
    <p className="mt-1 text-sm text-muted-foreground">
      Ajustez vos préférences : automations, notifications, accès équipe et export KPI.
    </p>
    <ul className="mt-6 space-y-3">
      {toggles.map((toggle) => (
        <li key={toggle.id} className="flex items-center justify-between rounded-xl border bg-background p-4">
          <div>
            <p className="font-medium">{toggle.label}</p>
            <p className="text-xs text-muted-foreground">{toggle.description}</p>
          </div>
          <button className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Activé
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default ClientSettings;
