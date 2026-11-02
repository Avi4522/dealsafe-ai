-- Migration: 001_dealsafe_core_schema.sql
-- Description: Complete core database schema with RLS enforcement per security.md

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'lawyer', 'admin')),
    subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
    stripe_customer_id TEXT,
    razorpay_customer_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- 2. WORKSPACES TABLE (Multi-tenancy & Team collaboration)
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace owners can access workspace"
    ON public.workspaces FOR ALL
    USING (auth.uid() = owner_id);

-- 3. CONTRACTS TABLE (Document Vault)
CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    file_type TEXT NOT NULL,
    document_status TEXT NOT NULL DEFAULT 'uploaded' CHECK (document_status IN ('uploaded', 'processing', 'analyzed', 'error')),
    overall_risk_level TEXT CHECK (overall_risk_level IN ('Low', 'Medium', 'High', 'Critical')),
    overall_risk_score NUMERIC(4, 2), -- e.g. 2.30 out of 10 or 92% confidence
    clause_count INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own contracts"
    ON public.contracts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own contracts"
    ON public.contracts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contracts"
    ON public.contracts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contracts"
    ON public.contracts FOR DELETE
    USING (auth.uid() = user_id);

-- 4. CONTRACT ANALYSIS TABLE (AI Results)
CREATE TABLE IF NOT EXISTS public.contract_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
    ai_confidence_percentage INT DEFAULT 90,
    clause_type TEXT,
    impact_summary TEXT,
    risk_zone TEXT,
    recommendations TEXT,
    suggested_rewrite TEXT,
    extracted_clauses JSONB DEFAULT '[]'::jsonb,
    missing_provisions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.contract_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access analysis of their own contracts"
    ON public.contract_analysis FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.contracts
            WHERE contracts.id = contract_analysis.contract_id
            AND contracts.user_id = auth.uid()
        )
    );

-- 5. RELEVANT PRECEDENTS / CASE LAW TABLE
CREATE TABLE IF NOT EXISTS public.precedent_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_name TEXT NOT NULL,
    jurisdiction TEXT NOT NULL,
    case_year INT NOT NULL,
    relevance_score_pct INT NOT NULL,
    clause_match TEXT NOT NULL,
    outcome TEXT NOT NULL CHECK (outcome IN ('Win', 'Settled', 'Loss')),
    summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.precedent_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can read precedents"
    ON public.precedent_cases FOR SELECT
    USING (auth.role() = 'authenticated');

-- 6. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('stripe', 'razorpay')),
    subscription_id TEXT NOT NULL,
    status TEXT NOT NULL,
    plan_id TEXT NOT NULL,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- 7. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own audit logs"
    ON public.audit_logs FOR SELECT
    USING (auth.uid() = user_id);

-- TRIGGER TO CREATE PROFILE ON USER SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
