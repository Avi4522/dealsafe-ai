'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  Play,
  FileCheck2,
} from 'lucide-react';
import MarketingNav from '@/components/marketing/MarketingNav';
import DashboardPreview from '@/components/marketing/DashboardPreview';
import ProductShowcase from '@/components/marketing/ProductShowcase';
import FeaturesSection from '@/components/marketing/FeaturesSection';
import HowItWorks from '@/components/marketing/HowItWorks';
import AiIntelligence from '@/components/marketing/AiIntelligence';
import TrustSecurity from '@/components/marketing/TrustSecurity';
import PricingPreview from '@/components/marketing/PricingPreview';
import FaqSection from '@/components/marketing/FaqSection';
import FinalCta from '@/components/marketing/FinalCta';
import Footer from '@/components/Footer';

// Animated Counter Hook
function useCounter(target: number, duration: number = 2000, startNow: boolean = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startNow) return;
    let startTime: number | null = null;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(ease * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, startNow]);

  return count;
}

export default function HomePage() {
  const contractsCount = useCounter(15420, 2200);
  const accuracyCount = useCounter(984, 2000); // 98.4%
  const hoursSavedCount = useCounter(42, 1800); // 4.2 hrs

  return (
    <div className="min-h-screen bg-white text-[#0B1B3B] selection:bg-[#1D4ED8] selection:text-white">
      {/* Hero Section Container */}
      <div className="relative hero-gradient overflow-hidden border-b border-[#E6EAF2]">
        {/* Ambient Glowing Background Orbs */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-tr from-blue-400/20 via-indigo-300/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-48 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-64 -right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Floating subtle decorative badges */}
        <div className="hidden xl:flex items-center gap-2.5 absolute top-40 left-12 p-3 bg-white/80 backdrop-blur-md rounded-2xl border border-white/90 shadow-lg shadow-blue-900/5 animate-float pointer-events-none">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#0B1B3B]">Liability Capped</p>
            <p className="text-[10px] text-[#64748B]">Schedule A verified</p>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-2.5 absolute top-56 right-12 p-3 bg-white/80 backdrop-blur-md rounded-2xl border border-white/90 shadow-lg shadow-blue-900/5 animate-float-slow pointer-events-none">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <ShieldCheck size={18} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#0B1B3B]">Uncapped CAM Pass</p>
            <p className="text-[10px] text-rose-600 font-semibold">Flagged Section 9.3</p>
          </div>
        </div>

        {/* Global Navigation */}
        <MarketingNav />

        {/* Hero Copy & Call-To-Action */}
        <section className="relative px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-20 text-center max-w-5xl mx-auto">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-white/90 border border-[#D6DEEE] shadow-xs px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider text-[#1E3A8A] mb-8 animate-in fade-in duration-500">
            <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
            <span>YOUR AI CONTRACT PARTNER</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif font-bold tracking-tight leading-[1.12] text-[40px] sm:text-[58px] md:text-[70px] text-[#0B1B3B]">
            <span>Contracts Made Clear.</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB]">
              Decisions Made Smarter.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="mt-6 text-[16px] sm:text-[19px] text-[#475569] max-w-2xl mx-auto leading-relaxed">
            Big agreements shouldn&apos;t come with bigger confusion. Upload your contract, uncover potential risks and understand exactly what you&apos;re agreeing to.
          </p>

          {/* Dual CTAs */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/auth/login?mode=signup"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] hover:opacity-95 text-white font-bold px-8 py-4 rounded-full text-[15px] sm:text-[16px] shadow-[0_4px_16px_rgba(29,78,216,0.28)] hover:shadow-[0_8px_24px_rgba(29,78,216,0.36)] transition-all duration-200 hover:-translate-y-0.5"
            >
              <span>Analyze My Contract</span>
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <a
              href="#demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/90 hover:bg-white text-[#0B1B3B] font-semibold px-7 py-4 rounded-full text-[15px] sm:text-[16px] border border-[#D6DEEE] shadow-2xs hover:shadow-xs transition-all duration-200"
            >
              <Play size={15} className="text-[#1D4ED8] fill-[#1D4ED8]" />
              <span>See How It Works</span>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[13px] text-[#64748B]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>Simple to start</span>
            </div>
            <span className="text-[#CBD5E1] hidden sm:inline">·</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>Easy to understand</span>
            </div>
            <span className="text-[#CBD5E1] hidden sm:inline">·</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>Built for smarter decisions</span>
            </div>
          </div>

          {/* Live Statistics Counters */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm border border-white/90 rounded-2xl p-4 shadow-sm">
              <span className="text-2xl sm:text-3xl font-serif font-black text-[#0B1B3B]">
                {contractsCount.toLocaleString()}+
              </span>
              <p className="text-[12px] font-semibold text-[#64748B] mt-0.5">Contracts Analyzed</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-white/90 rounded-2xl p-4 shadow-sm">
              <span className="text-2xl sm:text-3xl font-serif font-black text-[#1D4ED8]">
                {(accuracyCount / 10).toFixed(1)}%
              </span>
              <p className="text-[12px] font-semibold text-[#64748B] mt-0.5">Risk Detection Precision</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-white/90 rounded-2xl p-4 shadow-sm">
              <span className="text-2xl sm:text-3xl font-serif font-black text-[#0B1B3B]">
                {(hoursSavedCount / 10).toFixed(1)} hrs
              </span>
              <p className="text-[12px] font-semibold text-[#64748B] mt-0.5">Saved Per Review</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-white/90 rounded-2xl p-4 shadow-sm">
              <span className="text-2xl sm:text-3xl font-serif font-black text-[#059669]">
                100%
              </span>
              <p className="text-[12px] font-semibold text-[#64748B] mt-0.5">Evidence Citing Coverage</p>
            </div>
          </div>

          {/* Interactive Hero Dashboard Preview Component */}
          <div className="mt-12 sm:mt-16">
            <DashboardPreview />
          </div>

          {/* Subtle Scroll Down Indicator */}
          <div className="mt-32 flex flex-col items-center justify-center text-[12px] text-[#94A3B8]">
            <span className="font-semibold uppercase tracking-widest text-[10px]">Scroll to explore</span>
            <ChevronDown size={16} className="animate-bounce mt-1 text-[#1D4ED8]" />
          </div>
        </section>
      </div>

      {/* Section B: Interactive Product Showcase */}
      <ProductShowcase />

      {/* Section C: Features Section (8 Feature Cards) */}
      <FeaturesSection />

      {/* Section D: How It Works (4-Step Animated Workflow) */}
      <HowItWorks />

      {/* Section E: AI Intelligence Section */}
      <AiIntelligence />

      {/* Section F: Trust & Security Section */}
      <TrustSecurity />

      {/* Section G: Pricing Preview */}
      <PricingPreview />

      {/* Section H: FAQ Section */}
      <FaqSection />

      {/* Section I: Final CTA Section */}
      <FinalCta />

      {/* Footer */}
      <Footer />
    </div>
  );
}
