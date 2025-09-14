#!/bin/bash

# Diagnostic script for COM-PSU-Rizal user roles
# This script helps diagnose the current state of users in the database

echo "=== COM-PSU-Rizal User Role Diagnostic ==="

# Check if we can connect to Supabase (replace with actual values from your .env.local)
echo "1. Checking environment variables..."
if [ -f ".env.local" ]; then
  echo "   .env.local file found"
  # Source the environment variables
  source .env.local
  echo "   NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL:-(not set)}"
  echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY: ${NEXT_PUBLIC_SUPABASE_ANON_KEY:+(set)}${NEXT_PUBLIC_SUPABASE_ANON_KEY:-(not set)}"
else
  echo "   .env.local file NOT found"
fi

echo ""
echo "2. Checking for test users in database..."
echo "   Run this SQL in your Supabase SQL editor:"
echo "   ----------------------------------------------------"
echo "   SELECT email, role, created_at"
echo "   FROM users"
echo "   WHERE email IN ('admin@com-psu-rizal.com', 'user1@com-psu-rizal.com', 'user2@com-psu-rizal.com')"
echo "   ORDER BY email;"
echo "   ----------------------------------------------------"

echo ""
echo "3. If no users exist, create them with these SQL commands:"
echo "   ----------------------------------------------------"
echo "   -- Insert admin user"
echo "   INSERT INTO users (id, email, first_name, last_name, role, created_at)"
echo "   VALUES (gen_random_uuid(), 'admin@com-psu-rizal.com', 'Admin', 'User', 'admin', NOW());"
echo ""
echo "   -- Insert student users"
echo "   INSERT INTO users (id, email, first_name, last_name, role, created_at)"
echo "   VALUES (gen_random_uuid(), 'user1@com-psu-rizal.com', 'User', 'One', 'student', NOW()),"
echo "          (gen_random_uuid(), 'user2@com-psu-rizal.com', 'User', 'Two', 'student', NOW());"
echo "   ----------------------------------------------------"

echo ""
echo "4. To verify and fix existing user roles:"
echo "   ----------------------------------------------------"
echo "   -- Check current roles"
echo "   SELECT email, role FROM users"
echo "   WHERE email IN ('admin@com-psu-rizal.com', 'user1@com-psu-rizal.com', 'user2@com-psu-rizal.com');"
echo ""
echo "   -- Fix admin role"
echo "   UPDATE users SET role = 'admin' WHERE email = 'admin@com-psu-rizal.com';"
echo ""
echo "   -- Fix student roles"
echo "   UPDATE users SET role = 'student' WHERE email IN ('user1@com-psu-rizal.com', 'user2@com-psu-rizal.com');"
echo "   ----------------------------------------------------"

echo ""
echo "5. After ensuring users exist with correct roles:"
echo "   - Restart your development server: npm run dev"
echo "   - Test login with admin@com-psu-rizal.com (should route to /dashboard/admin)"
echo "   - Test login with user1@com-psu-rizal.com or user2@com-psu-rizal.com (should route to /dashboard/student)"