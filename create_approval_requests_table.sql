-- Create the approval_requests table
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

-- Create index for better performance
CREATE INDEX idx_approval_requests_status ON approval_requests(status);
CREATE INDEX idx_approval_requests_user_id ON approval_requests(user_id);
CREATE INDEX idx_approval_requests_created_at ON approval_requests(created_at DESC);

-- Enable Row Level Security (RLS) if needed
ALTER TABLE approval_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS (optional - allows admins to see all, users to see their own)
CREATE POLICY "Users can view their own approval requests" 
ON approval_requests FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all approval requests" 
ON approval_requests FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Grant necessary permissions
GRANT ALL ON approval_requests TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE approval_requests_id_seq TO authenticated;
