import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const config = { api: { body: false } };

export async function POST(req: NextRequest) {
  const sig = req.headers.get('x-razorpay-signature') as string;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const rawBody = await req.text();

  if (!webhookSecret) {
     return NextResponse.json({ received: true }); // Skip verification if not configured
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret!)
    .update(rawBody)
    .digest('hex');

  if (sig !== expectedSignature) {
    console.error('Razorpay Webhook Signature Mismatch');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const payload = event.payload;
  const eventType = event.event;

  if (eventType === 'invoice.paid' || eventType === 'payment.captured') {
    const payment = payload.payment || payload.invoice?.payments?.[0];
    const userId = payload.notes?.userId;

    if (!userId) {
      console.error('No userId in Razorpay webhook notes');
      return NextResponse.json({ error: 'Missing notes' }, { status: 400 });
    }

    const planName = payload.notes?.planName || 'Pro Plan';
    const tier = planName === 'Enterprise Plan' ? 'enterprise' : 'pro';
    const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    await supabase
      .from('profiles')
      .update({
        subscription_tier: tier,
        razorpay_customer_id: payload.customer_id,
      })
      .eq('id', userId);

    await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        provider: 'razorpay',
        subscription_id: payload.invoice_id || payment?.id,
        status: 'active',
        plan_id: planName,
        current_period_end: periodEnd,
      });
  }

  return NextResponse.json({ received: true });
}