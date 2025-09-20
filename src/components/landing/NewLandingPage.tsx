/* eslint-disable react-refresh/only-export-components */
"use client";

import { useState } from "react";

type Plan = {
  name: string;
  monthly: number;
  badge?: string;
  features: string[];
};

type Feature = {
  title: string;
  description: string;
  points: string[];
};

type Gain = {
  stat: string;
  label: string;
  detail: string;
};

type Addon = {
  name: string;
  price: string;
  bullets: string[];
};

const navigation = [
  { label: "Æditus", href: "#aeditus" },
  { label: "Gains", href: "#gains" },
  { label: "Tarifs", href: "#pricing" }
];

const plans: Plan[] = [
  {
    name: "Essential",
    monthly: 79,
    features: [
      "Mini-plan éditorial validé par Alfie",
      "Publication hebdomadaire sur 1 réseau",
      "1 visuel animé ou vidéo snack / semaine",
      "Bilan mensuel + recommandations rapides",
      "Copilot + calendrier collaboratif",
      "Affiliation partenaires 10 %"
    ]
  },
  {
    name: "Starter",
    monthly: 179,
    badge: "134,25€ 1er mois (–25%)",
    features: [
      "Plan éditorial complet multi-personas",
      "2 articles SEO + déclinaisons sociales",
      "Publication hebdo sur 4 réseaux",
      "1 vidéo HÉRO + 8 formats courts/mois",
      "Ajustements rapides & support prioritaire",
      "Copilot, calendrier & reporting avancé"
    ]
  },
  {
    name: "Pro",
    monthly: 399,
    badge: "299,25€ 1er mois (–25%)",
    features: [
      "Stratégie éditoriale complète par segment",
      "Publication hebdomadaire sur 7 réseaux",
      "3–4 vidéos HÉRO + 12 formats courts/mois",
      "Optimisation continue & bilan hebdomadaire",
      "Copilot, DAM & workflows approuvés",
      "Affiliation 15 % dès 20 clients"
    ]
  }
];

const aeditusFeatures: Feature[] = [
  {
    title: "Plan éditorial piloté par les données",
    description: "Saisons business, signaux SEO et tendance sociale intégrés pour chaque marque.",
    points: [
      "Angles, hooks et CTA alignés à vos objectifs",
      "Calendrier lisible + drag & drop ou mode auto",
      "Briefs validés par vos équipes en 2 clics"
    ]
  },
  {
    title: "Studio média intégré",
    description: "Scripts, visuels et vidéos produits par Alfie + l’équipe créa, prêts à publier.",
    points: [
      "Exports multi-formats (1:1, 9:16, carrousel)",
      "Bibliothèque de médias approuvés",
      "Collaboration instantanée avec mentions"
    ]
  },
  {
    title: "Distribution multicanal fiable",
    description: "Jusqu’à 20 réseaux connectés avec suivi des quotas et reprise automatique.",
    points: [
      "Heatmap des meilleurs créneaux",
      "File d’attente sécurisée & retries",
      "Alertes proactives sur les anomalies"
    ]
  },
  {
    title: "Pilotage KPI & Copilot",
    description: "Tableaux de bord clairs et recommandations actionnables sur ce qui performe.",
    points: [
      "Visibilité des impressions, clics et leads",
      "Insights automatiques envoyés chaque semaine",
      "Copilot IA + humain disponible 7j/7"
    ]
  }
];

const gains: Gain[] = [
  {
    stat: "+12 h/mois",
    label: "de coordination gagnées",
    detail: "Production + validation centralisées"
  },
  {
    stat: "+48 %",
    label: "de visibilité en moyenne",
    detail: "Sur 90 jours avec plan et vidéos intégrés"
  },
  {
    stat: "x3",
    label: "conversations qualifiées",
    detail: "RDV pris via contenus evergreen"
  }
];

