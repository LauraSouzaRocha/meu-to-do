/**
 * @file auth.service.ts
 * @description Service layer that abstracts Supabase authentication calls.
 * @module AuthService
 */

import { supabase } from "@/lib/supabase";
import type { AuthUser, AuthResponse } from "../auth.types";

/**
 * Maps a Supabase `User` object to the local {@link AuthUser} shape.
 *
 * @param supabaseUser - The user object returned by Supabase.
 * @returns Minimal {@link AuthUser} representation.
 */
function mapUser(supabaseUser: any): AuthUser {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
  };
}

/**
 * Sign in a user with email and password.
 *
 * @param email - The user's e‑mail address.
 * @param password - The user's password.
 * @returns An {@link AuthResponse} containing the signed‑in user or an error.
 */
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { user: null, error: error.message };
  }
  if (data?.user) {
    return { user: mapUser(data.user), error: null };
  }
  return { user: null, error: "Unexpected sign‑in response" };
}

/**
 * Sign up (register) a new user with email and password.
 *
 * @param email - The user's e‑mail address.
 * @param password - The user's password.
 * @returns An {@link AuthResponse} containing the created user or an error.
 */
export async function signUp(email: string, password: string): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    return { user: null, error: error.message };
  }
  if (data?.user) {
    return { user: mapUser(data.user), error: null };
  }
  return { user: null, error: "Unexpected sign‑up response" };
}

/**
 * Sign the current user out.
 *
 * @returns A promise that resolves when the sign‑out operation completes.
 */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}