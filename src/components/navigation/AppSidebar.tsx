import { useState } from "react";
import { 
  Home, 
  Calendar, 
  Users, 
  BarChart3, 
  Settings, 
  Palette,
  Folder,
  Zap,
  CreditCard
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

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

const navigationItems = [
  { title: "Tableau de Bord", url: "/app", icon: Home },
  { title: "Calendrier", url: "/app/calendar", icon: Calendar },
  { title: "Marques", url: "/app/brands", icon: Palette },
  { title: "Équipe", url: "/app/team", icon: Users },
  { title: "Analytics", url: "/app/analytics", icon: BarChart3 },
];

const toolsItems = [
  { title: "Intégrations", url: "/app/integrations", icon: Zap },
  { title: "Projets", url: "/app/projects", icon: Folder },
];

const settingsItems = [
  { title: "Abonnement", url: "/app/billing", icon: CreditCard },
  { title: "Paramètres", url: "/app/settings", icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

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
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClassName(item.url)}>
                      <item.icon className={`h-4 w-4 ${!open ? 'mx-auto' : ''}`} />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
              {toolsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClassName(item.url)}>
                      <item.icon className={`h-4 w-4 ${!open ? 'mx-auto' : ''}`} />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClassName(item.url)}>
                      <item.icon className={`h-4 w-4 ${!open ? 'mx-auto' : ''}`} />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}