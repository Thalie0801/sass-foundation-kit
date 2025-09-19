import { useState } from "react";
import { ArrowUpRight, ClipboardList, MessageSquarePlus, Star, ThumbsUp } from "lucide-react";

type RoadmapItem = {
  title: string;
  description: string;
  status: "Prévu" | "En test" | "Livré";
};

type Suggestion = {
  id: string;
  title: string;
  description: string;
  votes: number;
};

const roadmap: RoadmapItem[] = [
  {
    title: "Exports PowerPoint brandés",
    description: "Mise en forme auto pour comités mensuels",
    status: "En test"
  },
  {
    title: "Copilot vidéo long format",
    description: "Script + storyboard + captions",
    status: "Prévu"
  },
  {
    title: "Monitoring uptime n8n",
    description: "Alertes Slack + email instantanées",
    status: "Livré"
  }
];

const initialSuggestions: Suggestion[] = [
  {
    id: "s1",
    title: "Integration LinkedIn Ads",
    description: "Permettre le suivi des conversions paid",
    votes: 18
  },
  {
    id: "s2",
    title: "Mode agence multi-tenants",
    description: "Vue consolidée KPI + quotas",
    votes: 31
  },
  {
    id: "s3",
    title: "Bibliothèque prompts communautaire",
    description: "Partager les meilleures variations validées",
    votes: 22
  }
];

export default function RoadmapFeedback() {
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const submitIdea = () => {
    if (!newTitle.trim()) return;
    setSuggestions((prev) => [
      { id: `s${prev.length + 1}`, title: newTitle, description: newDescription, votes: 1 },
      ...prev
    ]);
    setNewTitle("");
    setNewDescription("");
  };

  return (
    <div className="space-y-12">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-heading text-lg text-white">Roadmap publique</h2>
            <p className="text-sm text-white/60">
              Transparente côté client & admin : basculez une idée en "acceptée", elle apparaît instantanément ici.
            </p>
          </div>
          <a
            href="#suggestion"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-indigo-400/40 hover:text-white"
          >
            <MessageSquarePlus className="h-4 w-4 text-indigo-200" /> Ajouter une suggestion
          </a>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {roadmap.map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-[#101726] p-4">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <ClipboardList className="h-4 w-4 text-indigo-300" />
                <span>{item.status}</span>
              </div>
              <p className="mt-2 font-heading text-sm text-white">{item.title}</p>
              <p className="text-xs text-white/60">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="suggestion" className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-heading text-lg text-white">Soumettre une idée</h3>
            <p className="text-sm text-white/60">
              Chaque suggestion rejoint la base `feedback` avec tenant, votes et statut.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/60">
            <Star className="h-4 w-4 text-indigo-200" /> Les idées les plus votées passent en revue produit chaque semaine.
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            placeholder="Titre de l’idée"
            className="rounded-xl border border-white/10 bg-[#101726] px-4 py-3 text-sm text-white outline-none focus:border-indigo-400/60"
          />
          <input
            value={newDescription}
            onChange={(event) => setNewDescription(event.target.value)}
            placeholder="Description (facultatif)"
            className="rounded-xl border border-white/10 bg-[#101726] px-4 py-3 text-sm text-white outline-none focus:border-indigo-400/60"
          />
        </div>
        <button
          type="button"
          onClick={submitIdea}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-indigo-400/40 bg-indigo-500/20 px-4 py-2 text-sm text-white transition hover:bg-indigo-500/30"
        >
          <ArrowUpRight className="h-4 w-4" /> Envoyer à l’équipe produit
        </button>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h3 className="font-heading text-lg text-white">Suggestions populaires</h3>
        <p className="text-sm text-white/60">Triées par votes. Côté admin : possibilité de passer en "acceptée" ou "en cours".</p>
        <div className="mt-4 space-y-3">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#101726] p-4">
              <div>
                <p className="font-heading text-sm text-white">{suggestion.title}</p>
                <p className="text-xs text-white/60">{suggestion.description || "En attente de description"}</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setSuggestions((prev) =>
                    prev.map((item) =>
                      item.id === suggestion.id ? { ...item, votes: item.votes + 1 } : item
                    )
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-1 text-xs text-white/70 transition hover:border-indigo-400/40 hover:text-white"
              >
                <ThumbsUp className="h-4 w-4 text-indigo-200" /> {suggestion.votes}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
