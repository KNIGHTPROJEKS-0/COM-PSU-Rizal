-- COM-PSU-Rizal User Setup Script
-- Run this in your Supabase SQL Editor to ensure test users exist with correct roles

-- First, check if users already exist
SELECT 'Checking existing users:' as message;
SELECT email, role, created_at 
FROM users 
WHERE email IN ('admin@com-psu-rizal.com', 'user1@com-psu-rizal.com', 'user2@com-psu-rizal.com')
ORDER BY email;

-- Insert or update users to ensure correct roles
-- For admin user
INSERT INTO users (id, email, first_name, last_name, role, created_at)
VALUES (gen_random_uuid(), 'admin@com-psu-rizal.com', 'Admin', 'User', 'admin', NOW())
ON CONFLICT (email) 
DO UPDATE SET role = 'admin', updated_at = NOW();

-- For student users
INSERT INTO users (id, email, first_name, last_name, role, created_at)
VALUES (gen_random_uuid(), 'user1@com-psu-rizal.com', 'User', 'One', 'student', NOW()),
       (gen_random_uuid(), 'user2@com-psu-rizal.com', 'User', 'Two', 'student', NOW())
ON CONFLICT (email) 
DO UPDATE SET role = EXCLUDED.role, updated_at = NOW();

-- Verify final state
SELECT 'Final user roles:' as message;
SELECT email, role, created_at 
FROM users 
WHERE email IN ('admin@com-psu-rizal.com', 'user1@com-psu-rizal.com', 'user2@com-psu-rizal.com')
ORDER BY email;

-- Check that the auth.users table also has these users
-- (Note: This is just for verification - do NOT try to insert into auth.users directly)
SELECT 'Auth users verification (if any exist):' as message;
SELECT id, email, created_at 
FROM auth.users 
WHERE email IN ('admin@com-psu-rizal.com', 'user1@com-psu-rizal.com', 'user2@com-psu-rizal.com')
ORDER BY email;