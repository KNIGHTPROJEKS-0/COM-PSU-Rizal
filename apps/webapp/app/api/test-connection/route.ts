import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@com-psu-rizal/shared/supabaseClient";

export async function GET(request: NextRequest) {
    try {
        console.log("🧪 Testing Supabase connection via API...");

        const supabase = createClient();

        // Test 1: Basic connection
        const { data: { user }, error: authError } = await supabase.auth
            .getUser();

        // Test 2: Database access (might be restricted by RLS)
        const { data: users, error: dbError } = await supabase
            .from("users")
            .select("*")
            .limit(1);

        // Test 3: Check if we can access the classes table
        const { data: classes, error: classesError } = await supabase
            .from("classes")
            .select("*")
            .limit(1);

        const results = {
            timestamp: new Date().toISOString(),
            connection: {
                status: "success",
                message: "Supabase connection established",
            },
            auth: {
                status: authError ? "error" : "success",
                user: user ? { email: user.email, id: user.id } : null,
                error: authError?.message,
            },
            database: {
                users: {
                    status: dbError ? "restricted" : "accessible",
                    error: dbError?.message,
                    hasData: users && users.length > 0,
                },
                classes: {
                    status: classesError ? "restricted" : "accessible",
                    error: classesError?.message,
                    hasData: classes && classes.length > 0,
                },
            },
        };

        console.log("✅ Connection test completed");
        return NextResponse.json(results);
    } catch (error) {
        console.error("❌ Connection test failed:", error);
        return NextResponse.json({
            timestamp: new Date().toISOString(),
            status: "error",
            message: "Failed to connect to Supabase",
            error: error instanceof Error ? error.message : "Unknown error",
        }, { status: 500 });
    }
}
