import { Link } from "react-router-dom";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Users,
  Zap
} from "lucide-react";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Sparkles,
    title: "Assistant IA intégré",
    description: "Co-pilotez vos campagnes avec une IA entraînée sur vos guidelines et vos objectifs."
  },
  {
    icon: Calendar,
    title: "Calendrier orchestré",
    description: "Planifiez, validez et publiez sur tous vos canaux depuis une seule interface."
  },
  {
    icon: Users,
    title: "Collaboration multi-marques",
    description: "Invitez vos équipes et vos clients pour valider chaque étape en temps réel."
  },
  {
    icon: BarChart3,
    title: "Pilotage des performances",
    description: "Analysez vos KPI et ajustez vos campagnes grâce à des tableaux de bord prêts à l'emploi."
  },
  {
    icon: Zap,
    title: "Workflows automatisés",
    description: "Déclenchez vos intégrations n8n et Postiz pour industrialiser votre production."
  },
  {
    icon: ShieldCheck,
    title: "Gouvernance avancée",
    description: "Contrôlez les droits, validez les contenus et auditez vos process en un clic."
  }
];

const faqs = [
  {
    question: "Aeditus propose-t-il un essai gratuit ?",
    answer:
      "Oui, vous disposez de 14 jours pour explorer toutes les fonctionnalités du plan Starter avant de choisir votre abonnement."
  },
  {
    question: "Puis-je inviter des clients ou des freelances ?",
    answer:
      "Chaque plan inclut des rôles flexibles. Vous pouvez inviter vos partenaires en lecture seule ou avec des droits d'édition selon vos besoins."
  },
  {
    question: "Comment fonctionne l'accès beta ?",
    answer:
      "Nous ouvrons 50 places pour co-construire les fonctionnalités IA avancées. Une fois votre demande envoyée, l'équipe vous recontacte sous 48h."
  },
  {
    question: "Les données sont-elles sécurisées ?",
    answer:
      "Les données sont hébergées en Union Européenne avec chiffrement au repos et en transit, et une journalisation complète des actions."
  }
];

type PlanBadgeTone = "promo" | "beta";

type StandardPlan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  ctaLink: string;
  ctaVariant: "hero" | "premium";
  badge?: { label: string; tone: PlanBadgeTone };
  isBeta?: false;
};

type BetaPlan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  ctaVariant: "hero" | "premium";
  badge?: { label: string; tone: PlanBadgeTone };
  isBeta: true;
  betaLink?: string;
};

type PricingPlan = StandardPlan | BetaPlan;

