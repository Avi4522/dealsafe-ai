'use client';

import { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import Logo from '@/components/Logo';

function VerifiedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextTarget = searchParams.get('next') || '/dashboard';

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white border border-[#E6EAF2] p-8 sm:p-10 rounded-[28px] shadow-[0_20px_60px_rgba(15,23,42,0.08)] space-y-6 text-center">
        {/* Logo */}
        <div className="flex justify-center">
          <Logo />
        </div>

        {/* Celebration icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-xs">
          <CheckCircle size={32} className="animate-bounce" />
        </div>

        {/* Copy */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={12} />
            Account Activated
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1B3B]">
            You&apos;re all set!
          </h1>
          <p className="text-[15px] text-[#475569] leading-relaxed">
            Your workspace is ready.
          </p>
        </div>

        {/* Direct Action */}
        <div className="pt-2">
          <Link
            href={nextTarget}
            className="w-full bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white font-bold py-4 px-6 rounded-full text-[15px] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <span>Continue to Dashboard</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <p className="text-xs text-[#94A3B8]">
          3 free contract analyses are ready in your account.
        </p>
      </div>
    </div>
  );
}

export default function VerifiedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen hero-gradient" />}>
      <VerifiedContent />
    </Suspense>
  );
}

