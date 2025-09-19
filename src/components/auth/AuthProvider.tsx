/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

type AuthUser = {
  id: string;
  email: string;
  name?: string;
};

type StoredUser = AuthUser & {
  passwordHash: string;
};

type SignInPayload = {
  email: string;
  password: string;
};

type SignUpPayload = SignInPayload & {
  name?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signIn: (payload: SignInPayload) => Promise<void>;
  signUp: (payload: SignUpPayload) => Promise<void>;
  signOut: () => Promise<void>;
};

const CURRENT_USER_KEY = "aeditus_current_user";
const USERS_KEY = "aeditus_users";

const AuthContext = createContext<AuthContextValue | null>(null);

const readUsers = (): StoredUser[] => {
  if (typeof window === "undefined") {
    return [];
  }
  const raw = window.localStorage.getItem(USERS_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as StoredUser[];
    if (Array.isArray(parsed)) {
      return parsed.filter((entry): entry is StoredUser => Boolean(entry?.email && entry?.passwordHash));
    }
    return [];
  } catch {
    return [];
  }
};

const persistUsers = (users: StoredUser[]) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const readCurrentUser = (): AuthUser | null => {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = window.localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as AuthUser | null;
    if (parsed && typeof parsed.email === "string" && typeof parsed.id === "string") {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

const persistCurrentUser = (user: AuthUser | null) => {
  if (typeof window === "undefined") {
    return;
  }
  if (!user) {
    window.localStorage.removeItem(CURRENT_USER_KEY);
    return;
  }
  window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const hashPassword = async (password: string) => {
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("");
  }
  return `plain:${password}`;
};

const randomId = () => {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `user_${Math.random().toString(36).slice(2)}`;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(readCurrentUser());
    setLoading(false);
  }, []);

  const signIn = useCallback(async ({ email, password }: SignInPayload) => {
    const safeEmail = normalizeEmail(email);
    const users = readUsers();
    const existing = users.find((entry) => entry.email === safeEmail);
    if (!existing) {
      throw new Error("Aucun compte trouvé avec cet email. Créez un compte pour commencer.");
    }
    const hashed = await hashPassword(password);
    if (existing.passwordHash !== hashed && existing.passwordHash !== `plain:${password}`) {
      throw new Error("Identifiants invalides. Vérifiez votre email et votre mot de passe.");
    }
    const nextUser: AuthUser = { id: existing.id, email: existing.email, name: existing.name };
    persistCurrentUser(nextUser);
    setUser(nextUser);
    setLoading(false);
  }, []);

  const signUp = useCallback(async ({ email, password, name }: SignUpPayload) => {
    const safeEmail = normalizeEmail(email);
    const users = readUsers();
    if (users.some((entry) => entry.email === safeEmail)) {
      throw new Error("Un compte existe déjà avec cet email.");
    }
    if (password.length < 8) {
      throw new Error("Le mot de passe doit contenir au moins 8 caractères.");
    }
    const passwordHash = await hashPassword(password);
    const newUser: StoredUser = {
      id: randomId(),
      email: safeEmail,
      name: name?.trim() || undefined,
      passwordHash
    };
    const nextUsers = [...users, newUser];
    persistUsers(nextUsers);
    const nextUser: AuthUser = { id: newUser.id, email: newUser.email, name: newUser.name };
    persistCurrentUser(nextUser);
    setUser(nextUser);
    setLoading(false);
  }, []);

  const signOut = useCallback(async () => {
    persistCurrentUser(null);
    setUser(null);
    setLoading(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signIn,
      signUp,
      signOut
    }),
    [user, loading, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l’intérieur d’un AuthProvider.");
  }
  return context;
};