const LandingPage = () => {
  const betaAccessLink = (import.meta.env.VITE_BETA_ACCESS_URL ?? "") as string;

  const plans = useMemo<PricingPlan[]>(
    () => [
      {
        name: "Starter",
        price: "29€",
        period: "/mois",
        description: "Tout pour lancer votre stratégie éditoriale avec un pack d'automations prêt-à-l'emploi.",
        features: [
          "1 marque",
          "10 campagnes actives",
          "Assistant IA Essentials",
          "Support email"
        ],
        ctaLink: "/auth?mode=signup&plan=Starter",
        ctaVariant: "premium" as const,
        badge: { label: "Promo", tone: "promo" },
        isBeta: false
      },
      {
        name: "Growth",
        price: "79€",
        period: "/mois",
        description: "Pensé pour les équipes marketing qui industrialisent leur production multi-canaux.",
        features: [
          "5 marques",
          "50 campagnes actives",
          "Validation client en marque blanche",
          "Automations avancées"
        ],
        ctaLink: "/auth?mode=signup&plan=Growth",
        ctaVariant: "hero" as const,
        isBeta: false
      },
      {
        name: "Scale",
        price: "129€",
        period: "/mois",
        description: "Ajoutez de la gouvernance, du reporting et des intégrations personnalisées.",
        features: [
          "Marques illimitées",
          "Dashboard KPI temps réel",
          "SLA prioritaire",
          "Exports BI"
        ],
        ctaLink: "/auth?mode=signup&plan=Scale",
        ctaVariant: "hero" as const,
        isBeta: false
      },
      {
        name: "Suite IA",
        price: "Beta",
        period: "",
        description: "Accès anticipé aux modules génératifs, scoring de contenus et prédictions de performance.",
        features: [
          "Coaching IA personnalisé",
          "Templates dynamiques",
          "Moteur de recommandations",
          "Roadmap partagée avec l'équipe produit"
        ],
        isBeta: true,
        ctaVariant: "premium" as const,
        badge: { label: "Beta (50)", tone: "beta" },
        betaLink: betaAccessLink
      }
    ],
    [betaAccessLink]
  );

  const openBeta = (link?: string) => {
    if (!link) {
      return;
    }

    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-gradient-dark text-foreground">
      <Header />
      <main>
        <section className="px-4 pb-24 pt-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-8 text-center lg:text-left">
              <Badge className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 text-primary">
                <Sparkles className="h-4 w-4" />
                Orchestration marketing augmentée
              </Badge>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
                La fondation SaaS qui synchronise
                <span className="block bg-gradient-premium bg-clip-text text-transparent"> contenus, équipes et résultats.</span>
              </h1>
              <p className="text-lg text-muted-foreground sm:text-xl">
                Centralisez vos rituels éditoriaux, alignez vos parties prenantes et accélérez vos livrables grâce à
                une plateforme pensée pour les agences et équipes marketing exigeantes.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button asChild size="xl" variant="premium" className="text-base shadow-gold">
                  <Link to="/auth?mode=signup&plan=Starter" className="inline-flex items-center gap-2">
                    Commencer gratuitement
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="xl" variant="hero" className="text-base">
                  <Link to="#tarifs">Explorer les tarifs</Link>
                </Button>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="relative h-full w-full max-w-xl overflow-hidden rounded-3xl border border-border/30 bg-background/60 p-8 shadow-elegant">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/80">Pilotage 360°</p>
                    <h2 className="mt-3 text-2xl font-semibold">Votre console marketing en temps réel</h2>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {features.slice(0, 4).map((feature) => (
                      <div key={feature.title} className="rounded-2xl border border-border/30 bg-background/80 p-4">
                        <feature.icon className="mb-3 h-6 w-6 text-primary" />
                        <p className="text-sm font-medium text-foreground">{feature.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-2xl border border-primary/30 bg-gradient-premium/40 p-4 text-sm text-primary-foreground">
                    <p className="font-medium">"Nous orchestrons désormais 6 marques avec un seul sprint hebdomadaire"</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.3em] text-primary-foreground/80">Collectif Marketing Aéditus</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="fonctionnalites" className="border-t border-border/20 bg-background/40 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <Badge className="mb-4 border border-primary/30 bg-primary/10 text-primary">Fonctionnalités</Badge>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Tout votre dispositif éditorial, parfaitement orchestré</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Des modules pensés pour couvrir l'intégralité de la chaîne de valeur : stratégie, production, diffusion et pilotage.
              </p>
            </div>
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="h-full border-border/30 bg-card/70 backdrop-blur">
                  <CardHeader>
                    <feature.icon className="h-8 w-8 text-primary" />
                    <CardTitle className="mt-4 text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-relaxed text-muted-foreground">{feature.description}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="tarifs" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl text-center">
            <Badge className="mb-4 border border-primary/30 bg-primary/10 text-primary">Tarifs</Badge>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Des plans taillés pour scaler votre organisation</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Choisissez le niveau qui correspond à votre maturité. Vous pouvez évoluer à tout moment, sans frais cachés.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-6xl gap-8 md:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={cn(
                  "relative flex h-full flex-col justify-between border-border/30 bg-card/70 p-8 text-left shadow-none transition-all hover:shadow-elegant",
                  plan.isBeta ? "border-primary/40" : ""
                )}
              >
                {plan.badge ? (
                  <Badge
                    className={cn(
                      "absolute -top-3 left-1/2 -translate-x-1/2 border-none px-3 py-1 text-xs font-semibold uppercase tracking-wide",
                      plan.badge.tone === "promo"
                        ? "bg-gradient-gold text-primary-foreground"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    {plan.badge.label}
                  </Badge>
                ) : null}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-foreground">{plan.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {plan.features.map((feature: string) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8">
                  {plan.isBeta ? (
                    <Button
                      size="lg"
                      variant={plan.ctaVariant}
                      className="w-full"
                      onClick={() => openBeta(plan.betaLink)}
                      disabled={!plan.betaLink}
                    >
                      Rejoindre la beta
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button asChild size="lg" variant={plan.ctaVariant} className="w-full">
                      <Link to={plan.ctaLink}>{`Choisir ${plan.name}`}</Link>
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section id="faq" className="border-t border-border/20 bg-background/40 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Badge className="mb-4 border border-primary/30 bg-primary/10 text-primary">FAQ</Badge>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Questions fréquentes</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Vous ne trouvez pas la réponse recherchée ? Écrivez-nous et nous reviendrons vers vous en moins de 24h.
              </p>
            </div>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.question}
                  value={faq.question}
                  className="overflow-hidden rounded-2xl border border-border/30 bg-card/70 px-4"
                >
                  <AccordionTrigger className="text-left text-base font-semibold text-foreground">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-sm text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
