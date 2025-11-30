import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client with the service role key
 * This bypasses Row Level Security policies and should ONLY be used in secure server contexts
 * (e.g., Cron jobs, admin APIs)
 */
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase URL or Service Role Key");
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
