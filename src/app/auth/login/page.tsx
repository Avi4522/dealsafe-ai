'use client';

import { FormEvent, useMemo, useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, User, AlertTriangle, CheckCircle2, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';
import Logo from '@/components/Logo';
import { createBrowserSupabase } from '@/lib/supabase/browser';

const RATE_LIMIT_MS = 60_000;

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get('redirect') || '/dashboard';
  const initialMode = params.get('mode') === 'signup' ? 'signup' : 'login';

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [needsConfirmationEmail, setNeedsConfirmationEmail] = useState<string | null>(null);

  const configured = useMemo(
    () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    []
  );

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = createBrowserSupabase();
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          window.location.href = redirect;
        }
      } catch {
        // ignore
      }
    };
    checkSession();
  }, [redirect]);

  const syncProfile = async (userId: string, userEmail: string, name?: string) => {
    try {
      await fetch('/api/auth/ensure-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email: userEmail, fullName: name }),
      });
    } catch {
      // background sync
    }
  };

  const handleInstantVerifyAndLogin = async (targetEmail: string) => {
    if (!targetEmail) return;
    setLoading(true);
    setError('');
    setInfo('');

    try {
      const res = await fetch('/api/auth/instant-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to verify account.');
      }

      setNeedsConfirmationEmail(null);

      // If user has already entered their password, sign in right away!
      if (password && password.length >= 8) {
        setInfo('Account verified! Signing you in…');
        const supabase = createBrowserSupabase();
        const { data, error: signInErr } = await supabase.auth.signInWithPassword({
          email: targetEmail,
          password,
        });

        if (signInErr) {
          setInfo('Account verified! Please click "Sign In" with your password.');
          return;
        }

        if (data.user) {
          await syncProfile(
            data.user.id,
            data.user.email || targetEmail,
            (data.user.user_metadata?.full_name as string) || fullName
          );
          window.location.href = redirect;
          return;
        }
      }

      setInfo('Account verified! You can now click "Sign In" below.');
    } catch (err: any) {
      setError(err?.message || 'Verification error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async (targetEmail: string) => {
    if (!targetEmail || cooldown > 0) return;
    setResending(true);
    setError('');
    setInfo('');

    try {
      const supabase = createBrowserSupabase();
      const redirectUrl = `${window.location.origin}/auth/callback?next=/dashboard&email=${encodeURIComponent(targetEmail)}`;

      const { error: resendErr } = await supabase.auth.resend({
        type: 'signup',
        email: targetEmail,
        options: { emailRedirectTo: redirectUrl },
      });

      if (resendErr) {
        throw resendErr;
      }

      setInfo(`Fresh verification email sent to ${targetEmail}. Please check your inbox and spam folder.`);
      setCooldown(RATE_LIMIT_MS / 1000);
      const start = Date.now();
      const timer = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((RATE_LIMIT_MS - (Date.now() - start)) / 1000));
        setCooldown(remaining);
        if (remaining <= 0) clearInterval(timer);
      }, 1000);
    } catch (err: any) {
      setError(err?.message || 'Failed to resend confirmation email. Please wait a moment.');
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setNeedsConfirmationEmail(null);

    if (!configured) {
      setError(
        'Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment.'
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid work email address.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (cooldown > 0) {
      setError(`Please wait ${cooldown}s before trying again.`);
      return;
    }

    setLoading(true);
    try {
      const supabase = createBrowserSupabase();

      if (mode === 'signup') {
        const redirectUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}&email=${encodeURIComponent(email)}`;
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: redirectUrl,
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        // If session was returned immediately (auto-confirm enabled in Supabase)
        if (data.session?.user) {
          await syncProfile(data.session.user.id, data.session.user.email || email, fullName);
          window.location.href = redirect;
          return;
        }

        // Email confirmation is required by default in Supabase:
        // Attempt instant auto-verification so the account is active immediately
        try {
          const autoConfirmRes = await fetch('/api/auth/instant-confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });

          if (autoConfirmRes.ok) {
            const { data: autoSignIn, error: autoSignErr } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (!autoSignErr && autoSignIn.user) {
              await syncProfile(autoSignIn.user.id, email, fullName);
              window.location.href = redirect;
              return;
            }
          }
        } catch {
          // fallback to verify-email route
        }

        // Fallback to email verification screen
        router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
        return;
      }

      // LOGIN MODE
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      if (!data.user) {
        throw new Error('Sign in failed. Please try again.');
      }

      await syncProfile(
        data.user.id,
        data.user.email || email,
        (data.user.user_metadata?.full_name as string) || fullName
      );

      // Full browser navigation ensures all refreshed session cookies are dispatched
      window.location.href = redirect;
    } catch (err: any) {
      const message = err?.message || 'Authentication failed';
      const lower = message.toLowerCase();

      if (lower.includes('invalid login') || lower.includes('invalid credentials')) {
        setError('Incorrect email or password. Please verify your credentials or reset your password.');
      } else if (lower.includes('email not confirmed')) {
        setNeedsConfirmationEmail(email);
        setError('Confirm your email before signing in. Check your inbox for the DealSafe AI link.');
      } else if (lower.includes('already registered') || lower.includes('user already exists')) {
        setError('An account with this email already exists. Please sign in or reset your password.');
      } else if (lower.includes('rate limit') || lower.includes('too many requests')) {
        setError('Too many attempts. Please wait 60 seconds before trying again.');
        setCooldown(RATE_LIMIT_MS / 1000);
        const start = Date.now();
        const timer = setInterval(() => {
          const remaining = Math.max(0, Math.ceil((RATE_LIMIT_MS - (Date.now() - start)) / 1000));
          setCooldown(remaining);
          if (remaining <= 0) clearInterval(timer);
        }, 1000);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white border border-[#E6EAF2] p-8 sm:p-10 rounded-[28px] shadow-[0_20px_60px_rgba(15,23,42,0.08)] space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <Logo />
          </div>

          {mode === 'login' ? (
            <>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1B3B]">
                Welcome back.
              </h1>
              <p className="text-[14px] font-semibold text-[#1D4ED8]">
                Your next deal deserves a closer look.
              </p>
              <p className="text-[13px] text-[#64748B]">
                Sign in to review your contracts and manage your workspace.
              </p>
            </>
          ) : (
            <>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1B3B]">
                Make smarter decisions from day one.
              </h1>
              <p className="text-[13px] text-[#64748B] pt-1">
                Create your account and start understanding your agreements with DealSafe AI.
              </p>
            </>
          )}
        </div>

        {/* Mode Selector Pill */}
        <div className="grid grid-cols-2 bg-[#F1F5F9] p-1 rounded-full border border-[#E2E8F0]">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
              setInfo('');
              setNeedsConfirmationEmail(null);
            }}
            className={`py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${mode === 'login' ? 'bg-[#0B1B3B] text-white shadow-xs' : 'text-[#64748B] hover:text-[#0B1B3B]'
              }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError('');
              setInfo('');
              setNeedsConfirmationEmail(null);
            }}
            className={`py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${mode === 'signup' ? 'bg-[#0B1B3B] text-white shadow-xs' : 'text-[#64748B] hover:text-[#0B1B3B]'
              }`}
          >
            Create Account
          </button>
        </div>

        {/* Feedback Notices */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-[13px] text-rose-700 space-y-2">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>

            {/* If Email Not Confirmed, provide instant action right inside the error banner */}
            {needsConfirmationEmail && (
              <div className="pt-2 border-t border-rose-200/60 space-y-2">
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleInstantVerifyAndLogin(needsConfirmationEmail)}
                    disabled={loading}
                    className="w-full sm:w-auto text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 px-3.5 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <CheckCircle2 size={13} />
                    <span>Verify &amp; Sign In Now</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleResendConfirmation(needsConfirmationEmail)}
                    disabled={resending || cooldown > 0}
                    className="w-full sm:w-auto text-xs font-semibold text-rose-800 bg-rose-100 hover:bg-rose-200 disabled:opacity-60 px-3 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors"
                  >
                    {resending ? (
                      <>
                        <RefreshCw size={12} className="animate-spin" />
                        <span>Sending…</span>
                      </>
                    ) : cooldown > 0 ? (
                      <span>Wait {cooldown}s</span>
                    ) : (
                      <span>Resend Email Link</span>
                    )}
                  </button>
                </div>

                <div className="text-left">
                  <Link
                    href={`/auth/verify-email?email=${encodeURIComponent(needsConfirmationEmail)}`}
                    className="text-xs font-semibold text-rose-800 hover:underline inline-block"
                  >
                    Open email verification screen →
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {info && (
          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-[13px] text-emerald-700 flex items-start gap-2">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <span>{info}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                Full name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Sarah Jenkins"
                  required
                  className="w-full border border-[#D6DEEE] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
              {mode === 'signup' ? 'Work email' : 'Email address'}
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

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569]">
                Password
              </label>
              {mode === 'login' && (
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-semibold text-[#1D4ED8] hover:underline"
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              placeholder="At least 8 characters"
              className="w-full border border-[#D6DEEE] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30"
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                Confirm password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                className="w-full border border-[#D6DEEE] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading || cooldown > 0}
            className="w-full bg-[#1E3A8A] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-bold py-3.5 rounded-full text-sm transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>Please wait…</span>
              </>
            ) : cooldown > 0 ? (
              <span>Wait {cooldown}s</span>
            ) : mode === 'login' ? (
              <span>Sign In</span>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Footer Toggle Links */}
        <div className="pt-2 text-center text-xs sm:text-[13px] text-[#64748B]">
          {mode === 'login' ? (
            <p>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError('');
                  setInfo('');
                  setNeedsConfirmationEmail(null);
                }}
                className="font-bold text-[#1D4ED8] hover:underline"
              >
                Create one.
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                  setInfo('');
                  setNeedsConfirmationEmail(null);
                }}
                className="font-bold text-[#1D4ED8] hover:underline"
              >
                Sign in.
              </button>
            </p>
          )}

          <div className="mt-4 pt-4 border-t border-[#F1F5F9]">
            <Link href="/" className="font-semibold text-[#64748B] hover:text-[#0B1B3B]">
              ← Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen hero-gradient" />}>
      <LoginForm />
    </Suspense>
  );
}
