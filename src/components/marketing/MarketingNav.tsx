'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import Logo from '@/components/Logo';

const navItems = [
  { href: '/#features', label: 'Features' },
  { href: '/#demo', label: 'Demo' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#intelligence', label: 'AI Intelligence' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/#security', label: 'Security' },
  { href: '/#faq', label: 'FAQ' },
];

export default function MarketingNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
          ? 'bg-white/85 backdrop-blur-md border-b border-[#E6EAF2]/80 shadow-[0_4px_20px_rgba(11,27,59,0.04)] py-3'
          : 'bg-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo with micro-badge */}
        <div className="flex items-center gap-3 shrink-0">
          <Logo />
          <span className="hidden xl:inline-flex items-center gap-1 text-[11px] font-semibold text-[#1D4ED8] bg-[#EEF2FF] border border-[#DBEAFE] px-2.5 py-0.5 rounded-full">
            <Sparkles size={11} className="text-[#2563EB]" />
            AI Contract SaaS
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 bg-white/70 backdrop-blur-sm border border-[#E5E7EB]/70 rounded-full px-3 py-1 shadow-sm shrink-0">
          {navItems.map((item) => {
            const isPricingActive = item.href === '/pricing' && pathname === '/pricing';
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap text-[12px] xl:text-[13px] font-medium px-2.5 xl:px-3 py-1.5 rounded-full transition-all duration-200 ${isPricingActive
                    ? 'text-[#1D4ED8] bg-[#EFF6FF] font-semibold shadow-xs'
                    : 'text-[#4B5563] hover:text-[#0B1B3B] hover:bg-[#F8FAFC]'
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <Link
            href="/auth/login"
            className="whitespace-nowrap text-[13px] font-semibold text-[#0B1B3B] px-4 py-2 rounded-full border border-[#D6DEEE] bg-white/80 hover:bg-white hover:border-[#94A3B8] hover:shadow-sm transition-all duration-150 shrink-0"
          >
            Sign In
          </Link>
          <Link
            href="/auth/login?mode=signup"
            className="whitespace-nowrap group inline-flex items-center gap-1.5 text-[13px] font-semibold text-white px-5 py-2.5 rounded-full bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] hover:opacity-95 shadow-[0_4px_14px_rgba(29,78,216,0.25)] hover:shadow-[0_6px_20px_rgba(29,78,216,0.35)] transition-all duration-200 shrink-0"
          >
            <span>Get Started</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="lg:hidden w-10 h-10 rounded-xl border border-[#D6DEEE] bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#0B1B3B] hover:bg-[#F8FAFC] transition-colors"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="lg:hidden absolute left-4 right-4 top-full mt-2 bg-white/95 backdrop-blur-xl border border-[#E5E7EB] rounded-2xl shadow-2xl p-5 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="pb-2 mb-2 border-b border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
            <span>Navigation Menu</span>
            <span className="flex items-center gap-1 text-[#1D4ED8] font-medium">
              <ShieldCheck size={13} />
              DealSafe AI
            </span>
          </div>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block px-3.5 py-2.5 rounded-xl text-[14px] font-medium text-[#1E293B] hover:bg-[#EFF6FF] hover:text-[#1D4ED8] transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#F1F5F9] grid grid-cols-2 gap-2">
            <Link
              href="/auth/login"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 rounded-xl border border-[#D6DEEE] bg-white text-[14px] font-semibold text-[#0B1B3B] hover:bg-[#F8FAFC]"
            >
              Sign In
            </Link>
            <Link
              href="/auth/login?mode=signup"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-[#1E3A8A] text-white text-[14px] font-semibold hover:bg-[#1D4ED8] shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
