import { useMemo } from "react";
import {
  Activity,
  BellRing,
  Briefcase,
  Building2,
  CalendarRange,
  CheckCircle,
  Database,
  ExternalLink,
  FileOutput,
  Gauge,
  Layers3,
  LifeBuoy,
  Lock,
  Send,
  Server,
  ShieldAlert,
  UsersRound
} from "lucide-react";

type Connector = {
  name: string;
  status: "ok" | "warning" | "error";
  mode: "Live" | "Test";
  lastCheck: string;
  note: string;
};

type Quota = {
  plan: string;
  contents: string;
  videos: string;
  networks: string;
  addons: string;
};

const connectors: Connector[] = [
  {
    name: "Stripe Billing",
    status: "ok",
    mode: "Test",
    lastCheck: "il y a 15 min",
    note: "Webhook /payments synchronisé"
  },
  {
    name: "Supabase",
    status: "ok",
    mode: "Live",
    lastCheck: "il y a 2 min",
    note: "Auth multi-rôle active"
  },
  {
    name: "n8n Orchestration",
    status: "warning",
    mode: "Test",
    lastCheck: "il y a 28 min",
    note: "Workflow vidéos — 1 retry programmé"
  },
  {
    name: "Orchestrateur social",
    status: "ok",
    mode: "Live",
    lastCheck: "il y a 10 min",
    note: "20 réseaux connectés"
  },
  {
    name: "CMS headless",
    status: "ok",
    mode: "Live",
    lastCheck: "il y a 45 min",
    note: "Publishing API stable"
  },
  {
    name: "Replicate / Fal.ai",
    status: "ok",
    mode: "Test",
    lastCheck: "il y a 1 h",
    note: "Modèle vidéos HERO v4"
  }
];

const quotas: Quota[] = [
  {
    plan: "Essential",
    contents: "8 contenus/mois",
    videos: "1 visuel ou vidéo/sem",
    networks: "1 réseau",
    addons: "Fynk Basic"
  },
  {
    plan: "Starter",
    contents: "16 contenus/mois",
    videos: "1 vidéo HERO + 10 shorts",
    networks: "4 réseaux",
    addons: "Fynk Basic/Pro + Ambassadeurs"
  },
  {
    plan: "Pro",
    contents: "30 contenus/mois",
    videos: "3-4 vidéos HERO + shorts",
    networks: "7 réseaux",
    addons: "Tous add-ons"
  }
];

const crmSegments = [
  {
    title: "Growth",
    count: 42,
    description: "Scale-ups, KPI hebdo, besoin reporting PPT",
    icon: Building2
  },
  {
    title: "Retail",
    count: 28,
    description: "Réseaux IG/FB + vitrines locales",
    icon: Briefcase
  },
  {
    title: "Consulting",
    count: 16,
    description: "LinkedIn + newsletter premium",
    icon: UsersRound
  }
];

const supportStats = [
  { title: "Tickets ouverts", value: 3, icon: LifeBuoy },
  { title: "Temps moyen réponse", value: "11 min", icon: TimerIcon },
  { title: "Satisfaction", value: "4.9/5", icon: CheckCircle }
];

function TimerIcon() {
  return <Gauge className="h-5 w-5" />;
}

function statusBadge(status: Connector["status"]) {
  switch (status) {
    case "ok":
      return "bg-emerald-500/20 text-emerald-200";
    case "warning":
      return "bg-amber-500/20 text-amber-200";
    default:
      return "bg-red-500/20 text-red-200";
  }
}

