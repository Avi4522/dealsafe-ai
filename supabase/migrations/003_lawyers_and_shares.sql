-- supabase/migrations/003_lawyers_and_shares.sql
-- Curated lawyer directory + shareable analysis links

CREATE TABLE IF NOT EXISTS lawyers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  specialties TEXT[] NOT NULL DEFAULT '{}',
  languages TEXT[] NOT NULL DEFAULT '{}',
  contact_email TEXT,
  contact_phone TEXT,
  bar_registration_number TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  short_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lawyers_verified ON lawyers(verified);
CREATE INDEX IF NOT EXISTS idx_lawyers_city ON lawyers(city);

CREATE TABLE IF NOT EXISTS analysis_share_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_id UUID NOT NULL,
  document_id UUID NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked BOOLEAN NOT NULL DEFAULT false,
  revoked_at TIMESTAMPTZ,
  shared_fields TEXT[] NOT NULL DEFAULT '{}',
  access_count INT NOT NULL DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_share_links_token ON analysis_share_links(token);
CREATE INDEX IF NOT EXISTS idx_share_links_user ON analysis_share_links(user_id);

ALTER TABLE lawyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_share_links ENABLE ROW LEVEL SECURITY;

-- Public: only verified lawyers visible
CREATE POLICY "lawyers_public_read_verified" ON lawyers
  FOR SELECT USING (verified = true);

-- Admin: full access (service role bypasses RLS anyway)
-- Users manage their own share links
CREATE POLICY "share_links_owner_all" ON analysis_share_links
  FOR ALL USING (auth.uid() = user_id);

-- Public read by token handled via service role in API

CREATE TABLE IF NOT EXISTS payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  external_payment_id TEXT,
  plan_id TEXT NOT NULL,
  amount INT NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_payment_history_user ON payment_history(user_id);

ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payment_history_owner_read" ON payment_history
  FOR SELECT USING (auth.uid() = user_id);
