import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AdminStatus = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
};

/**
 * Determines whether the current authenticated user has admin privileges.
 *
 * IMPORTANT: The final enforcement is done via RLS on the database.
 * This hook is used to avoid showing admin UI to non-admin users.
 */
export function useAdminStatus(): AdminStatus {
  const [session, setSession] = useState<Session | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listener first (prevents missing auth events)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Only synchronous state updates here
      setSession(session);
    });

    // Then initial session fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthInitialized(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const checkAdmin = async () => {
      if (!authInitialized) return;

      if (!session?.user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase.rpc("is_admin");

      if (cancelled) return;

      setIsAdmin(!error && !!data);
      setLoading(false);
    };

    checkAdmin();

    return () => {
      cancelled = true;
    };
  }, [authInitialized, session?.user?.id]);

  return {
    user: session?.user ?? null,
    isAdmin,
    loading,
  };
}
