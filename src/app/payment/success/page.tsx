'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import canvasConfetti from 'canvas-confetti';
import AppShell from '@/components/AppShell';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const triggerConfetti = () => {
      canvasConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1D4ED8', '#10B981', '#3B82F6'],
      });
    };

    const verifyPayment = async () => {
      if (sessionId) {
        try {
          const res = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId }),
          });
          const data = await res.json();
          if (data.success) {
            setVerified(true);
            triggerConfetti();
          }
        } catch (err) {
          console.error('Verification failed:', err);
        }
      } else {
        setVerified(true);
        triggerConfetti();
      }
    };

    verifyPayment();
  }, [sessionId]);

  return (
    <div className="max-w-lg mx-auto my-12 bg-white border border-[#EEF1F6] rounded-2xl p-8 shadow-xs text-center space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
        <CheckCircle2 size={36} />
      </div>

      <div className="space-y-1">
        <h1 className="font-serif text-2xl font-bold text-[#0B1B3B]">
          Payment Successful!
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B]">
          Your subscription has been activated. You now have access to higher audit limits and premium AI contract intelligence.
        </p>
      </div>

      <div className="bg-[#F8FAFC] border border-[#EEF1F6] rounded-xl p-4 text-xs text-[#0B1B3B] space-y-2 text-left">
        <div className="flex items-center gap-2 font-semibold">
          <ShieldCheck size={16} className="text-[#1D4ED8]" />
          <span>Membership Benefits Active</span>
        </div>
        <ul className="list-disc pl-4 text-[#64748B] space-y-1">
          <li>Expanded monthly contract audit quota</li>
          <li>Full risk assessment & clause rewrite access</li>
          <li>Interactive document comparison & drafting</li>
        </ul>
      </div>

      <div className="pt-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl transition-colors w-full justify-center"
        >
          <span>Go to Contract Workspace</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <AppShell title="Payment Confirmed">
      <main className="px-4 py-8">
        <Suspense fallback={<div className="text-center py-12 text-xs text-slate-500">Loading…</div>}>
          <PaymentSuccessContent />
        </Suspense>
      </main>
    </AppShell>
  );
}
