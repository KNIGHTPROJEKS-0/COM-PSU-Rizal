-- First, let's check what roles the test users currently have
SELECT 
  email,
  role
FROM users
WHERE email IN ('admin@com-psu-rizal.com', 'user1@com-psu-rizal.com', 'user2@com-psu-rizal.com');

-- Then, let's update the admin user to have the 'admin' role if it doesn't already
UPDATE users 
SET role = 'admin' 
WHERE email = 'admin@com-psu-rizal.com' AND role != 'admin';

-- Let's also make sure the other users have 'student' roles
UPDATE users 
SET role = 'student' 
WHERE email IN ('user1@com-psu-rizal.com', 'user2@com-psu-rizal.com') AND role != 'student';

-- Verify the updates
SELECT 
  email,
  role
FROM users
WHERE email IN ('admin@com-psu-rizal.com', 'user1@com-psu-rizal.com', 'user2@com-psu-rizal.com');