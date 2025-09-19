const invoices = [
  { id: "INV-2025-091", customer: "Atelier Verne", amount: "179 €", status: "Payée" },
  { id: "INV-2025-092", customer: "Maison Ondine", amount: "399 €", status: "En cours" },
  { id: "INV-2025-093", customer: "Studio Rive", amount: "79 €", status: "Payée" },
];

const AdminBilling = () => (
  <div className="space-y-6">
    <section className="rounded-2xl border bg-card p-6 shadow-elegant">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-lg font-semibold">Facturation Stripe</h1>
          <p className="text-sm text-muted-foreground">
            Pilotez les abonnements Essential/Starter/Pro, add-ons Fynk et exclusivités avec le mode test activé.
          </p>
        </div>
        <button className="rounded-xl border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          Ouvrir le dashboard Stripe
        </button>
      </header>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border bg-background p-4">
          <p className="text-xs text-muted-foreground">MRR (test)</p>
          <p className="mt-2 text-2xl font-semibold">{"1\u202f986 €"}</p>
        </article>
        <article className="rounded-xl border bg-background p-4">
          <p className="text-xs text-muted-foreground">Add-ons actifs</p>
          <p className="mt-2 text-2xl font-semibold">14 Fynk · 6 Ambassadeurs</p>
        </article>
        <article className="rounded-xl border bg-background p-4">
          <p className="text-xs text-muted-foreground">Paiements en échec</p>
          <p className="mt-2 text-2xl font-semibold">0</p>
        </article>
      </div>
    </section>

    <section className="rounded-2xl border bg-card p-6 shadow-elegant">
      <h2 className="text-base font-semibold">Historique des factures</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="px-3 py-2 font-medium">#</th>
              <th className="px-3 py-2 font-medium">Client</th>
              <th className="px-3 py-2 font-medium">Montant</th>
              <th className="px-3 py-2 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-t border-border/60">
                <td className="px-3 py-2 font-medium">{invoice.id}</td>
                <td className="px-3 py-2">{invoice.customer}</td>
                <td className="px-3 py-2">{invoice.amount}</td>
                <td className="px-3 py-2">
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                    {invoice.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  </div>
);

export default AdminBilling;
