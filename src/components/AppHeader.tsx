'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Plus,
  Search,
  SlidersHorizontal,
  LogOut,
  User,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';
import { createBrowserSupabase } from '@/lib/supabase/browser';
import { initialsFrom } from '@/lib/utils';

export default function AppHeader({ title = 'Contract Workspace' }: { title?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [tier, setTier] = useState('free');
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createBrowserSupabase();
    supabase.auth
      .getUser()
      .then(async ({ data }) => {
        const u = data.user;
        if (!u) return;
        setEmail(u.email || null);
        setName((u.user_metadata?.full_name as string) || null);

        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, subscription_tier, email')
          .eq('id', u.id)
          .maybeSingle();

        if (profile) {
          setName(profile.full_name || u.user_metadata?.full_name || null);
          setTier(profile.subscription_tier || 'free');
          setEmail(profile.email || u.email || null);
        }
      })
      .catch(() => undefined);

    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/dashboard/documents?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const logout = async () => {
    const supabase = createBrowserSupabase();
    await supabase.auth.signOut();
    window.location.href = '/auth/login';
  };

  return (
    <header className="h-[76px] sm:h-[84px] bg-white px-4 sm:px-6 lg:px-8 border-b border-[#E2E8F0] flex items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
      {/* Title */}
      <div className="flex items-center gap-3 min-w-0 pl-11 lg:pl-0">
        <h1 className="text-xl sm:text-2xl font-bold text-[#17243A] truncate font-serif tracking-tight">
          {title}
        </h1>
      </div>

      {/* Center & Right Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3 flex-1 justify-end max-w-2xl">
        {/* Global Contract Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md hidden md:block">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            name="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search contracts, clauses, or parties…"
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-[#F4F7FC] border border-[#E2E8F0] text-xs sm:text-sm text-[#17243A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2458D3] focus:bg-white transition-all"
          />
        </form>

        {/* Upload Shortcut */}
        <Link
          href="/dashboard/analyze"
          className="inline-flex items-center gap-1.5 h-10 px-3 sm:px-4 rounded-xl bg-[#2458D3] hover:bg-[#193F9B] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors shrink-0"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Upload</span>
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-10 h-10 rounded-xl bg-[#F4F7FC] hover:bg-[#E2E8F0] text-[#64748B] hover:text-[#17243A] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={17} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#2458D3]" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-4 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                <p className="font-bold text-xs text-[#17243A] uppercase tracking-wider">
                  Audit Notifications
                </p>
                <span className="text-[10px] bg-blue-50 text-[#2458D3] font-bold px-2 py-0.5 rounded-full">
                  Real-time
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#EEF1F6] flex gap-2.5 items-start">
                  <CheckCircle2 size={16} className="text-[#059669] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#17243A]">Contract engine active</p>
                    <p className="text-[11px] text-[#64748B]">
                      AI risk scanner and clause models are synchronized.
                    </p>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#EEF1F6] flex gap-2.5 items-start">
                  <ShieldCheck size={16} className="text-[#2458D3] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#17243A]">Vault encryption verified</p>
                    <p className="text-[11px] text-[#64748B]">All documents isolated with row-level security.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 h-10 pl-1.5 pr-2 rounded-xl hover:bg-[#F4F7FC] transition-colors cursor-pointer border border-transparent hover:border-[#E2E8F0]"
            aria-label="User Profile"
          >
            <div className="w-8 h-8 rounded-lg bg-[#2458D3] text-white text-xs font-bold flex items-center justify-center shadow-xs">
              {initialsFrom(name, email)}
            </div>
            <ChevronDown size={14} className="text-[#64748B] hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
              {/* User Bio */}
              <div className="p-3 border-b border-[#F1F5F9] space-y-0.5">
                <p className="font-bold text-sm text-[#17243A] truncate">{name || 'DealSafe User'}</p>
                <p className="text-[#64748B] text-[11px] truncate">{email || 'user@dealsafe.ai'}</p>
                <div className="pt-1.5">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#EAF1FF] text-[#2458D3] border border-[#2458D3]/20">
                    {tier} Plan
                  </span>
                </div>
              </div>

              {/* Menu Links */}
              <div className="py-1.5 space-y-0.5">
                <Link
                  href="/dashboard/billing"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#17243A] hover:bg-[#F4F7FC] font-medium"
                >
                  <CreditCard size={15} className="text-[#2458D3]" />
                  <span>Subscription & Billing</span>
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#17243A] hover:bg-[#F4F7FC] font-medium"
                >
                  <SlidersHorizontal size={15} className="text-[#2458D3]" />
                  <span>Account Settings</span>
                </Link>
                <Link
                  href="/dashboard/support"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#17243A] hover:bg-[#F4F7FC] font-medium"
                >
                  <User size={15} className="text-[#2458D3]" />
                  <span>Help & Support</span>
                </Link>
              </div>

              {/* Logout */}
              <div className="pt-1 border-t border-[#F1F5F9]">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold cursor-pointer text-left"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
