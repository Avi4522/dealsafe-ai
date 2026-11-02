'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import Logo from '@/components/Logo';
import { createBrowserSupabase } from '@/lib/supabase/browser';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const supabase = createBrowserSupabase();
      const { error: updateErr } = await supabase.auth.updateUser({
        password,
      });

      if (updateErr) {
        throw updateErr;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2500);
    } catch (err: any) {
      setError(err?.message || 'Failed to update password. Your reset session may have expired.');
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
          <Lock size={26} />
        </div>

        <div className="space-y-1.5">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1B3B]">
            Create new password
          </h1>
          <p className="text-[14px] text-[#64748B] leading-relaxed">
            Enter your new password below to secure your workspace.
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
                <p className="font-bold">Password updated successfully!</p>
                <p className="mt-0.5 text-emerald-700">
                  Redirecting to your workspace dashboard now…
                </p>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="inline-block w-full bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white font-semibold py-3.5 rounded-full text-sm"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                New password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="At least 8 characters"
                className="w-full border border-[#D6DEEE] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                Confirm new password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Re-enter your password"
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
                  <span>Updating password…</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
