'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  AlertCircle,
  CheckCircle,
  FileText,
  Copy,
  Check,
  Cpu,
  Layers,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

const intelligenceItems = [
  {
    id: 'liability',
    title: 'Clause Analysis',
    clauseName: 'Section 14.2 — Uncapped Consequential Damages',
    citation: 'Page 9, Section 14.2',
    original:
      'Neither party shall have any cap or limitation on indemnification obligations arising out of third-party IP claims, data breaches, or consequential losses.',
    explanation:
      'Exposes your company to unlimited financial damages for indirect or consequential third-party claims regardless of proportional fault.',
    recommendation:
      'Insert mutual aggregate liability cap equal to 12 months of total service fees paid under Schedule A.',
    highlights: [
      'Identifies implicit liability expansion',
      'Compares against standard market norms',
      'Provides defensible counter-language',
    ],
  },
  {
    id: 'termination',
    title: 'Risk Detection',
    clauseName: 'Section 8.1 — Unilateral Auto-Renewal Window',
    citation: 'Page 5, Section 8.1',
    original:
      'This Agreement automatically renews for successive 24-month terms unless written notice is delivered not less than ninety (90) days prior to expiration.',
    explanation:
      'A 90-day cancellation window creates a severe operational risk of accidental lock-in for a full 2-year commitment.',
    recommendation:
      'Shorten notice period to 30 days and restrict automatic renewal terms to 12-month periods with advance reminder notice.',
    highlights: [
      'Highlights hidden calendar lock-ins',
      'Separates procedural from commercial risks',
      'Clear, plain-English breakdown',
    ],
  },
  {
    id: 'ip',
    title: 'Key Obligations',
    clauseName: 'Section 12.1 — Broad IP Assignment',
    citation: 'Page 8, Section 12.1',
    original:
      'All developments, feedback, customizations, and work product conceived during the term shall be deemed work made for hire and become the sole property of Provider.',
    explanation:
      'Overly broad IP capture risks inadvertently transferring ownership of your company preexisting assets and improvements.',
    recommendation:
      'Specify that customer retains full ownership of Preexisting IP and Customer Data; vendor receives only a limited service license.',
    highlights: [
      'Protects proprietary company IP',
      'Separates deliverables from background tech',
      'Prepares redlines for negotiation',
    ],
  },
  {
    id: 'evidence',
    title: 'Actionable Advice',
    clauseName: 'Section 16.3 — Broad Form Third-Party Indemnity',
    citation: 'Page 11, Section 16.3',
    original:
      'Customer shall indemnify, defend, and hold harmless Provider from and against any and all losses arising out of Customer use of the Services.',
    explanation:
      'One-sided indemnity forces you to defend the vendor even if a problem arose from the vendor own technical defects or service failures.',
    recommendation:
      'Make indemnification mutual and expressly carve out vendor gross negligence, willful misconduct, or breach of contract.',
    highlights: [
      'Tied directly to page & clause citations',
      'Verifiable against physical contract text',
      'Ready-to-copy redline recommendations',
    ],
  },
];

export default function AiIntelligence() {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeItem = intelligenceItems[activeTab];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="intelligence" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 bg-[#EEF2FF] border border-[#DBEAFE] px-4 py-1.5 rounded-full text-[12px] font-semibold text-[#1D4ED8] mb-4">
            <Cpu size={14} className="text-[#2563EB]" />
            CONTRACT CLARITY
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0B1B3B]">
            Not Just a Summary. A Better Understanding.
          </h2>
          <p className="mt-4 text-[16px] sm:text-[18px] text-[#4B5563] leading-relaxed">
            Get more than a shortened document. Understand important clauses, discover potential risks and see why they matter.
          </p>
        </div>

        {/* Dashboard Visual Container */}
        <div className="bg-[#0B1B3B] text-white rounded-2xl sm:rounded-3xl border border-[#1E293B] shadow-2xl overflow-hidden p-6 sm:p-10">
          {/* Top Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pb-6 mb-8 border-b border-white/10">
            {intelligenceItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(idx);
                  setCopied(false);
                }}
                className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${activeTab === idx
                    ? 'bg-[#1D4ED8] text-white shadow-md'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
              >
                {item.title}
              </button>
            ))}
          </div>

          {/* Main 2-Column Intelligence Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Original Clause with AI Risk Flagging */}
            <div className="lg:col-span-6 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-mono text-[#38BDF8] flex items-center gap-1.5">
                  <FileText size={14} />
                  {activeItem.citation}
                </span>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Potential Risk Identified
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">{activeItem.clauseName}</h3>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-[13px] leading-relaxed text-slate-300">
                  &ldquo;{activeItem.original}&rdquo;
                </div>
              </div>

              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/20">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-[13px] mb-1.5">
                  <AlertCircle size={15} />
                  Plain-English Risk Explanation
                </div>
                <p className="text-[13px] text-slate-300 leading-relaxed">
                  {activeItem.explanation}
                </p>
              </div>
            </div>

            {/* Right: AI Recommendation & Rewrite Playbook */}
            <div className="lg:col-span-6 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-[#38BDF8]" />
                    <span className="font-bold text-[14px] text-white">Suggested Improvement</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                    Evidence Verified
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#07132B] border border-blue-900/60 mb-5">
                  <p className="text-[13px] font-mono text-emerald-300 leading-relaxed">
                    &ldquo;{activeItem.recommendation}&rdquo;
                  </p>
                </div>

                <div className="space-y-2 text-[12px] text-white/70">
                  {activeItem.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-emerald-400" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => handleCopy(activeItem.recommendation)}
                  className="inline-flex items-center gap-2 text-[13px] font-semibold bg-[#1D4ED8] hover:bg-[#2563EB] text-white px-4 py-2 rounded-xl transition-colors shadow-sm"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-300" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy Suggested Rewrite</span>
                    </>
                  )}
                </button>

                <Link
                  href="/auth/login?mode=signup"
                  className="text-[12px] font-semibold text-[#38BDF8] hover:underline flex items-center gap-1"
                >
                  <span>Analyze My Contract</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <p className="text-center text-[12px] text-[#94A3B8] mt-6 max-w-2xl mx-auto leading-relaxed">
          DealSafe AI provides informational analysis, risk identification, and productivity assistance. DealSafe AI does not provide formal legal advice, does not replace licensed legal counsel, and does not guarantee legal enforceability.
        </p>
      </div>
    </section>
  );
}
