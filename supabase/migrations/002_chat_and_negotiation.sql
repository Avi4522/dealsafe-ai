-- Migration 002: Add chat_messages and negotiation_history tables
-- DealSafe AI Step 2 additions

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS negotiation_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  suggestions JSONB NOT NULL DEFAULT '[]',
  email_draft JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE negotiation_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Chat Messages
CREATE POLICY "Users can view own chat messages" ON chat_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages" ON chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat messages" ON chat_messages
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies: Negotiation History
CREATE POLICY "Users can view own negotiation history" ON negotiation_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own negotiation history" ON negotiation_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own negotiation history" ON negotiation_history
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_document_id ON chat_messages(document_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_negotiation_history_document_id ON negotiation_history(document_id);
CREATE INDEX IF NOT EXISTS idx_negotiation_history_user_id ON negotiation_history(user_id);
