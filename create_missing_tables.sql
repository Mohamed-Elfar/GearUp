-- Create missing tables from your schema

-- Track user actions or logs
CREATE TABLE activity_logs (
  id serial primary key,
  user_id uuid references users(id),
  action text,
  target text,
  created_at timestamptz default now()
);

-- Feedback or reports
CREATE TABLE feedback_reports (
  id serial primary key,
  reporter_id uuid references users(id),
  reported_user_id uuid references users(id),
  reason text,
  status text default 'pending',
  created_at timestamptz default now()
);

-- Add indexes for better performance
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX idx_feedback_reports_reporter_id ON feedback_reports(reporter_id);
CREATE INDEX idx_feedback_reports_reported_user_id ON feedback_reports(reported_user_id);
CREATE INDEX idx_feedback_reports_status ON feedback_reports(status);

-- Enable RLS if needed
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_reports ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON activity_logs TO authenticated;
GRANT ALL ON feedback_reports TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE activity_logs_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE feedback_reports_id_seq TO authenticated;
