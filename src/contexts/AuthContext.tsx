import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { differenceInCalendarDays, isAfter } from "date-fns";

export type UserRole = Database["public"]["Enums"]["user_role"];

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

type FeatureRow = Pick<
  Database["public"]["Tables"]["features"]["Row"],
  "id" | "name" | "display_name" | "description" | "requires_subscription" | "enabled_by_default"
>;

type UserFeatureRow = Pick<
  Database["public"]["Tables"]["user_features"]["Row"],
  "id" | "user_id" | "feature_id" | "enabled"
>;

export interface FeatureWithState {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  requiresSubscription: boolean | null;
  enabledByDefault: boolean | null;
  enabled: boolean;
}

export interface SubscriptionState {
  status: string;
  trialEndsAt: string | null;
  plan: string | null;
  isTrialing: boolean;
  isTrialExpired: boolean;
  hasAccess: boolean;
  requiresPayment: boolean;
  daysLeft: number | null;
}

interface AuthContextValue {
  user: User | null;
  profile: ProfileRow | null;
  loading: boolean;
  features: FeatureWithState[];
  subscription: SubscriptionState;
  hasFeature: (featureName: string) => boolean;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS as string | undefined)
  ?.split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean) ?? [];

const DEFAULT_TRIAL_DURATION_DAYS = 7;

const getDefaultSubscriptionState = (): SubscriptionState => ({
  status: "unauthenticated",
  trialEndsAt: null,
  plan: null,
  isTrialing: false,
  isTrialExpired: false,
  hasAccess: false,
  requiresPayment: true,
  daysLeft: null,
});

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [features, setFeatures] = useState<FeatureWithState[]>([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  const subscription = useMemo<SubscriptionState>(() => {
    if (!profile) {
      return getDefaultSubscriptionState();
    }

    const now = new Date();
    const status = profile.subscription_status ?? "trial";
    const trialEndsAt = profile.trial_ends_at ? new Date(profile.trial_ends_at) : null;
    const hasTrialDate = Boolean(trialEndsAt);
    const trialStillActive = hasTrialDate ? isAfter(trialEndsAt!, now) : false;
    const isTrialing = status === "trial" && trialStillActive;
    const isTrialExpired = status === "trial" && hasTrialDate && !trialStillActive;
    const isActive = ["active", "paid", "subscribed"].includes(status);
    const hasAccess = isActive || isTrialing;
    const daysLeft = trialEndsAt ? Math.max(differenceInCalendarDays(trialEndsAt, now), 0) : null;

    return {
      status,
      trialEndsAt: profile.trial_ends_at,
      plan: profile.plan ?? null,
      isTrialing,
      isTrialExpired,
      hasAccess,
      requiresPayment: !hasAccess,
      daysLeft,
    };
  }, [profile]);

  const fetchProfileAndFeatures = useCallback(async (currentUser: User) => {
    setDataLoading(true);
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", currentUser.id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      let resolvedProfile = profileData as ProfileRow | null;

      if (!resolvedProfile) {
        const trialEndsAt = new Date();
        trialEndsAt.setDate(trialEndsAt.getDate() + DEFAULT_TRIAL_DURATION_DAYS);

        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert({
            user_id: currentUser.id,
            email: currentUser.email,
            full_name: currentUser.user_metadata?.full_name ?? null,
            company: currentUser.user_metadata?.company ?? null,
            subscription_status: "trial",
            plan: "starter",
            trial_ends_at: trialEndsAt.toISOString(),
          })
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        resolvedProfile = newProfile as ProfileRow;
      }

      const lowerCaseEmail = currentUser.email?.toLowerCase();
      if (lowerCaseEmail && ADMIN_EMAILS.includes(lowerCaseEmail) && resolvedProfile?.role !== "admin") {
        const { data: updatedProfile, error: updateError } = await supabase
          .from("profiles")
          .update({ role: "admin" })
          .eq("user_id", currentUser.id)
          .select()
          .single();

        if (!updateError && updatedProfile) {
          resolvedProfile = updatedProfile as ProfileRow;
        }
      }

      setProfile(resolvedProfile as ProfileRow);

      const { data: featuresData, error: featuresError } = await supabase
        .from("features")
        .select("id, name, display_name, description, requires_subscription, enabled_by_default")
        .order("display_name", { ascending: true });

      if (featuresError) {
        throw featuresError;
      }

      const { data: userFeaturesData, error: userFeaturesError } = await supabase
        .from("user_features")
        .select("id, feature_id, enabled")
        .eq("user_id", currentUser.id);

      if (userFeaturesError) {
        throw userFeaturesError;
      }

      const combinedFeatures: FeatureWithState[] = (featuresData ?? []).map((feature: FeatureRow) => {
        const userFeature = (userFeaturesData as UserFeatureRow[] | null)?.find(
          (uf) => uf.feature_id === feature.id,
        );

        const enabled = userFeature ? userFeature.enabled : feature.enabled_by_default ?? false;

        return {
          id: feature.id,
          name: feature.name,
          displayName: feature.display_name,
          description: feature.description,
          requiresSubscription: feature.requires_subscription,
          enabledByDefault: feature.enabled_by_default,
          enabled,
        };
      });

      setFeatures(combinedFeatures);
    } catch (error) {
      console.error("Unable to fetch profile data", error);
      setProfile(null);
      setFeatures([]);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setAuthLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setFeatures([]);
      return;
    }

    fetchProfileAndFeatures(user);
  }, [user, fetchProfileAndFeatures]);

  const hasFeature = useCallback(
    (featureName: string) => features.some((feature) => feature.name === featureName && feature.enabled),
    [features],
  );

  const refresh = useCallback(async () => {
    if (user) {
      await fetchProfileAndFeatures(user);
    }
  }, [fetchProfileAndFeatures, user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading: authLoading || dataLoading,
      features,
      subscription,
      hasFeature,
      refresh,
    }),
    [authLoading, dataLoading, features, hasFeature, profile, refresh, subscription, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
