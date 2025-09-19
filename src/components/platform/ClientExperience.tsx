import { useMemo, useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  FileCode,
  LayoutGrid,
  MonitorPlay,
  MousePointerClick,
  PenTool,
  PlayCircle,
  Sparkles,
  TimerReset
} from "lucide-react";

type CalendarSlot = {
  id: string;
  label: string;
  channel: string;
  format: string;
  status: "Validé" | "À revoir" | "Programmé";
  auto: boolean;
};

type PlanItem = {
  week: string;
  focus: string;
  deliverables: string[];
};

type DemoClient = {
  name: string;
  segment: string;
  voice: string;
  mode: "Auto" | "Validation";
  lastSync: string;
};

const onboardingChecklist = [
  {
    title: "Niche & objectifs",
    detail: "Formulaire d’onboarding + alignement KPI",
    icon: TargetIcon
  },
  {
    title: "Brand kit importé",
    detail: "Logos, palette, références tonales",
    icon: PaletteIcon
  },
  {
    title: "Access réseaux",
    detail: "Connexion sécurisée orchestrateur social & CMS headless",
    icon: LockIcon
  }
];

function TargetIcon() {
  return <TimerReset className="h-5 w-5" />;
}

function PaletteIcon() {
  return <PenTool className="h-5 w-5" />;
}

function LockIcon() {
  return <MousePointerClick className="h-5 w-5" />;
}

const basePlan: PlanItem[] = [
  {
    week: "Semaine 1",
    focus: "Lancement & thought leadership",
    deliverables: [
      "Article SEO — Les tendances 2025 de votre secteur",
      "2 posts LinkedIn (carrousel + insight)",
      "1 vidéo snack Instagram"
    ]
  },
  {
    week: "Semaine 2",
    focus: "Preuve sociale & activation",
    deliverables: [
      "Article blog — étude de cas client",
      "Newsletter recap",
      "4 posts courts IG/TikTok"
    ]
  },
  {
    week: "Semaine 3",
    focus: "Produit & différenciation",
    deliverables: [
      "1 vidéo HÉRO 90s",
      "3 scripts shorts",
      "1 thread X optimisé AI Overviews"
    ]
  },
  {
    week: "Sema 4",
    focus: "Engagement & conversions",
    deliverables: [
      "Article SEO — comparaison de solutions",
      "5 posts multi-réseaux",
      "Pack visuels + prompts UGC"
    ]
  }
];

const baseCalendar: CalendarSlot[] = [
  {
    id: "mon",
    label: "Lun 3",
    channel: "LinkedIn",
    format: "Article",
    status: "Validé",
    auto: true
  },
  {
    id: "tue",
    label: "Mar 4",
    channel: "Instagram",
    format: "Vidéo snack",
    status: "Programmé",
    auto: true
  },
  {
    id: "wed",
    label: "Mer 5",
    channel: "TikTok",
    format: "Clip 30s",
    status: "À revoir",
    auto: false
  },
  {
    id: "thu",
    label: "Jeu 6",
    channel: "Blog",
    format: "Article SEO",
    status: "Validé",
    auto: false
  },
  {
    id: "fri",
    label: "Ven 7",
    channel: "Newsletter",
    format: "Email",
    status: "Programmé",
    auto: true
  }
];

const demoClients: DemoClient[] = [
  {
    name: "Wild Bloom",
    segment: "Retail durable",
    voice: "Chaleureuse & experte",
    mode: "Auto",
    lastSync: "il y a 2 h"
  },
  {
    name: "NovaTech B2B",
    segment: "SaaS RH",
    voice: "Factuel & direct",
    mode: "Validation",
    lastSync: "il y a 37 min"
  }
];

