-- Seed script for DealSafe AI
-- Run this after migrations to set up initial data

-- Create a test user profile (optional, for development)
-- Note: This will fail if the user doesn't exist in auth.users
-- In production, profiles are auto-created via trigger on signup

-- Example: Insert test data (only for local development)
-- INSERT INTO profiles (id, email, full_name, subscription_tier)
-- VALUES ('00000000-0000-0000-0000-000000000000', 'test@example.com', 'Test User', 'free')
-- ON CONFLICT (id) DO NOTHING;

-- Verify tables exist
SELECT 'profiles' as table_name, COUNT(*) as row_count FROM profiles
UNION ALL
SELECT 'documents', COUNT(*) FROM documents
UNION ALL
SELECT 'analyses', COUNT(*) FROM analyses
UNION ALL
SELECT 'analysis_findings', COUNT(*) FROM analysis_findings
UNION ALL
SELECT 'jobs', COUNT(*) FROM jobs
UNION ALL
SELECT 'usage', COUNT(*) FROM usage
UNION ALL
SELECT 'audit_logs', COUNT(*) FROM audit_logs;
