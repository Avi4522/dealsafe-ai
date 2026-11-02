'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Receipt,
  Download,
  Check,
  Zap,
  Lock,
  Loader2,
  X,
} from 'lucide-react';
import { PLANS, displayPrice, type BillingCycle, type Currency } from '@/lib/plans';

interface BillingData {
  tier: string;
  credits: number;
  used: number;
  remaining: number;
  profileCreated?: string;
  subscriptions: any[];
  transactions: Array<{
    id: string;
    date: string;
    amount: number;
    currency: string;
    status: string;
    method: string;
    invoiceUrl: string;
    planName: string;
  }>;
}

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<BillingData | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const loadBilling = async () => {
    try {
      const res = await fetch('/api/billing');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error('Failed to load billing', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBilling();
  }, []);

  const handlePlanAction = async (targetPlanId: string) => {
    setActionLoading(targetPlanId);
    setNotification(null);

    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change_plan',
          planId: targetPlanId,
          billingCycle,
        }),
      });

      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.error || 'Failed to update plan');

      setNotification({
        type: 'success',
        message: `Your workspace was successfully updated to ${targetPlanId.toUpperCase()}!`,
      });
      await loadBilling();
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Could not update subscription.',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelSubscription = async () => {
    setActionLoading('cancel');
    setNotification(null);

    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' }),
      });

      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.error || 'Cancellation failed');

      setNotification({
        type: 'success',
        message: 'Your subscription has been cancelled. Plan moved to Free tier.',
      });
      setShowCancelModal(false);
      await loadBilling();
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Could not cancel subscription.',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const currentTier = data?.tier || 'free';
  const planName = currentTier === 'enterprise' || currentTier === 'business'
    ? 'Business Plan'
    : currentTier === 'pro'
      ? 'Pro Plan'
      : 'Free Plan';

  const used = data?.used || 0;
  const credits = data?.credits || 3;
  const remaining = data?.remaining || 0;
  const usagePercent = Math.min(100, Math.round((used / credits) * 100));

  return (
    <AppShell title="Subscription & Billing">
      <main className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-7xl mx-auto">
        {/* Page Heading & Subtitle */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2458D3] bg-[#EAF1FF] px-2.5 py-0.5 rounded-full mb-2">
                <CreditCard size={13} />
                <span>Account & Plan Management</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#17243A]">
                Subscription & Billing
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                Manage your plan, payments, and subscription in one place.
              </p>
            </div>

            {/* Billing Cycle Switcher */}
            <div className="flex items-center bg-[#F4F7FC] p-1 rounded-xl border border-[#E2E8F0] self-start md:self-center">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-[#17243A] shadow-xs'
                    : 'text-[#64748B] hover:text-[#17243A]'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === 'annual'
                    ? 'bg-white text-[#17243A] shadow-xs'
                    : 'text-[#64748B] hover:text-[#17243A]'
                }`}
              >
                <span>Annual</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {notification && (
            <div
              className={`mt-4 p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                notification.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {notification.type === 'success' ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <AlertTriangle size={16} />
                )}
                <span>{notification.message}</span>
              </div>
              <button onClick={() => setNotification(null)} className="cursor-pointer">
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* SECTION A: CURRENT PLAN */}
        <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
            <div>
              <h2 className="text-base font-bold text-[#17243A]">Current Subscription Plan</h2>
              <p className="text-xs text-[#64748B]">Active quota, renewal details, and usage breakdown</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
            {/* Plan Card */}
            <div className="bg-[#F4F7FC] rounded-xl p-5 border border-[#E2E8F0] space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Active Tier
              </span>
              <p className="text-2xl font-black text-[#17243A]">{planName}</p>
              <p className="text-xs text-[#64748B] flex items-center gap-2">
                <Calendar size={14} />
                <span>
                  Billed {billingCycle === 'annual' ? 'Annually' : 'Monthly'} &bull; Renews next cycle
                </span>
              </p>
            </div>

            {/* Quota Usage */}
            <div className="bg-[#F4F7FC] rounded-xl p-5 border border-[#E2E8F0] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Monthly Analyses Usage
                </span>
                <span className="font-mono font-bold text-sm text-[#17243A]">
                  {used} / {credits} Used
                </span>
              </div>
              <div className="h-2 rounded-full bg-[#E2E8F0] overflow-hidden mt-1">
                <div
                  className="h-2 rounded-full bg-[#2458D3] transition-all duration-500"
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
              <p className="text-[11px] text-[#64748B] pt-1">
                {remaining} analysis credits remaining this month.
              </p>
            </div>

            {/* Actions */}
            <div className="bg-[#F4F7FC] rounded-xl p-5 border border-[#E2E8F0] flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Manage Subscription
                </span>
                <p className="text-xs text-[#64748B] mt-1">
                  Change plans anytime or manage recurring payment methods.
                </p>
              </div>
              {currentTier !== 'free' && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="mt-3 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline text-left cursor-pointer"
                >
                  Cancel subscription &rarr;
                </button>
              )}
            </div>
          </div>
        </section>

        {/* SECTION B: AVAILABLE PLANS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#17243A]">Available Pricing Plans</h2>
              <p className="text-xs text-[#64748B]">Scale your contract analysis allowance as your business grows</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map((plan) => {
              const isCurrent =
                (currentTier === 'free' && plan.id === 'free') ||
                (currentTier === 'pro' && plan.id === 'pro') ||
                ((currentTier === 'enterprise' || currentTier === 'business') && plan.id === 'business');

              const priceObj = displayPrice(plan, billingCycle, currency);

              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                    isCurrent
                      ? 'border-[#2458D3] shadow-md ring-2 ring-[#2458D3]/15'
                      : 'border-[#E2E8F0] shadow-xs hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-[#17243A]">{plan.planName}</h3>
                      {isCurrent && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#EAF1FF] text-[#2458D3] border border-[#2458D3]/30">
                          Current Plan
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-[#17243A]">
                        {priceObj.symbol}
                        {priceObj.value}
                      </span>
                      <span className="text-xs text-[#64748B]">{priceObj.suffix}</span>
                    </div>

                    <p className="text-xs text-[#64748B] min-h-[32px]">{plan.tagline}</p>

                    <div className="py-2 border-t border-b border-[#F1F5F9] text-xs font-semibold text-[#17243A] flex items-center gap-1.5">
                      <Zap size={14} className="text-[#2458D3]" />
                      <span>
                        {plan.analysesPerMonth === 'limited'
                          ? '3 analyses to start'
                          : `${plan.analysesPerMonth} full monthly analyses`}
                      </span>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-2 text-xs text-[#17243A]">
                      {plan.included.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check size={14} className="text-[#059669] shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="pt-6">
                    {isCurrent ? (
                      <button
                        disabled
                        className="w-full py-2.5 rounded-xl bg-[#F4F7FC] text-[#64748B] font-semibold text-xs border border-[#E2E8F0] cursor-not-allowed"
                      >
                        Active Plan
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePlanAction(plan.id)}
                        disabled={actionLoading === plan.id}
                        className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                          plan.highlighted
                            ? 'bg-[#2458D3] hover:bg-[#193F9B] text-white shadow-xs'
                            : 'bg-[#111C2E] hover:bg-[#263A59] text-white'
                        }`}
                      >
                        {actionLoading === plan.id ? (
                          <>
                            <Loader2 size={13} className="animate-spin" />
                            <span>Updating…</span>
                          </>
                        ) : (
                          <>
                            <span>
                              {plan.id === 'free' ? 'Downgrade to Free' : `Upgrade to ${plan.displayName}`}
                            </span>
                            <ArrowRight size={13} />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION C & D: PAYMENT HISTORY & METHODS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* SECTION C: Payment History */}
          <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div>
                <h3 className="font-bold text-base text-[#17243A]">Payment History</h3>
                <p className="text-xs text-[#64748B]">Invoices and receipts for subscription charges</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2458D3] flex items-center justify-center">
                <Receipt size={16} />
              </div>
            </div>

            {(!data?.transactions || data.transactions.length === 0) ? (
              <div className="text-center py-10 text-xs text-[#64748B] space-y-2">
                <p>No transactions recorded yet.</p>
                <p className="text-[11px] text-[#94A3B8]">
                  Charges will appear here after upgrading or renewing your plan.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[500px]">
                  <thead className="text-[11px] uppercase tracking-wider text-[#94A3B8] border-b border-[#F1F5F9]">
                    <tr>
                      <th className="pb-2.5 font-semibold">Transaction ID</th>
                      <th className="pb-2.5 font-semibold">Plan</th>
                      <th className="pb-2.5 font-semibold">Date</th>
                      <th className="pb-2.5 font-semibold">Amount</th>
                      <th className="pb-2.5 font-semibold">Status</th>
                      <th className="pb-2.5 font-semibold text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F8FAFC]">
                    {data.transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#F8FAFC]">
                        <td className="py-3 font-mono text-[11px] text-[#17243A]">{tx.id}</td>
                        <td className="py-3 font-semibold text-[#17243A]">{tx.planName}</td>
                        <td className="py-3 text-[#64748B]">
                          {new Date(tx.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 font-bold text-[#17243A]">${tx.amount}.00</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() =>
                              alert(`Receipt ${tx.id} for $${tx.amount} downloaded successfully.`)
                            }
                            className="inline-flex items-center gap-1 text-[11px] text-[#2458D3] font-semibold hover:underline cursor-pointer"
                          >
                            <Download size={12} />
                            <span>Invoice</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* SECTION D: Payment Methods */}
          <div className="lg:col-span-4 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                <div>
                  <h3 className="font-bold text-base text-[#17243A]">Payment Methods</h3>
                  <p className="text-xs text-[#64748B]">Active payment gateway</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck size={16} />
                </div>
              </div>

              <div className="space-y-3 pt-3">
                <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#2458D3] text-white flex items-center justify-center font-bold text-xs">
                    CARD
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#17243A]">Stripe & Razorpay Secure</p>
                    <p className="text-[11px] text-[#64748B]">Global cards, UPI, & net banking</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-[#059669] font-medium pt-1">
                  <Lock size={12} />
                  <span>256-bit TLS encrypted bank-grade payments</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F1F5F9]">
              <p className="text-[11px] text-[#94A3B8]">
                Need tax invoices with GSTIN or VAT? Email support@dealsafe.ai with your business ID.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setShowCancelModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2E8F0] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                <AlertTriangle size={20} />
              </div>
              <h3 className="font-bold text-lg text-[#17243A]">Cancel Subscription?</h3>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Are you sure you want to cancel? Your workspace will return to the Free tier (3 analyses/month). You will lose unlimited vault history and advanced Copilot rewriting.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#17243A] hover:bg-[#F4F7FC] rounded-xl cursor-pointer"
              >
                Keep My Plan
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={actionLoading === 'cancel'}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                {actionLoading === 'cancel' ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Cancelling…</span>
                  </>
                ) : (
                  <span>Confirm Cancellation</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

