-- GearUp Admin User Setup
-- Follow these steps to create an admin user for the approval system

-- Step 1: Create admin user in Supabase Auth Dashboard
-- 1. Go to your Supabase Dashboard > Authentication > Users
-- 2. Click "Add User" and create:
--    Email: admin@gearup.com
--    Password: Admin123!
-- 3. Copy the User ID from the created auth user

-- Step 2: Insert admin user into your users table
-- Replace 'YOUR_SUPABASE_AUTH_USER_ID' with the actual UUID from Step 1

INSERT INTO users (
  id,
  role,
  first_name,
  last_name,
  email,
  phone_number
) VALUES (
  'YOUR_SUPABASE_AUTH_USER_ID', -- Replace with actual UUID from Supabase Auth
  'admin',
  'Admin',
  'User',
  'admin@gearup.com',
  '+1234567890'
) ON CONFLICT (id) DO UPDATE SET 
  role = 'admin',
  email = 'admin@gearup.com',
  phone_number = '+1234567890';

-- Step 3: Login and Access
-- 1. Go to your app homepage
-- 2. Login with: admin@gearup.com / Admin123!
-- 3. Visit /profile (shows admin dashboard)
-- 4. Click "Approval Requests" to manage user verifications

-- Verify admin user was created
SELECT id, email, role, first_name, last_name FROM users WHERE role = 'admin';
