import {
  Building2,
  CreditCard,
  Folder,
  Home,
  KanbanSquare,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  Settings,
  Webhook,
} from "lucide-react";
import type { AppShellMenuItem } from "@/components/layout/AppShell";

export const adminMenu: AppShellMenuItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Building2, label: "Clients", href: "/admin/clients" },
  { icon: KanbanSquare, label: "Roadmaps", href: "/admin/roadmaps" },
  { icon: CreditCard, label: "Facturation", href: "/admin/billing" },
  { icon: Webhook, label: "Intégrations", href: "/admin/integrations" },
  { icon: Settings, label: "Paramètres", href: "/admin/settings" },
];

export const clientMenu: AppShellMenuItem[] = [
  { icon: Home, label: "Aperçu", href: "/app" },
  { icon: KanbanSquare, label: "Roadmap", href: "/app/roadmap" },
  { icon: ListChecks, label: "Tâches", href: "/app/tasks" },
  { icon: Folder, label: "Livrables", href: "/app/files" },
  { icon: MessageSquare, label: "Discussions", href: "/app/discussions" },
  { icon: Settings, label: "Paramètres", href: "/app/settings" },
];
