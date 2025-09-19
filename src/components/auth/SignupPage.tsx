import { FormEvent, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

type LocationState = {
  from?: string;
};

const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState | null) ?? {};
  const fromPath = typeof state.from === "string" && state.from.length > 0 ? state.from : "/app/client";
  const { signUp, user, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to="/app/client" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setSubmitting(true);
    try {
      await signUp({ email, password, name });
      navigate(fromPath, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Impossible de créer votre compte.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <div className="mx-auto flex w-full max-w-md flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Link to="/" className="mb-8 inline-flex items-center text-sm text-white/70 transition hover:text-white">
          ← Retour à la landing
        </Link>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur">
          <h1 className="font-heading text-2xl text-white">Créer votre compte</h1>
          <p className="mt-2 text-sm text-white/60">
            Enregistrez-vous pour accéder à la plateforme et tester Æditus.
          </p>
          {error && (
            <p className="mt-4 rounded-xl border border-rose-500/50 bg-rose-500/10 px-4 py-2 text-xs text-rose-100">{error}</p>
          )}
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-white">
                Nom / Société (optionnel)
              </label>
              <input
                id="name"
                type="text"
                autoComplete="organization"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0B1110] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-white">
                Email professionnel
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0B1110] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-white">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0B1110] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium text-white">
                Confirmez le mot de passe
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0B1110] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-[#0B1110] transition hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Création en cours..." : "Créer mon compte"}
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-white/60">
            Déjà inscrit ?{" "}
            <Link
              to="/login"
              state={{ from: fromPath }}
              className="font-semibold text-indigo-200 transition hover:text-white"
            >
              Retour à la connexion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
