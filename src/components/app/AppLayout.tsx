/* eslint-disable react-refresh/only-export-components */
import React, { useMemo } from "react";
import { Outlet, Link, useLocation, useOutletContext } from "react-router-dom";
import {
  Home,
  Calendar,
  FileText,
  CheckSquare,
  BarChart3,
  Zap,
  CreditCard,
  Settings,
  HelpCircle,
  Search,
  Plus,
  Bell,
  User,
  LogOut,
  Building2,
  Info,
  PencilRuler,
  ArrowRightLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockOrganization } from "@/lib/mockAppData";

type AppUser = {
  firstName: string;
  email: string;
  role: "owner" | "admin" | "editor" | "viewer";
  avatar?: string | null;
  hasFynkAddOn: boolean;
};

export type AppLayoutContext = {
  user: AppUser;
  organization: typeof mockOrganization;
};

const baseNavigation = [
  { href: "/app", icon: Home, label: "Accueil" },
  { href: "/app/plan", icon: FileText, label: "Plan éditorial" },
  { href: "/app/calendar", icon: Calendar, label: "Calendrier" },
  { href: "/app/contents", icon: FileText, label: "Contenus" },
  { href: "/app/tasks", icon: CheckSquare, label: "Tâches" },
  { href: "/app/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/app/settings", icon: Settings, label: "Paramètres" },
  { href: "/app/help", icon: HelpCircle, label: "Aide" },
];

const ownerNavigation = [
  { href: "/app/billing", icon: CreditCard, label: "Facturation" },
];

export const useAppLayoutContext = () => useOutletContext<AppLayoutContext>();

export default function AppLayout() {
  const location = useLocation();
  const user: AppUser = {
    firstName: "Nathalie",
    email: "nathalie@aeditus.com",
    role: "owner",
    avatar: null,
    hasFynkAddOn: true,
  };

  const navigation = useMemo(() => {
    const items = [...baseNavigation];

    if (user.hasFynkAddOn) {
      items.splice(6, 0, { href: "/app/fynk", icon: Zap, label: "Fynk" });
    }

    if (user.role === "owner" || user.role === "admin") {
      items.splice(items.length - 2, 0, ...ownerNavigation);
    }

    return items;
  }, [user.hasFynkAddOn, user.role]);

  const contextValue: AppLayoutContext = {
    user,
    organization: mockOrganization,
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <div className="flex h-16 items-center justify-between border-b px-6">
          <Link to="/app" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-1 py-1">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground font-bold">
              Æ
            </div>
            <span className="font-heading text-lg font-semibold">Æditus</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-1 py-1"
          >
            <Info className="h-3.5 w-3.5" />
            Landing
          </Link>
        </div>

        <nav className="p-4 space-y-2">
          {navigation.map(({ href, icon: Icon, label }) => {
            const isActive =
              location.pathname === href || (href !== "/app" && location.pathname.startsWith(href));

            return (
              <Link
                key={href}
                to={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        {/* Top bar */}
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <div className="relative w-80 max-w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher... (Ctrl/Cmd+K)"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/app/contents/new" className="flex items-center gap-2">
                      <PenLine className="h-4 w-4" />
                      Nouveau sujet
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/app/contents/new?type=article" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Nouvel article
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/app/tasks/new" className="flex items-center gap-2">
                      <CheckSquare className="h-4 w-4" />
                      Nouvelle tâche
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/app/contents/import" className="flex items-center gap-2">
                      <ArrowRightLeft className="h-4 w-4" />
                      Import CSV
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar ?? undefined} alt={user.firstName} />
                      <AvatarFallback>{user.firstName?.[0]}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.firstName}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        user@example.com
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Building2 className="mr-2 h-4 w-4" />
                    <span>Organisation</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-6">
          <Outlet context={contextValue} />
        </div>
      </main>
    </div>
  );
}