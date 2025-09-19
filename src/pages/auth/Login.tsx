import { listDemoProfiles, setActiveProfile } from "@/lib/supabaseClient";

const Login = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-subtle px-4 py-16">
    <div className="w-full max-w-md space-y-6 rounded-3xl border bg-card p-8 shadow-gold">
      <div className="space-y-2 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">Æditus Sandbox</p>
        <h1 className="text-2xl font-semibold">Connexion démo</h1>
        <p className="text-sm text-muted-foreground">
          Sélectionnez un rôle pour explorer la plateforme. Les comptes réels utilisent Supabase Auth + RLS.
        </p>
      </div>
      <div className="space-y-3">
        {listDemoProfiles().map((profile) => (
          <button
            key={profile.id}
            className="w-full rounded-xl border bg-background px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-gold"
            onClick={() => setActiveProfile(profile.id)}
          >
            <p className="font-medium">{profile.label}</p>
            <p className="text-xs text-muted-foreground">{profile.email}</p>
          </button>
        ))}
        <button
          className="w-full rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
          onClick={() => setActiveProfile(null)}
        >
          Se déconnecter
        </button>
      </div>
    </div>
  </div>
);

export default Login;
