import { NextRequest, NextResponse } from 'next/server';
import { classifyContract } from '@/lib/ai/classifier';
import { extractClausesAndAnalyze } from '@/lib/ai/clause-extractor';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    const { contractText, contractId } = await req.json();

    if (!contractText) {
      return NextResponse.json({ error: 'Contract text is required' }, { status: 400 });
    }

    // Step 1: Classify
    const classification = await classifyContract(contractText);

    // Step 2: Extract clauses and analyze risks
    const analysis = await extractClausesAndAnalyze(contractText, classification.contract_type);

    // Step 3: Persist to database if contractId provided
    if (contractId && supabaseUrl !== 'https://placeholder.supabase.co') {
      await supabase
        .from('contracts')
        .update({
          document_status: 'analyzed',
          overall_risk_level: analysis.overall_risk_level,
          overall_risk_score: analysis.overall_risk_score,
          clause_count: analysis.clauses.length,
        })
        .eq('id', contractId);

      await supabase
        .from('contract_analysis')
        .insert({
          contract_id: contractId,
          ai_confidence_percentage: classification.confidence,
          clause_type: classification.contract_type,
          impact_summary: analysis.summary,
          risk_zone: analysis.overall_risk_level,
          recommendations: analysis.clauses.map(c => c.recommendation).join('; '),
          extracted_clauses: analysis.clauses,
          missing_provisions: analysis.missing_provisions,
        });
    }

    return NextResponse.json({
      classification,
      analysis,
    });
  } catch (error: any) {
    console.error('AI Analysis Error:', error);
    return NextResponse.json(
      { error: error.message || 'AI analysis failed' },
      { status: 500 }
    );
  }
}