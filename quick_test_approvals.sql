-- Quick test queries for the current database state

-- 1. Find mohaameedsaameer@gmail.com user
SELECT id, email, role, first_name, last_name 
FROM users 
WHERE email = 'mohaameedsaameer@gmail.com';

-- 2. Check if this user has an approval request
SELECT ar.*, u.email, u.first_name, u.last_name
FROM approval_requests ar 
JOIN users u ON ar.user_id = u.id 
WHERE u.email = 'mohaameedsaameer@gmail.com';

-- 3. Create test scenarios for different approval statuses:

-- Scenario A: Test REJECTED status (if mohaameedsaameer exists)
UPDATE approval_requests 
SET status = 'rejected', 
    reviewed_at = NOW(), 
    reviewed_by = '5edbea08-d652-4e4f-a20b-e7f1c72cabf5',
    notes = 'Business license image is unclear. Please resubmit with a clearer photo showing all details.'
WHERE user_id = (SELECT id FROM users WHERE email = 'mohaameedsaameer@gmail.com' LIMIT 1);

-- Scenario B: Test PENDING status (if mohaameedsaameer exists)
-- UPDATE approval_requests 
-- SET status = 'pending', 
--     reviewed_at = NULL, 
--     reviewed_by = NULL,
--     notes = NULL
-- WHERE user_id = (SELECT id FROM users WHERE email = 'mohaameedsaameer@gmail.com' LIMIT 1);

-- Scenario C: Test APPROVED status (if mohaameedsaameer exists)
-- UPDATE approval_requests 
-- SET status = 'approved', 
--     reviewed_at = NOW(), 
--     reviewed_by = '5edbea08-d652-4e4f-a20b-e7f1c72cabf5',
--     notes = 'All documents verified successfully. Welcome to the platform!'
-- WHERE user_id = (SELECT id FROM users WHERE email = 'mohaameedsaameer@gmail.com' LIMIT 1);

-- 4. If mohaameedsaameer doesn't have an approval request, create one:
-- First, check if user exists and get their role
SELECT id, email, role FROM users WHERE email = 'mohaameedsaameer@gmail.com';

-- If user exists but no approval request, create one:
-- INSERT INTO approval_requests (user_id, role_requested, status, notes)
-- SELECT id, role, 'pending', 'Submitted for verification'
-- FROM users 
-- WHERE email = 'mohaameedsaameer@gmail.com' 
-- AND role IN ('seller', 'service_provider')
-- AND NOT EXISTS (
--     SELECT 1 FROM approval_requests 
--     WHERE user_id = users.id
-- );

-- 5. Verify the current state
SELECT 
    u.email,
    u.role,
    u.first_name,
    u.last_name,
    ar.status as approval_status,
    ar.notes as rejection_reason,
    ar.reviewed_at,
    ar.created_at as submitted_at
FROM users u
LEFT JOIN approval_requests ar ON u.id = ar.user_id
WHERE u.role IN ('seller', 'service_provider')
ORDER BY ar.created_at DESC;
