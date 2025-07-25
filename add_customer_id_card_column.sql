-- SQL to add id_card_url column to customers table
-- This needs to be run in your Supabase SQL editor

-- Add id_card_url column to customers table
ALTER TABLE customers 
ADD COLUMN id_card_url text;

-- Verify the change
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'customers' 
AND table_schema = 'public';
