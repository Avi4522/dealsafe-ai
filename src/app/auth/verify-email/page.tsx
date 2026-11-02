'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Mail, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';
import { createBrowserSupabase } from '@/lib/supabase/browser';

const COOLDOWN_SECONDS = 60;

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const errorParam = searchParams.get('error');

  const [email, setEmail] = useState(initialEmail);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Check if Supabase passed tokens in the URL hash fragment (#access_token=...&refresh_token=...)
    if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      if (accessToken && refreshToken) {
        setSuccessMsg('Email verified! Redirecting to workspace…');
        const supabase = createBrowserSupabase();
        supabase.auth
          .setSession({ access_token: accessToken, refresh_token: refreshToken })
          .then(({ data }) => {
            if (data.session) {
              window.location.href = '/auth/verified?next=/dashboard';
            }
          });
        return;
      }
    }

    if (errorParam === 'expired') {
      setErrorMsg('Your verification link has expired or has already been used. Please request a new link below.');
    } else if (errorParam === 'auth_failed') {
      setErrorMsg('Verification failed. Please check that you clicked the newest link in your inbox.');
    } else if (errorParam === 'missing_token') {
      setErrorMsg('Verification link incomplete. You can click "Verify & Activate Account Instantly" below.');
    }
  }, [errorParam]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((c) => c - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleResend = async () => {
    if (!email) {
      setErrorMsg('Please specify an email address to send the verification link.');
      setIsEditingEmail(true);
      return;
    }
    if (cooldown > 0) return;

    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const supabase = createBrowserSupabase();
      const redirectUrl = `${window.location.origin}/auth/callback?next=/dashboard&email=${encodeURIComponent(email)}`;

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes('rate limit')) {
          setErrorMsg('Email rate limit reached. Please wait a minute before requesting another link.');
          setCooldown(COOLDOWN_SECONDS);
        } else {
          setErrorMsg(error.message);
        }
        return;
      }

      setSuccessMsg('A fresh verification link has been sent to your email. Please check your inbox and spam folder.');
      setCooldown(COOLDOWN_SECONDS);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to resend verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInstantConfirm = async () => {
    if (!email) return;
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/instant-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Verification failed.');
      }
      setSuccessMsg('Your email is now verified! Redirecting to sign in…');
      setTimeout(() => {
        window.location.href = `/auth/login?email=${encodeURIComponent(email)}`;
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to verify account.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmailInput)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setEmail(newEmailInput);
    setIsEditingEmail(false);
    setErrorMsg('');
    setSuccessMsg('Email updated. You can now request a verification link for this address.');
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white border border-[#E6EAF2] p-8 sm:p-10 rounded-[28px] shadow-[0_20px_60px_rgba(15,23,42,0.08)] space-y-6 text-center">
        {/* Logo */}
        <div className="flex justify-center">
          <Logo />
        </div>

        {/* Envelope Icon with glow */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-[#EEF2FF] border border-[#DBEAFE] text-[#1D4ED8] flex items-center justify-center shadow-xs">
          <Mail size={30} className="animate-pulse" />
        </div>

        {/* Copy */}
        <div className="space-y-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1B3B]">
            One last step!
          </h1>
          <p className="text-[14px] text-[#475569] leading-relaxed">
            Verify your email to get started with DealSafe AI. We&apos;ve sent a verification link to:
          </p>
          <div className="inline-block bg-[#F8FAFC] border border-[#E2E8F0] px-3.5 py-1.5 rounded-full text-[13px] font-semibold text-[#0B1B3B]">
            {email || 'your email'}
          </div>
          <p className="text-[13px] text-[#64748B] pt-1">
            Check your inbox and verify your email to activate your account.
          </p>
        </div>

        {/* Feedback alerts */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl text-[13px] text-rose-700 flex items-start gap-2 text-left">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-[13px] text-emerald-700 flex items-start gap-2 text-left">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Edit Email Form Modal / Inline */}
        {isEditingEmail ? (
          <form onSubmit={handleSaveEmail} className="space-y-3 pt-2 text-left">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#475569]">
              Change Email Address
            </label>
            <input
              type="email"
              value={newEmailInput}
              onChange={(e) => setNewEmailInput(e.target.value)}
              placeholder="you@company.com"
              required
              className="w-full border border-[#D6DEEE] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-[#0B1B3B] hover:bg-[#1E3A8A] text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
              >
                Update Email
              </button>
              <button
                type="button"
                onClick={() => setIsEditingEmail(false)}
                className="px-3 py-2.5 border border-[#D6DEEE] text-[#475569] text-xs font-semibold rounded-xl hover:bg-[#F8FAFC]"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleInstantConfirm}
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-full text-sm transition-all shadow-sm hover:shadow flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={16} />
            <span>Verify &amp; Activate Account Instantly</span>
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={loading || cooldown > 0}
            className="w-full bg-[#1E3A8A] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-semibold py-3.5 rounded-full text-sm transition-all shadow-sm hover:shadow flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>Sending email…</span>
              </>
            ) : cooldown > 0 ? (
              <span>Resend available in {cooldown}s</span>
            ) : (
              <>
                <RefreshCw size={15} />
                <span>Resend verification email</span>
              </>
            )}
          </button>

          {!isEditingEmail && (
            <button
              type="button"
              onClick={() => {
                setNewEmailInput(email);
                setIsEditingEmail(true);
              }}
              className="w-full text-xs font-semibold text-[#1D4ED8] hover:underline py-1"
            >
              Change email address
            </button>
          )}

          <div className="pt-4 border-t border-[#F1F5F9]">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#0B1B3B] transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen hero-gradient" />}>
      <VerifyEmailContent />
    </Suspense>
  );
}

