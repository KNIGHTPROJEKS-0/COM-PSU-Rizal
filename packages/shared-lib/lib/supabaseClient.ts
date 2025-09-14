import { createBrowserClient } from "@supabase/ssr";
import { supabaseConfig, validateSupabaseConfig } from "./supabaseConfig";

// Validate configuration before creating client
validateSupabaseConfig();

export const supabase = createBrowserClient(
  supabaseConfig.url,
  supabaseConfig.anonKey,
);
