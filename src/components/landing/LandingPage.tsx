import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Calendar, Users, BarChart3, Zap } from "lucide-react";
import logoAeditus from "@/assets/logo-aeditus.jpg";
import { useToast } from "@/hooks/use-toast";

const LandingPage = () => {
  const { toast } = useToast();
  const betaLink = "/auth?mode=signup&plan=Beta";

  const handleBetaClick = useCallback(async () => {
    const hasWindow = typeof window !== "undefined";
    const url = hasWindow ? new URL(betaLink, window.location.origin).toString() : betaLink;
    const canUseClipboard = typeof navigator !== "undefined" && navigator.clipboard?.writeText;

    try {
      if (canUseClipboard) {
        await navigator.clipboard.writeText(url);
      }

      if (hasWindow) {
        window.open(betaLink, "_blank", "noopener,noreferrer");
      }

      toast({
        title: "Lien Beta copié ✨",
        description: "L'inscription s'ouvre dans un nouvel onglet."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Copie impossible",
        description: "Redirection directe vers le programme Beta."
      });

      if (hasWindow) {
        window.location.href = betaLink;
      }
    }
  }, [betaLink, toast]);

  const features = [
    {
      icon: Calendar,
      title: "Vision 360° des campagnes",
      description: "Visualisez chaque publication, canal et jalon stratégique en un seul planning interactif."
    },
    {
      icon: Users,
      title: "Collaboration orchestrée",
      description: "Invitez vos experts, assignez les validations et gardez l'historique de toutes les itérations."
    },
    {
      icon: BarChart3,
      title: "Scores prédictifs IA",
      description: "Anticipez les performances grâce à nos modèles entraînés sur plus de 2M de contenus."
    },
    {
      icon: Zap,
      title: "Automations plug-and-play",
      description: "Déclenchez n8n, Postiz ou vos webhooks maison sans quitter votre espace de travail."
    }
  ];

  const plans = [
    {
      name: "Solo",
      price: "19,90 €",
      period: "/mois",
      description: "L'essentiel pour piloter une première marque sans friction.",
      features: [
        "1 marque & 2 collaborateurs",
        "Calendrier éditorial IA 30 jours",
        "Exports PDF illimités",
        "Support email 48h"
      ],
      badge: {
        label: "Promo",
        className: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
      }
    },
    {
      name: "Équipe",
      price: "49,90 €",
      period: "/mois",
      description: "Pensé pour les agences et scale-ups en pleine croissance.",
      features: [
        "5 marques & 10 collaborateurs",
        "Workflows de validation multi-niveaux",
        "Bibliothèque d'assets partagée",
        "Support chat prioritaire"
      ]
    },
    {
      name: "Scale",
      price: "89,90 €",
      period: "/mois",
      description: "Automatisez vos opérations et pilotez vos KPI en continu.",
      features: [
        "Marques illimitées",
        "Automations n8n & Postiz",
        "Rapports KPI personnalisés",
        "SLA dédié & onboarding"
      ],
      highlight: true
    },
    {
      name: "Beta",
      price: "49,90 €",
      period: "×3",
      description: "Accès anticipé aux nouveautés Aeditus avec accompagnement expert sur 3 mois.",
      features: [
        "Modules Scale inclus",
        "Coaching onboarding 1:1",
        "Canal Slack privé avec l'équipe produit",
        "50 places réservées au programme Beta"
      ],
      badge: {
        label: "Beta (50)",
        className: "bg-primary/10 text-primary border-primary/20"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="border-b border-border/20 backdrop-blur-sm bg-background/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img src={logoAeditus} alt="Aeditus" className="h-10 w-auto" />
              <span className="text-xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                Aeditus
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-foreground">
                Connexion
              </Button>
              <Button variant="premium" size="lg">
                Commencer
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="w-4 h-4 mr-2" />
            Nouvelle génération de SaaS
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-gold bg-clip-text text-transparent leading-tight">
            La Plateforme
            <br />
            Ultime pour vos
            <br />
            <span className="bg-gradient-premium bg-clip-text text-transparent">
              Contenus
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Gérez vos marques, planifiez votre contenu et automatisez vos workflows 
            avec la puissance de l'IA et des intégrations premium.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="premium" size="xl" className="text-lg">
              Essai Gratuit 14 jours
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button onClick={handleBetaClick} variant="hero" size="xl" className="text-lg">
              Rejoindre la Beta
            </Button>
            <Button variant="ghost" size="xl" className="text-lg text-foreground/80">
              Voir la Démo
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="fonctionnalites" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Fonctionnalités Premium
            </h2>
            <p className="text-xl text-muted-foreground">
              Tout ce dont vous avez besoin pour réussir
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/20 hover:shadow-elegant transition-smooth">
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="tarifs" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Tarifs Transparents
            </h2>
            <p className="text-xl text-muted-foreground">
              Choisissez le plan qui correspond à vos ambitions
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative bg-card/50 backdrop-blur-sm border-border/20 transition-smooth hover:shadow-elegant ${
                  plan.highlight ? "border-primary shadow-gold" : ""
                }`}
              >
                {plan.badge && (
                  <Badge
                    className={`absolute -top-3 left-1/2 transform -translate-x-1/2 border ${plan.badge.className}`}
                  >
                    {plan.badge.label}
                  </Badge>
                )}
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-2 text-foreground">
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground">
                      {plan.period}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <Sparkles className="h-4 w-4 text-primary mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant={plan.highlight ? "premium" : "hero"}
                    className="w-full"
                    size="lg"
                  >
                    <Link to={`/auth?mode=signup&plan=${encodeURIComponent(plan.name)}`}>
                      Choisir {plan.name}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-subtle border-border/20 shadow-premium">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold mb-6 text-foreground">
                Prêt à Révolutionner
                <br />
                <span className="bg-gradient-gold bg-clip-text text-transparent">
                  Votre Stratégie Contenu ?
                </span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Rejoignez des milliers d'entreprises qui font confiance à Aeditus
                pour gérer leur présence digitale.
              </p>
              <Button onClick={handleBetaClick} variant="premium" size="xl" className="text-lg">
                Rejoindre la Beta
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img src={logoAeditus} alt="Aeditus" className="h-8 w-auto" />
              <span className="text-lg font-semibold bg-gradient-gold bg-clip-text text-transparent">
                Aeditus
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 Aeditus. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
