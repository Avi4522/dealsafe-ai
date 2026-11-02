import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { USAGE_CREDITS, PLANS } from '@/lib/plans';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';
const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient(
      supabaseUrl,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
      {
        cookies: {
          getAll: () => req.cookies.getAll(),
          setAll: () => {},
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Get profile
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('subscription_tier, stripe_customer_id, razorpay_customer_id, created_at')
      .eq('id', user.id)
      .maybeSingle();

    const tier = profile?.subscription_tier || 'free';
    const credits = USAGE_CREDITS[tier] ?? USAGE_CREDITS.free;

    // 2. Count usage this calendar month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: usedCount } = await adminSupabase
      .from('contracts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', startOfMonth.toISOString());

    const used = usedCount || 0;
    const remaining = Math.max(0, credits - used);

    // 3. Fetch subscriptions
    const { data: subs } = await adminSupabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // 4. Construct payment / transaction history
    const transactions = (subs || []).map((sub) => {
      const planDef = PLANS.find((p) => p.id === sub.plan_id) || PLANS[1];
      return {
        id: sub.subscription_id || sub.id,
        date: sub.created_at,
        amount: planDef.monthlyUsd,
        currency: 'USD',
        status: sub.status === 'active' ? 'Paid' : sub.status,
        method: sub.provider === 'stripe' ? 'Credit Card (Stripe)' : 'UPI / Card (Razorpay)',
        invoiceUrl: '#',
        planName: planDef.planName,
      };
    });

    return NextResponse.json({
      tier,
      credits,
      used,
      remaining,
      profileCreated: profile?.created_at,
      subscriptions: subs || [],
      transactions,
    });
  } catch (error: any) {
    console.error('Billing GET error:', error);
    return NextResponse.json({ error: error.message || 'Failed to load billing' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient(
      supabaseUrl,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
      {
        cookies: {
          getAll: () => req.cookies.getAll(),
          setAll: () => {},
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, planId, billingCycle } = await req.json();

    if (action === 'cancel') {
      // Downgrade to free tier
      await adminSupabase
        .from('profiles')
        .update({ subscription_tier: 'free' })
        .eq('id', user.id);

      await adminSupabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'subscription_cancelled',
        details: { previousTier: planId, cancelledAt: new Date().toISOString() },
      });

      return NextResponse.json({ success: true, tier: 'free', message: 'Subscription cancelled.' });
    }

    if (action === 'change_plan' && planId) {
      const validTier = planId === 'business' ? 'enterprise' : planId;
      await adminSupabase
        .from('profiles')
        .update({ subscription_tier: validTier })
        .eq('id', user.id);

      const periodEnd = new Date();
      periodEnd.setDate(periodEnd.getDate() + (billingCycle === 'annual' ? 365 : 30));

      await adminSupabase.from('subscriptions').insert({
        user_id: user.id,
        provider: 'stripe',
        subscription_id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        status: 'active',
        plan_id: planId,
        current_period_start: new Date().toISOString(),
        current_period_end: periodEnd.toISOString(),
      });

      await adminSupabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'plan_upgraded',
        details: { newTier: validTier, billingCycle, timestamp: new Date().toISOString() },
      });

      return NextResponse.json({
        success: true,
        tier: validTier,
        message: `Plan updated to ${planId.toUpperCase()}.`,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Billing POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update plan' }, { status: 500 });
  }
}

