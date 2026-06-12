/**
 * @file useAuth.ts
 * @description React hook exposing authentication state, loading flag, and sign‑out helper.
 * @module useAuth
 */

import { useEffect, useState, useCallback } from "react";
import {
  AuthUser,
  UseAuthReturn,
} from "../auth.types";
import * as authService from "../services/auth.service";
import { supabase } from "@/lib/supabase";

/**
 * Custom hook that tracks the current authentication state.
 *
 * @returns An object containing the user, loading status, authentication flag and signOut method.
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Retrieve the initial user (if any) when the hook mounts.
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user: supabaseUser },
        error,
      } = await supabase.auth.getUser();

      if (!error && supabaseUser) {
        setUser({ id: supabaseUser.id, email: supabaseUser.email });
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    fetchUser();

    // Listen for future auth state changes (sign‑in / sign‑out / token refresh).
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email });
      } else {
        setUser(null);
      }
    });

    // Cleanup the listener when the component unmounts.
    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  /**
   * Sign the current user out and clear local state.
   */
  const signOut = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    isAuthenticated: Boolean(user),
    signOut,
  };
}