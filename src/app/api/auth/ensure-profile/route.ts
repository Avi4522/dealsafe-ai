import { NextRequest, NextResponse } from 'next/server';
import { getServiceRoleSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { userId, email, fullName } = await req.json();
    if (!userId || !email) {
      return NextResponse.json({ error: 'userId and email are required' }, { status: 400 });
    }

    const supabase = getServiceRoleSupabase();
    const { data: existing } = await supabase.from('profiles').select('id').eq('id', userId).maybeSingle();
    if (existing) {
      return NextResponse.json({ ok: true, created: false });
    }

    const { error } = await supabase.from('profiles').insert({
      id: userId,
      email,
      full_name: fullName || null,
      subscription_tier: 'free',
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, created: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to sync profile' }, { status: 500 });
  }
}
