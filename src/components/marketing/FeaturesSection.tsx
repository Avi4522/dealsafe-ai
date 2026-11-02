'use client';

import {
  FileSearch,
  ShieldAlert,
  BookOpenCheck,
  Sparkles,
  GitCompare,
  FileCheck2,
  Bot,
  FolderLock,
  ArrowUpRight,
} from 'lucide-react';

const features = [
  {
    icon: FileSearch,
    badge: 'Quick Analysis',
    title: 'AI Contract Analysis',
    body: 'Upload any agreement and get a clear, easy-to-read breakdown in seconds.',
    href: '/upload',
  },
  {
    icon: ShieldAlert,
    badge: 'Risk Spotting',
    title: 'Smart Risk Detection',
    body: 'Catch hidden liabilities, unbalanced terms, and missing protections before you sign.',
    href: '/risk',
  },
  {
    icon: BookOpenCheck,
    badge: 'Zero Jargon',
    title: 'Plain-English Explanations',
    body: 'Complex legalese translated into straightforward everyday language you can trust.',
    href: '/cases',
  },
  {
    icon: Sparkles,
    badge: 'Actionable Tips',
    title: 'AI-Powered Recommendations',
    body: 'Get practical suggestions on what to push back on or renegotiate.',
    href: '/copilot',
  },
  {
    icon: GitCompare,
    badge: 'Side-by-Side',
    title: 'Contract Comparison',
    body: 'See exactly what changed between versions without skimming line by line.',
    href: '/compare',
  },
  {
    icon: FileCheck2,
    badge: 'Page Citations',
    title: 'Evidence-Based Insights',
    body: 'Every insight links directly back to the exact page and clause in your document.',
    href: '/upload',
  },
  {
    icon: Bot,
    badge: 'Instant Answers',
    title: 'Ask Your Contract',
    body: 'Have a question? Chat with your agreement and get immediate, cited answers.',
    href: '/copilot',
  },
  {
    icon: FolderLock,
    badge: 'Document Vault',
    title: 'Smart Contract Workspace',
    body: 'Keep all your contracts, reviews, and renewals organized in one secure place.',
    href: '/dashboard',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 bg-[#EEF2FF] border border-[#DBEAFE] px-4 py-1.5 rounded-full text-[12px] font-semibold text-[#1D4ED8] mb-4">
            SIMPLE &amp; POWERFUL TOOLS
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0B1B3B]">
            Everything You Need to Understand the Fine Print.
          </h2>
          <p className="mt-4 text-[16px] sm:text-[18px] text-[#4B5563] leading-relaxed">
            From confusing clauses to hidden obligations, get the clarity you need before signing.
          </p>
        </div>

        {/* Feature Grid (8 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative bg-[#FBFDFE] hover:bg-white border border-[#E6EAF2] hover:border-[#BFDBFE] rounded-2xl p-7 shadow-xs hover:shadow-hover transition-all duration-300 flex flex-col justify-between min-h-[280px]"
              >
                <div>
                  {/* Top Bar: Icon + Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] text-[#1D4ED8] group-hover:bg-[#1D4ED8] group-hover:text-white flex items-center justify-center transition-colors duration-300 shadow-xs">
                      <Icon size={22} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] bg-[#F1F5F9] px-2.5 py-1 rounded-full group-hover:bg-blue-50 group-hover:text-[#1D4ED8] transition-colors">
                      {feature.badge}
                    </span>
                  </div>

                  {/* Title & Body with exact requested copy */}
                  <h3 className="text-[17px] font-bold text-[#0B1B3B] group-hover:text-[#1D4ED8] transition-colors mb-2.5">
                    {feature.title}
                  </h3>
                  <p className="text-[14px] text-[#64748B] leading-relaxed">
                    {feature.body}
                  </p>
                </div>

                {/* Bottom link indication */}
                <div className="pt-4 mt-4 border-t border-[#F1F5F9] flex items-center justify-between text-[12px] font-semibold text-[#1D4ED8] opacity-80 group-hover:opacity-100 transition-opacity">
                  <span>Learn more</span>
                  <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
