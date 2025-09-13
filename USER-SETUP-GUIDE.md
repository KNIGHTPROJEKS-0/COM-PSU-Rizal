# COM-PSU-Rizal User Setup and Verification Guide

## Overview

This guide explains how to set up test users with correct roles for the COM-PSU-Rizal application and verify that role-based routing works correctly.

## Prerequisites

1. Supabase project set up with the correct schema
2. Environment variables configured in `.env.local`
3. Application built and running (`npm run dev`)

## Step 1: Verify Database Schema

First, ensure your Supabase database has the correct schema by running the migration:

```sql
-- Check if the users table exists with correct structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name IN ('id', 'email', 'first_name', 'last_name', 'role')
ORDER BY ordinal_position;
```

## Step 2: Create Test Users with Correct Roles

Run the following SQL in your Supabase SQL Editor:

```sql
-- Insert or update test users with correct roles
INSERT INTO users (id, email, first_name, last_name, role, created_at)
VALUES
  (gen_random_uuid(), 'admin@com-psu-rizal.com', 'Admin', 'User', 'admin', NOW()),
  (gen_random_uuid(), 'user1@com-psu-rizal.com', 'User', 'One', 'student', NOW()),
  (gen_random_uuid(), 'user2@com-psu-rizal.com', 'User', 'Two', 'student', NOW())
ON CONFLICT (email)
DO UPDATE SET
  role = EXCLUDED.role,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  updated_at = NOW();
```

## Step 3: Verify User Roles

Check that users have been created with correct roles:

```sql
SELECT email, role, created_at, updated_at
FROM users
WHERE email IN ('admin@com-psu-rizal.com', 'user1@com-psu-rizal.com', 'user2@com-psu-rizal.com')
ORDER BY email;
```

Expected output:

```
email                    | role    | created_at          | updated_at
-------------------------|---------|---------------------|---------------------
admin@com-psu-rizal.com  | admin   | 2025-09-13 10:00:00 | 2025-09-13 10:00:00
user1@com-psu-rizal.com  | student | 2025-09-13 10:00:00 | 2025-09-13 10:00:00
user2@com-psu-rizal.com  | student | 2025-09-13 10:00:00 | 2025-09-13 10:00:00
```

## Step 4: Ensure Auth Users Exist

Navigate to your Supabase Dashboard > Authentication > Users and ensure these users exist:

- admin@com-psu-rizal.com
- user1@com-psu-rizal.com
- user2@com-psu-rizal.com

If they don't exist, create them through the dashboard or sign up through the application.

## Step 5: Test Authentication Flow

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. Test each user:

   ### Admin User Test
   - Sign in with: admin@com-psu-rizal.com
   - Password: (whatever you set)
   - Expected behavior: Should be redirected to `/dashboard/admin`

   ### Student User Tests
   - Sign in with: user1@com-psu-rizal.com OR user2@com-psu-rizal.com
   - Password: (whatever you set)
   - Expected behavior: Should be redirected to `/dashboard/student`

## Step 6: Troubleshooting

### If Users Are Not Redirected Correctly

1. Check browser console for errors
2. Check server logs for authentication errors
3. Verify the user's role in the database matches expected values

### If Users Don't Exist in Auth System

1. Go to Supabase Dashboard > Authentication > Users
2. Click "Add user" to manually create users
3. Or use the application's sign-up flow to create users

### SQL Scripts Location

All SQL scripts are located in the project root:

- `supabase-user-setup.sql` - Main setup script
- `check-user-roles.sql` - Check current roles
- `fix-user-roles.sql` - Fix incorrect roles

## Common Issues and Solutions

### Issue: "No rows returned" when checking users

**Solution**: Users haven't been created yet. Run the setup SQL script.

### Issue: Admin user redirected to student dashboard

**Solution**: Check that the user's role is set to 'admin' in the database.

### Issue: Authentication failed

**Solution**: Ensure users exist in both the auth system and the users table.

## Additional Resources

- View diagnostic information: `./user-role-diagnostic.sh`
- Manual setup script: `./setup-test-users.sh`
- SQL verification scripts: All `.sql` files in the project root
