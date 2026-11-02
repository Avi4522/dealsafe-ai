'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Folder,
  Sparkles,
  ShieldAlert,
  GitCompare,
  FilePlus2,
  History,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  Menu,
  X,
} from 'lucide-react';
import { createBrowserSupabase } from '@/lib/supabase/browser';
import { initialsFrom } from '@/lib/utils';

const MAIN = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/documents', label: 'My Documents', icon: Folder, altHrefs: ['/cases'] },
  { href: '/dashboard/analyze', label: 'AI Contract Analysis', icon: Sparkles, altHrefs: ['/upload'] },
  { href: '/dashboard/risk-assessment', label: 'Risk Assessment', icon: ShieldAlert, altHrefs: ['/risk-assessment', '/risk'] },
  { href: '/dashboard/compare', label: 'Document Comparison', icon: GitCompare, altHrefs: ['/compare'] },
  { href: '/dashboard/document-generator', label: 'Legal Document Generator', icon: FilePlus2, altHrefs: ['/document-generator', '/forms'] },
  { href: '/dashboard/history', label: 'Document History', icon: History, altHrefs: ['/history'] },
];

const ACCOUNT = [
  { href: '/dashboard/billing', label: 'Subscription & Billing', icon: CreditCard, altHrefs: ['/pricing'] },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings, altHrefs: ['/settings'] },
  { href: '/dashboard/support', label: 'Help & Support', icon: HelpCircle, altHrefs: ['/contact'] },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [tier, setTier] = useState('free');

  useEffect(() => {
    const supabase = createBrowserSupabase();
    supabase.auth
      .getUser()
      .then(async ({ data }) => {
        const user = data.user;
        if (!user) return;
        setEmail(user.email || null);
        setName((user.user_metadata?.full_name as string) || null);
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, subscription_tier, email')
          .eq('id', user.id)
          .maybeSingle();
        if (profile) {
          setName(profile.full_name || name);
          setTier(profile.subscription_tier || 'free');
          setEmail(profile.email || user.email || null);
        }
      })
      .catch(() => undefined);
  }, []);

  const logout = async () => {
    const supabase = createBrowserSupabase();
    await supabase.auth.signOut();
    window.location.href = '/auth/login';
  };

  const content = (
    <div className="flex flex-col h-full bg-[#111C2E] text-[#E2E8F0]">
      {/* Brand Header */}
      <div className="px-5 py-5 flex items-center justify-between border-b border-[#263A59]/40">
        <Link href="/dashboard" className="flex items-center gap-3 min-h-0">
          <span className="w-9 h-9 rounded-xl bg-[#2458D3] text-white font-bold text-sm flex items-center justify-center shadow-md">
            DS
          </span>
          <div className="flex flex-col">
            <span className="font-bold text-white text-[16px] tracking-tight">DealSafe AI</span>
            <span className="text-[10px] text-[#A9B7CA] tracking-wider uppercase font-medium">
              Contract Intelligence
            </span>
          </div>
        </Link>
        <button
          className="lg:hidden text-[#A9B7CA] hover:text-white p-1 cursor-pointer"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-4 space-y-6">
        <div>
          <p className="px-5 pb-2 text-[11px] font-bold tracking-[0.14em] text-[#A9B7CA] uppercase">
            Main
          </p>
          <nav className="px-3 space-y-1">
            {MAIN.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href + '/')) ||
                Boolean(
                  (item as any).altHrefs?.some(
                    (alt: string) => pathname === alt || pathname.startsWith(alt + '/')
                  )
                );
              return (
                <NavLink
                  key={item.href}
                  {...item}
                  active={isActive}
                  onClick={() => setOpen(false)}
                />
              );
            })}
          </nav>
        </div>

        <div>
          <p className="px-5 pb-2 text-[11px] font-bold tracking-[0.14em] text-[#A9B7CA] uppercase">
            Account
          </p>
          <nav className="px-3 space-y-1">
            {ACCOUNT.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(item.href + '/') ||
                Boolean(
                  (item as any).altHrefs?.some(
                    (alt: string) => pathname === alt || pathname.startsWith(alt + '/')
                  )
                );
              return (
                <NavLink
                  key={item.href}
                  {...item}
                  active={isActive}
                  onClick={() => setOpen(false)}
                />
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer User Info */}
      <div className="p-4 border-t border-[#263A59]/40 bg-[#0E1726]/60">
        <div className="flex items-center gap-3 px-1 mb-3">
          <div className="w-9 h-9 rounded-xl bg-[#2458D3] text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-xs">
            {initialsFrom(name, email)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate">{name || email || 'Workspace User'}</p>
            <p className="text-[11px] text-[#A9B7CA] capitalize font-medium">{tier} Plan</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#A9B7CA] hover:bg-[#263A59]/60 hover:text-white transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Button */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-[#111C2E] text-white flex items-center justify-center shadow-md cursor-pointer"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[260px] shrink-0 bg-[#111C2E] rounded-[22px] overflow-hidden flex-col h-[calc(100vh-24px)] sticky top-3 shadow-md border border-[#263A59]/30">
        {content}
      </aside>

      {/* Mobile Modal Drawer */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden"
            onClick={() => setOpen(false)}
          />
          <aside className="fixed left-3 top-3 bottom-3 w-[270px] bg-[#111C2E] rounded-[22px] z-50 lg:hidden overflow-hidden shadow-2xl border border-[#263A59]/40">
            {content}
          </aside>
        </>
      )}
    </>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] sm:text-[15px] font-medium transition-all ${
        active
          ? 'bg-[#263A59] text-white font-semibold shadow-xs border-l-4 border-[#2458D3]'
          : 'text-[#A9B7CA] hover:bg-[#1B2940] hover:text-[#E2E8F0]'
      }`}
    >
      <Icon size={17} className={active ? 'text-[#2458D3]' : 'text-[#A9B7CA]'} />
      <span className="truncate">{label}</span>
    </Link>
  );
}
