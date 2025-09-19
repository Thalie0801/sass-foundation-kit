import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bot,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  Rocket,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "../auth/AuthProvider";

const navItems = [
  {
    to: "client",
    label: "Espace Client",
    description:
      "Onboarding guidé, plan éditorial généré et calendrier intelligent pour vos équipes marketing.",
    icon: LayoutDashboard
  },
  {
    to: "admin",
    label: "Console Admin",
    description:
      "Supervision des intégrations, gestion des quotas et suivi CRM pour chaque tenant.",
    icon: ShieldCheck
  },
  {
    to: "sandbox",
    label: "Sandbox QA",
    description:
      "Mode test pour générer des contenus fictifs, simuler les publications et valider Stripe.",
    icon: Rocket
  },
  {
    to: "roadmap",
    label: "Roadmap & Feedback",
    description:
      "Votes clients, priorisation et synchronisation avec la roadmap publique.",
    icon: Bot
  }
] as const;

export default function PlatformLayout() {
  const location = useLocation();
  const active = navItems.find((item) => location.pathname.includes(item.to));
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" /> Retour landing
            </Link>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Aperçu produit</p>
              <h1 className="font-heading text-lg font-semibold text-white md:text-2xl">
                Plateforme Æditus
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-xl border border-indigo-400/30 bg-indigo-400/10 px-3 py-1 text-xs text-indigo-200 md:inline-flex">
              <ClipboardCheck className="h-4 w-4" /> Version démo connectée
            </span>
            {user && (
              <span className="max-w-[160px] truncate rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                {user.name ?? user.email}
              </span>
            )}
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-1 text-xs text-white/80 transition hover:bg-white/10"
            >
              <LogOut className="h-3 w-3" /> Déconnexion
            </button>
          </div>
        </div>
        <nav className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 pb-4 md:px-6">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "client"}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition",
                    isActive
                      ? "border-indigo-400/60 bg-indigo-500/20 text-white shadow-lg shadow-indigo-500/10"
                      : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white"
                  ].join(" ")
                }
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
          <p className="text-sm text-white/60">
            {active ? active.description : "Sélectionnez un espace pour découvrir les workflows Æditus."}
          </p>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:px-6">
        <Outlet />
      </main>
    </div>
  );
}
