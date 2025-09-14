// Electron-specific Supabase client for main process
import { createClient } from "@supabase/supabase-js";
import { supabaseConfig, validateSupabaseConfig } from "./supabaseConfig";

// Validate configuration
validateSupabaseConfig();

export const supabaseElectron = createClient(
    supabaseConfig.url,
    supabaseConfig.serviceRoleKey || supabaseConfig.anonKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    },
);

// Export for use in electron main process
export default supabaseElectron;
