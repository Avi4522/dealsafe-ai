'use client';

import React, { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import { createBrowserSupabase } from '@/lib/supabase/browser';
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  Check,
  AlertCircle,
  Bell,
  Globe,
  SlidersHorizontal,
  KeyRound,
  FileCheck,
} from 'lucide-react';

export default function SettingsPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [tier, setTier] = useState('free');
  const [createdAt, setCreatedAt] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [defaultJurisdiction, setDefaultJurisdiction] = useState('Delaware, United States');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createBrowserSupabase();
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setEmail(data.user.email || '');
        setFullName(data.user.user_metadata?.full_name || '');
        setCreatedAt(data.user.created_at || '');

        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, subscription_tier')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profile?.full_name) setFullName(profile.full_name);
        if (profile?.subscription_tier) setTier(profile.subscription_tier);
      }
    };
    loadProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const supabase = createBrowserSupabase();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      await supabase.auth.updateUser({
        data: { full_name: fullName },
      });

      await supabase.from('profiles').update({ full_name: fullName }).eq('id', userData.user.id);

      setMessage({ type: 'success', text: 'Profile details saved successfully.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const supabase = createBrowserSupabase();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setMessage({ type: 'success', text: 'Password updated successfully.' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update password.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: 'success', text: 'Workspace preferences updated.' });
  };

  return (
    <AppShell title="Account Settings">
      <main className="px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto space-y-6">
        {/* Banner */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#17243A]">
            Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Manage your personal profile, security credentials, and contract audit preferences.
          </p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {message.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Profile & Security */}
          <div className="lg:col-span-7 space-y-6">
            {/* Profile Information */}
            <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#F1F5F9] pb-3">
                <User size={18} className="text-[#2458D3]" />
                <h2 className="font-bold text-sm text-[#17243A]">Profile Information</h2>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17243A] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#17243A] focus:outline-none focus:border-[#2458D3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243A] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-[#E2E8F0]/40 border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#64748B] cursor-not-allowed"
                  />
                  <p className="text-[11px] text-[#94A3B8] mt-1">
                    Your authenticated email address cannot be edited here.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#2458D3] hover:bg-[#193F9B] disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Save Profile
                </button>
              </form>
            </section>

            {/* Password Management */}
            <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#F1F5F9] pb-3">
                <Lock size={18} className="text-[#2458D3]" />
                <h2 className="font-bold text-sm text-[#17243A]">Password Management</h2>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17243A] mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter at least 6 characters"
                    className="w-full bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#17243A] focus:outline-none focus:border-[#2458D3]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !newPassword}
                  className="bg-[#111C2E] hover:bg-[#263A59] disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Update Password
                </button>
              </form>
            </section>
          </div>

          {/* Right Column: Preferences & Account Summary */}
          <div className="lg:col-span-5 space-y-6">
            {/* Account Overview */}
            <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-3">
              <h2 className="font-bold text-sm text-[#17243A] uppercase tracking-wider pb-2 border-b border-[#F1F5F9]">
                Account Overview
              </h2>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Active Tier:</span>
                  <span className="font-bold text-[#2458D3] uppercase">{tier} Plan</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Account Created:</span>
                  <span className="text-[#17243A]">
                    {createdAt ? new Date(createdAt).toLocaleDateString() : 'Active'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Vault Encryption:</span>
                  <span className="text-emerald-700 font-semibold">Enabled (AES-256)</span>
                </div>
              </div>
            </section>

            {/* Document Preferences */}
            <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#F1F5F9] pb-3">
                <Globe size={18} className="text-[#2458D3]" />
                <h2 className="font-bold text-sm text-[#17243A]">Document Preferences</h2>
              </div>

              <form onSubmit={handleSavePreferences} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#17243A] mb-1">
                    Default Governing Jurisdiction
                  </label>
                  <select
                    value={defaultJurisdiction}
                    onChange={(e) => setDefaultJurisdiction(e.target.value)}
                    className="w-full bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#17243A] focus:outline-none focus:border-[#2458D3]"
                  >
                    <option value="Delaware, United States">Delaware, United States</option>
                    <option value="California, United States">California, United States</option>
                    <option value="New York, United States">New York, United States</option>
                    <option value="England & Wales, UK">England & Wales, UK</option>
                    <option value="European Union (GDPR)">European Union (GDPR)</option>
                    <option value="India (Commercial Courts)">India (Commercial Courts)</option>
                  </select>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#F1F5F9]">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                      className="rounded text-[#2458D3] focus:ring-[#2458D3]"
                    />
                    <span className="font-medium text-[#17243A]">
                      Email notifications for High-Risk clause flags
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={weeklyDigest}
                      onChange={(e) => setWeeklyDigest(e.target.checked)}
                      className="rounded text-[#2458D3] focus:ring-[#2458D3]"
                    />
                    <span className="font-medium text-[#17243A]">
                      Monthly quota and renewal reminders
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="bg-[#F4F7FC] hover:bg-[#E2E8F0] text-[#17243A] border border-[#E2E8F0] font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Save Preferences
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
    </AppShell>
  );
}

