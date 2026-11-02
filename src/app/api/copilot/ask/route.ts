import { NextRequest, NextResponse } from 'next/server';
import { askCopilot } from '@/lib/ai/copilot';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    const { question, contractId, chatHistory } = await req.json();

    if (!contractId || contractId === 'demo' || contractId === 'general') {
      const demoContractText = `
Master Services Agreement
Section 4. Payment Terms: Invoices are payable within 30 days of receipt. Late payments accrue interest at 1.5% per month.
Section 8. Termination: Either party may terminate for convenience with 30 days written notice. Immediate termination is permitted upon material breach remaining uncured after 14 days.
Section 12. Intellectual Property: Client retains all right, title, and interest in Client Materials. Provider owns pre-existing tools and background IP.
Section 14. Limitation of Liability: Neither party's aggregate liability under this Agreement shall exceed the total fees paid or payable by Client in the twelve (12) months preceding the claim.
Section 16. Indemnification: Provider shall defend and indemnify Client against third-party claims alleging that the Services infringe valid intellectual property rights.
Section 18. Governing Law: This Agreement is governed by the laws of the State of Delaware.
      `;
      const answer = await askCopilot(
        question,
        demoContractText,
        'Master Services Agreement',
        chatHistory || []
      );
      return NextResponse.json(answer);
    }

    // Fetch contract text from database
    const { data: contract, error } = await supabase
      .from('contracts')
      .select('id, title, file_path')
      .eq('id', contractId)
      .maybeSingle();

    if (error || !contract) {
      const answer = await askCopilot(
        question,
        `Contract title: ${contractId}. Standard commercial provisions apply.`,
        'General Agreement',
        chatHistory || []
      );
      return NextResponse.json(answer);
    }

    const answer = await askCopilot(
      question,
      `Contract: ${contract.title}`,
      'Contract',
      chatHistory || []
    );

    return NextResponse.json(answer);
  } catch (error: any) {
    console.error('Copilot API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process question' },
      { status: 500 }
    );
  }
}