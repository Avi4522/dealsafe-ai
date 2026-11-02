// src/app/api/lawyers/share/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, analysisId, documentId, sharedFields, expiryDays = 7 } = body;

    if (!userId || !analysisId || !documentId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from('analysis_share_links')
      .insert({
        user_id: userId,
        analysis_id: analysisId,
        document_id: documentId,
        token,
        expires_at: expiresAt.toISOString(),
        shared_fields: sharedFields || ['summary', 'findings'],
      })
      .select()
      .single();

    if (error) throw error;

    // Audit log
    try {
      await supabase.from('audit_logs').insert({
        action: 'share_link_created',
        resource_type: 'analysis',
        resource_id: analysisId,
        user_id: userId,
        metadata: { token, expires_at: expiresAt.toISOString(), shared_fields: sharedFields },
      });
    } catch {}

    return NextResponse.json({
      token,
      url: `/shared/analysis/${token}`,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');

    if (!token || !userId) {
      return NextResponse.json({ error: 'Missing token or userId' }, { status: 400 });
    }

    const { error } = await supabase
      .from('analysis_share_links')
      .update({ revoked: true, revoked_at: new Date().toISOString() })
      .eq('token', token)
      .eq('user_id', userId);

    if (error) throw error;

    try {
      await supabase.from('audit_logs').insert({
        action: 'share_link_revoked',
        resource_type: 'analysis_share_link',
        metadata: { token },
        user_id: userId,
      });
    } catch {}

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
