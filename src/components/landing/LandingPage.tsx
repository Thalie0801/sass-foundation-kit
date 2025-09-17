import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Calendar, Users, BarChart3, Zap } from "lucide-react";
import logoAeditus from "@/assets/logo-aeditus.jpg";
import { getBetaLink } from "@/lib/env";

const LandingPage = () => {
  const betaLink = getBetaLink();
  const hasBetaLink = Boolean(betaLink);

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

  const plans = [
    {
      name: "Starter",
      price: "29€",
      period: "/mois",
      description: "Pour les petites équipes qui débutent",
      features: ["1 marque", "10 publications/mois", "Support email", "Calendrier basique"]
    },
    {
      name: "Pro",
      price: "79€",
      period: "/mois",
      description: "Pour les équipes qui grandissent",
      features: ["5 marques", "100 publications/mois", "Support prioritaire", "Analytics avancées", "Intégrations"],
      popular: true
    },
    {
      name: "Beta",
      price: "149€",
      period: "/mois",
      description: "Pour les grandes organisations",
      features: ["Marques illimitées", "Publications illimitées", "Support dédié", "API complète", "Fonctionnalités beta"]
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
            <Button variant="hero" size="xl" className="text-lg">
              Voir la Démo
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Tarifs Transparents
            </h2>
            <p className="text-xl text-muted-foreground">
              Choisissez le plan qui correspond à vos ambitions
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const isBetaPlan = plan.name === "Beta";

              const handlePlanClick = () => {
                if (isBetaPlan) {
                  if (betaLink) {
                    window.open(betaLink, "_blank", "noopener,noreferrer");
                  }
                  return;
                }
              };

              return (
                <Card
                  key={index}
                  className={`relative bg-card/50 backdrop-blur-sm border-border/20 transition-smooth hover:shadow-elegant ${
                    plan.popular ? 'border-primary shadow-gold' : ''
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-gold text-primary-foreground">
                      Populaire
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
                      variant={plan.popular ? "premium" : "hero"}
                      className="w-full"
                      size="lg"
                      onClick={handlePlanClick}
                      disabled={isBetaPlan && !hasBetaLink}
                    >
                      Choisir {plan.name}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
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
              <Button variant="premium" size="xl" className="text-lg">
                Commencer Maintenant
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
