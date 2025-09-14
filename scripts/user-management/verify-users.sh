#!/bin/bash

# Verification script for COM-PSU-Rizal user roles
# Uses your actual Supabase configuration

echo "=== COM-PSU-Rizal User Role Verification ==="

# Extract Supabase URL from .env.local
SUPABASE_URL=$(grep "NEXT_PUBLIC_SUPABASE_URL" .env.local | cut -d '=' -f2)
echo "Supabase URL: $SUPABASE_URL"

# Show instructions for checking user roles
echo ""
echo "To verify user roles, run this SQL in your Supabase SQL Editor:"
echo "==============================================================="
echo "SELECT email, role, created_at, updated_at"
echo "FROM users"
echo "WHERE email IN ('admin@com-psu-rizal.com', 'user1@com-psu-rizal.com', 'user2@com-psu-rizal.com')"
echo "ORDER BY email;"
echo "==============================================================="

# Show instructions for setting up users
echo ""
echo "To set up users with correct roles, run this SQL:"
echo "=================================================="
echo "INSERT INTO users (id, email, first_name, last_name, role, created_at)"
echo "VALUES "
echo "  (gen_random_uuid(), 'admin@com-psu-rizal.com', 'Admin', 'User', 'admin', NOW()),"
echo "  (gen_random_uuid(), 'user1@com-psu-rizal.com', 'User', 'One', 'student', NOW()),"
echo "  (gen_random_uuid(), 'user2@com-psu-rizal.com', 'User', 'Two', 'student', NOW())"
echo "ON CONFLICT (email) "
echo "DO UPDATE SET "
echo "  role = EXCLUDED.role,"
echo "  first_name = EXCLUDED.first_name,"
echo "  last_name = EXCLUDED.last_name,"
echo "  updated_at = NOW();"
echo "==================================================="

# Show instructions for testing
echo ""
echo "After setting up users:"
echo "1. Ensure these users also exist in Supabase Authentication > Users"
echo "2. Start your development server: npm run dev"
echo "3. Visit http://localhost:3000/auth"
echo "4. Test signing in with:"
echo "   - Admin: admin@com-psu-rizal.com"
echo "   - Students: user1@com-psu-rizal.com or user2@com-psu-rizal.com"
echo ""
echo "Expected behavior:"
echo " - Admin should be redirected to /dashboard/admin"
echo " - Students should be redirected to /dashboard/student"