export default function AdminConsole() {
  const liveCount = useMemo(() => connectors.filter((c) => c.mode === "Live").length, []);

  return (
    <div className="space-y-12">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-heading text-lg text-white">Intégrations & statut</h2>
            <p className="text-sm text-white/60">
              {liveCount} connecteurs en production, 2 en mode test. Tests automatiques toutes les 30 minutes.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-indigo-400/40 hover:text-white"
          >
            <Activity className="h-4 w-4 text-indigo-200" /> Lancer un test global
          </button>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {connectors.map((connector) => (
            <div key={connector.name} className="rounded-2xl border border-white/10 bg-[#101726] p-4">
              <div className="flex items-center justify-between">
                <p className="font-heading text-sm text-white">{connector.name}</p>
                <span className={`rounded-full px-3 py-1 text-xs ${statusBadge(connector.status)}`}>
                  {connector.status === "ok" ? "Connecté" : connector.status === "warning" ? "A surveiller" : "Erreur"}
                </span>
              </div>
              <p className="mt-2 text-xs text-white/60">{connector.note}</p>
              <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-wide text-white/40">
                <span>{connector.mode}</span>
                <span>Check {connector.lastCheck}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Layers3 className="h-4 w-4 text-indigo-300" /> Plans & quotas
          </div>
          <div className="mt-4 space-y-3">
            {quotas.map((quota) => (
              <div key={quota.plan} className="rounded-2xl border border-white/10 bg-[#101726] p-4">
                <div className="flex items-center justify-between">
                  <p className="font-heading text-sm text-white">{quota.plan}</p>
                  <span className="text-[11px] uppercase tracking-wide text-white/40">Toggle annuel -10 %</span>
                </div>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-white/60">
                  <li>{quota.contents}</li>
                  <li>{quota.videos}</li>
                  <li>{quota.networks}</li>
                  <li>Add-ons : {quota.addons}</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <BellRing className="h-4 w-4 text-indigo-300" /> Notifications & exports
          </div>
          <ul className="mt-4 space-y-3 text-xs text-white/60">
            <li className="flex items-start gap-2">
              <Send className="mt-0.5 h-4 w-4 text-indigo-200" />
              Alertes publication multi-canaux (email, Slack, SMS)
            </li>
            <li className="flex items-start gap-2">
              <FileOutput className="mt-0.5 h-4 w-4 text-indigo-200" />
              Exports CSV / PDF / PowerPoint planifiés
            </li>
            <li className="flex items-start gap-2">
              <Server className="mt-0.5 h-4 w-4 text-indigo-200" />
              Sauvegarde Supabase + monitoring n8n intégré
            </li>
            <li className="flex items-start gap-2">
              <ShieldAlert className="mt-0.5 h-4 w-4 text-indigo-200" />
              Audit log et suivi RGPD (tokens chiffrés)
            </li>
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Database className="h-4 w-4 text-indigo-300" /> CRM & emailing
            </div>
            <div className="mt-4 space-y-3">
              {crmSegments.map(({ title, count, description, icon: Icon }) => (
                <div key={title} className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#101726] p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-200">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-heading text-sm text-white">{title}</p>
                      <p className="text-xs text-white/60">{description}</p>
                    </div>
                  </div>
                  <span className="text-xl font-semibold text-white/80">{count}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <LifeBuoy className="h-4 w-4 text-indigo-300" /> Support & mémoire tonale
            </div>
            <div className="mt-4 space-y-3">
              {supportStats.map(({ title, value, icon: Icon }) => (
                <div key={title} className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#101726] p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-200">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-heading text-sm text-white">{title}</p>
                      <p className="text-xs text-white/60">Historique chat Alfie + tickets reliés</p>
                    </div>
                  </div>
                  <span className="text-lg font-semibold text-white/80">{value}</span>
                </div>
              ))}
            </div>
            <a
              href="https://postiz.app"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-xs text-indigo-200 hover:text-white"
            >
              Voir la configuration orchestrateur social <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <CalendarRange className="h-4 w-4 text-indigo-300" /> Affiliation & facturation
          </div>
          <ul className="mt-4 space-y-3 text-xs text-white/60">
            <li>Affiliation 10 % — 15 % après 20 clients (automatique)</li>
            <li>Stripe Billing : plans mensuels + toggle annuel -10 %</li>
            <li>Factures PDF générées via SendGrid/Postmark</li>
            <li>Gestion des exclusivités et add-ons Fynk / Ambassadeurs</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Lock className="h-4 w-4 text-indigo-300" /> Sécurité & monitoring
          </div>
          <ul className="mt-4 space-y-3 text-xs text-white/60">
            <li>Tokens chiffrés, rotation automatique, journal RGPD</li>
            <li>Alertes n8n + Supabase en temps réel</li>
            <li>Backups quotidiens + restauration 1 clic</li>
            <li>Audit log complet accessible par tenant</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
