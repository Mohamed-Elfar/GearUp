-- Temporary: Make any existing user an admin for testing
-- Replace 'your-email@example.com' with your actual email

UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Or create a new admin user (you'll need to create the auth user first in Supabase dashboard)
INSERT INTO users (
  id,
  role,
  first_name,
  last_name,
  email,
  phone_number
) VALUES (
  'YOUR_SUPABASE_AUTH_USER_ID', -- Get this from Supabase Auth dashboard
  'admin',
  'Admin',
  'User',
  'admin@gearup.com',
  '+1234567890'
) ON CONFLICT (email) DO UPDATE SET role = 'admin';

-- To check current users and their roles:
SELECT id, email, role, first_name, last_name FROM users;
