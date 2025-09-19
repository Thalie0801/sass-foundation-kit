import { useMemo, useState } from "react";
import {
  Beaker,
  Clock3,
  Download,
  FileText,
  Loader2,
  RefreshCcw,
  ShieldCheck,
  Sparkle,
  ToggleLeft
} from "lucide-react";

type TestRun = {
  id: string;
  type: "content" | "stripe" | "publish";
  status: "Succès" | "Échec" | "En cours";
  result: string;
};

const initialTests: TestRun[] = [
  {
    id: "sandbox-1",
    type: "content",
    status: "Succès",
    result: "3 articles de démo générés (tech, retail, food)"
  },
  {
    id: "sandbox-2",
    type: "stripe",
    status: "Succès",
    result: "Paiement test Starter via Payment Link"
  },
  {
    id: "sandbox-3",
    type: "publish",
    status: "Échec",
    result: "Post LinkedIn en attente (quota API atteint)"
  }
];

export default function SandboxExperience() {
  const [tests, setTests] = useState(initialTests);
  const [isRunning, setIsRunning] = useState(false);
  const successRate = useMemo(
    () => Math.round((tests.filter((test) => test.status === "Succès").length / tests.length) * 100),
    [tests]
  );

  const rerunPublish = () => {
    setIsRunning(true);
    setTimeout(() => {
      setTests((prev) =>
        prev.map((test) =>
          test.type === "publish"
            ? {
                ...test,
                status: "Succès",
                result: "Simulation orchestrateur social OK — brouillon créé"
              }
            : test
        )
      );
      setIsRunning(false);
    }, 900);
  };

  return (
    <div className="space-y-12">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-heading text-lg text-white">Mode Sandbox</h2>
            <p className="text-sm text-white/60">
              Génère des contenus fictifs, simule Stripe en test et publie uniquement des brouillons.
            </p>
          </div>
          <button
            type="button"
            onClick={rerunPublish}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-indigo-400/40 hover:text-white"
          >
            {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4 text-indigo-200" />}
            Relancer les tests publication
          </button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[{
            label: "Contenus fictifs",
            value: "12 posts générés",
            description: "Articles, scripts vidéos, visuels",
            icon: FileText
          },
          {
            label: "Mode Stripe",
            value: "Test",
            description: "Paiements sécurisés via Payment Link",
            icon: ShieldCheck
          },
          {
            label: "Taux de réussite",
            value: `${successRate}%`,
            description: "Réussi sur les 3 scénarios",
            icon: Sparkle
          }].map(({ label, value, description, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-[#101726] p-4">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Icon className="h-4 w-4 text-indigo-300" />
                <span>{label}</span>
              </div>
              <p className="mt-2 text-xl font-semibold text-white">{value}</p>
              <p className="text-xs text-white/60">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h3 className="font-heading text-lg text-white">Journal des tests</h3>
        <p className="text-sm text-white/60">Chaque exécution est historisée dans Supabase avec statut, logs et résultat.</p>
        <div className="mt-4 space-y-3">
          {tests.map((test) => (
            <div key={test.id} className="rounded-2xl border border-white/10 bg-[#101726] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-200">
                    <Beaker className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-heading text-sm text-white">{test.type.toUpperCase()}</p>
                    <p className="text-xs text-white/60">{test.result}</p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    test.status === "Succès"
                      ? "bg-emerald-500/20 text-emerald-200"
                      : test.status === "Échec"
                      ? "bg-rose-500/20 text-rose-200"
                      : "bg-indigo-500/20 text-indigo-200"
                  }`}
                >
                  {test.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <ToggleLeft className="h-4 w-4 text-indigo-300" /> Bascules disponibles
          </div>
          <ul className="mt-4 space-y-3 text-xs text-white/60">
            <li>Activer / désactiver la génération de contenus fictifs</li>
            <li>Simulation publication orchestrateur social uniquement en brouillon</li>
            <li>Stripe test mode avec webhooks sécurisés</li>
            <li>Option : importer un CSV de clients fictifs</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Clock3 className="h-4 w-4 text-indigo-300" /> Exports & validation
          </div>
          <ul className="mt-4 space-y-3 text-xs text-white/60">
            <li>Exports tests : CSV / PDF / PPT pour démonstrations</li>
            <li>Rapport envoyé à l’admin après chaque batch</li>
            <li>Capture auto des logs n8n et orchestrateur social</li>
            <li>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-1 text-xs text-white/70 transition hover:border-indigo-400/40 hover:text-white"
              >
                <Download className="h-4 w-4 text-indigo-200" /> Télécharger le dernier rapport
              </button>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
