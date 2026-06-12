import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/todo/hooks/useAuth";

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};