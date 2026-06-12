import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../lib/supabase";

export const ProtectedRoute = () => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setAuthenticated(!!user);
    };
    checkAuth();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session?.user);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (authenticated === null) {
    // loading state
    return null;
  }

  return authenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
