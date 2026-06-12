/**
 * @file src/lib/supabase.ts
 * @description Single Supabase client used throughout the app.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL or ANON KEY not set. Define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env."
  );
}

/** Exported Supabase client */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
