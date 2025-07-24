-- Complete test script for approval status system
-- Run these queries step by step to test different scenarios

-- STEP 1: Check current database state
SELECT 'Current Users' as info;
SELECT id, email, role, first_name, last_name FROM users;

SELECT 'Current Approval Requests' as info;
SELECT 
    ar.id,
    u.email,
    ar.role_requested,
    ar.status,
    ar.notes,
    ar.created_at
FROM approval_requests ar 
JOIN users u ON ar.user_id = u.id
ORDER BY ar.created_at DESC;

-- STEP 2: Test REJECTED status (creates toast notification)
SELECT 'Setting user to REJECTED status...' as info;
UPDATE approval_requests 
SET status = 'rejected', 
    reviewed_at = NOW(), 
    reviewed_by = '5edbea08-d652-4e4f-a20b-e7f1c72cabf5',
    notes = 'Business license document is not clearly visible. Please upload a high-quality image where all text is readable.'
WHERE user_id = '83ddb227-0346-4973-a536-1823c5617479';

-- Check result
SELECT 'REJECTED user status:' as info;
SELECT 
    u.email,
    ar.status,
    ar.notes,
    ar.reviewed_at
FROM approval_requests ar 
JOIN users u ON ar.user_id = u.id
WHERE ar.user_id = '83ddb227-0346-4973-a536-1823c5617479';

-- Now login with this user to see:
-- ✅ Toast notification with rejection reason
-- ✅ Rejection page with reapply button
-- ✅ Red "Rejected" badge

-- STEP 3: Test PENDING status (shows under review page)
SELECT 'Setting user to PENDING status...' as info;
UPDATE approval_requests 
SET status = 'pending', 
    reviewed_at = NULL, 
    reviewed_by = NULL,
    notes = NULL
WHERE user_id = '83ddb227-0346-4973-a536-1823c5617479';

-- Check result
SELECT 'PENDING user status:' as info;
SELECT 
    u.email,
    ar.status,
    ar.notes,
    ar.reviewed_at
FROM approval_requests ar 
JOIN users u ON ar.user_id = u.id
WHERE ar.user_id = '83ddb227-0346-4973-a536-1823c5617479';

-- Now login with this user to see:
-- ✅ "Under Review" page with timeline
-- ✅ Yellow "Under Review" badge
-- ✅ Professional waiting page

-- STEP 4: Test APPROVED status (shows normal profile with verified badge)
SELECT 'Setting user to APPROVED status...' as info;
UPDATE approval_requests 
SET status = 'approved', 
    reviewed_at = NOW(), 
    reviewed_by = '5edbea08-d652-4e4f-a20b-e7f1c72cabf5',
    notes = 'All documents verified successfully. Welcome to the GearUp platform!'
WHERE user_id = '83ddb227-0346-4973-a536-1823c5617479';

-- Check result
SELECT 'APPROVED user status:' as info;
SELECT 
    u.email,
    ar.status,
    ar.notes,
    ar.reviewed_at
FROM approval_requests ar 
JOIN users u ON ar.user_id = u.id
WHERE ar.user_id = '83ddb227-0346-4973-a536-1823c5617479';

-- Now login with this user to see:
-- ✅ Normal profile page (not verification form)
-- ✅ Green "Approved & Verified" badge
-- ✅ Multiple verification badges (Phone + ID + Approved)
-- ✅ "Fully Verified Business" status

-- STEP 5: Final verification
SELECT 'Final Status Check:' as info;
SELECT 
    u.id,
    u.email,
    u.role,
    u.first_name,
    u.last_name,
    ar.status as approval_status,
    ar.notes,
    ar.reviewed_at,
    ar.created_at as submitted_at
FROM users u
LEFT JOIN approval_requests ar ON u.id = ar.user_id
WHERE u.role IN ('seller', 'service_provider')
ORDER BY ar.created_at DESC;

-- TESTING INSTRUCTIONS:
-- 1. Run STEP 1 to see current state
-- 2. Run STEP 2, then login with the seller to test REJECTED flow
-- 3. Run STEP 3, then login with the seller to test PENDING flow  
-- 4. Run STEP 4, then login with the seller to test APPROVED flow
-- 5. Run STEP 5 to verify final state

-- User credentials for testing:
-- Find the seller's email from the users table and use their login credentials
