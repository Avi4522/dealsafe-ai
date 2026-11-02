'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function FinalCta() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="relative rounded-3xl sm:rounded-[36px] bg-gradient-to-br from-[#0B1B3B] via-[#0E244F] to-[#1D4ED8] p-8 sm:p-14 lg:p-16 text-center text-white overflow-hidden shadow-2xl shadow-blue-900/20 border border-white/10">
          {/* Ambient background glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Micro Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-[12px] font-semibold text-blue-200 mb-6 shadow-sm">
            <Sparkles size={14} className="text-blue-300" />
            START IN MINUTES
          </div>

          {/* Heading & Subtitle */}
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-3xl mx-auto leading-[1.15]">
            Your Next Contract Deserves a Closer Look.
          </h2>
          <p className="mt-5 text-[16px] sm:text-[19px] text-white/80 max-w-2xl mx-auto leading-relaxed">
            Don&apos;t let confusing clauses slow you down. Get the clarity to move forward with confidence.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/login?mode=signup"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#0B1B3B] hover:bg-slate-100 font-bold px-8 py-4 rounded-full text-[16px] shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              <span>Analyze Your First Contract</span>
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <a
              href="#demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-8 py-4 rounded-full text-[16px] backdrop-blur-sm transition-all"
            >
              <span>See How It Works</span>
            </a>
          </div>

          {/* Proof checkmarks */}
          <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[13px] text-white/70">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Simple to start</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Built for smarter decisions</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