export default function ClientExperience() {
  const [autoMode, setAutoMode] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<CalendarSlot>(baseCalendar[0]);
  const [plan] = useState(basePlan);
  const calendar = useMemo(() => baseCalendar.map((slot) => ({ ...slot, auto: autoMode ? true : slot.auto })), [autoMode]);

  return (
    <div className="space-y-12">
      <section className="grid gap-4 md:grid-cols-3">
        {onboardingChecklist.map(({ title, detail, icon: Icon }) => (
          <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-200">
                <Icon />
              </span>
              <div>
                <p className="font-heading text-sm text-white">{title}</p>
                <p className="text-xs text-white/60">{detail}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-heading text-lg text-white">Mode publication</h2>
            <p className="text-sm text-white/60">
              Basculez entre validation manuelle et automatisation complète. Reversible en un clic.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAutoMode((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-xl border border-indigo-400/40 bg-indigo-500/20 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500/30"
          >
            <Sparkles className="h-4 w-4" /> {autoMode ? "Mode Automatique" : "Validation 2 clics"}
          </button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#101726] p-5">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <LayoutGrid className="h-4 w-4 text-indigo-300" /> Plan éditorial mensuel
            </div>
            <ul className="mt-4 space-y-3">
              {plan.map((item) => (
                <li key={item.week} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-indigo-200">{item.week}</p>
                      <p className="font-heading text-sm text-white">{item.focus}</p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                  </div>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-white/70">
                    {item.deliverables.map((deliverable) => (
                      <li key={deliverable}>{deliverable}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#101726] p-5">
            <div className="flex items-center justify-between text-sm text-white/70">
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-indigo-300" /> Calendrier semaine à venir
              </div>
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60">Drag & drop ou auto</span>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-3">
              {calendar.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`rounded-xl border px-3 py-2 text-left text-xs transition ${
                    selectedSlot.id === slot.id
                      ? "border-indigo-400/60 bg-indigo-500/30 text-white shadow-lg shadow-indigo-500/20"
                      : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <p className="font-semibold">{slot.label}</p>
                  <p>{slot.channel}</p>
                  <p className="text-[10px] uppercase tracking-wide text-white/60">{slot.format}</p>
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-medium text-white">{selectedSlot.channel} — {selectedSlot.format}</p>
              <p className="mt-1 text-xs text-white/70">Statut : {selectedSlot.status}</p>
              <p className="mt-1 text-xs text-white/60">
                Publication {selectedSlot.auto ? "automatique" : "en attente de validation"}. Alfie propose 3 variations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 className="font-heading text-lg text-white">Test clients actifs</h3>
          <p className="text-sm text-white/60">
            Les comptes ci-dessous utilisent la sandbox pour vérifier le respect du ton et des quotas.
          </p>
          <ul className="mt-4 space-y-3">
            {demoClients.map((client) => (
              <li key={client.name} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#101726] p-4">
                <div>
                  <p className="font-heading text-sm text-white">{client.name}</p>
                  <p className="text-xs text-white/60">{client.segment} • {client.voice}</p>
                </div>
                <div className="text-right">
                  <span className="block text-xs text-white/50">Mode {client.mode}</span>
                  <span className="text-[10px] uppercase tracking-wide text-white/40">Sync {client.lastSync}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 className="font-heading text-lg text-white">KPI & Copilot Alfie</h3>
          <p className="text-sm text-white/60">
            Alfie suit les performances et suggère des améliorations pour chaque réseau.
          </p>
          <div className="mt-4 space-y-3">
            {["Impressions +32 %", "Engagement +18 %", "Clics +11 %"].map((metric) => (
              <div key={metric} className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#101726] p-4">
                <span className="text-sm text-white/70">{metric}</span>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-1 text-xs text-white/70 transition hover:border-indigo-400/40 hover:text-white"
                >
                  <PlayCircle className="h-4 w-4 text-indigo-200" /> Voir recommandation
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-4 text-xs text-indigo-100">
            <p className="font-semibold">Suggestion Alfie</p>
            <p>
              "Avancez la vidéo HÉRO de jeudi à mercredi 9h : pic d’engagement attendu +12 %." — Copilot
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h3 className="font-heading text-lg text-white">Publication orchestrée</h3>
        <p className="text-sm text-white/60">
          File d’attente sécurisée, retries automatiques et sauvegarde dans la médiathèque Supabase.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            {
              title: "File d’attente",
              description: "4 contenus prêts à partir. Retard moyen : 0 min.",
              icon: MonitorPlay
            },
            {
              title: "Retries intelligents",
              description: "0 échec cette semaine. 2 retries programmés sur LinkedIn.",
              icon: FileCode
            },
            {
              title: "Heatmap",
              description: "Créneaux forts : mar 11h, jeu 17h, dim 19h (mobile first).",
              icon: Sparkles
            }
          ].map(({ title, description, icon: Icon }) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-[#101726] p-4">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Icon className="h-4 w-4 text-indigo-300" />
                <span>{title}</span>
              </div>
              <p className="mt-2 text-xs text-white/60">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
