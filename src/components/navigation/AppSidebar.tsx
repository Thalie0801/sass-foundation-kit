import {
  Home,
  Calendar,
  Users,
  BarChart3,
  Settings,
  Palette,
  Folder,
  Zap,
  CreditCard,
  Shield,
  Lock,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useMemo, type ComponentType } from "react";
import { useAuth } from "@/contexts/AuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { profile, hasFeature } = useAuth();

  const isAdmin = profile?.role === "admin" || profile?.role === "super_admin";
  const fynkEnabled = isAdmin || hasFeature("fynk");

  const navigationItems = useMemo(
    () => [
      {
        title: isAdmin ? "Vue d'ensemble" : "Tableau de Bord",
        url: "/app",
        icon: Home,
      },
      {
        title: "Calendrier",
        url: "/app/calendar",
        icon: Calendar,
      },
      {
        title: "Marques",
        url: "/app/brands",
        icon: Palette,
      },
      {
        title: "Équipe",
        url: "/app/team",
        icon: Users,
      },
      {
        title: "Analytics",
        url: "/app/analytics",
        icon: BarChart3,
      },
      ...(isAdmin
        ? [
            {
              title: "Administration",
              url: "/app/admin",
              icon: Shield,
            },
          ]
        : []),
    ],
    [isAdmin],
  );

  const toolsItems = useMemo(
    () => [
      {
        title: "Intégrations",
        url: fynkEnabled ? "/app/integrations" : "/app/paywall",
        icon: Zap,
        locked: !fynkEnabled,
      },
      { title: "Projets", url: "/app/projects", icon: Folder },
    ],
    [fynkEnabled],
  );

  const settingsItems = useMemo(
    () => [
      { title: "Abonnement", url: "/app/billing", icon: CreditCard },
      { title: "Paramètres", url: "/app/settings", icon: Settings },
    ],
    [],
  );

  const isActive = (path: string) => {
    if (path === "/app") {
      return currentPath === "/app";
    }
    return currentPath.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    const baseClasses = "transition-smooth group";
    return isActive(path)
      ? `${baseClasses} bg-primary/10 text-primary font-medium border-r-2 border-primary`
      : `${baseClasses} text-muted-foreground hover:text-foreground hover:bg-accent/50`;
  };

  const renderNavItem = (
    item: { title: string; url: string; icon: ComponentType<{ className?: string }>; locked?: boolean },
  ) => {
    const actualUrl = item.locked ? "/app/paywall" : item.url;
    const disabledClasses = item.locked ? "opacity-60" : "";

    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild>
          <NavLink to={actualUrl} className={`${getNavClassName(item.url)} ${disabledClasses}`}>
            <item.icon className={`h-4 w-4 ${!open ? "mx-auto" : ""}`} />
            {open && (
              <span className="flex items-center gap-2">
                {item.title}
                {item.locked && <Lock className="h-3 w-3" />}
              </span>
            )}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar className="border-r border-border/20 bg-sidebar">
      <SidebarContent className="bg-sidebar">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs font-semibold uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => renderNavItem(item))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tools */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs font-semibold uppercase tracking-wider">
            Outils
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsItems.map((item) => renderNavItem(item))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs font-semibold uppercase tracking-wider">
            Configuration
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => renderNavItem(item))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}