import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Calendar,
  PenLine,
  Video,
  BarChart3,
  ShieldCheck,
  ChevronRight,
  Check,
  ArrowRightLeft,
  MousePointerClick,
  BadgeCheck
} from "lucide-react";

/**
 * Æditus — Landing (friendly, mobile-first, accents OK)
 * ----------------------------------------------------
 * Stack: React + Tailwind + Framer Motion + Lucide
 * Brand (friendly): Indigo/Cyan gradient (#6366F1 → #06B6D4) + warm accent (#F59E0B)
 * Messaging: Visibilité & Authenticité. Pas de mention de paiement récurrent.
 * Vidéos intégrées (Spark supprimé). Ne pas mentionner Postiz/WordPress.
 * Publication 20+ réseaux. Calendrier : drag & drop ou automatique.
 * CTA: Démo et Offres.
 */

// Animations
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  })
};

const float = (delay = 0) => ({
  initial: { y: 0, opacity: 0.75 },
  animate: {
    y: [0, -24, 0, 18, 0],
    opacity: [0.75, 0.95, 0.8, 0.9, 0.75],
    transition: { duration: 9.5, delay, repeat: Infinity, ease: "easeInOut" }
  }
});

const haloPulse = {
  initial: { scale: 0.9, opacity: 0.25 },
  animate: { scale: [0.9, 1.05, 0.95, 1.1, 0.9], opacity: [0.2, 0.35, 0.25, 0.3, 0.2] },
  transition: { duration: 10, repeat: Infinity, ease: "easeInOut" }
};

// UI tokens
const container = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8";
const h1 = "font-heading text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight text-white";
const h2 = "font-heading text-2xl md:text-3xl tracking-tight text-white";
const sub = "text-base md:text-lg text-white/70";
const pill =
  "inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-3 py-1 text-indigo-200 text-xs font-medium";

// Helpers
const euro = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(n);

// Pricing helpers (exported for tests)
export const calc = {
  discountedFirstMonth(base: number) {
    return Math.round(base * 0.75 * 100) / 100; // 25% off
  },
  annual(base: number, discount = 0.1) {
    return Math.round(base * 12 * (1 - discount) * 100) / 100; // 10% off by default
  }
};

// Dev-time sanity checks (non-blocking)
if (typeof window !== "undefined") {
  try {
    console.assert(calc.discountedFirstMonth(179) === 134.25, "Starter -25% should be 134.25");
    console.assert(calc.discountedFirstMonth(399) === 299.25, "Pro -25% should be 299.25");
    console.assert(
      calc.annual(79) === Math.round(79 * 12 * 0.9 * 100) / 100,
      "Annual -10% should match formula"
    );
  } catch {}
}

