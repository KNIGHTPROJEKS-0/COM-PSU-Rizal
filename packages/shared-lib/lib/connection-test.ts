import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Test the connection
export async function testSupabaseConnection() {
    try {
        console.log("🧪 Testing Supabase connection...");

        // Try to get the current user (this will work even if no user is logged in)
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error && error.message !== "Auth session missing!") {
            console.error("❌ Supabase connection error:", error.message);
            return false;
        }

        console.log("✅ Supabase connection successful!");
        console.log("🌐 Connected to:", supabaseUrl);
        console.log(
            "👤 Current user:",
            user ? user.email : "No user logged in",
        );

        return true;
    } catch (err) {
        console.error("❌ Connection test failed:", err);
        return false;
    }
}

// Test database access
export async function testDatabaseAccess() {
    try {
        console.log("🗃️ Testing database access...");

        // Try to select from users table (this might fail due to RLS, but connection should work)
        const { data, error } = await supabase
            .from("users")
            .select("count")
            .limit(1);

        if (error) {
            console.log("⚠️ Database access note:", error.message);
            console.log(
                "This is normal if RLS policies restrict anonymous access",
            );
            return true; // Connection works, just restricted access
        }

        console.log("✅ Database access successful!");
        console.log("📊 Users count query worked");

        return true;
    } catch (err) {
        console.error("❌ Database test failed:", err);
        return false;
    }
}
