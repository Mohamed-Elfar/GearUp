-- Quick fix: Make any existing user an admin for testing
-- Replace 'your-email@example.com' with your actual email

UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Or if you know the user ID:
-- UPDATE users SET role = 'admin' WHERE id = 'your-user-id';

-- Check the update worked:
SELECT id, email, role, first_name, last_name FROM users WHERE role = 'admin';
