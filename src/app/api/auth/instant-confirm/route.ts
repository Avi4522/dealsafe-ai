import { NextRequest, NextResponse } from 'next/server';
import { getServiceRoleSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email address is required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const serviceSupabase = getServiceRoleSupabase();

    // 1. Find user by email
    const { data: usersData, error: listErr } = await serviceSupabase.auth.admin.listUsers();
    if (listErr) {
      return NextResponse.json({ error: listErr.message }, { status: 500 });
    }

    const targetUser = usersData.users.find(
      (u) => u.email?.toLowerCase() === cleanEmail
    );

    if (!targetUser) {
      return NextResponse.json(
        { error: `No account found for ${cleanEmail}. Please create an account first.` },
        { status: 404 }
      );
    }

    // 2. Confirm email immediately using admin API
    const { data: updated, error: updateErr } = await serviceSupabase.auth.admin.updateUserById(
      targetUser.id,
      { email_confirm: true }
    );

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    // 3. Ensure profile row exists
    const { data: existingProfile } = await serviceSupabase
      .from('profiles')
      .select('id')
      .eq('id', targetUser.id)
      .maybeSingle();

    if (!existingProfile) {
      await serviceSupabase.from('profiles').insert({
        id: targetUser.id,
        email: cleanEmail,
        full_name: targetUser.user_metadata?.full_name || null,
        subscription_tier: 'free',
      });
    }

    return NextResponse.json({
      ok: true,
      message: `Account ${cleanEmail} verified successfully! You can now sign in immediately.`,
      userId: targetUser.id,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to confirm account.' },
      { status: 500 }
    );
  }
}

