-- Test if approval_requests table exists and has the correct structure
-- Run this in your Supabase SQL Editor to verify

-- Check if the table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_name = 'approval_requests'
);

-- If the table exists, check its structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'approval_requests'
ORDER BY ordinal_position;

-- Check if there are any records
SELECT COUNT(*) as total_requests FROM approval_requests;

-- If you need to create the table, use this:
/*
CREATE TABLE approval_requests (
  id serial primary key,
  user_id uuid references users(id) on delete cascade,
  role_requested text check (role_requested in ('seller', 'service_provider')),
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references users(id), -- admin id
  reviewed_at timestamptz,
  notes text,
  created_at timestamptz default now()
);
*/
