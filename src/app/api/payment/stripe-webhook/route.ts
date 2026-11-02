import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const config = { api: { body: false } };

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const rawBody = await req.text();

  if (!webhookSecret || !sig) {
    return NextResponse.json({ received: true });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      webhookSecret!
    );
  } catch (err: any) {
    console.error('Stripe Webhook Signature Verification Failed:', err.message);
    return NextResponse.json({ error: 'Webhook signature mismatch' }, { status: 400 });
  }

  if (event.type === 'invoice.payment_succeeded' || event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as any;
    const userId = subscription.metadata?.userId;

    if (!userId) {
      console.error('No userId in subscription metadata');
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
    }

    const planName = subscription.metadata?.planName || 'Pro Plan';
    const periodEnd = new Date(subscription.current_period_end * 1000).toISOString();

    const tier = planName === 'Enterprise Plan' ? 'enterprise' : 'pro';
    await supabase
      .from('profiles')
      .update({
        subscription_tier: tier,
        stripe_customer_id: subscription.customer,
      })
      .eq('id', userId);

    await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        provider: 'stripe',
        subscription_id: subscription.id,
        status: 'active',
        plan_id: planName,
        current_period_end: periodEnd,
      });
  }

  return NextResponse.json({ received: true });
}