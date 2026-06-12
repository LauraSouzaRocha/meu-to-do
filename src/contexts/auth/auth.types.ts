/**
 * @file auth.types.ts
 * @description Types and interfaces used by the authentication context and services.
 * @module AuthTypes
 */

/**
 * Minimal representation of an authenticated user.
 */
export interface AuthUser {
  /** Unique identifier for the user (Supabase UUID). */
  id: string;
  /** User's email address. */
  email: string;
}

/**
 * Payload returned by the sign‑in / sign‑up service methods.
 */
export interface AuthResponse {
  /** Authenticated user data (if sign‑in succeeded). */
  user: AuthUser | null;
  /** Possible error message returned by Supabase. */
  error: string | null;
}

/**
 * Shape of the object returned by the {@link useAuth} hook.
 */
export interface UseAuthReturn {
  /** Current authenticated user, or `null` when not signed in. */
  user: AuthUser | null;
  /** Loading flag while the authentication state is being resolved. */
  loading: boolean;
  /** Convenience boolean indicating if a user is authenticated. */
  isAuthenticated: boolean;
  /** Function to sign the user out. */
  signOut: () => Promise<void>;
}