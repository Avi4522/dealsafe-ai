import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { razorpay } from '@/lib/razorpay';
import { createClient } from '@supabase/supabase-js';
import { razorpayAmountPaise, stripeAmountCents, tierFromPlanName } from '@/lib/plans';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planName, billingCycle, currency = 'USD' } = body as {
      planName: string;
      billingCycle: 'monthly' | 'annual';
      currency?: 'USD' | 'INR';
    };

    if (planName === 'Free Plan') {
      return NextResponse.json({ error: 'Free plan does not require checkout' }, { status: 400 });
    }

    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: sign in to subscribe' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Invalid session' }, { status: 401 });
    }

    const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('your_stripe'));
    const razorpayConfigured = Boolean(
      process.env.RAZORPAY_KEY_ID &&
        process.env.RAZORPAY_KEY_SECRET &&
        !process.env.RAZORPAY_KEY_ID.includes('your_key')
    );

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, razorpay_customer_id')
      .eq('id', user.id)
      .single();

    const useRazorpay = currency === 'INR' || Boolean(profile?.razorpay_customer_id);

    if (useRazorpay) {
      if (!razorpayConfigured) {
        return NextResponse.json(
          {
            error:
              'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET, or choose USD to use Stripe.',
          },
          { status: 503 }
        );
      }

      const amount = razorpayAmountPaise(planName, billingCycle);
      if (!amount) {
        return NextResponse.json({ error: 'Invalid plan name' }, { status: 400 });
      }

      const order = await razorpay.orders.create({
        amount,
        currency: 'INR',
        receipt: `deal_safe_${user.id.slice(0, 8)}`,
        notes: { planName, userId: user.id, billingCycle, tier: tierFromPlanName(planName) },
      });

      return NextResponse.json({
        provider: 'razorpay',
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: process.env.RAZORPAY_KEY_ID,
      });
    }

    if (!stripeConfigured) {
      return NextResponse.json(
        {
          error:
            'Stripe is not configured. Add STRIPE_SECRET_KEY (and a webhook secret for live events) to .env. Razorpay can be used with INR once RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set.',
        },
        { status: 503 }
      );
    }

    const amount = stripeAmountCents(planName, billingCycle);
    if (!amount) {
      return NextResponse.json({ error: 'Invalid plan name' }, { status: 400 });
    }

    const appUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: profile?.stripe_customer_id || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `DealSafe AI - ${planName}`,
              description: `${billingCycle === 'annual' ? 'Annual' : 'Monthly'} billing subscription`,
            },
            recurring: {
              interval: billingCycle === 'annual' ? 'year' : 'month',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing`,
      metadata: { userId: user.id, planName, billingCycle },
    });

    return NextResponse.json({
      provider: 'stripe',
      url: session.url,
      sessionId: session.id,
    });
  } catch (error: any) {
    console.error('Create Order Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
