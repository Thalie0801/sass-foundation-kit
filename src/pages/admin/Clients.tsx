const clients = [
  {
    name: "Atelier Verne",
    plan: "Starter",
    health: "vert",
    contents: 48,
    manager: "Marc",
  },
  {
    name: "Maison Ondine",
    plan: "Pro",
    health: "ambre",
    contents: 92,
    manager: "Julie",
  },
  {
    name: "Club Ambassadeurs",
    plan: "Essential",
    health: "vert",
    contents: 16,
    manager: "Lucas",
  },
];

const AdminClients = () => (
  <div className="rounded-2xl border bg-card p-6 shadow-elegant">
    <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-lg font-semibold">Clients & quotas</h1>
        <p className="text-sm text-muted-foreground">
          Visualisez les plans, add-ons Fynk/Ambassadeurs et la consommation des quotas contenus.
        </p>
      </div>
      <button className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-gold">
        Ajouter un client
      </button>
    </header>

    <div className="mt-6 overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-muted-foreground">
            <th className="px-3 py-2 font-medium">Organisation</th>
            <th className="px-3 py-2 font-medium">Plan</th>
            <th className="px-3 py-2 font-medium">Quota utilisé</th>
            <th className="px-3 py-2 font-medium">CSM</th>
            <th className="px-3 py-2 font-medium">Statut</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.name} className="border-t border-border/60">
              <td className="px-3 py-3 font-medium">{client.name}</td>
              <td className="px-3 py-3">{client.plan}</td>
              <td className="px-3 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 rounded-full bg-muted">
                    <span
                      className="block h-full rounded-full bg-primary"
                      style={{ width: `${Math.min(100, client.contents)}%` }}
                    />
                  </div>
                  <span>{client.contents} contenus</span>
                </div>
              </td>
              <td className="px-3 py-3 text-muted-foreground">{client.manager}</td>
              <td className="px-3 py-3">
                <span
                  className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide"
                >
                  {client.health === "vert" ? "Actif" : "À surveiller"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminClients;
