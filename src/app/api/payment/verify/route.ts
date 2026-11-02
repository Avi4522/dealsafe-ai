import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { tierFromPlanName } from '@/lib/plans';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    const { sessionId, paymentId, orderId, signature, planName: bodyPlanName } = await req.json();

    if (sessionId) {
      // Stripe verification
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== 'paid') {
        return NextResponse.json({ success: false, error: 'Payment not completed' }, { status: 400 });
      }

      const userId = session.metadata?.userId;
      const planName = session.metadata?.planName || 'Pro Plan';
      const tier = tierFromPlanName(planName);

      if (userId) {
        await supabase
          .from('profiles')
          .update({ subscription_tier: tier })
          .eq('id', userId);
      }

      return NextResponse.json({ success: true, provider: 'stripe', planName });
    }

    if (paymentId && orderId && signature) {
      // Razorpay verification
      const body = `${orderId}|${paymentId}`;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
        .update(body)
        .digest('hex');

      if (signature !== expectedSignature) {
        return NextResponse.json({ success: false, error: 'Signature verification failed' }, { status: 400 });
      }

      const planName = bodyPlanName || 'Pro Plan';
      return NextResponse.json({ success: true, provider: 'razorpay', planName, tier: tierFromPlanName(planName) });
    }

    return NextResponse.json({ success: false, error: 'No valid payment details provided' }, { status: 400 });
  } catch (error: any) {
    console.error('Payment Verification Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}