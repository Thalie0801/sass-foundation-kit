import { useEffect, useState } from "react";
import { supabase, getActiveProfile } from "@/lib/supabaseClient";

type User = { id: string } | null;

type AuthState = {
  user: User;
  loading: boolean;
};

export function useAuth(): AuthState {
  const [user, setUser] = useState<User>(() => {
    const profile = getActiveProfile();
    return profile ? { id: profile.id } : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUser(data.user ?? null);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session.user ?? null);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
