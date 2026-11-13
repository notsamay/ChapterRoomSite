import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// The app's Supabase project, used by the officer portal in the browser. Only the publishable key
// lives here: every read is limited by row-level security and every change goes through the app's
// own permission-checked database functions, the same ones the app calls.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabaseConfigured = Boolean(url && key);

let client: SupabaseClient | null = null;

/** The one browser client; null when the env vars aren't set (the portal then runs on sample data). */
export function supabase(): SupabaseClient | null {
  if (!supabaseConfigured) return null;
  if (!client) client = createClient(url!, key!, { auth: { persistSession: true, autoRefreshToken: true, storageKey: "cr-portal-auth" } });
  return client;
}
