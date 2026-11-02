import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    // Search contracts by title
    const { data: contracts } = await supabase
      .from('contracts')
      .select('id, title, created_at, overall_risk_level')
      .ilike('title', `%${query}%`)
      .limit(10);

    // Search precedents
    const { data: precedents } = await supabase
      .from('precedent_cases')
      .select('id, case_name, jurisdiction, case_year, outcome')
      .ilike('case_name', `%${query}%`)
      .limit(10);

    const results = [
      ...(contracts || []).map(c => ({
        title: c.title,
        snippet: `Analyzed contract with risk level: ${c.overall_risk_level || 'N/A'}`,
        source: 'Contract Vault',
        relevance: 85,
      })),
      ...(precedents || []).map(p => ({
        title: p.case_name,
        snippet: `${p.jurisdiction} case from ${p.case_year} with outcome: ${p.outcome}`,
        source: 'Precedent Case Law',
        relevance: 90,
      })),
    ];

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('Search API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}