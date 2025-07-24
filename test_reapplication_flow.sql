-- Quick test script for rejection and reapplication flow

-- Step 1: Set user to REJECTED status
UPDATE approval_requests 
SET status = 'rejected', 
    reviewed_at = NOW(), 
    reviewed_by = '5edbea08-d652-4e4f-a20b-e7f1c72cabf5',
    notes = 'Business license image is unclear. Please upload a high-quality image where all text is readable. Also ensure your shop address matches the license document.'
WHERE user_id = '83ddb227-0346-4973-a536-1823c5617479';

-- Verify the rejection
SELECT 
    u.email,
    ar.status,
    ar.notes,
    ar.reviewed_at
FROM approval_requests ar 
JOIN users u ON ar.user_id = u.id
WHERE ar.user_id = '83ddb227-0346-4973-a536-1823c5617479';

-- TESTING INSTRUCTIONS:
-- 1. Run the UPDATE query above
-- 2. Login with the seller account
-- 3. You should see:
--    ✅ Toast notification with rejection reason
--    ✅ Rejection page with detailed feedback
--    ✅ "Reapply for Verification" button
-- 4. Click "Reapply for Verification"
-- 5. You should see:
--    ✅ Loading spinner during processing
--    ✅ Page reload to verification form
--    ✅ "Resubmit Verification" header (not "Profile Verification")
--    ✅ Warning alert about resubmission
--    ✅ All form fields available for updating
-- 6. Submit the form again to create a new approval request

-- To check what happens after reapplication:
SELECT 
    u.email,
    ar.status,
    ar.created_at,
    ar.notes
FROM approval_requests ar 
JOIN users u ON ar.user_id = u.id
WHERE ar.user_id = '83ddb227-0346-4973-a536-1823c5617479'
ORDER BY ar.created_at DESC;
