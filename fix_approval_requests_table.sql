-- Quick fix for foreign key relationship issue
-- This will recreate the approval_requests table with proper foreign keys

-- Step 1: Drop and recreate approval_requests table
DROP TABLE IF EXISTS approval_requests CASCADE;

-- Step 2: Create table with explicit foreign key constraints
CREATE TABLE approval_requests (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  role_requested TEXT NOT NULL CHECK (role_requested IN ('seller', 'service_provider')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Foreign key constraints
  CONSTRAINT fk_approval_requests_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_approval_requests_reviewed_by 
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Step 3: Create indexes for performance
CREATE INDEX idx_approval_requests_user_id ON approval_requests(user_id);
CREATE INDEX idx_approval_requests_status ON approval_requests(status);
CREATE INDEX idx_approval_requests_reviewed_by ON approval_requests(reviewed_by);

-- Step 4: Enable RLS
ALTER TABLE approval_requests ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policies
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

-- Step 6: Insert some test data if needed
-- Replace with actual user IDs from your users table
INSERT INTO approval_requests (user_id, role_requested, status) 
SELECT id, 'seller', 'pending' 
FROM users 
WHERE role = 'seller' 
LIMIT 2;

INSERT INTO approval_requests (user_id, role_requested, status) 
SELECT id, 'service_provider', 'pending' 
FROM users 
WHERE role = 'service_provider' 
LIMIT 2;

-- Step 7: Verify the foreign key relationship was created
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

-- Step 8: Test the query that was failing
SELECT 
  approval_requests.*,
  users.id,
  users.first_name,
  users.last_name,
  users.email,
  users.phone_number,
  users.created_at
FROM approval_requests
JOIN users ON approval_requests.user_id = users.id
WHERE approval_requests.status = 'pending'
ORDER BY approval_requests.created_at DESC;
