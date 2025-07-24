-- Clean up orphaned approval requests that reference non-existent users

-- First, let's see which approval requests have invalid user_ids
SELECT 
  ar.id,
  ar.user_id,
  ar.role_requested,
  ar.status,
  ar.created_at
FROM approval_requests ar
LEFT JOIN users u ON ar.user_id = u.id
WHERE u.id IS NULL;

-- Delete approval requests that reference non-existent users
DELETE FROM approval_requests 
WHERE user_id NOT IN (SELECT id FROM users);

-- Verify cleanup - this should return 0 rows
SELECT 
  ar.id,
  ar.user_id,
  ar.role_requested,
  ar.status,
  ar.created_at
FROM approval_requests ar
LEFT JOIN users u ON ar.user_id = u.id
WHERE u.id IS NULL;

-- Show remaining valid approval requests
SELECT 
  ar.id,
  ar.user_id,
  u.first_name,
  u.last_name,
  u.email,
  ar.role_requested,
  ar.status,
  ar.created_at
FROM approval_requests ar
JOIN users u ON ar.user_id = u.id
ORDER BY ar.created_at DESC;
