import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  BarChart3,
  LayoutDashboard,
  Puzzle,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";

import logoAeditus from "@/assets/logo-aeditus.jpg";

type ExtendedWindow = Window & { openBeta?: () => void };

const LandingPage = () => {
  const navigation = useMemo(
    () => [
      { label: "Fonctionnalités", href: "#fonctionnalites" },
      { label: "Tarifs", href: "#tarifs" },
      { label: "FAQ", href: "#faq" },
    ],
    [],
  );

  const features = useMemo(
    () => [
      {
        icon: LayoutDashboard,
        title: "Pilotage multi-marques",
        description:
          "Coordonnez chaque marque depuis un cockpit unique : calendriers, campagnes et validations centralisés.",
      },
      {
        icon: Workflow,
        title: "Playbooks automatisés",
        description:
          "Déployez des scénarios n8n et Postiz préconfigurés pour publier, recycler et amplifier votre contenu sans effort.",
      },
      {
        icon: BarChart3,
        title: "Analytique temps réel",
        description:
          "Visualisez l'impact de vos actions avec des tableaux de bord orientés KPI, prêts pour vos comités marketing.",
      },
      {
        icon: ShieldCheck,
        title: "Gouvernance renforcée",
        description:
          "Définissez des rôles, tracez les validations et protégez vos actifs avec des contrôles conformes aux standards B2B.",
      },
      {
        icon: Puzzle,
        title: "Marketplace intégrée",
        description:
          "Connectez HubSpot, Notion, Slack ou votre DAM en quelques clics grâce à notre catalogue d'intégrations natif.",
      },
      {
        icon: Users,
        title: "Collaboration augmentée",
        description:
          "Invitez vos agences et partenaires, travaillez en temps réel et suivez les contributions directement dans Aeditus.",
      },
    ],
    [],
  );

  const pricingPlans = useMemo(
    () => [
      {
        name: "Starter",
        price: "29€",
        period: "/mois",
        description: "Pour structurer votre premier calendrier éditorial d'équipe.",
        badge: "Promo",
        features: [
          "1 marque & 3 espaces collaboratifs",
          "Calendrier éditorial et vues Kanban",
          "10 automatisations mensuelles",
          "Support email sous 24h",
        ],
        ctaLabel: "Lancer Starter",
        ctaHref: "/auth?mode=signup&plan=Starter",
      },
      {
        name: "Pro",
        price: "79€",
        period: "/mois",
        description: "Pensé pour les équipes marketing qui gèrent plusieurs lancements.",
        badge: "Promo",
        features: [
          "5 marques illimitées",
          "Playbooks multi-canal",
          "Reporting KPI exportable",
          "Support prioritaire & onboarding",
        ],
        highlight: true,
        ctaLabel: "Choisir Pro",
        ctaHref: "/auth?mode=signup&plan=Pro",
      },
      {
        name: "Business",
        price: "129€",
        period: "/mois",
        description: "La fondation pour orchestrer un collectif marketing distribué.",
        features: [
          "Marques illimitées & droits granulaires",
          "SLA 99.9% et signature SSO",
          "Automatisations personnalisées",
          "Gestion des campagnes multi-pays",
        ],
        ctaLabel: "Activer Business",
        ctaHref: "/auth?mode=signup&plan=Business",
      },
      {
        name: "Beta",
        price: "0€",
        period: "pendant la bêta",
        description: "Accédez en avant-première aux modules IA et aux intégrations exclusives.",
        badge: "Beta (50)",
        features: [
          "Modules IA génératifs",
          "Conseiller onboarding dédié",
          "Accès aux futures releases",
          "Sessions produit mensuelles",
        ],
        ctaLabel: "Rejoindre la Beta",
        ctaAction: "beta",
      },
    ],
    [],
  );

  const faqs = useMemo(
    () => [
      {
        question: "Quelle est la durée de l'essai Starter ?",
        answer:
          "L'essai Starter dure 14 jours sans engagement. Vous pouvez inviter l'ensemble de votre équipe et tester toutes les fonctionnalités du plan.",
      },
      {
        question: "Peut-on migrer depuis un autre outil ?",
        answer:
          "Oui, nos spécialistes vous accompagnent gratuitement pour importer vos contenus, workflows et taxonomies existantes depuis Excel, Notion ou Trello.",
      },
      {
        question: "Comment fonctionne la bêta privée ?",
        answer:
          "La bêta est limitée à 50 comptes. Nous planifions un onboarding personnalisé et recueillons vos retours toutes les deux semaines pour accélérer notre feuille de route.",
      },
      {
        question: "Proposez-vous un hébergement européen ?",
        answer:
          "Aeditus est hébergé sur des infrastructures européennes conformes RGPD. Des options dédiées ou on-premise sont disponibles pour les clients Enterprise.",
      },
    ],
    [],
  );

  const openBeta = () => {
    if (typeof window === "undefined") {
      return;
    }

    const browserWindow = window as ExtendedWindow;
    if (typeof browserWindow.openBeta === "function") {
      browserWindow.openBeta();
      return;
    }

    window.location.href = "/auth?mode=signup&plan=Beta";
  };

  return (
    <div className="min-h-screen bg-gradient-dark text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/30 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <a className="flex items-center gap-3" href="#">
            <img src={logoAeditus} alt="Aeditus" className="h-10 w-auto rounded-xl" />
            <span className="text-xl font-semibold tracking-tight">
              <span className="bg-gradient-gold bg-clip-text text-transparent">Aeditus</span>
            </span>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            {navigation.map((item) => (
              <a
                key={item.href}
                className="transition-colors hover:text-primary"
                href={item.href}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <a href="/auth?mode=signin">Connexion</a>
            </Button>
            <Button variant="hero" onClick={openBeta}>
              Beta privée
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="px-4 pb-24 pt-16 sm:px-6 lg:px-8 lg:pt-24">
          <div className="mx-auto max-w-5xl text-center">
            <Badge className="mx-auto mb-6 flex items-center gap-2 bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
              Aeditus Foundation Kit
            </Badge>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-pretty sm:text-5xl md:text-6xl">
              Le cockpit éditorial des équipes marketing B2B ambitieuses.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Synchronisez calendriers, campagnes et automatisations dans un espace unique. De la stratégie à l'analyse, Aeditus
              équipe vos squads pour publier plus vite et mieux.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="xl" variant="premium" className="px-10 text-base">
                <a href="/auth?mode=signup&plan=Starter">
                  Démarrer avec Starter
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button size="xl" variant="ghost" className="px-10 text-base" onClick={openBeta}>
                Rejoindre la bêta privée
              </Button>
            </div>
          </div>
        </section>

        <section
          id="fonctionnalites"
          className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold sm:text-4xl">Fonctionnalités clés</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Une base solide pour industrialiser votre production de contenu tout en conservant la finesse stratégique de votre équipe.
              </p>
            </div>
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="h-full border-border/20 bg-card/70 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-elevated"
                >
                  <CardHeader className="flex h-full flex-col gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="tarifs" className="bg-background/40 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold sm:text-4xl">Tarifs pensés pour votre croissance</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Des plans clairs, sans surprise, pour aligner vos équipes et accélérer votre go-to-market.
              </p>
            </div>
            <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {pricingPlans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative flex h-full flex-col border-border/30 bg-card/80 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-premium ${
                    plan.highlight ? "border-primary shadow-gold" : ""
                  }`}
                >
                  {plan.badge ? (
                    <Badge className="absolute -top-3 left-4 bg-gradient-gold text-primary-foreground">
                      {plan.badge}
                    </Badge>
                  ) : null}
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold">{plan.name}</CardTitle>
                    <CardDescription className="text-base text-muted-foreground">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-primary">{plan.price}</span>
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    </div>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      {plan.features.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    {plan.ctaAction === "beta" ? (
                      <Button className="w-full" size="lg" variant="hero" onClick={openBeta}>
                        {plan.ctaLabel}
                      </Button>
                    ) : (
                      <Button className="w-full" size="lg" variant={plan.highlight ? "premium" : "hero"} asChild>
                        <a href={plan.ctaHref}>{plan.ctaLabel}</a>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <h2 className="text-3xl font-semibold sm:text-4xl">FAQ</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Les réponses aux questions les plus fréquentes de nos équipes pilotes.
              </p>
            </div>
            <Accordion type="single" collapsible className="mt-12 divide-y divide-border/20 rounded-3xl border border-border/20 bg-card/60 backdrop-blur-xl">
              {faqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question} className="px-6">
                  <AccordionTrigger className="text-left text-base font-semibold sm:text-lg">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/20 bg-background/60 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img src={logoAeditus} alt="Aeditus" className="h-8 w-auto rounded-lg" />
            <span className="text-lg font-semibold">
              <span className="bg-gradient-gold bg-clip-text text-transparent">Aeditus</span>
            </span>
          </div>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            {navigation.map((item) => (
              <a key={item.href} className="transition-colors hover:text-primary" href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Aeditus. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
