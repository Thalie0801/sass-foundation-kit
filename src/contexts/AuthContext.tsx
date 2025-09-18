import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AuthError, Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type UserRole = "admin" | "client" | "super_admin";

type SubscriptionStatus = "active" | "trial" | "canceled" | "inactive" | null;

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  company: string;
  plan: string;
  subscription_status: SubscriptionStatus;
  trial_ends_at: string | null;
  role: UserRole;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  isClient: () => boolean;
  hasActiveSubscription: () => boolean;
  isInTrial: () => boolean;
  isRestricted: () => boolean;
  getTrialDaysLeft: () => number;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const computeTrialDaysLeft = (trialEndsAt: string | null) => {
  if (!trialEndsAt) return 0;

  const trialEnd = new Date(trialEndsAt);
  const today = new Date();
  const diffTime = trialEnd.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        setProfile(null);
        return;
      }

      if (profileData) {
        setProfile(profileData as UserProfile);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const handleSessionChange = async (nextSession: Session | null) => {
      if (!isMounted) return;

      setLoading(true);
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user) {
        await fetchProfile(nextSession.user.id);
      } else {
        setProfile(null);
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((_, nextSession) => {
      void handleSessionChange(nextSession);
    });

    supabase.auth
      .getSession()
      .then(({ data: { session: initialSession } }) => handleSessionChange(initialSession))
      .catch((error) => {
        console.error("Error getting session:", error);
        setLoading(false);
      });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (!error) {
      setUser(null);
      setSession(null);
      setProfile(null);
    }

    return { error };
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user?.id) return;
    await fetchProfile(user.id);
  }, [fetchProfile, user?.id]);

  const value = useMemo<AuthContextValue>(() => {
    const isAdmin = () => profile?.role === "admin" || profile?.role === "super_admin";
    const isSuperAdmin = () => profile?.role === "super_admin";
    const isClient = () => profile?.role === "client";
    const hasActiveSubscription = () => profile?.subscription_status === "active";
    const isInTrial = () => profile?.subscription_status === "trial";
    const isRestricted = () => !hasActiveSubscription() && !isInTrial();
    const getTrialDaysLeft = () => computeTrialDaysLeft(profile?.trial_ends_at ?? null);

    return {
      user,
      session,
      profile,
      loading,
      isAdmin,
      isSuperAdmin,
      isClient,
      hasActiveSubscription,
      isInTrial,
      isRestricted,
      getTrialDaysLeft,
      refreshProfile,
      signOut,
    };
  }, [loading, profile, refreshProfile, session, signOut, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
