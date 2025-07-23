-- Database Schema Update: Add location columns to service_providers table
-- This allows service providers to store their location for map search functionality

-- Add location columns to service_providers table (if they don't exist)
ALTER TABLE service_providers 
ADD COLUMN IF NOT EXISTS latitude double precision,
ADD COLUMN IF NOT EXISTS longitude double precision,
ADD COLUMN IF NOT EXISTS service_address text;

-- Optional: Add indexes for better location-based query performance
CREATE INDEX IF NOT EXISTS idx_sellers_location ON sellers(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_service_providers_location ON service_providers(latitude, longitude);

-- Verify your current sellers table schema has the correct columns:
-- - latitude (double precision)  
-- - longitude (double precision)
-- - shop_address (text)
-- - id_card_number (text not null) ✓ Required field

-- Fixed issues in code:
-- 1. ProfileVerification.jsx now uses correct column names: latitude, longitude (not shop_latitude, shop_longitude)
-- 2. authStore.js now properly handles id_card_number for sellers
-- 3. Form validation ensures id_card_number is required for sellers
-- 4. Location coordinates now use correct database column names
