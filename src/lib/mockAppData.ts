export type ContentStatus =
  | "idea"
  | "draft"
  | "review"
  | "ready"
  | "scheduled"
  | "published"
  | "archived";

export type ContentPriority = "low" | "medium" | "high";

export interface ContentChecklist {
  research: boolean;
  writing: boolean;
  review: boolean;
  ready: boolean;
}

export interface ContentLink {
  label: string;
  url: string;
  type: "brief" | "source" | "asset" | "doc" | "publication";
}

export interface ContentAttachment {
  id: string;
  name: string;
  url: string;
  kind: string;
}

export interface ContentHistoryEntry {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
  details?: string;
}

export interface ContentComment {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  mentions?: string[];
}

export interface AntiOverlapInfo {
  hasConflict: boolean;
  message: string;
  suggestions: string[];
}

export interface BrandVoiceDial {
  formel: number;
  expert: number;
  energy: number;
}

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  status: ContentStatus;
  channel: string;
  assignee: string;
  dueDate?: string;
  plannedAt?: string;
  priority: ContentPriority;
  tags: string[];
  lastUpdated: string;
  createdAt: string;
  summary: string;
  checklist: ContentChecklist;
  links: ContentLink[];
  attachments: ContentAttachment[];
  history: ContentHistoryEntry[];
  comments: ContentComment[];
  antiOverlap?: AntiOverlapInfo;
  brandVoice?: BrandVoiceDial;
}

export type TaskStatus = "todo" | "doing" | "done";

export interface TaskItem {
  id: string;
  title: string;
  status: TaskStatus;
  assignee: string;
  dueDate?: string;
  contentId?: string;
  channel?: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  target: string;
  timestamp: string;
  by: string;
  type: "publication" | "validation" | "creation" | "edition" | "comment";
}

export interface AnalyticsSnapshot {
  created: number;
  published: number;
  onTimeRate: number;
  velocity: Array<{ user: string; value: number }>;
  loadByChannel: Array<{ channel: string; planned: number; published: number }>;
}

export interface InvoiceItem {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "due";
  url: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: "owner" | "admin" | "editor" | "viewer";
  email: string;
}

export const mockOrganization = {
  name: "Studio Nova",
  quotas: {
    weekly: { blog: 3, linkedin: 5, instagram: 4, youtube: 2 },
    monthly: { blog: 12, linkedin: 20, instagram: 16, youtube: 8 },
  },
  trialEndsAt: "2025-02-01",
  currentPlan: "Pro",
  nextInvoiceDate: "2025-02-01",
  fynkActive: true,
};

