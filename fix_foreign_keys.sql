-- Fix Foreign Key Relationships and Ensure Tables Exist

-- First, let's make sure the users table exists with correct structure
CREATE TABLE IF NOT EXISTS users (
  id uuid primary key,
  role text check (role in ('customer', 'seller', 'service_provider', 'admin')),
  first_name text,
  last_name text,
  email text unique,
  phone_number text,
  profile_image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create or recreate approval_requests table with proper foreign key
DROP TABLE IF EXISTS approval_requests CASCADE;
CREATE TABLE approval_requests (
  id serial primary key,
  user_id uuid NOT NULL,
  role_requested text NOT NULL check (role_requested in ('seller', 'service_provider')),
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid,
  reviewed_at timestamptz,
  notes text,
  created_at timestamptz default now(),
  
  -- Add foreign key constraints explicitly
  CONSTRAINT fk_approval_requests_user_id 
    FOREIGN KEY (user_id) 
    REFERENCES users(id) 
    ON DELETE CASCADE,
    
  CONSTRAINT fk_approval_requests_reviewed_by 
    FOREIGN KEY (reviewed_by) 
    REFERENCES users(id) 
    ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_approval_requests_user_id ON approval_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_approval_requests_status ON approval_requests(status);
CREATE INDEX IF NOT EXISTS idx_approval_requests_reviewed_by ON approval_requests(reviewed_by);

-- Enable Row Level Security
ALTER TABLE approval_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for approval_requests
CREATE POLICY "Users can view their own approval requests" ON approval_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all approval requests" ON approval_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can insert their own approval requests" ON approval_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update approval requests" ON approval_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Verify the relationship was created
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'approval_requests';
