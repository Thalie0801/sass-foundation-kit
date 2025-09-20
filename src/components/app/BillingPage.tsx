import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockOrganization, mockInvoices } from "@/lib/mockAppData";
import { Badge } from "@/components/ui/badge";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Facturation</h1>
        <p className="text-sm text-muted-foreground">
          Consultez vos plans, factures et accédez au portail Stripe pour modifier votre abonnement.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Plan actuel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-lg font-semibold">Offre {mockOrganization.currentPlan}</p>
              <p className="text-muted-foreground">Facturation mensuelle. Prochaine échéance le {mockOrganization.nextInvoiceDate}.</p>
            </div>
            <Badge variant="secondary">Actif</Badge>
          </div>
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm">
              Quotas hebdo :
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {Object.entries(mockOrganization.quotas.weekly).map(([channel, value]) => (
                <li key={channel}>
                  {channel} : {value}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button>Mettre à niveau</Button>
            <Button variant="outline" asChild>
              <a href="https://billing.stripe.com" target="_blank" rel="noreferrer">
                Ouvrir le portail Stripe
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique des factures</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {mockInvoices.map((invoice) => (
            <div key={invoice.id} className="flex flex-wrap items-center justify-between rounded border px-3 py-2">
              <div>
                <p className="font-medium">{invoice.date}</p>
                <p className="text-xs text-muted-foreground">Référence {invoice.id}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">{formatCurrency(invoice.amount)}</span>
                <Button variant="outline" size="sm" asChild>
                  <a href={invoice.url} target="_blank" rel="noreferrer">
                    Télécharger
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
