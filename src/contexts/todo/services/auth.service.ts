import { supabase } from "@/lib/supabase";
import type { User } from "../todo.types";

// Map Supabase auth user to our User interface
const mapUser = (supabaseUser: any): User => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    full_name: supabaseUser.user_metadata?.full_name ?? null,
  };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return mapUser(data.user);
};

export const signUp = async (
  email: string,
  password: string,
  full_name: string
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name } },
  });
  if (error) throw error;
  return mapUser(data.user);
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data } = await supabase.auth.getUser();
  return data.user ? mapUser(data.user) : null;
};
