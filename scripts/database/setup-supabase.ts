#!/usr/bin/env node

/**
 * Supabase Auth Setup Script
 * This script helps set up the local Supabase environment and initializes the database
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = path.join(__dirname, "..");
const SUPABASE_DIR = path.join(PROJECT_ROOT, "supabase");

function runCommand(command, cwd = PROJECT_ROOT) {
    try {
        console.log(`Running: ${command}`);
        const result = execSync(command, {
            cwd,
            stdio: "inherit",
            env: { ...process.env, FORCE_COLOR: "1" },
        });
        return result;
    } catch (error) {
        console.error(`Command failed: ${command}`);
        console.error(error.message);
        process.exit(1);
    }
}

function checkPrerequisites() {
    console.log("🔍 Checking prerequisites...");

    // Check if Supabase CLI is installed
    try {
        execSync("supabase --version", { stdio: "pipe" });
        console.log("✅ Supabase CLI is installed");
    } catch (error) {
        console.error(
            "❌ Supabase CLI is not installed. Please install it first:",
        );
        console.error("npm install -g supabase");
        process.exit(1);
    }

    // Check if Docker is running
    try {
        execSync("docker info", { stdio: "pipe" });
        console.log("✅ Docker is running");
    } catch (error) {
        console.error("❌ Docker is not running. Please start Docker first.");
        process.exit(1);
    }
}

function setupLocalSupabase() {
    console.log("🚀 Setting up local Supabase...");

    // Check if supabase directory exists
    if (!fs.existsSync(SUPABASE_DIR)) {
        console.log("📁 Initializing Supabase project...");
        runCommand("supabase init", PROJECT_ROOT);
    } else {
        console.log("✅ Supabase project already exists");
    }

    // Start Supabase services
    console.log("🔄 Starting Supabase services...");
    runCommand("supabase start", PROJECT_ROOT);

    // Wait for services to be ready
    console.log("⏳ Waiting for services to be ready...");
    runCommand("sleep 10");

    // Check status
    console.log("📊 Checking Supabase status...");
    runCommand("supabase status", PROJECT_ROOT);

    // Run migrations
    console.log("🗃️ Running database migrations...");
    runCommand("supabase db reset", PROJECT_ROOT);
}

function setupAuthConfiguration() {
    console.log("🔐 Setting up authentication configuration...");

    // Create auth hooks directory if it doesn't exist
    const authHooksDir = path.join(SUPABASE_DIR, "auth", "hooks");
    if (!fs.existsSync(authHooksDir)) {
        fs.mkdirSync(authHooksDir, { recursive: true });
    }

    // Create auth hook for user profile creation
    const userProfileHook = path.join(authHooksDir, "create-user-profile.sql");
    const userProfileHookContent = `
-- Create user profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    COALESCE(new.raw_user_meta_data->>'role', 'student')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
`;

    fs.writeFileSync(userProfileHook, userProfileHookContent);
    console.log("✅ Created user profile creation hook");

    // Apply the hook
    runCommand("supabase db reset", PROJECT_ROOT);
}

function createTestUsers() {
    console.log("👥 Creating test users...");

    const testUsersScript = `
-- Create test users (passwords will be set through the auth system)
-- These are just for reference - actual user creation should be done through the app

-- Test Admin User
-- Email: admin@psu-rizal.edu
-- Password: admin123

-- Test Faculty User
-- Email: faculty@psu-rizal.edu
-- Password: faculty123

-- Test Student User
-- Email: student@psu-rizal.edu
-- Password: student123

-- Note: Use the signup functionality in the app to create these users
-- The auth hooks will automatically create the corresponding profiles in the users table
`;

    const testUsersFile = path.join(
        PROJECT_ROOT,
        "scripts",
        "test-users-setup.sql",
    );
    fs.writeFileSync(testUsersFile, testUsersScript);
    console.log("✅ Created test users setup script");
}

function setupStorageBuckets() {
    console.log("📦 Setting up storage buckets...");

    const storageSetupScript = `
-- Storage bucket for verification documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('verification', 'verification', false)
ON CONFLICT (id) DO NOTHING;

-- Storage bucket for assignment submissions
INSERT INTO storage.buckets (id, name, public)
VALUES ('submissions', 'submissions', false)
ON CONFLICT (id) DO NOTHING;

-- Storage bucket for general file uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', false)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for storage buckets
CREATE POLICY "Users can upload their own verification documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'verification' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own verification documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'verification' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own submissions" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'submissions' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own submissions" ON storage.objects
  FOR SELECT USING (bucket_id = 'submissions' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own files" ON storage.objects
  FOR SELECT USING (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
`;

    const storageFile = path.join(SUPABASE_DIR, "storage-setup.sql");
    fs.writeFileSync(storageFile, storageSetupScript);

    // Apply storage setup
    runCommand(`supabase db push --file ${storageFile}`, PROJECT_ROOT);
    console.log("✅ Set up storage buckets and policies");
}

function createEnvironmentFile() {
    console.log("📝 Creating environment configuration...");

    const envContent = `# Supabase Configuration
# Copy this to your .env.local file

# Supabase (Cloud - Production)
NEXT_PUBLIC_SUPABASE_URL=https://xoeyjtsgbvufupkgsphn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZXlqdHNnYnZ1ZnVwa2dzcGhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MTEwMzcsImV4cCI6MjA3MzI4NzAzN30.bjm3tP-yhjEvtMzT_3iZpnivZmc1iGY1gvtY7gtMW0Y

# Supabase (Local - Development)
# Uncomment these lines to use local Supabase instead of cloud
# NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZXlqdHNnYnZ1ZnVwa2dzcGhuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzcxMTAzNywiZXhwIjoyMDczMjg3MDM3fQ.BWR55tK2O7P3_kxshHIl-cq0cI5ZFLjwHJtM77s3msc

# Supabase Service Role Key (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZXlqdHNnYnZ1ZnVwa2dzcGhuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzcxMTAzNywiZXhwIjoyMDczMjg3MDM3fQ.BWR55tK2O7P3_kxshHIl-cq0cI5ZFLjwHJtM77s3msc

# OpenAI API Key (for AI features)
OPENAI_API_KEY=your_openai_api_key_here
`;

    const envFile = path.join(PROJECT_ROOT, ".env.example");
    fs.writeFileSync(envFile, envContent);
    console.log("✅ Created environment configuration file");
}

function printSetupInstructions() {
    console.log("\n🎉 Supabase setup completed successfully!");
    console.log("\n📋 Next steps:");
    console.log("1. Copy .env.example to .env.local and update the values");
    console.log("2. Start the development server: npm run dev");
    console.log("3. Start the desktop app: npm run desktop");
    console.log("4. Access Supabase Studio at: http://127.0.0.1:54323");
    console.log("5. Create test users through the app signup process");

    console.log("\n🔗 Useful links:");
    console.log("- Supabase Dashboard: https://supabase.com/dashboard");
    console.log("- Local Supabase Studio: http://127.0.0.1:54323");
    console.log("- API Documentation: http://127.0.0.1:54321/rest/v1/");

    console.log("\n🧪 Test users you can create:");
    console.log("- Admin: admin@psu-rizal.edu (password: admin123)");
    console.log("- Faculty: faculty@psu-rizal.edu (password: faculty123)");
    console.log("- Student: student@psu-rizal.edu (password: student123)");
}

// Main execution
function main() {
    console.log("🛠️ COM-PSU-Rizal Supabase Setup");
    console.log("================================\n");

    checkPrerequisites();
    setupLocalSupabase();
    setupAuthConfiguration();
    createTestUsers();
    setupStorageBuckets();
    createEnvironmentFile();
    printSetupInstructions();
}

if (require.main === module) {
    main();
}

module.exports = { main };
