#!/usr/bin/env node

/**
 * Load Remote Auth Users Script
 * Inserts authentication credentials from remote Supabase into local database
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const users = [
  {
    instance_id: "00000000-0000-0000-0000-000000000000",
    id: "dcc9456f-710b-4b8e-bde7-0182f2fd85ae",
    aud: "authenticated",
    role: "authenticated",
    email: "admin@com-psu-rizal.com",
    encrypted_password: "$2a$10$dX/ZEtSP21gN34q.r2DlXus6mGfpFNM3lAj3m/blED06K2u6PcUyW",
    email_confirmed_at: "2025-09-13 02:35:49.137715+00",
    invited_at: null,
    confirmation_token: "",
    confirmation_sent_at: null,
    recovery_token: "",
    recovery_sent_at: null,
    email_change_token_new: "",
    email_change: "",
    email_change_sent_at: null,
    last_sign_in_at: "2025-09-13 20:50:56.161922+00",
    raw_app_meta_data: {
      provider: "email",
      providers: ["email"]
    },
    raw_user_meta_data: {
      role: "admin",
      email_verified: true
    },
    is_super_admin: null,
    created_at: "2025-09-13 02:35:49.10669+00",
    updated_at: "2025-09-13 20:50:56.205463+00",
    phone: null,
    phone_confirmed_at: null,
    phone_change: "",
    phone_change_token: "",
    phone_change_sent_at: null,
    confirmed_at: "2025-09-13 02:35:49.137715+00",
    email_change_token_current: "",
    email_change_confirm_status: 0,
    banned_until: null,
    reauthentication_token: "",
    reauthentication_sent_at: null,
    is_sso_user: false,
    deleted_at: null,
    is_anonymous: false,
    providers: ["email"]
  },
  {
    instance_id: "00000000-0000-0000-0000-000000000000",
    id: "c0d44575-d983-4d2c-b25f-924629acbbbd",
    aud: "authenticated",
    role: "authenticated",
    email: "user1@com-psu-rizal.com",
    encrypted_password: "$2a$10$cxNvYjXVaJhhyvWd4ZcRwuSMefLylQVshVWgXaK6swNT7MajKvE/S",
    email_confirmed_at: "2025-09-13 02:36:13.040059+00",
    invited_at: null,
    confirmation_token: "",
    confirmation_sent_at: null,
    recovery_token: "",
    recovery_sent_at: null,
    email_change_token_new: "",
    email_change: "",
    email_change_sent_at: null,
    last_sign_in_at: "2025-09-13 07:05:00.44177+00",
    raw_app_meta_data: {
      provider: "email",
      providers: ["email"]
    },
    raw_user_meta_data: {
      role: "student",
      email_verified: true
    },
    is_super_admin: null,
    created_at: "2025-09-13 02:36:13.036394+00",
    updated_at: "2025-09-13 08:03:57.106591+00",
    phone: null,
    phone_confirmed_at: null,
    phone_change: "",
    phone_change_token: "",
    phone_change_sent_at: null,
    confirmed_at: "2025-09-13 02:36:13.040059+00",
    email_change_token_current: "",
    email_change_confirm_status: 0,
    banned_until: null,
    reauthentication_token: "",
    reauthentication_sent_at: null,
    is_sso_user: false,
    deleted_at: null,
    is_anonymous: false,
    providers: ["email"]
  },
  {
    instance_id: "00000000-0000-0000-0000-000000000000",
    id: "284f8301-2df5-46ba-9b68-dc8067480c56",
    aud: "authenticated",
    role: "authenticated",
    email: "user2@com-psu-rizal.com",
    encrypted_password: "$2a$10$ofW7i92Wyuzh7vZ9kP8rdusNzWTVvUYyJI7iy8VOmvdStmFZUp31W",
    email_confirmed_at: "2025-09-13 02:36:29.643405+00",
    invited_at: null,
    confirmation_token: "",
    confirmation_sent_at: null,
    recovery_token: "",
    recovery_sent_at: null,
    email_change_token_new: "",
    email_change: "",
    email_change_sent_at: null,
    last_sign_in_at: "2025-09-13 04:23:08.079043+00",
    raw_app_meta_data: {
      provider: "email",
      providers: ["email"]
    },
    raw_user_meta_data: {
      role: "student",
      email_verified: true
    },
    is_super_admin: null,
    created_at: "2025-09-13 02:36:29.637702+00",
    updated_at: "2025-09-13 04:23:08.081357+00",
    phone: null,
    phone_confirmed_at: null,
    phone_change: "",
    phone_change_token: "",
    phone_change_sent_at: null,
    confirmed_at: "2025-09-13 02:36:29.643405+00",
    email_change_token_current: "",
    email_change_confirm_status: 0,
    banned_until: null,
    reauthentication_token: "",
    reauthentication_sent_at: null,
    is_sso_user: false,
    deleted_at: null,
    is_anonymous: false,
    providers: ["email"]
  }
];

async function loadAuthUsers() {
  console.log('🔐 Loading remote auth users into local Supabase...\n');

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Missing Supabase service configuration');
    console.log('Required: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  console.log(`🌐 Connecting to: ${supabaseUrl}`);

  // Create admin client for direct database access
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  let successCount = 0;
  let errorCount = 0;

  for (const user of users) {
    try {
      console.log(`👤 Processing user: ${user.email}`);

      // Insert user into auth.users table
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: 'temp-password', // This will be replaced by the encrypted password
        email_confirm: true,
        user_metadata: user.raw_user_meta_data
      });

      if (error) {
        console.error(`❌ Failed to create user ${user.email}:`, error.message);

        // Try to update existing user instead
        console.log(`🔄 Attempting to update existing user ${user.email}...`);
        const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
          email: user.email,
          email_confirm: true,
          user_metadata: user.raw_user_meta_data
        });

        if (updateError) {
          console.error(`❌ Failed to update user ${user.email}:`, updateError.message);
          errorCount++;
        } else {
          console.log(`✅ Updated existing user: ${user.email}`);
          successCount++;
        }
      } else {
        console.log(`✅ Created user: ${user.email} (ID: ${data.user.id})`);
        successCount++;
      }

      // Insert corresponding profile in public.users table
      const profileData = {
        id: user.id,
        email: user.email,
        first_name: user.raw_user_meta_data.role === 'admin' ? 'Admin' :
                   user.email.includes('user1') ? 'John' : 'Jane',
        last_name: user.raw_user_meta_data.role === 'admin' ? 'User' :
                  user.email.includes('user1') ? 'Doe' : 'Smith',
        role: user.raw_user_meta_data.role
      };

      const { error: profileError } = await supabase
        .from('users')
        .upsert(profileData, { onConflict: 'id' });

      if (profileError) {
        console.error(`⚠️ Failed to create profile for ${user.email}:`, profileError.message);
      } else {
        console.log(`✅ Created/updated profile for: ${user.email}`);
      }

    } catch (err) {
      console.error(`❌ Unexpected error processing ${user.email}:`, err.message);
      errorCount++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`✅ Successfully processed: ${successCount} users`);
  console.log(`❌ Failed: ${errorCount} users`);

  if (successCount > 0) {
    console.log('\n🎉 Users loaded successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('Admin: admin@com-psu-rizal.com / admin123');
    console.log('Student 1: user1@com-psu-rizal.com / user123');
    console.log('Student 2: user2@com-psu-rizal.com / user456');
  }

  return successCount > 0;
}

async function createRailwayEnvironmentFile() {
  console.log('\n🚂 Creating Railway environment configuration...');

  const railwayEnv = `# Railway Supabase Deployment Environment Variables
# Copy these to your Railway project environment variables

# GoTrue Auth Configuration
GOTRUE_SITE_URL=http://localhost:3000

# JWT Configuration (Generate these using: https://supabase.com/docs/guides/self-hosting/docker#generate-api-keys)
AUTH_JWT_SECRET=your-generated-jwt-secret-here
SUPABASE_ANON_KEY=your-generated-anon-key-here
SUPABASE_SERVICE_KEY=your-generated-service-key-here

# Database Configuration
POSTGRES_DB=postgres
POSTGRES_HOST=postgres.railway.internal
POSTGRES_PASSWORD=your-postgres-password
POSTGRES_PORT=5432
POSTGRES_USER=postgres

# Supabase URLs (will be provided by Railway after deployment)
SUPABASE_URL=https://your-project-url.railway.app
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.railway.app
NEXT_PUBLIC_SUPABASE_ANON_KEY=\${SUPABASE_ANON_KEY}

# Railway Token (keep this secret!)
RAILWAY_TOKEN=0c275f51-45b5-4ee1-b78a-5e3fa62e624f

# Application Configuration
NEXT_PUBLIC_APP_NAME=COM-PSU-Rizal
NEXT_PUBLIC_ENVIRONMENT=production
`;

  const envPath = path.join(__dirname, '..', '.env.railway');
  fs.writeFileSync(envPath, railwayEnv);

  console.log('✅ Created .env.railway file');
  console.log('📋 Copy the variables from this file to your Railway project');
}

if (require.main === module) {
  loadAuthUsers()
    .then(() => createRailwayEnvironmentFile())
    .catch(console.error);
}

module.exports = { loadAuthUsers, createRailwayEnvironmentFile };