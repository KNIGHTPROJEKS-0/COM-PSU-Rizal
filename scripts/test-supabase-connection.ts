#!/usr/bin/env node

/**
 * Supabase Connection Test Script
 * Tests the connection to Supabase (cloud) and verifies database access
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

async function testSupabaseConnection() {
    console.log("🧪 Testing Supabase Connection...\n");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error("❌ Missing Supabase configuration in .env.local");
        console.log(
            "Required: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
        );
        process.exit(1);
    }

    console.log(`🌐 Connecting to: ${supabaseUrl}`);

    // Test with anon key
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        console.log("🔍 Testing anonymous connection...");
        const { data, error } = await supabase.from("users").select("count")
            .limit(1);

        if (error) {
            console.error("❌ Anonymous connection failed:", error.message);
        } else {
            console.log("✅ Anonymous connection successful");
        }
    } catch (err) {
        console.error("❌ Connection error:", err.message);
    }

    // Test with service key if available
    if (serviceKey) {
        console.log("\n🔍 Testing service role connection...");
        const supabaseAdmin = createClient(supabaseUrl, serviceKey);

        try {
            const { data, error } = await supabaseAdmin.from("users").select(
                "*",
            ).limit(5);

            if (error) {
                console.error(
                    "❌ Service role connection failed:",
                    error.message,
                );
            } else {
                console.log("✅ Service role connection successful");
                console.log(`📊 Found ${data?.length || 0} user records`);
            }
        } catch (err) {
            console.error("❌ Service connection error:", err.message);
        }
    }

    // Test database tables
    console.log("\n📋 Testing database tables...");

    const tables = [
        "users",
        "classes",
        "enrollments",
        "attendance",
        "assignments",
        "submissions",
        "grades",
        "student_verification",
    ];

    for (const table of tables) {
        try {
            const { data, error } = await supabase.from(table).select("*")
                .limit(1);

            if (error) {
                console.log(`❌ Table '${table}': ${error.message}`);
            } else {
                console.log(`✅ Table '${table}': OK`);
            }
        } catch (err) {
            console.log(`❌ Table '${table}': ${err.message}`);
        }
    }

    console.log("\n🎉 Connection test completed!");
    console.log("\n💡 Next steps:");
    console.log("1. If all tests passed, your Supabase setup is working!");
    console.log("2. Run: npm run dev");
    console.log("3. Test the application with user authentication");
    console.log("4. Create test users through the signup process");
}

if (require.main === module) {
    testSupabaseConnection().catch(console.error);
}

module.exports = { testSupabaseConnection };
