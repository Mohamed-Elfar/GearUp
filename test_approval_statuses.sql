-- Test script to set different approval statuses for testing

-- First, let's see all users and their roles
SELECT id, email, role, first_name, last_name FROM users;

-- Check existing approval requests
SELECT * FROM approval_requests ORDER BY created_at DESC;

-- To test different scenarios, you can manually update approval statuses:

-- Example 1: Set a user as APPROVED
-- UPDATE approval_requests 
-- SET status = 'approved', 
--     reviewed_at = NOW(), 
--     reviewed_by = (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
--     notes = 'All documents verified successfully'
-- WHERE user_id = 'USER_ID_HERE';

-- Example 2: Set a user as REJECTED
-- UPDATE approval_requests 
-- SET status = 'rejected', 
--     reviewed_at = NOW(), 
--     reviewed_by = (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
--     notes = 'Business license image is unclear. Please resubmit with a clearer photo.'
-- WHERE user_id = 'USER_ID_HERE';

-- Example 3: Set a user as PENDING (default)
-- UPDATE approval_requests 
-- SET status = 'pending', 
--     reviewed_at = NULL, 
--     reviewed_by = NULL,
--     notes = NULL
-- WHERE user_id = 'USER_ID_HERE';

-- For the user mohaameedsaameer@gmail.com, find their user_id first:
SELECT id, email, role FROM users WHERE email = 'mohaameedsaameer@gmail.com';

-- Then check if they have an approval request:
SELECT ar.*, u.email 
FROM approval_requests ar 
JOIN users u ON ar.user_id = u.id 
WHERE u.email = 'mohaameedsaameer@gmail.com';

-- To test APPROVED status for mohaameedsaameer@gmail.com:
-- UPDATE approval_requests 
-- SET status = 'approved', 
--     reviewed_at = NOW(), 
--     reviewed_by = (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
--     notes = 'Profile verified successfully'
-- WHERE user_id = (SELECT id FROM users WHERE email = 'mohaameedsaameer@gmail.com');
