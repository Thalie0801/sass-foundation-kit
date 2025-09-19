import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center text-slate-100">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-200">
        <Compass className="h-8 w-8" />
      </div>
      <h1 className="mt-6 font-heading text-3xl font-semibold">Page introuvable</h1>
      <p className="mt-2 max-w-md text-sm text-white/70">
        Ce chemin ne fait pas partie de la démo Æditus. Revenez sur la landing page ou explorez la plateforme.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-sm text-white/80 transition hover:border-white/20 hover:text-white"
        >
          Retour landing
        </Link>
        <Link
          to="/app/client"
          className="inline-flex items-center justify-center rounded-xl border border-indigo-400/40 bg-indigo-500/20 px-5 py-3 text-sm text-white transition hover:bg-indigo-500/30"
        >
          Voir la plateforme
        </Link>
      </div>
    </div>
  );
}
