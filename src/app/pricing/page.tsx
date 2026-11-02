'use client';

import { useState } from 'react';
import Script from 'next/script';
import { Check, Minus } from 'lucide-react';
import MarketingNav from '@/components/marketing/MarketingNav';
import Footer from '@/components/Footer';
import { createBrowserSupabase } from '@/lib/supabase/browser';
import {
  PLANS,
  displayPrice,
  type BillingCycle,
  type Currency,
} from '@/lib/plans';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const handleSelect = async (planName: string, planId: string) => {
    setMessage('');
    if (planId === 'free') {
      window.location.href = '/auth/login?mode=signup&redirect=/dashboard';
      return;
    }

    setLoadingPlan(planId);
    try {
      const supabase = createBrowserSupabase();
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) {
        window.location.href = `/auth/login?redirect=/pricing`;
        return;
      }

      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planName, billingCycle, currency }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not start checkout');
      }

      if (data.provider === 'stripe' && data.url) {
        window.location.href = data.url;
        return;
      }

      if (data.provider === 'razorpay') {
        if (!window.Razorpay) {
          throw new Error('Razorpay checkout failed to load. Check RAZORPAY_KEY_ID.');
        }
        const razorpay = new window.Razorpay({
          key: data.key_id,
          amount: data.amount,
          currency: data.currency,
          name: 'DealSafe AI',
          description: planName,
          order_id: data.orderId,
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                planName,
              }),
            });
            window.location.href = '/payment/success';
          },
        });
        razorpay.open();
        return;
      }

      throw new Error('Checkout is not configured for this plan.');
    } catch (err: any) {
      setMessage(err.message || 'Checkout error. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen pricing-gradient text-[#0B1B3B]">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <MarketingNav />

      <main className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 pb-24">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#EEF2FF] border border-[#DBEAFE] px-4 py-1.5 rounded-full text-[12px] font-semibold text-[#1D4ED8] mb-4">
            SIMPLE PRICING
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#0B1B3B]">
            Find a Plan That Works for You.
          </h1>
          <p className="mt-4 text-[16px] text-[#64748B] leading-relaxed">
            Start understanding your contracts today. Choose a plan that fits the way you work.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="inline-flex items-center gap-3 bg-white/80 border border-[#E6EAF2] rounded-full px-4 py-2 shadow-sm">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-[#0B1B3B]' : 'text-[#9CA3AF]'}`}>
                Monthly
              </span>
              <button
                type="button"
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className="w-12 h-7 rounded-full bg-[#0B1B3B] relative"
                aria-label="Toggle annual billing"
              >
                <span
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                    billingCycle === 'annual' ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-[#0B1B3B]' : 'text-[#9CA3AF]'}`}>
                Annually
              </span>
            </div>

            <div className="inline-flex bg-white border border-[#E6EAF2] rounded-full p-1">
              {(['USD', 'INR'] as Currency[]).map((code) => (
                <button
                  key={code}
                  onClick={() => setCurrency(code)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                    currency === code ? 'bg-[#0B1B3B] text-white' : 'text-[#6B7280]'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
          {billingCycle === 'annual' && (
            <p className="mt-3 text-xs text-[#1D4ED8] font-medium">Annual billing shown as a monthly equivalent (20% off).</p>
          )}
        </div>

        {message && (
          <p className="max-w-xl mx-auto mt-6 text-center text-sm text-rose-600 bg-white/80 border border-rose-100 rounded-xl px-4 py-3">
            {message}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12 items-stretch">
          {PLANS.map((plan) => {
            const price = displayPrice(plan, billingCycle, currency);
            const highlighted = plan.highlighted;
            return (
              <div
                key={plan.id}
                className={`rounded-[28px] p-8 flex flex-col shadow-sm hover:-translate-y-1 hover:shadow-hover transition-all ${
                  highlighted
                    ? 'bg-[#0A1A6B] text-white md:-translate-y-3 md:py-10'
                    : 'bg-white border border-[#E6EAF2] text-[#0B1B3B]'
                }`}
              >
                <div className="text-center">
                  <h3 className="text-xl font-bold">{plan.displayName}</h3>
                  <p className={`mt-2 text-sm min-h-[48px] ${highlighted ? 'text-blue-100' : 'text-[#6B7280]'}`}>
                    {plan.tagline}
                  </p>
                  <div className="mt-5 flex items-end justify-center">
                    <span className="text-5xl font-extrabold tracking-tight">
                      {price.symbol}
                      {price.value}
                    </span>
                    <span className={`mb-1 ml-1 text-sm ${highlighted ? 'text-blue-200' : 'text-[#6B7280]'}`}>
                      {price.suffix}
                    </span>
                  </div>
                  <button
                    onClick={() => handleSelect(plan.planName, plan.id)}
                    disabled={loadingPlan !== null}
                    className={`mt-6 w-full py-3 rounded-xl text-sm font-semibold transition-colors ${
                      highlighted
                        ? 'bg-white text-[#0A1A6B] hover:bg-blue-50'
                        : 'bg-[#0A1A6B] text-white hover:bg-[#12207A]'
                    }`}
                  >
                    {loadingPlan === plan.id ? 'Starting checkout…' : 'Select Plan'}
                  </button>
                </div>

                <ul className={`mt-8 pt-6 border-t space-y-3 text-sm ${highlighted ? 'border-white/15' : 'border-[#EEF1F6]'}`}>
                  {plan.included.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          highlighted ? 'bg-white/15 text-emerald-300' : 'bg-[#ECFDF5] text-emerald-600'
                        }`}
                      >
                        <Check size={12} />
                      </span>
                      {item}
                    </li>
                  ))}
                  {plan.excluded.map((item) => (
                    <li key={item} className={`flex items-start gap-3 ${highlighted ? 'text-white/40' : 'text-[#9CA3AF]'}`}>
                      <span className="mt-0.5 w-5 h-5 rounded-full bg-[#F3F4F6] text-[#9CA3AF] flex items-center justify-center shrink-0">
                        <Minus size={12} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