export const mockContents: ContentItem[] = [
  {
    id: "cnt-1",
    title: "Article SEO — Tendances IA 2025",
    slug: "article-seo-tendances-ia-2025",
    status: "ready",
    channel: "Blog",
    assignee: "Nathalie",
    dueDate: "2025-01-23",
    plannedAt: "2025-01-23T09:00:00.000Z",
    priority: "high",
    tags: ["IA", "SEO"],
    lastUpdated: "2025-01-19T10:15:00.000Z",
    createdAt: "2025-01-08T08:00:00.000Z",
    summary: "Analyse des tendances IA et des impacts pour les directions marketing.",
    checklist: { research: true, writing: true, review: true, ready: false },
    links: [
      { label: "Brief Notion", url: "https://example.com/brief-ia", type: "brief" },
      { label: "Sources Gartner", url: "https://example.com/gartner", type: "source" },
    ],
    attachments: [
      {
        id: "att-1",
        name: "Mockups hero.png",
        url: "https://example.com/mockup-hero.png",
        kind: "image/png",
      },
    ],
    history: [
      {
        id: "act-1",
        actor: "Nathalie",
        action: "a créé le contenu",
        timestamp: "2025-01-08T08:05:00.000Z",
      },
      {
        id: "act-2",
        actor: "Marc",
        action: "a validé le brief",
        timestamp: "2025-01-10T14:15:00.000Z",
      },
      {
        id: "act-3",
        actor: "Sophie",
        action: "a mis à jour le plan de diffusion",
        timestamp: "2025-01-18T09:40:00.000Z",
        details: "Ajout d'une déclinaison Instagram",
      },
    ],
    comments: [
      {
        id: "com-1",
        author: "Marc",
        message: "Super intro. @Nathalie peux-tu préciser le chiffre clé dans le H2 ?",
        timestamp: "2025-01-19T09:15:00.000Z",
        mentions: ["Nathalie"],
      },
      {
        id: "com-2",
        author: "Nathalie",
        message: "@Marc c'est fait, j'ai ajouté la stat Gartner dans la section 2.",
        timestamp: "2025-01-19T10:05:00.000Z",
        mentions: ["Marc"],
      },
    ],
    antiOverlap: {
      hasConflict: false,
      message: "Aucun chevauchement détecté sur les 30 prochains jours.",
      suggestions: [],
    },
    brandVoice: { formel: 45, expert: 70, energy: 60 },
  },
  {
    id: "cnt-2",
    title: "Post LinkedIn — Retour client GreenShift",
    slug: "post-linkedin-retour-client-greenshift",
    status: "draft",
    channel: "LinkedIn",
    assignee: "Marc",
    dueDate: "2025-01-23",
    plannedAt: "2025-01-23T15:00:00.000Z",
    priority: "medium",
    tags: ["Client", "LinkedIn"],
    lastUpdated: "2025-01-19T11:45:00.000Z",
    createdAt: "2025-01-15T09:00:00.000Z",
    summary: "Mise en avant du ROI client avec carrousel visuel.",
    checklist: { research: true, writing: false, review: false, ready: false },
    links: [
      { label: "Témoignage brut", url: "https://example.com/temoignage", type: "source" },
    ],
    attachments: [
      {
        id: "att-2",
        name: "Carrousel Figma",
        url: "https://example.com/carrousel.fig",
        kind: "application/figma",
      },
    ],
    history: [
      {
        id: "act-4",
        actor: "Sophie",
        action: "a assigné Marc",
        timestamp: "2025-01-15T09:05:00.000Z",
      },
    ],
    comments: [],
    antiOverlap: {
      hasConflict: true,
      message: "Sujet proche de 'Case study GreenShift'.",
      suggestions: [
        "Changer l'angle sur l'équipe produit",
        "Planifier à +7 jours",
      ],
    },
    brandVoice: { formel: 30, expert: 55, energy: 75 },
  },
  {
    id: "cnt-3",
    title: "Story Instagram — Coulisses studio",
    slug: "story-instagram-coulisses-studio",
    status: "scheduled",
    channel: "Instagram",
    assignee: "Sophie",
    dueDate: "2025-01-23",
    plannedAt: "2025-01-23T18:00:00.000Z",
    priority: "medium",
    tags: ["Instagram", "Brand"],
    lastUpdated: "2025-01-18T16:20:00.000Z",
    createdAt: "2025-01-12T12:00:00.000Z",
    summary: "Mini reportage en coulisses de la production vidéo.",
    checklist: { research: true, writing: true, review: true, ready: true },
    links: [
      { label: "Storyboard", url: "https://example.com/storyboard", type: "doc" },
    ],
    attachments: [],
    history: [
      {
        id: "act-5",
        actor: "Sophie",
        action: "a planifié la publication",
        timestamp: "2025-01-18T16:20:00.000Z",
      },
    ],
    comments: [],
    brandVoice: { formel: 20, expert: 40, energy: 85 },
  },
  {
    id: "cnt-4",
    title: "Vidéo YouTube — Tutoriel complet",
    slug: "video-youtube-tutoriel-complet",
    status: "review",
    channel: "YouTube",
    assignee: "Sophie",
    dueDate: "2025-01-24",
    plannedAt: "2025-01-24T10:00:00.000Z",
    priority: "high",
    tags: ["YouTube", "Video"],
    lastUpdated: "2025-01-19T12:30:00.000Z",
    createdAt: "2025-01-05T08:00:00.000Z",
    summary: "Tutoriel sur la programmation multi-plateformes Æditus.",
    checklist: { research: true, writing: true, review: false, ready: false },
    links: [
      { label: "Script final", url: "https://example.com/script-video", type: "doc" },
      { label: "Captations brutes", url: "https://example.com/captation", type: "asset" },
    ],
    attachments: [
      {
        id: "att-4",
        name: "Miniature.png",
        url: "https://example.com/miniature.png",
        kind: "image/png",
      },
    ],
    history: [
      {
        id: "act-6",
        actor: "Marc",
        action: "a demandé une révision",
        timestamp: "2025-01-19T12:00:00.000Z",
        details: "Ajouter les sous-titres FR/EN",
      },
    ],
    comments: [
      {
        id: "com-3",
        author: "Marc",
        message: "Peux-tu intégrer le CTA vers la landing à 04:32 ?",
        timestamp: "2025-01-19T12:05:00.000Z",
        mentions: ["Sophie"],
      },
    ],
    brandVoice: { formel: 35, expert: 65, energy: 80 },
  },
  {
    id: "cnt-5",
    title: "Newsletter — Synthèse mensuelle",
    slug: "newsletter-synthese-janvier",
    status: "draft",
    channel: "Email",
    assignee: "Nathalie",
    dueDate: "2025-01-22",
    plannedAt: "2025-01-22T08:00:00.000Z",
    priority: "medium",
    tags: ["Newsletter"],
    lastUpdated: "2025-01-17T10:10:00.000Z",
    createdAt: "2025-01-09T07:30:00.000Z",
    summary: "Résumé des contenus et chiffres clés du mois.",
    checklist: { research: true, writing: false, review: false, ready: false },
    links: [
      { label: "Outline", url: "https://example.com/outline-newsletter", type: "doc" },
    ],
    attachments: [],
    history: [],
    comments: [],
    antiOverlap: {
      hasConflict: false,
      message: "",
      suggestions: [],
    },
    brandVoice: { formel: 40, expert: 60, energy: 55 },
  },
  {
    id: "cnt-6",
    title: "Idée — Interview client Weave",
    slug: "idee-interview-client-weave",
    status: "idea",
    channel: "Blog",
    assignee: "Marc",
    priority: "low",
    tags: ["Client", "Interview"],
    lastUpdated: "2025-01-16T09:45:00.000Z",
    createdAt: "2025-01-16T09:45:00.000Z",
    summary: "Interview croisée sur la collaboration avec Æditus.",
    checklist: { research: false, writing: false, review: false, ready: false },
    links: [],
    attachments: [],
    history: [],
    comments: [],
    brandVoice: { formel: 50, expert: 60, energy: 65 },
  },
];

