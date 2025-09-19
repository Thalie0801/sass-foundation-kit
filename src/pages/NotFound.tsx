import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-subtle px-4 text-center">
    <div className="space-y-4 rounded-3xl border bg-card p-10 shadow-gold">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">404</p>
      <h1 className="text-3xl font-semibold">Page introuvable</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Cette URL n'existe pas (encore). Utilisez la navigation ou retournez sur la page d'accueil pour explorer la démo Æditus.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground" to="/">
          Revenir à la landing
        </Link>
        <Link className="rounded-xl border px-5 py-2 text-sm font-medium" to="/app">
          Explorer l'espace client
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