export default function AeditusLanding() {
  const [billing, setBilling] = useState<"mensuel" | "annuel">("mensuel");

  const prices = useMemo(
    () => ({
      essential: { monthly: 79, annual: calc.annual(79) },
      starter: { monthly: 179, annual: calc.annual(179) },
      pro: { monthly: 399, annual: calc.annual(399) }
    }),
    []
  );

  return (
    <div className="min-h-screen scroll-smooth bg-[#0B1110] text-white [--ring:#6366F1]">
      {/* Background FX */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* soft blobs */}
        <motion.div className="absolute left-1/2 top-[-12rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-indigo-500/30 blur-[120px]" {...float(0.2)} />
        <motion.div className="absolute right-[-10rem] bottom-[-8rem] h-[24rem] w-[24rem] rounded-full bg-cyan-500/30 blur-[120px]" {...float(0.6)} />
        <motion.div className="absolute left-[-12rem] bottom-[-14rem] h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/20 blur-[120px]" {...float(1.2)} />

        {/* tiny bubbles */}
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-white/10"
            style={{ left: (Math.random() * 100) + '%', top: (Math.random() * 100) + '%' }}
            initial={{ y: 0, opacity: 0.2, scale: 0.8 }}
            animate={{ y: [0, -12, 0, 10, 0], opacity: [0.2, 0.45, 0.25, 0.4, 0.2], scale: [0.8, 1, 0.9, 1.05, 0.8] }}
            transition={{ duration: 12 + Math.random() * 6, delay: Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-white/5 backdrop-blur supports-[backdrop-filter]:bg-[#0B1110]/70">
        <nav className={`${container} flex h-16 items-center justify-between`}>
          <a href="#top" className="group inline-flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-indigo-400 to-cyan-500 text-[#0B1110] font-bold">
              A
            </div>
            <span className="font-heading text-white/90 group-hover:text-white">Æditus</span>
          </a>
          <div className="hidden items-center gap-6 md:flex">
            <a href="#about" className="text-sm text-white/70 hover:text-white">Fonctionnalités</a>
            <a href="#semaine-type" className="text-sm text-white/70 hover:text-white">Comment ça marche</a>
            <a href="#offres" className="text-sm text-white/70 hover:text-white">Offres</a>
            <a href="#faq" className="text-sm text-white/70 hover:text-white">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#offres" className="hidden rounded-xl border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/5 md:inline-flex">Voir les offres</a>
            <a href="#offres" className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-[#0B1110] hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/60">
              Démarrer l’essai 7 jours <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section id="top" className="relative">
        {/* hero halo */}
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-6 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.35),transparent_60%)]"
          {...haloPulse}
        />
        <div className={`${container} grid grid-cols-1 items-center gap-10 py-14 md:grid-cols-2 md:py-20`}>
          <div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <span className={pill}><Sparkles className="h-4 w-4" /> Visibilité – Authenticité</span>
            </motion.div>
            <motion.h1 variants={fadeUp} initial="hidden" whileInView="show" custom={1} viewport={{ once: true }} className={`${h1} mt-4`}>
              Æditus — Plan éditorial mensuel & calendrier de publication
            </motion.h1>
            <motion.p variants={fadeUp} initial="hidden" whileInView="show" custom={2} viewport={{ once: true }} className={`${sub} mt-4`}>
              Plan éditorial complet chaque mois. Publications hebdomadaires sur tous vos réseaux, en 2 clics — gain : +10 h de travail/mois. Vidéos & visuels inclus. Option : tout en automatique (réversible).
            </motion.p>
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" custom={3} viewport={{ once: true }} className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#offres" className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-[#0B1110] shadow-lg shadow-indigo-500/20 hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/60">
                Démarrer l’essai 7 jours <ChevronRight className="h-4 w-4" />
              </a>
              <a href="#offres" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white/80 hover:bg-white/5">
                Voir les offres
              </a>
              <a href="#compare" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white/80 hover:bg-white/5">
                Comparer aux autres solutions
              </a>
            </motion.div>
            <motion.ul variants={fadeUp} initial="hidden" whileInView="show" custom={4} viewport={{ once: true }} className="mt-5 flex flex-wrap gap-2 text-xs text-white/70">
              <li className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Plan mensuel</li>
              <li className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Publication hebdo multi‑réseaux</li>
              <li className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Authenticité préservée</li>
              <li className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Zéro ton “IA”</li>
            </motion.ul>

            {/* Logos réseaux (SVG) */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" custom={5} viewport={{ once: true }} className="mt-6 flex flex-wrap items-center gap-4">
              <SocialLogos colored animated />
            </motion.div>
          </div>

          {/* Visual / Motion card */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="relative">
            <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4 shadow-2xl">
              <motion.div
                aria-hidden
                className="absolute -inset-0.5 -z-10 rounded-[1.25rem] bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.35),transparent_45%),radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.25),transparent_55%)]"
                {...haloPulse}
              />
              <div className="rounded-xl border border-white/10 bg-[#0E1514] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-white/60">Aperçu calendrier</span>
                  <span className="text-xs text-indigo-200">Auto</span>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 21 }).map((_, i) => (
                    <motion.div key={i} className="aspect-square rounded-lg bg-white/5" whileHover={{ scale: 1.05 }} />
                  ))}
                </div>
                <div className="mt-4 rounded-lg bg-white/5 p-3">
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <BadgeCheck className="h-4 w-4 text-indigo-300" /> 12 posts programmés • 2 vidéos • 1 article
                  </div>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 w-48 rotate-3 rounded-xl border border-indigo-300/30 bg-indigo-400/10 p-3 shadow-xl">
                <div className="flex items-center gap-2 text-sm font-medium text-indigo-100">
                  <ShieldCheck className="h-4 w-4" /> Votre voix, votre personnalité
                </div>
                <p className="mt-1 text-xs text-indigo-100/80">Style appris et respecté partout.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Badges */}
      <section aria-label="badges" className="border-y border-white/5 bg-white/5">
        <div className={`${container} flex flex-wrap items-center justify-center gap-6 py-6 text-white/60`}>
          <div className="inline-flex items-center gap-2 text-xs"><ShieldCheck className="h-4 w-4 text-indigo-300"/> C2PA/filigrane IA (option)</div>
          <div className="inline-flex items-center gap-2 text-xs"><ArrowRightLeft className="h-4 w-4 text-indigo-300"/> Anti‑répétition & couverture thématique</div>
          <div className="inline-flex items-center gap-2 text-xs"><MousePointerClick className="h-4 w-4 text-indigo-300"/> Validation ultra‑light</div>
        </div>
      </section>

      {/* Ce que fait Æditus */}
      <section id="about" className="border-b border-white/5">
        <div className={`${container} py-16 md:py-20`}>
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className={h2}>Ce que fait Æditus</motion.h2>
          <p className={`${sub} mt-2 max-w-3xl`}>Un <strong>plan éditorial complet chaque mois</strong> + <strong>publication hebdomadaire</strong> sur vos réseaux, avec votre voix de marque. Validation en 2 clics ou <strong>mode automatique</strong> (réversible). Vidéos & visuels inclus.</p>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-heading text-white">Plan éditorial</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-white/80 space-y-1">
                <li>Priorités mensuelles, angles, calendrier lisible</li>
                <li>Garde‑fous de ton : <em>votre voix, votre personnalité</em></li>
                <li>Objectifs & KPI réalistes</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-heading text-white">Publication hebdo</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-white/80 space-y-1">
                <li>Multi‑réseaux, timing optimisé</li>
                <li>Vidéos courtes & visuels inclus</li>
                <li>Calendrier drag‑and‑drop ou auto</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-heading text-white">Validation simple</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-white/80 space-y-1">
                <li>2 clics : OK / Éditer / Remplacer</li>
                <li>Journal de publication transparent</li>
                <li>Réglages rapides en cours de mois</li>
              </ul>
            </div>
          </div>

          {/* Ce que vous gagnez */}
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {[
              {t:"+10 h/mois récupérées", d:"moins d’allers‑retours, plus d’exécution"},
              {t:"Visibilité mesurable", d:"journal de publication & KPI lisibles"},
              {t:"Cohérence de marque", d:"même voix, partout, chaque semaine"},
              {t:"Simplicité", d:"validation 2 clics ou mode auto réversible"}
            ].map((b,i)=> (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h4 className="font-heading text-white">{b.t}</h4>
                <p className="mt-1 text-sm text-white/70">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offres */}
      <section id="offres">
        <div className={`${container} py-16 md:py-20`}>
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className={h2}>Offres & besoins</motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="show" custom={1} viewport={{ once: true }} className={`${sub} mt-2 max-w-2xl`}>
            Règles claires : 1 marque/abo · annulation à tout moment · essai 7 jours pour Starter & Pro.
          </motion.p>

          {/* Toggle mensuel/annuel */}
          <div className="mt-6 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1" data-testid="billing-toggle">
              {(["mensuel", "annuel"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setBilling(opt)}
                  className={`px-3 py-1 text-sm rounded-lg ${billing === opt ? "bg-indigo-500 text-[#0B1110]" : "text-white/80 hover:text-white"}`}
                >
                  {opt === "mensuel" ? "Mensuel" : "Annuel"}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3" data-testid="pricing-grid">
            <PriceCard
              dataTestId="price-essential"
              badge="Besoin : exister sans se disperser"
              title="Essential"
              price={billing === "mensuel" ? euro(prices.essential.monthly) : euro(prices.essential.annual)}
              period={billing === "mensuel" ? "/mois" : "/an"}
              discountNote={billing === "annuel" ? "–10% vs mensuel" : undefined}
              points={[
                "1 idée/mois · 12 posts (1 réseau)",
                "4 shorts · 1 cover",
                "KPI lite",
                "Affiliation 10% incluse",
                "Pour : solo‑preneurs (présence minimale)",
                "Sans article, sans carrousel/stories"
              ]}
              cta="Choisir Essential"
              highlight={false}
            />
            <PriceCard
              dataTestId="price-starter"
              badge="–25% le 1er mois"
              title="Starter"
              price={billing === "mensuel" ? euro(calc.discountedFirstMonth(prices.starter.monthly)) : euro(prices.starter.annual)}
              period={billing === "mensuel" ? "/mois" : "/an"}
              strike={billing === "mensuel" ? euro(prices.starter.monthly) : undefined}
              discountNote={billing === "mensuel" ? "puis 179€/mois" : "–10% vs mensuel"}
              points={[
                "2 idées/mois · 2 articles (1200–1500)",
                "14–16 posts (2–3 réseaux)",
                "6 vidéos (1 HÉRO + 5 snacks)",
                "1–2 carrousels, 2 stories, KPI",
                "Essai 7 jours gratuit (sans publication)",
                "Affiliation 10% incluse"
              ]}
              cta="Choisir Starter"
              highlight={false}
            />
            <PriceCard
              dataTestId="price-pro"
              badge="–25% le 1er mois"
              title="Pro"
              price={billing === "mensuel" ? euro(calc.discountedFirstMonth(prices.pro.monthly)) : euro(prices.pro.annual)}
              period={billing === "mensuel" ? "/mois" : "/an"}
              strike={billing === "mensuel" ? euro(prices.pro.monthly) : undefined}
              discountNote={billing === "mensuel" ? "puis 399€/mois" : "–10% vs mensuel"}
              points={[
                "4 idées/mois (hebdo) · 4 articles (1500–2000)",
                "28–36 posts (3–4 réseaux)",
                "12–14 vidéos (4 HÉRO + 8–10 snacks)",
                "Carrousels + stories, KPI & recalibrage",
                "Essai 7 jours gratuit (sans publication)",
                "Affiliation 10% incluse"
              ]}
              cta="Choisir Pro"
              highlight
            />
          </div>
          <div className="mt-2 text-center text-xs text-white/60">Affiliation : 10 % sur toutes les offres et sur Fynk.</div>

          {/* Add-ons moved below (Fynk section) */}
        </div>
      </section>

      {/* Fynk Focus */}
      <section id="fynk" className="border-t border-white/5 bg-[#0E1514]">
        <div className={`${container} py-16 md:py-20`}>
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className={h2}>
            Encore plus de visibilité avec Fynk
          </motion.h2>
          <p className={`${sub} mt-2 max-w-2xl`}>Complément d’engagement : réponses/commentaires pertinents proposés, <strong>validation en 1 clic</strong>. Jamais de spam. Règles plateformes respectées.</p>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {k:"+30–60%", v:"de portée sur les 4 premières semaines*"},
              {k:"< 2 min/jour", v:"grâce aux suggestions prêtes à poster"},
              {k:"0 spam", v:"respect des règles & de votre image"}
            ].map((s,i)=> (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <div className="font-heading text-2xl text-white">{s.k}</div>
                <div className="mt-1 text-sm text-white/70">{s.v}</div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-[10px] text-white/40">*Indication issue de comptes pilotes : dépend de la base d’abonnés et de la fréquence de publication.</div>

          {/* How it works */}
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {t:"Connecter", d:"IG/FB/LinkedIn selon l’offre"},
              {t:"Choisir des routines", d:"thèmes, audiences, cadences"},
              {t:"Valider en 1 clic", d:"réponses/commentaires pertinents, jamais génériques"}
            ].map((b,i)=> (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-heading text-white">{`0${i+1}`} — {b.t}</h3>
                <p className="mt-2 text-sm text-white/70">{b.d}</p>
              </div>
            ))}
          </div>

          {/* Offres Fynk (déplacées ici) */}
          <div id="fynk-offres" className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <AddOnCard
              title="Fynk Basic — 29€ /mois"
              price="IG/FB"
              variant="basic"
              points={[
                "Jusqu’à 80 commentaires pertinents/mois",
                "Suggestions de réponses quotidiennes (jusqu’à 20/jour)",
                "Validation en 1 clic",
                "Jamais de spam, respect des règles plateformes"
              ]}
              note="1 marque/abo · annulation à tout moment"
              cta="Choisir Fynk Basic"
            />
            <AddOnCard
              title="Fynk Pro — 69€ /mois"
              price="IG/FB/LinkedIn"
              variant="pro"
              points={[
                "Jusqu’à 240 commentaires pertinents/mois",
                "Priorisation des leads & relances",
                "Routines avancées (prospection douce)",
                "Validation en 1 clic · reporting d’impact"
              ]}
              note="1 marque/abo · annulation à tout moment"
              cta="Choisir Fynk Pro"
            />
          </div>

          {/* Ambassadeurs (déplacé ici) */}
          <div className="hidden mt-8 rounded-2xl border border-indigo-400/20 bg-indigo-400/10 p-6">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <div className={pill}>Programme Ambassadeurs — sous conditions</div>
                <h3 className="mt-2 font-heading text-xl text-white">Ambassadeurs — 49,90€/mois pendant 3 mois</h3>
                <ul className="mt-2 list-disc pl-5 text-sm text-white/80">
                  <li>Actif sur au moins 2 réseaux, sélection sur dossier</li>
                  <li><strong>4 posts/semaine automatiques</strong> inclus dans votre plan éditorial</li>
                  <li>Avis/témoignage + feedback mensuel</li>
                  <li>Affiliation activée : 10 % par parrainage, <strong>15 % à partir de 20 clients</strong></li>
                </ul>
              </div>
              <a href="#" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#0B1110] hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/60">
                Devenir Ambassadeur <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Ambassadeurs */}
      <section id="ambassadeurs" className="border-t border-white/5">
        <div className={`${container} py-16 md:py-20`}>
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className={h2}>Programme Ambassadeurs</motion.h2>
          <p className={`${sub} mt-2 max-w-3xl`}>Devenez l’une des premières marques à installer une présence régulière avec Æditus. En échange de retours concrets, vous profitez d’un tarif préférentiel et d’un accompagnement rapproché — idéal pour poser des bases solides et accélérer la visibilité sans vous trahir.</p>
          <div className="mt-6 rounded-2xl border border-indigo-400/20 bg-indigo-400/10 p-6">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <div className={pill}>Ambassadeurs — sous conditions</div>
                <h3 className="mt-2 font-heading text-xl text-white">49,90€/mois pendant 3 mois</h3>
                <ul className="mt-2 list-disc pl-5 text-sm text-white/80">
                  <li>Actif sur au moins 2 réseaux, sélection sur dossier</li>
                  <li><strong>4 posts/semaine automatiques</strong> inclus dans votre plan éditorial</li>
                  <li>Avis/témoignage + feedback mensuel</li>
                  <li>Affiliation activée : 10 % par parrainage, <strong>15 % à partir de 20 clients</strong></li>
                </ul>
              </div>
              <a href="#" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#0B1110] hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/60">
                Devenir Ambassadeur <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Compare */}
      <section id="compare" className="border-t border-white/5 bg-[#0E1514]">
        <div className={`${container} py-16 md:py-20`}>
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className={h2}>Æditus vs concurrents</motion.h2>
        	<p className={`${sub} mt-2 max-w-3xl`}>Pas qu’un scheduler : une chaîne complète de génération + orchestration + publication, avec voix de marque conservée.</p>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[1080px] border-collapse text-sm" data-testid="compare-table">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-white/70">Fonction</th>
                  <th className="px-4 py-3 text-left font-medium text-white">Æditus</th>
                  <th className="px-4 py-3 text-left font-medium text-white/70">Hootsuite</th>
                  <th className="px-4 py-3 text-left font-medium text-white/70">Buffer</th>
                  <th className="px-4 py-3 text-left font-medium text-white/70">Metricool</th>
                  <th className="px-4 py-3 text-left font-medium text-white/70">Freelance</th>
                  <th className="px-4 py-3 text-left font-medium text-white/70">Agence</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Génération d’articles SEO + déclinaisons", "Oui", "Non", "Non", "Partiel", "Oui (manuel)", "Oui (coût élevé)"],
                  ["Mémoire tonale (voix/personnalité)", "Oui", "Non", "Non", "Non", "Variable", "Variable"],
                  ["Publication multi‑plateforme auto", "Oui", "Oui", "Oui", "Oui", "Non", "Oui (manuel)"],
                  ["Vidéo intégrée (shorts/covers)", "Oui", "Partiel", "Partiel", "Partiel", "Option", "Option"],
                  ["A/B hooks + recalibrage KPI", "Oui", "Partiel", "Partiel", "Partiel", "Rare", "Option premium"],
                  ["Validation ultra‑light in‑app", "Oui", "Partiel", "Partiel", "Partiel", "—", "—"],
                  ["Affiliation intégrée", "Oui", "Non", "Non", "Non", "—", "—"]
                ].map((row, i) => (
                  <tr key={i} className={i % 2 ? "bg-white/0" : "bg-white/5"}>
                    {row.map((cell, j) => (
                      <td key={j} className={j === 0 ? "px-4 py-3 text-white/80" : j === 1 ? "px-4 py-3 text-indigo-200" : "px-4 py-3 text-white/60"}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-400/10 to-cyan-400/10 p-6 text-center">
            <h3 className="font-heading text-xl text-white">Prêt à installer votre présence régulière ?</h3>
            <p className="mt-1 text-sm text-white/70">Démarrez l’essai 7 jours (sans publication) ou choisissez une offre.</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <a href="#offres" className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-[#0B1110] hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/60">
                Voir les offres <ChevronRight className="h-4 w-4" />
              </a>
              <a href="#fynk" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white/80 hover:bg-white/5">
                En savoir plus sur Fynk
              </a>
            </div>
          </div>
        </div>
        <div className={`${container} py-16 md:py-20`}>
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className={h2}>FAQ</motion.h2>
          <div className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5">
            {[
              { q: "Puis‑je valider avant publication ?", a: "Oui. Validation ultra‑light (OK / Éditer / Remplacer). Aucune publication surprise." },
              { q: "Quelles plateformes sont supportées ?", a: "Publication sur 20+ réseaux (selon forfait)." },
              { q: "Et ma voix de marque ?", a: "Votre voix et votre personnalité sont apprises et respectées dans chaque contenu." },
              { q: "Fynk, à quoi ça sert ?", a: "Fynk déclenche des interactions utiles (likes/commentaires ciblés) pour augmenter la portée de vos posts et générer des conversations. Résultat : plus de vues, plus de réponses et davantage de RDV/Leads." }
            ].map((f, i) => (
              <details key={i} className="group open:bg-white/5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 px-6 py-5 text-left font-medium text-white/90">
                  <span>{f.q}</span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-white/40 transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-6 pb-6 text-white/70">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5">
        <div className={`${container} flex flex-col items-center justify-between gap-4 py-8 md:flex-row`}>
          <p className="text-xs text-white/50">© {new Date().getFullYear()} Æditus — Visibilité & Authenticité</p>
          <div className="flex items-center gap-6 text-xs text-white/50">
            <a href="#offres" className="hover:text-white/80">Voir les offres</a>
            <a href="#compare" className="hover:text-white/80">Comparatif</a>
            <a href="#faq" className="hover:text-white/80">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PriceCard({
  badge,
  title,
  price,
  period,
  points,
  cta,
  highlight,
  dataTestId,
  strike,
  discountNote
}: {
  badge?: string;
  title: string;
  price: string;
  period: string;
  points: string[];
  cta: string;
  highlight?: boolean;
  dataTestId?: string;
  strike?: string;
  discountNote?: string;
}) {
  return (
    <div data-testid={dataTestId} className={`relative rounded-2xl border ${highlight ? "border-indigo-400/40 bg-indigo-400/10" : "border-white/10 bg-white/5"} p-6`}>
      {badge && (
        <div className="absolute -top-3 left-4 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-wide text-white/80">
          {badge}
        </div>
      )}
      <h3 className="font-heading text-xl text-white">{title}</h3>
      <div className="mt-2 flex items-end gap-2 flex-wrap">
        {strike && <span className="text-sm text-white/50 line-through">{strike}</span>}
        <span className="text-3xl font-semibold text-white">{price}</span>
        <span className="text-sm text-white/60">{period}</span>
      </div>
      {discountNote && (
        <div className="mt-1 text-xs text-amber-300">{discountNote}</div>
      )}
      <ul className="mt-4 space-y-2 text-sm text-white/80">
        {points.map((p, i) => (
          <li key={i} className="inline-flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-indigo-300" /> {p}</li>
        ))}
      </ul>
      <a href="#" className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 ${highlight ? "bg-indigo-500 text-[#0B1110] hover:bg-indigo-400 focus:ring-indigo-400/60" : "border border-white/10 text-white/80 hover:bg-white/5 focus:ring-white/40"}`}>
        {cta} <ChevronRight className="h-4 w-4" />
      </a>
    </div>
  );
}

function AddOnCard({ title, price, points, note, cta, variant }: { title: string; price: string; points: string[]; note?: string; cta?: string; variant?: 'basic' | 'pro' }) {
  const isPro = variant === 'pro';
  const frame = isPro ? 'border-cyan-400/40 bg-cyan-400/10' : 'border-indigo-400/40 bg-indigo-400/10';
  const chip = isPro ? 'bg-cyan-400/20 text-cyan-100 border-cyan-400/30' : 'bg-indigo-400/20 text-indigo-100 border-indigo-400/30';
  return (
    <div className={`rounded-2xl border ${frame} p-6`}>
      <div className="flex items-baseline justify-between">
        <h3 className="font-heading text-lg text-white">{title}</h3>
        <div className="text-sm text-white/70">{price}</div>
      </div>
      <span className={`mt-2 inline-flex rounded-full border px-2 py-0.5 text-[10px] ${chip}`}>{isPro ? 'Pro' : 'Basic'}</span>
      <ul className="mt-3 space-y-2 text-sm text-white/80">
        {points.map((p, i) => (
          <li key={i} className="inline-flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-indigo-300" /> {p}</li>
        ))}
      </ul>
      {note && <p className="mt-3 text-xs text-white/50">{note}</p>}
      {cta && (
        <a href="#" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/40">
          {cta} <ChevronRight className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}

// Social logos (colored + subtle animation)
function SocialLogos({ colored = false, animated = false }: { colored?: boolean; animated?: boolean }){
  const base = "h-7 w-7 transition-transform";
  const hover = animated ? "hover:scale-110" : "";
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* LinkedIn */}
      <svg aria-label="LinkedIn" viewBox="0 0 24 24" className={`${base} ${hover}`}>
        <rect x="2" y="2" width="20" height="20" rx="4" fill={colored ? "#0A66C2" : "currentColor"} opacity={colored ? 1 : 0.15}/>
        <rect x="5" y="9" width="3" height="10" fill="#ffffff"/>
        <circle cx="6.5" cy="6.5" r="1.5" fill="#ffffff"/>
        <path d="M11 9h3v1.5c.6-1 1.6-1.7 3-1.7 2.2 0 3 1.3 3 3.5V19h-3v-5c0-1.2-.4-2-1.5-2-1 0-1.5.8-1.5 2V19h-3V9z" fill="#ffffff"/>
      </svg>
      {/* Instagram */}
      <svg aria-label="Instagram" viewBox="0 0 24 24" className={`${base} ${hover}`}>
        <defs>
          <radialGradient id="igG" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#FFDC80"/>
            <stop offset="50%" stopColor="#F56040"/>
            <stop offset="100%" stopColor="#833AB4"/>
          </radialGradient>
        </defs>
        <rect x="3" y="3" width="18" height="18" rx="5" fill={colored ? "url(#igG)" : "none"} stroke={colored ? "none" : "currentColor"}/>
        <circle cx="12" cy="12" r="3.5" stroke={colored ? "#fff" : "currentColor"} fill="none"/>
        <circle cx="17.5" cy="6.5" r="1" fill={colored ? "#fff" : "currentColor"}/>
      </svg>
      {/* TikTok */}
      <svg aria-label="TikTok" viewBox="0 0 24 24" className={`${base} ${hover}`}>
        <rect x="2" y="2" width="20" height="20" rx="4" fill={colored ? "#000" : "currentColor"} opacity={colored ? 1 : 0.15}/>
        <path d="M14 4v6.5c-1-.7-2.1-1.1-3.3-1.1A4.7 4.7 0 0 0 6 14c0 2.6 2.1 4.7 4.7 4.7 2.3 0 4.2-1.7 4.6-3.9V8.2c1 .8 2.2 1.3 3.7 1.4V7.3c-1.5-.1-2.7-.7-3.7-1.7C14.6 4.9 14.2 4.5 14 4z" fill={colored ? "#69C9D0" : "currentColor"}/>
        <path d="M14 4c.6.7 1.3 1.3 2.1 1.8 1 .7 2.1 1.1 3.3 1.1V7.3c-1.5-.1-2.7-.7-3.7-1.7-.7-.7-1.2-1.2-1.7-1.6z" fill={colored ? "#EE1D52" : "currentColor"} opacity={colored ? 1 : 0.8}/>
      </svg>
      {/* YouTube */}
      <svg aria-label="YouTube" viewBox="0 0 24 24" className={`${base} ${hover}`}>
        <rect x="3" y="7" width="18" height="10" rx="3" fill={colored ? "#FF0000" : "currentColor"} opacity={colored ? 1 : 0.15}/>
        <path d="M10 10l5 2-5 2z" fill="#fff"/>
      </svg>
      {/* Facebook */}
      <svg aria-label="Facebook" viewBox="0 0 24 24" className={`${base} ${hover}`}>
        <rect x="2" y="2" width="20" height="20" rx="4" fill={colored ? "#1877F2" : "currentColor"} opacity={colored ? 1 : 0.15}/>
        <path d="M13 8h2V5h-2c-2 0-3.5 1.5-3.5 3.5V11H7v3h2.5v5H13v-5h2.2l.3-3H13V9.5c0-.9.4-1.5 1-1.5z" fill="#fff"/>
      </svg>
      {/* X */}
      <svg aria-label="X" viewBox="0 0 24 24" className={`${base} ${hover}`}>
        <rect x="2" y="2" width="20" height="20" rx="4" fill={colored ? "#000" : "currentColor"} opacity={colored ? 1 : 0.15}/>
        <path d="M5 5l14 14m0-14L5 19" stroke="#fff" strokeWidth="2"/>
      </svg>
      {/* Pinterest */}
      <svg aria-label="Pinterest" viewBox="0 0 24 24" className={`${base} ${hover}`}>
        <rect x="2" y="2" width="20" height="20" rx="4" fill={colored ? "#E60023" : "currentColor"} opacity={colored ? 1 : 0.15}/>
        <path d="M12 6.5c-3 0-5 2-5 4.5 0 1.8 1 3.3 2.8 3.6.2 0 .3 0 .3-.2.1-.2.2-.8.2-.8 0-.2-.1-.3-.2-.5-.5-.6-.8-1.5-.8-2.3 0-2.1 1.6-3.5 3.8-3.5 2 0 3.3 1.2 3.3 3 0 2.2-1.1 3.8-2.5 3.8-.8 0-1.4-.6-1.2-1.4l.4-1.7c.1-.5 0-.7-.3-1-.3-.2-.9 0-1.2.5-.3.6-.5 1.4-.5 2 0 1 .3 1.7 1 2 .7.4 1.7.4 2.5 0 1.6-.8 2.7-2.7 2.7-5 0-3-2.2-5.3-5.5-5.3z" fill="#fff"/>
      </svg>
      {/* Threads */}
      <svg aria-label="Threads" viewBox="0 0 24 24" className={`${base} ${hover}`}>
        <rect x="2" y="2" width="20" height="20" rx="10" fill={colored ? "#000" : "none"} stroke={colored ? "#000" : "currentColor"}/>
        <path d="M12 7c3 0 5 1.8 5 5s-2 5-5 5c-2 0-3.5-1.2-3.5-2.6 0-1.3 1-2.2 2.4-2.2 1 0 2 .4 2 .4 0-1.3-.7-2-1.9-2-1 0-1.8.5-2.3 1.2L8 10.7C8.8 9.5 10.2 9 12 9c2.6 0 4.2 1.7 4.2 4.1 0 2.5-1.6 4.1-4 4.1" stroke={colored ? "#fff" : "currentColor"} fill="none"/>
      </svg>
    </div>
  );
}

/* Tailwind helpers (optional, drop in globals.css)
:root { --bg:#0B1110; --fg:#F8FAF9; --brand:#6366F1; }
.font-heading{ font-family: "Space Grotesk", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Inter, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"; }
*/
