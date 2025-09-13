-- Check if test users exist
SELECT 
  email,
  role,
  first_name,
  last_name
FROM users
WHERE email IN ('admin@com-psu-rizal.com', 'user1@com-psu-rizal.com', 'user2@com-psu-rizal.com');

-- If no rows are returned, it means the users don't exist yet
-- You'll need to create them using the application's sign up flow or directly in the database

-- To manually create the users in the database (only if they don't exist in auth system):
-- Note: You should normally create users through the app UI, but for testing purposes:

-- First, you would need to create the auth users through the Supabase dashboard
-- Then insert the user records in the public.users table:

-- Example of how to insert user records (replace 'user_id_from_auth' with actual auth user IDs):
/*
INSERT INTO users (id, email, first_name, last_name, role, created_at)
VALUES 
  ('user_id_from_auth_1', 'admin@com-psu-rizal.com', 'Admin', 'User', 'admin', NOW()),
  ('user_id_from_auth_2', 'user1@com-psu-rizal.com', 'User', 'One', 'student', NOW()),
  ('user_id_from_auth_3', 'user2@com-psu-rizal.com', 'User', 'Two', 'student', NOW());
*/