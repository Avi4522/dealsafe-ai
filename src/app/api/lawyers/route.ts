// src/app/api/lawyers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');
    const specialty = searchParams.get('specialty');

    let query = supabase.from('lawyers').select('*').eq('verified', true);
    if (city) query = query.eq('city', city);
    if (specialty) query = query.contains('specialties', [specialty]);

    const { data, error } = await query.order('name', { ascending: true });
    if (error) throw error;

    return NextResponse.json({ lawyers: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
