import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { listDemoProfiles, setActiveProfile } from "@/lib/supabaseClient";

export type AppShellMenuItem = {
  icon: LucideIcon;
  label: string;
  href: string;
  description?: string;
};

export function AppShell({ menu, children }: { menu: AppShellMenuItem[]; children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const profiles = useMemo(() => listDemoProfiles(), []);
  const activeProfile = profiles.find((profile) => profile.id === user?.id);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="flex flex-1">
        <aside className="hidden md:flex w-64 shrink-0 border-r bg-card/80 backdrop-blur">
          <nav className="flex flex-col gap-1 p-4 w-full">
            {menu.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-muted", 
                    isActive && "bg-muted text-primary font-semibold"
                  )}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1 text-sm leading-tight">
                    {item.label}
                    {item.description ? (
                      <span className="block text-xs text-muted-foreground">{item.description}</span>
                    ) : null}
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1">
          <header className="h-16 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-full items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <span className="rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Æditus Preview
                </span>
                <div className="hidden md:flex items-center rounded-xl border bg-card px-3 py-1.5 text-sm text-muted-foreground shadow-sm">
                  ⌘K · Recherche & raccourcis
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Session</span>
                <select
                  className="rounded-lg border bg-card px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={activeProfile?.id ?? "guest"}
                  onChange={(event) => {
                    const next = event.target.value;
                    if (next === "guest") {
                      setActiveProfile(null);
                    } else {
                      setActiveProfile(next);
                    }
                  }}
                >
                  <option value="guest">Déconnecté</option>
                  {profiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </header>
          <div className="p-4 lg:p-6 space-y-6">{children}</div>
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 inset-x-0 border-t bg-card/95 backdrop-blur shadow-lg">
        <div className="grid grid-cols-4 text-xs font-medium">
          {menu.slice(0, 4).map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2", 
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
