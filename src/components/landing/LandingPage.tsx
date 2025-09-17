import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Users, BarChart3, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import logoAeditus from "@/assets/logo-aeditus.jpg";

const normalizeLink = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const linkEssential = normalizeLink(import.meta.env.VITE_LINK_ESSENTIAL as string | undefined);
const linkStarter = normalizeLink(import.meta.env.VITE_LINK_STARTER as string | undefined);
const linkPro = normalizeLink(import.meta.env.VITE_LINK_PRO as string | undefined);
const linkFynk = normalizeLink(import.meta.env.VITE_LINK_FYNK as string | undefined);
const linkFynkPro = normalizeLink(import.meta.env.VITE_LINK_FYNK_PRO as string | undefined);

function openLink(url?: string) {
  const normalizedUrl = normalizeLink(url);
  if (!normalizedUrl) {
    alert("Lien paiement non configuré");
    return;
  }
  window.open(normalizedUrl, "_blank", "noopener,noreferrer");
}

const features = [
  {
    icon: Calendar,
    title: "Calendrier Éditorial",
    description: "Planifiez et organisez votre contenu avec notre calendrier intelligent"
  },
  {
    icon: Users,
    title: "Multi-Tenant",
    description: "Gérez plusieurs marques depuis une seule plateforme"
  },
  {
    icon: BarChart3,
    title: "Analytics & KPI",
    description: "Suivez vos performances avec des métriques détaillées"
  },
  {
    icon: Zap,
    title: "Automatisation",
    description: "Intégrations n8n et Postiz pour automatiser vos workflows"
  }
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border/60 backdrop-blur-sm bg-background/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <img src={logoAeditus} alt="Aeditus" className="h-10 w-auto" />
            <span className="text-xl font-bold text-foreground">Æditus</span>
          </div>
          <div className="flex items-center space-x-8">
            <div className="hidden items-center space-x-6 text-sm font-medium text-muted-foreground md:flex">
              <a href="#fonctionnalites" className="transition-colors hover:text-foreground">
                Fonctionnalités
              </a>
              <a href="#tarifs" className="transition-colors hover:text-foreground">
                Tarifs
              </a>
              <a href="#faq" className="transition-colors hover:text-foreground">
                FAQ
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-foreground" asChild>
                <Link to="/auth">Connexion</Link>
              </Button>
              <Button
                variant="hero"
                size="sm"
                onClick={() => {
                  const el = document.querySelector("#tarifs");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Commencer
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-hero-aeditus">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h1 className="text-4xl font-semibold leading-tight lg:text-5xl">
              Æditus — la plateforme éditoriale qui publie pour vous,
              <span className="block text-secondary">et parle comme vous.</span>
            </h1>
            <p className="mt-6 text-lg opacity-80">
              1 idée/sem → article, déclinaisons social, visuels, vidéos. Généré, planifié et publié automatiquement.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                variant="hero"
                size="xl"
                onClick={() => document.querySelector("#tarifs")?.scrollIntoView({ behavior: "smooth" })}
              >
                Voir les tarifs
              </Button>
              <Button variant="luxury" size="xl" onClick={() => openLink(linkPro)} disabled={!linkPro}>
                Offre Ambassadeur
              </Button>
            </div>
            <p className="mt-3 text-sm opacity-70">
              Pré-lancement : <b>LAUNCH25</b> sur Starter & Pro • Ambassadeur : <b>BETA2025</b> (3 mois)
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-border bg-card p-4 shadow">
              <div className="h-44 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15" />
              <p className="mt-3 text-sm opacity-70">Aperçu calendrier + KPI</p>
            </div>
          </div>
        </div>
      </section>

      <section id="fonctionnalites" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-foreground">Fonctionnalités Premium</h2>
            <p className="text-xl text-muted-foreground">Tout ce dont vous avez besoin pour réussir</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/40 bg-card/80 backdrop-blur-sm transition-smooth hover:shadow-elegant">
                <CardContent className="p-6">
                  <feature.icon className="mb-4 h-12 w-12 text-primary" />
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="tarifs" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-6 text-2xl font-semibold">Tarifs</h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Essential</h3>
            </div>
            <p className="mt-2 text-3xl">
              79 €<span className="text-sm opacity-60">/mois</span>
            </p>
            <ul className="mt-4 space-y-2 text-sm opacity-80">
              <li>• Plan éditorial + calendrier</li>
              <li>• Publication multi-plateforme</li>
              <li>• KPI basiques</li>
            </ul>
            <Button className="mt-6 w-full" variant="hero" onClick={() => openLink(linkEssential)} disabled={!linkEssential}>
              Choisir Essential
            </Button>
            {!linkEssential && <p className="mt-2 text-xs opacity-60">Lien paiement non configuré</p>}
          </Card>

          <Card className="border border-secondary p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Starter</h3>
              <Badge>Pré-lancement −25% (LAUNCH25 ⇒ 134,25 €)</Badge>
            </div>
            <p className="mt-2 text-3xl">
              179 €<span className="text-sm opacity-60">/mois</span>
            </p>
            <ul className="mt-4 space-y-2 text-sm opacity-80">
              <li>• 1 idée/sem → article + déclinaisons</li>
              <li>• Vidéo snack 8–12 s</li>
              <li>• KPI intermédiaires</li>
            </ul>
            <Button className="mt-6 w-full" variant="hero" onClick={() => openLink(linkStarter)} disabled={!linkStarter}>
              Choisir Starter
            </Button>
            <p className="mt-2 text-xs opacity-80">
              À l’étape Paiement, saisir <b>LAUNCH25</b> (−25%).
            </p>
            {!linkStarter && <p className="mt-1 text-xs opacity-60">Lien paiement non configuré</p>}
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Pro</h3>
              <Badge>Pré-lancement −25% (LAUNCH25 ⇒ 299,25 €)</Badge>
            </div>
            <p className="mt-2 text-3xl">
              399 €<span className="text-sm opacity-60">/mois</span>
            </p>
            <ul className="mt-4 space-y-2 text-sm opacity-80">
              <li>• + vidéo héro 15–20 s + 2 snacks</li>
              <li>• StyleDNA / ToneGuard</li>
              <li>• KPI avancés + recalibrage</li>
            </ul>
            <Button className="mt-6 w-full" variant="hero" onClick={() => openLink(linkPro)} disabled={!linkPro}>
              Choisir Pro
            </Button>
            <p className="mt-2 text-xs opacity-80">
              À l’étape Paiement, saisir <b>LAUNCH25</b> (−25%).
            </p>
            {!linkPro && <p className="mt-1 text-xs opacity-60">Lien paiement non configuré</p>}
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Ambassadeur</h3>
              <Badge>BETA2025 (−87,5% ×3)</Badge>
            </div>
            <p className="mt-2 text-3xl">49,90 € × 3</p>
            <ul className="mt-4 space-y-2 text-sm opacity-80">
              <li>• Équivalent Pro</li>
              <li>• Réduction 3 mois via code</li>
              <li>• Places limitées</li>
            </ul>
            <Button className="mt-6 w-full" variant="luxury" onClick={() => openLink(linkPro)} disabled={!linkPro}>
              Offre Ambassadeur
            </Button>
            <p className="mt-2 text-xs opacity-80">
              À l’étape Paiement, saisir <b>BETA2025</b>.
            </p>
            {!linkPro && <p className="mt-1 text-xs opacity-60">Lien paiement non configuré</p>}
          </Card>
        </div>

        <h3 className="mt-12 mb-4 text-lg font-semibold">Add-ons</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <p className="font-medium">Fynk</p>
            <p className="mt-2 text-2xl">
              29 €<span className="text-sm opacity-60">/mois</span>
            </p>
            <p className="mt-2 text-sm opacity-80">Assistant IA rédactionnel.</p>
            <Button className="mt-6 w-full" variant="secondary" onClick={() => openLink(linkFynk)} disabled={!linkFynk}>
              Prendre Fynk
            </Button>
            {!linkFynk && <p className="mt-2 text-xs opacity-60">Lien paiement non configuré</p>}
          </Card>

          <Card className="p-6">
            <p className="font-medium">Fynk Pro</p>
            <p className="mt-2 text-2xl">
              69 €<span className="text-sm opacity-60">/mois</span>
            </p>
            <p className="mt-2 text-sm opacity-80">Fonctions avancées & support prioritaire.</p>
            <Button className="mt-6 w-full" variant="secondary" onClick={() => openLink(linkFynkPro)} disabled={!linkFynkPro}>
              Prendre Fynk Pro
            </Button>
            {!linkFynkPro && <p className="mt-2 text-xs opacity-60">Lien paiement non configuré</p>}
          </Card>
        </div>
      </section>

      <section id="faq" className="bg-background/60 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-foreground">FAQ</h2>
            <p className="text-xl text-muted-foreground">Les réponses aux questions les plus fréquentes sur Aeditus</p>
          </div>
          <div className="space-y-6">
            <Card className="border-border/40 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="mb-2 text-lg font-semibold text-foreground">Puis-je essayer Aeditus avant de m'engager ?</h3>
                <p className="text-sm text-muted-foreground">
                  Oui, profitez de 14 jours d'essai gratuit pour découvrir toutes les fonctionnalités de la plateforme sans carte de
                  crédit.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/40 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="mb-2 text-lg font-semibold text-foreground">Puis-je changer de plan à tout moment ?</h3>
                <p className="text-sm text-muted-foreground">
                  Bien sûr, vous pouvez passer à un plan supérieur ou inférieur à tout moment depuis votre tableau de bord sans interruption de
                  service.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/40 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="mb-2 text-lg font-semibold text-foreground">Offrez-vous un accompagnement personnalisé ?</h3>
                <p className="text-sm text-muted-foreground">
                  Notre équipe Customer Success est disponible pour vous aider à configurer Aeditus et partager les meilleures pratiques adaptées à vos objectifs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Card className="border-border/40 bg-card/90 shadow-premium">
            <CardContent className="p-12">
              <h2 className="mb-6 text-4xl font-bold text-foreground">
                Prêt à Révolutionner
                <br />
                <span className="text-secondary">Votre Stratégie Contenu ?</span>
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
                Rejoignez des entreprises qui font confiance à Æditus pour gérer leur présence digitale.
              </p>
              <Button
                variant="hero"
                size="xl"
                onClick={() => document.querySelector("#tarifs")?.scrollIntoView({ behavior: "smooth" })}
              >
                Voir les tarifs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t border-border/60 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center space-x-3">
            <img src={logoAeditus} alt="Aeditus" className="h-8 w-auto" />
            <span className="text-lg font-semibold text-foreground">Æditus</span>
          </div>
          <p>© 2024 Aeditus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
