-- Check the current users and their roles in the database
SELECT 
  id,
  email,
  first_name,
  last_name,
  role,
  created_at
FROM users
WHERE email IN ('admin@com-psu-rizal.com', 'user1@com-psu-rizal.com', 'user2@com-psu-rizal.com')
ORDER BY email;