/**
 * @file src/components/common/ProtectedRoute.tsx
 * @description Route guard that checks authentication via useAuth.
 */

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/auth/hooks/useAuth";

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
