import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn, signUp, signOut, getCurrentUser } from "../services/auth.service";
import type { User } from "../todo.types";

export const useAuth = () => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["authUser"],
    queryFn: getCurrentUser,
    staleTime: Infinity,
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => signIn(email, password),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  const registerMutation = useMutation({
    mutationFn: ({ email, password, fullName }: { email: string; password: string; fullName: string }) =>
      signUp(email, password, fullName),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  const logoutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.clear();
    },
  });

  return {
    user,
    isLoading,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
  };
};
