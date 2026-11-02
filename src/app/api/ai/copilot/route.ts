// src/app/api/ai/copilot/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { askCopilot } from '@/lib/ai/copilot';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const CopilotRequestSchema = z.object({
  question: z.string().min(1).max(1000),
  documentId: z.string().uuid(),
  contractText: z.string().min(1),
  contractType: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CopilotRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { question, documentId, contractText, contractType } = parsed.data;

    // Get chat history for this document
    let chatHistory: { role: 'user' | 'assistant'; content: string }[] = [];
    const { data: history } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('document_id', documentId)
      .order('created_at', { ascending: true })
      .limit(20);
    if (history) {
      chatHistory = history.map((h) => ({ role: h.role as 'user' | 'assistant', content: h.content }));
    }

    // Ask copilot (with evidence verification built in)
    const answer = await askCopilot(question, contractText, contractType || 'contract', chatHistory);

    // Save chat history
    try {
      await supabase.from('chat_messages').insert([
        { document_id: documentId, role: 'user', content: question },
        { document_id: documentId, role: 'assistant', content: answer.answer },
      ]);
    } catch (err) {
      console.warn('Could not save chat history:', err);
    }

    // Audit log
    try {
      await supabase.from('audit_logs').insert({
        action: 'copilot_question',
        resource_type: 'document',
        resource_id: documentId,
        metadata: { question, confidence: answer.confidence, cited_pages: answer.cited_pages },
      });
    } catch (err) {
      console.warn('Could not save audit log:', err);
    }

    return NextResponse.json({
      answer: answer.answer,
      cited_pages: answer.cited_pages,
      evidence_verified: answer.evidence_verified,
      confidence: answer.confidence,
      disclaimer: answer.disclaimer,
    });
  } catch (error: any) {
    console.error('Copilot Error:', error);
    return NextResponse.json(
      { error: error.message || 'Copilot failed' },
      { status: 500 }
    );
  }
}