export const mockTasks: TaskItem[] = [
  {
    id: "task-1",
    title: "Finaliser le H2 de l'article IA",
    status: "doing",
    assignee: "Nathalie",
    dueDate: "2025-01-22",
    contentId: "cnt-1",
  },
  {
    id: "task-2",
    title: "Uploader les sous-titres FR/EN",
    status: "todo",
    assignee: "Sophie",
    dueDate: "2025-01-21",
    contentId: "cnt-4",
  },
  {
    id: "task-3",
    title: "Valider le témoignage client",
    status: "todo",
    assignee: "Marc",
    dueDate: "2025-01-20",
    contentId: "cnt-2",
  },
  {
    id: "task-4",
    title: "Programmer les stories Instagram",
    status: "done",
    assignee: "Sophie",
    dueDate: "2025-01-18",
    contentId: "cnt-3",
  },
];

export const mockActivity: ActivityItem[] = [
  {
    id: "activity-1",
    action: "Publication",
    target: "Story Instagram — Coulisses studio",
    timestamp: "2025-01-19T18:05:00.000Z",
    by: "Sophie",
    type: "publication",
  },
  {
    id: "activity-2",
    action: "Validation",
    target: "Article SEO — Tendances IA 2025",
    timestamp: "2025-01-19T10:20:00.000Z",
    by: "Marc",
    type: "validation",
  },
  {
    id: "activity-3",
    action: "Création",
    target: "Idée — Interview client Weave",
    timestamp: "2025-01-16T09:45:00.000Z",
    by: "Marc",
    type: "creation",
  },
  {
    id: "activity-4",
    action: "Commentaire",
    target: "Vidéo YouTube — Tutoriel complet",
    timestamp: "2025-01-19T12:05:00.000Z",
    by: "Marc",
    type: "comment",
  },
];

