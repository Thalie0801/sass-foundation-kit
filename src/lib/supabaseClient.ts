export type SupabaseRole = "admin" | "client";

export type SupabaseProfile = {
  id: string;
  role: SupabaseRole;
  email: string;
  label: string;
};

type AuthListener = (event: "SIGNED_IN" | "SIGNED_OUT", session: { user: { id: string } | null }) => void;

type SingleResponse<T> = Promise<{ data: T | null; error: Error | null }>;

const demoProfiles: SupabaseProfile[] = [
  {
    id: "admin-0001",
    role: "admin",
    email: "amelie@aeditus.app",
    label: "Amélie · Admin",
  },
  {
    id: "client-0001",
    role: "client",
    email: "marc@atelierverne.fr",
    label: "Marc · Client",
  },
];

let activeUserId: string | null = typeof window !== "undefined" ? window.localStorage.getItem("aeditus.activeUser") : null;
const listeners = new Set<AuthListener>();

function notify(event: "SIGNED_IN" | "SIGNED_OUT") {
  const session = activeUserId ? { user: { id: activeUserId } } : { user: null };
  listeners.forEach((listener) => listener(event, session));
}

function persist(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) {
    window.localStorage.setItem("aeditus.activeUser", id);
  } else {
    window.localStorage.removeItem("aeditus.activeUser");
  }
}

function resolveProfile(id: string | null) {
  if (!id) return null;
  return demoProfiles.find((profile) => profile.id === id) ?? null;
}

function selectProfile(role?: SupabaseRole) {
  const profile = resolveProfile(activeUserId);
  if (!profile) return null;
  if (role && profile.role !== role) return null;
  return profile;
}

function makeTableClient(table: string) {
  return {
    select(_columns?: string) {
      return {
        single(): SingleResponse<{ role: SupabaseRole }> {
          if (table !== "profiles") {
            return Promise.resolve({ data: null, error: new Error(`Table "${table}" non supportée en mode démo.`) });
          }
          const profile = selectProfile();
          if (!profile) {
            return Promise.resolve({ data: null, error: new Error("Aucun profil actif.") });
          }
          return Promise.resolve({ data: { role: profile.role }, error: null });
        },
      };
    },
  };
}

export const supabase = {
  auth: {
    async getUser() {
      const profile = resolveProfile(activeUserId);
      return { data: { user: profile ? { id: profile.id } : null } };
    },
    onAuthStateChange(callback: AuthListener) {
      listeners.add(callback);
      return {
        data: {
          subscription: {
            unsubscribe() {
              listeners.delete(callback);
            },
          },
        },
      };
    },
  },
  from(table: string) {
    return makeTableClient(table);
  },
};

export function listDemoProfiles() {
  return demoProfiles.slice();
}

export function setActiveProfile(id: string | null) {
  activeUserId = id;
  persist(id);
  notify(id ? "SIGNED_IN" : "SIGNED_OUT");
}

export function getActiveProfile() {
  return resolveProfile(activeUserId);
}