const fynkAddons: Addon[] = [
  {
    name: "Fynk Basic",
    price: "29€/mois",
    bullets: ["Jusqu’à 400 interactions/mois", "Instagram + Facebook", "Suggestions quotidiennes validées"]
  },
  {
    name: "Fynk Pro",
    price: "69€/mois",
    bullets: [
      "Jusqu’à 1500 interactions/mois",
      "Instagram + Facebook + LinkedIn",
      "Détection de leads + reporting détaillé"
    ]
  }
];

const perMonth = (monthly: number) => (monthly * 0.9).toFixed(2).replace(".", ",");
const yearlyTotal = (monthly: number) => (monthly * 12 * 0.9).toFixed(2).replace(".", ",");
const price = (monthly: number, annual: boolean) => (annual ? perMonth(monthly) : monthly.toString());

export const calc = {
  discountedFirstMonth(base: number) {
    return Math.round(base * 0.75 * 100) / 100;
  },
  annual(base: number, discount = 0.1) {
    return Math.round(base * 12 * (1 - discount) * 100) / 100;
  }
};

export default function NewLandingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <main className="min-h-screen bg-[#0B0C0E] text-white">
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#0B0C0E]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-2 font-semibold text-white">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white">Æ</span>
            <span>Æditus</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            {navigation.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-teal-400">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3 text-left">
            <a
              href="/auth/signin"
              className="group inline-flex flex-col rounded-lg border border-slate-800 px-3 py-2 text-sm hover:border-teal-500 hover:bg-slate-800"
            >
              <span className="font-medium text-white">Se connecter</span>
              <span className="text-xs text-slate-400 group-hover:text-teal-300">Auth sécurisée + plateforme clients</span>
            </a>
            <a
              href="/auth/signup"
              className="group inline-flex flex-col rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-700"
            >
              <span>S’inscrire</span>
              <span className="text-xs font-normal text-teal-100 group-hover:text-white">Essai 7 jours + vérif e-mail incluse</span>
            </a>
          </div>
          <div className="md:hidden">
            <a
              href="/auth/signup"
              className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-700"
            >
              Essai 7 jours
            </a>
          </div>
        </div>
      </header>

      <section className="border-b border-slate-800 bg-[#0B0C0E]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Plan éditorial complet & contenus prêts à publier
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Æditus coordonne stratégie, production média et publication multicanale. Vous validez, on déploie.
              Alfie copilote vos prises de parole et sécurise chaque diffusion.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="/auth/signup"
                className="rounded-xl bg-teal-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-teal-700"
              >
                Démarrer l’essai 7 jours
              </a>
              <a
                href="#pricing"
                className="rounded-xl border border-slate-700 px-6 py-3 text-base text-white transition hover:bg-slate-800"
              >
                Voir les offres
              </a>
              <a
                href="/auth/signin"
                className="text-sm text-slate-300 underline-offset-4 transition hover:text-teal-400 hover:underline"
              >
                Se connecter à la plateforme
              </a>
            </div>
            <dl className="mt-10 grid grid-cols-2 gap-4 text-sm text-slate-300 sm:max-w-md">
              <div>
                <dt className="font-semibold text-white">Publication</dt>
                <dd>20+ réseaux, blog & newsletter</dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Mode</dt>
                <dd>Validation 2 clics ou auto réversible</dd>
              </div>
            </dl>
          </div>
          <div className="lg:justify-self-end">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
              <div className="text-sm text-slate-400">Calendrier en cours</div>
              <div className="mt-4 grid grid-cols-7 gap-2">
                {Array.from({ length: 21 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-10 rounded-lg border border-slate-800 bg-slate-800/60"
                  />
                ))}
              </div>
              <p className="mt-4 text-sm text-slate-400">12 posts programmés · 3 vidéos · 2 articles longs</p>
            </div>
          </div>
        </div>
      </section>

      <section id="aeditus" className="border-b border-slate-800 bg-slate-900 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-white">Pourquoi les équipes choisissent Æditus</h2>
            <p className="mt-4 text-slate-300">
              Une suite unique pour planifier, produire et publier avec votre voix de marque. Alfie copilote chaque étape
              et capitalise sur vos meilleures performances.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {aeditusFeatures.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-slate-800 bg-[#0F1115] p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm text-slate-300">{feature.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {feature.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-teal-600 text-[10px]">✓</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="gains" className="border-b border-slate-800 bg-[#0B0C0E] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">Ce que gagnent nos clients</h2>
          <p className="mt-4 max-w-2xl text-slate-300">
            Les entreprises qui activent Æditus constatent rapidement un gain de temps, de visibilité et de conversations
            qualifiées. Les chiffres ci-dessous proviennent de cohortes suivies sur 90 jours.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {gains.map((gain) => (
              <div key={gain.stat} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center">
                <div className="text-3xl font-bold text-teal-400">{gain.stat}</div>
                <div className="mt-2 text-base font-semibold text-white">{gain.label}</div>
                <p className="mt-2 text-sm text-slate-300">{gain.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-b border-slate-800 bg-slate-900 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
            <div>
              <h2 className="text-3xl font-bold text-white">Nos offres Æditus</h2>
              <p className="mt-2 text-slate-300">
                Essai gratuit 7 jours. Annulation 1 clic. Facturation mensuelle ou annuelle avec –10 %.
              </p>
            </div>
            <div className="inline-flex items-center gap-3 rounded-full border border-slate-700 bg-[#0B0C0E] px-3 py-1 text-sm text-slate-300">
              <span className={!annual ? "font-semibold text-white" : ""}>Mensuel</span>
              <button
                type="button"
                onClick={() => setAnnual((value) => !value)}
                className="relative h-6 w-11 rounded-full bg-slate-700 transition"
                aria-pressed={annual}
                aria-label="Basculer la tarification"
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${annual ? "left-6" : "left-0.5"}`}
                />
              </button>
              <span className={annual ? "font-semibold text-white" : ""}>Annuel –10%</span>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-slate-400 md:text-left">
            {annual ? "Affichage équivalent mensuel –10 % + total annuel indiqué." : "Payer à la fin de l’essai si satisfait."}
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {plans.map((plan) => {
              const displayed = price(plan.monthly, annual);
              const yearly = yearlyTotal(plan.monthly);

              return (
                <div
                  key={plan.name}
                  className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#0F1115] p-6 shadow-lg"
                  data-testid={plan.name === "Pro" ? "price-pro" : undefined}
                >
                  <div>
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                      <div className="text-2xl font-bold text-teal-400">
                        {displayed}
                        <span className="text-sm font-normal text-slate-400">€/mois</span>
                      </div>
                    </div>
                    {!annual && plan.badge ? (
                      <div className="mt-1 text-xs text-teal-400">{plan.badge}</div>
                    ) : null}
                    {annual ? (
                      <div className="mt-1 text-xs text-slate-400">{yearly}€ par an · –10% vs mensuel</div>
                    ) : null}
                    <ul className="mt-4 space-y-2 text-sm text-slate-300">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-teal-600 text-[10px]">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href="/auth/checkout"
                    className="mt-6 inline-flex items-center justify-center rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
                  >
                    Choisir {plan.name}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="fynk" className="border-b border-slate-800 bg-[#0B0C0E] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-white">Boostez votre portée avec Fynk</h2>
            <p className="mt-4 text-slate-300">
              Add-on d’engagement social : likes, follows et commentaires validés en un clic. Suggestion humaine + IA,
              respect strict des règles plateformes.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {fynkAddons.map((addon) => (
              <div key={addon.name} className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h3 className="text-lg font-semibold text-white">{addon.name} — {addon.price}</h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {addon.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-teal-600 text-[10px]">✓</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#0B0C0E] py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Æditus. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <a href="/legal" className="hover:text-teal-400">Mentions légales</a>
            <a href="/privacy" className="hover:text-teal-400">Confidentialité</a>
            <a href="/terms" className="hover:text-teal-400">CGU</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
