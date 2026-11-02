'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { PLANS, displayPrice, type BillingCycle, type Currency } from '@/lib/plans';

export default function PricingPreview() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [currency, setCurrency] = useState<Currency>('USD');

  return (
    <section id="pricing" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-[#EEF2FF] border border-[#DBEAFE] px-4 py-1.5 rounded-full text-[12px] font-semibold text-[#1D4ED8] mb-4">
            SIMPLE PRICING
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0B1B3B]">
            Find a Plan That Works for You.
          </h2>
          <p className="mt-4 text-[16px] sm:text-[18px] text-[#4B5563] leading-relaxed">
            Start understanding your contracts today. Choose a plan that fits the way you work.
          </p>

          {/* Controls: Billing Cycle + Currency Switchers */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Monthly / Annual Toggle */}
            <div className="inline-flex items-center p-1 bg-[#F1F5F9] rounded-full border border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all ${billingCycle === 'monthly'
                    ? 'bg-white text-[#0B1B3B] shadow-sm'
                    : 'text-[#64748B] hover:text-[#0B1B3B]'
                  }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all ${billingCycle === 'annual'
                    ? 'bg-white text-[#0B1B3B] shadow-sm'
                    : 'text-[#64748B] hover:text-[#0B1B3B]'
                  }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>

            {/* Currency Selector */}
            <div className="inline-flex items-center p-1 bg-[#F1F5F9] rounded-full border border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all ${currency === 'USD'
                    ? 'bg-white text-[#0B1B3B] shadow-sm'
                    : 'text-[#64748B] hover:text-[#0B1B3B]'
                  }`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all ${currency === 'INR'
                    ? 'bg-white text-[#0B1B3B] shadow-sm'
                    : 'text-[#64748B] hover:text-[#0B1B3B]'
                  }`}
              >
                INR (₹)
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid (Free, Pro, Business) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan) => {
            const price = displayPrice(plan, billingCycle, currency);
            const isHighlighted = plan.highlighted;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${isHighlighted
                    ? 'bg-gradient-to-b from-[#FAFBFD] to-white border-2 border-[#1D4ED8] shadow-[0_20px_50px_rgba(29,78,216,0.12)] scale-[1.02] lg:-translate-y-2'
                    : 'bg-white border border-[#E2E8F0] shadow-sm hover:shadow-lg'
                  }`}
              >
                {/* Popular Pill Badge */}
                {isHighlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles size={12} />
                    Recommended For Growing Teams
                  </div>
                )}

                <div>
                  {/* Plan Name & Tagline */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold text-[#0B1B3B]">{plan.displayName}</h3>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] bg-[#F1F5F9] px-2.5 py-0.5 rounded-md">
                      {plan.analysesPerMonth === 'limited' ? '3 Trial Audits' : `${plan.analysesPerMonth} Audits/Month`}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#64748B] min-h-[38px] leading-relaxed mb-6">
                    {plan.tagline}
                  </p>

                  {/* Price Block */}
                  <div className="flex items-baseline gap-1 pb-6 mb-6 border-b border-[#F1F5F9]">
                    <span className="text-4xl sm:text-5xl font-serif font-black text-[#0B1B3B]">
                      {price.symbol}{price.value}
                    </span>
                    <span className="text-[13px] text-[#64748B] font-medium">{price.suffix}</span>
                    {billingCycle === 'annual' && price.value > 0 && (
                      <span className="ml-2 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        billed annually
                      </span>
                    )}
                  </div>

                  {/* Included features list */}
                  <div className="space-y-3 mb-8">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                      Plan Capabilities:
                    </p>
                    {plan.included.map((feature) => (
                      <div key={feature} className="flex items-start gap-2.5 text-[13px] text-[#334155]">
                        <Check size={16} className="text-[#1D4ED8] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan Action CTA */}
                <div>
                  <Link
                    href={plan.id === 'free' ? '/auth/login?mode=signup' : '/pricing'}
                    className={`w-full py-3.5 px-6 rounded-full text-[14px] font-semibold text-center flex items-center justify-center gap-2 transition-all ${isHighlighted
                        ? 'bg-[#1D4ED8] hover:bg-[#1E3A8A] text-white shadow-md hover:shadow-lg'
                        : 'bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0B1B3B]'
                      }`}
                  >
                    <span>{plan.id === 'free' ? 'Start Free Analysis' : `Get Started with ${plan.displayName}`}</span>
                    <ArrowRight size={14} />
                  </Link>
                  <p className="text-center text-[11px] text-[#94A3B8] mt-2.5">
                    {plan.id === 'free' ? 'No credit card required' : 'Cancel or change plans anytime'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment Terms & Cancellation Disclosure */}
        <div className="mt-12 p-6 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-[#64748B]">
          <div>
            <p className="font-semibold text-[#0B1B3B]">
              Flexible Billing &amp; Easy Cancellation
            </p>
            <p className="mt-0.5">
              Secure checkout with Stripe or Razorpay. Upgrade, downgrade, or cancel your subscription at any time from your account settings with zero cancellation penalties.
            </p>
          </div>
          <Link
            href="/pricing"
            className="shrink-0 font-bold text-[#1D4ED8] hover:underline"
          >
            Compare All Features →
          </Link>
        </div>
      </div>
    </section>
  );
}
