'use client';

import { useState } from 'react';
import Link from 'next/link';
import { KeyRound, CheckCircle2, AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';
import Logo from '@/components/Logo';
import { createBrowserSupabase } from '@/lib/supabase/browser';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const supabase = createBrowserSupabase();
      const redirectUrl = `${window.location.origin}/auth/callback?next=/auth/reset-password`;

      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (resetErr) {
        throw resetErr;
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Could not send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white border border-[#E6EAF2] p-8 sm:p-10 rounded-[28px] shadow-[0_20px_60px_rgba(15,23,42,0.08)] space-y-6 text-center">
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="mx-auto w-14 h-14 rounded-2xl bg-[#EEF2FF] border border-[#DBEAFE] text-[#1D4ED8] flex items-center justify-center">
          <KeyRound size={26} />
        </div>

        <div className="space-y-1.5">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1B3B]">
            Forgot your password?
          </h1>
          <p className="text-[14px] text-[#64748B] leading-relaxed">
            No worries. Let&apos;s get you back into your workspace.
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl text-[13px] text-rose-700 flex items-start gap-2 text-left">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-[13px] text-emerald-800 flex items-start gap-2.5 text-left">
              <CheckCircle2 size={18} className="shrink-0 text-emerald-600 mt-0.5" />
              <div>
                <p className="font-bold">Reset link sent!</p>
                <p className="mt-0.5 text-emerald-700">
                  We&apos;ve emailed password reset instructions to <strong>{email}</strong>. Check your inbox and spam folder.
                </p>
              </div>
            </div>

            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1D4ED8] hover:underline"
            >
              <ArrowLeft size={14} />
              <span>Return to Sign In</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@company.com"
                className="w-full border border-[#D6DEEE] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1E3A8A] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-semibold py-3.5 rounded-full text-sm transition-all shadow-sm hover:shadow flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>Sending reset link…</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>

            <div className="pt-2 text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#0B1B3B] transition-colors"
              >
                <ArrowLeft size={13} />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

