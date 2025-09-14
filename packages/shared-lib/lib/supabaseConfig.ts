// Shared Supabase configuration for both webapp and electron app
export const supabaseConfig = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.SUPABASE_ANON_KEY || "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
};

// Validate configuration
export function validateSupabaseConfig() {
    if (!supabaseConfig.url) {
        throw new Error(
            "Supabase URL is required. Set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL",
        );
    }
    if (!supabaseConfig.anonKey) {
        throw new Error(
            "Supabase Anon Key is required. Set NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY",
        );
    }
    return true;
}

// Environment detection
export function isElectron() {
    return typeof window !== "undefined" && window.process &&
        window.process.type === "renderer";
}

export function isWebApp() {
    return typeof window !== "undefined" && !isElectron();
}

export function isServer() {
    return typeof window === "undefined";
}
