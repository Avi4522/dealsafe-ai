'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UploadCloud, Cpu, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Upload Your Document.',
    short: 'Step 1',
    description: "Bring your agreement. We'll take it from here.",
    icon: UploadCloud,
    details: 'Drop any PDF or DOCX contract. Fast, private, and ready in seconds.',
  },
  {
    step: '02',
    title: 'Let AI Review It.',
    short: 'Step 2',
    description: 'Find potential risks, important clauses and things worth a second look.',
    icon: Cpu,
    details: 'Scans every page, flags questionable terms, and translates legal jargon into plain English.',
  },
  {
    step: '03',
    title: 'Know Before You Sign.',
    short: 'Step 3',
    description: 'Understand your agreement and decide what to do next.',
    icon: CheckCircle2,
    details: 'Review clear recommendations and negotiate with total peace of mind.',
  },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 bg-[#EEF2FF] border border-[#DBEAFE] px-4 py-1.5 rounded-full text-[12px] font-semibold text-[#1D4ED8] mb-4">
            HOW IT WORKS
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0B1B3B]">
            Three Steps. A Much Clearer Contract.
          </h2>
          <p className="mt-4 text-[16px] sm:text-[18px] text-[#4B5563] leading-relaxed">
            Stop losing hours to legal ambiguity. Upload your document and get plain-English clarity before you sign.
          </p>
        </div>

        {/* 3-Step Grid with Connecting Line */}
        <div className="relative max-w-5xl mx-auto">
          {/* Subtle horizontal connecting line on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 -translate-y-16 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {steps.map((item, index) => {
              const Icon = item.icon;
              const isSelected = activeStep === index;
              return (
                <div
                  key={item.step}
                  onClick={() => setActiveStep(index)}
                  className={`cursor-pointer rounded-2xl sm:rounded-3xl p-7 transition-all duration-300 border bg-white flex flex-col justify-between ${isSelected
                      ? 'border-[#2563EB] shadow-xl shadow-blue-900/10 -translate-y-1 ring-2 ring-blue-500/20'
                      : 'border-[#E2E8F0] hover:border-[#CBD5E1] shadow-xs hover:shadow-md'
                    }`}
                >
                  <div>
                    {/* Top Row: Number Badge + Icon */}
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-[26px] font-serif font-black text-[#1D4ED8] tracking-tight">
                        {item.step}
                      </span>
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isSelected
                            ? 'bg-[#1D4ED8] text-white shadow-md'
                            : 'bg-[#EEF2FF] text-[#1D4ED8]'
                          }`}
                      >
                        <Icon size={22} />
                      </div>
                    </div>

                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] mb-1">
                      {item.short}
                    </p>
                    <h3 className="text-[18px] font-bold text-[#0B1B3B] mb-2.5">
                      {item.title}
                    </h3>
                    <p className="text-[14px] text-[#0B1B3B] font-medium leading-relaxed mb-3">
                      {item.description}
                    </p>
                  </div>

                  <p className="text-[12px] text-[#64748B] leading-relaxed pt-3 border-t border-[#F1F5F9]">
                    {item.details}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Banner under workflow */}
        <div className="mt-14 text-center">
          <Link
            href="/auth/login?mode=signup"
            className="inline-flex items-center gap-2 bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white font-semibold px-8 py-4 rounded-full text-[15px] shadow-md hover:shadow-lg transition-all"
          >
            <span>Analyze My Contract</span>
            <ArrowRight size={16} />
          </Link>
          <p className="mt-3 text-[12px] text-[#64748B]">
            Simple to start · No credit card required · Built for smarter decisions
          </p>
        </div>
      </div>
    </section>
  );
}
