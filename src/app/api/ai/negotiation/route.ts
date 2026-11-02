// src/app/api/ai/negotiation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateNegotiationSuggestions } from '@/lib/ai/negotiation';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const NegotiationRequestSchema = z.object({
  documentId: z.string().uuid(),
  contractText: z.string().min(1),
  contractType: z.string().optional(),
  findings: z.array(z.object({
    title: z.string(),
    category: z.string(),
    severity: z.string(),
    quoted_text: z.string(),
    explanation: z.string(),
  })),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = NegotiationRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { documentId, contractText, contractType, findings } = parsed.data;

    const result = await generateNegotiationSuggestions(
      contractText,
      contractType || 'contract',
      findings
    );

    // Save negotiation history
    try {
      await supabase.from('negotiation_history').insert({
        document_id: documentId,
        suggestions: result.suggestions,
        email_draft: result.email_draft,
      });
    } catch (err) {
      console.warn('Could not save negotiation history:', err);
    }

    // Audit log
    await supabase.from('audit_logs').insert({
      action: 'negotiation_generated',
      resource_type: 'document',
      resource_id: documentId,
      metadata: { suggestion_count: result.suggestions.length },
    });

    return NextResponse.json({
      ...result,
      disclaimer: 'AI-assisted analysis, not legal advice. Review all suggestions before sending.',
    });
  } catch (error: any) {
    console.error('Negotiation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Negotiation generation failed' },
      { status: 500 }
    );
  }
}