export const analyticsSnapshot: AnalyticsSnapshot = {
  created: 32,
  published: 26,
  onTimeRate: 0.82,
  velocity: [
    { user: "Nathalie", value: 7 },
    { user: "Marc", value: 6 },
    { user: "Sophie", value: 8 },
  ],
  loadByChannel: [
    { channel: "Blog", planned: 8, published: 6 },
    { channel: "LinkedIn", planned: 10, published: 9 },
    { channel: "Instagram", planned: 12, published: 10 },
    { channel: "YouTube", planned: 4, published: 3 },
  ],
};

export const mockInvoices: InvoiceItem[] = [
  {
    id: "inv-2024-11",
    date: "2024-11-01",
    amount: 399,
    status: "paid",
    url: "https://example.com/invoice/2024-11",
  },
  {
    id: "inv-2024-12",
    date: "2024-12-01",
    amount: 399,
    status: "paid",
    url: "https://example.com/invoice/2024-12",
  },
  {
    id: "inv-2025-01",
    date: "2025-01-01",
    amount: 399,
    status: "paid",
    url: "https://example.com/invoice/2025-01",
  },
];

export const teamMembers: TeamMember[] = [
  { id: "user-1", name: "Nathalie", role: "owner", email: "nathalie@aeditus.com" },
  { id: "user-2", name: "Marc", role: "editor", email: "marc@aeditus.com" },
  { id: "user-3", name: "Sophie", role: "editor", email: "sophie@aeditus.com" },
  { id: "user-4", name: "Lina", role: "viewer", email: "lina@aeditus.com" },
];

export const supportedChannels = ["Blog", "LinkedIn", "Instagram", "YouTube", "Email", "Podcast"];

export const fynkQueue = [
  {
    id: "fynk-1",
    title: "Post LinkedIn — Lancement produit",
    scheduledAt: "2025-01-22T08:30:00.000Z",
    status: "En file",
    channel: "LinkedIn",
  },
  {
    id: "fynk-2",
    title: "Post LinkedIn — Bilan semaine",
    scheduledAt: "2025-01-24T09:00:00.000Z",
    status: "Prêt à valider",
    channel: "LinkedIn",
  },
  {
    id: "fynk-3",
    title: "Relance commentaires",
    scheduledAt: "2025-01-24T17:00:00.000Z",
    status: "Programmé",
    channel: "LinkedIn",
  },
];

export const fynkCalendarHighlights = [
  {
    date: "2025-01-22",
    label: "3 publications automatiques",
  },
  {
    date: "2025-01-24",
    label: "Campagne relance",
  },
];

export const alfieInsights = [
  "Tu es à 78 % du quota hebdo LinkedIn. Ajoute 2 posts vendredi.",
  "Les vidéos coulisses génèrent +24 % d'engagement, pense à en planifier une supplémentaire.",
  "Les publications newsletter sont prêtes avec 2 jours d'avance cette semaine, bravo !",
];

export const getContentById = (id: string) => mockContents.find((content) => content.id === id);
