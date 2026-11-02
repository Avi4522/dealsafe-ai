-- 2026-11-01 00:00:00 initial schema
-- Tables: profiles, subscriptions, contracts, logs

-- profiles table: users and profile data
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY,
  email text NOT NULL UNIQUE,
  full_name text,
  avatar_url text,
  subscription_tier text DEFAULT 'free',
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Add/update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- subscriptions table: subscription metadata per user
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_name text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  status text NOT NULL,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

CREATE TRIGGER set_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- contracts table: stored contract metadata
CREATE TABLE IF NOT EXISTS public.contracts (
  id uuid PRIMARY KEY,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  contract_type text,
  confidence int,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

CREATE TRIGGER set_contracts_updated_at
BEFORE UPDATE ON public.contracts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- logs table: audit trail for actions
CREATE TABLE IF NOT EXISTS public.logs (
  id serial PRIMARY KEY,
  actor_id uuid REFERENCES public.profiles(id),
  action text,
  target_id uuid,
  target_type text,
  change_json jsonb,
  created_at timestamp default now()
);

-- Optional: Grants for Row Level Security (RLS) setup
-- Assuming you want implement read/write access only by profile owner or admin
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- Example policies: owner can read/write own profile
DROP POLICY IF EXISTS "profile_owner_read" ON public.profiles;
CREATE POLICY "profile_owner_read" ON public.profiles
FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profile_owner_write" ON public.profiles;
CREATE POLICY "profile_owner_write" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- Same for subscriptions and contracts
DROP POLICY IF EXISTS "subscription_owner_read" ON public.subscriptions;
CREATE POLICY "subscription_owner_read" ON public.subscriptions
FOR SELECT USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "subscription_owner_write" ON public.subscriptions;
CREATE POLICY "subscription_owner_write" ON public.subscriptions
FOR UPDATE USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "contract_owner_read" ON public.contracts;
CREATE POLICY "contract_owner_read" ON public.contracts
FOR SELECT USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "contract_owner_write" ON public.contracts;
CREATE POLICY "contract_owner_write" ON public.contracts
FOR UPDATE USING (auth.uid() = profile_id);

-- Logs are read-only for admins only
DROP POLICY IF EXISTS "logs_admin_read" ON public.logs;
CREATE POLICY "logs_admin_read" ON public.logs
FOR SELECT USING (auth.role() = 'admin');

-- End of migration file