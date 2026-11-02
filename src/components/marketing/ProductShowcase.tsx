'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  Copy,
  Check,
  Layers,
  FileCheck2,
} from 'lucide-react';

interface ContractSample {
  id: string;
  title: string;
  type: string;
  pages: number;
  overallScore: number;
  riskSummary: { high: number; med: number; low: number };
  clauses: Array<{
    id: string;
    section: string;
    title: string;
    risk: 'High' | 'Medium' | 'Low';
    page: number;
    sourceRef: string;
    originalText: string;
    explanation: string;
    recommendation: string;
  }>;
}

const CONTRACT_SAMPLES: ContractSample[] = [
  {
    id: 'msa',
    title: 'Enterprise_Master_Services_Agreement_2026.pdf',
    type: 'Master Services Agreement',
    pages: 14,
    overallScore: 68,
    riskSummary: { high: 2, med: 3, low: 4 },
    clauses: [
      {
        id: 'c1',
        section: 'Section 14.2',
        title: 'Unlimited Indirect & Consequential Liability',
        risk: 'High',
        page: 9,
        sourceRef: 'Page 9, Line 142 (Master Services Agreement)',
        originalText:
          'Neither party shall have any cap or limitation on indemnification obligations arising out of third-party IP claims, data breaches, or consequential losses.',
        explanation:
          'This clause removes all monetary liability ceilings for consequential losses and third-party claims, exposing your business to unlimited financial damage.',
        recommendation:
          'Insert an aggregate mutual liability cap tied to 12 months of total service fees paid under Schedule A.',
      },
      {
        id: 'c2',
        section: 'Section 8.1',
        title: 'Unilateral Auto-Renewal with 90-Day Notice',
        risk: 'Medium',
        page: 5,
        sourceRef: 'Page 5, Line 84 (Term & Renewal)',
        originalText:
          'This Agreement automatically renews for successive 24-month terms unless written notice is delivered not less than ninety (90) days prior to expiration.',
        explanation:
          'The 90-day cancellation window is unusually restrictive and may trap you in an unwanted 24-month renewal if missed by a single day.',
        recommendation:
          'Shorten the notice window from 90 days to 30 days and limit automatic renewals to 12-month increments.',
      },
      {
        id: 'c3',
        section: 'Section 19.4',
        title: 'Mutual Non-Disclosure & Confidentiality',
        risk: 'Low',
        page: 12,
        sourceRef: 'Page 12, Line 210 (Confidentiality)',
        originalText:
          'Both parties agree to exercise reasonable care to protect proprietary information for a period of three (3) years post-termination.',
        explanation:
          'Standard, well-balanced industry language protecting both parties equally without unreasonable perpetual burdens.',
        recommendation:
          'Clause is standard and well-balanced. Safe to approve without modification.',
      },
    ],
  },
  {
    id: 'lease',
    title: 'Commercial_Office_Lease_Suite400.pdf',
    type: 'Commercial Real Estate Lease',
    pages: 22,
    overallScore: 54,
    riskSummary: { high: 3, med: 2, low: 5 },
    clauses: [
      {
        id: 'l1',
        section: 'Section 9.3',
        title: 'Uncapped CAM Expense Pass-Through',
        risk: 'High',
        page: 7,
        sourceRef: 'Page 7, Line 118 (Operating Costs & CAM)',
        originalText:
          'Tenant shall reimburse Landlord for all Common Area Maintenance (CAM) capital expenditures without annual index caps or audit rights.',
        explanation:
          'Landlord can pass along major building renovations and unpredictable capital improvements directly to tenant without limitation.',
        recommendation:
          'Negotiate a 5% cumulative annual cap on controllable operating expenses and reserve annual tenant audit rights.',
      },
      {
        id: 'l2',
        section: 'Section 16.1',
        title: 'Sublease Consent at Landlord Sole Discretion',
        risk: 'Medium',
        page: 13,
        sourceRef: 'Page 13, Line 190 (Assignment & Subletting)',
        originalText:
          'Tenant may not assign or sublease any portion of premises without Landlords consent, which may be withheld for any reason.',
        explanation:
          'Arbitrary withholding of sublease consent prevents downsizing or subletting if your business model changes.',
        recommendation:
          'Replace with "consent not to be unreasonably withheld, conditioned, or delayed beyond fifteen (15) business days."',
      },
      {
        id: 'l3',
        section: 'Section 22.2',
        title: 'Quiet Enjoyment Covenant',
        risk: 'Low',
        page: 19,
        sourceRef: 'Page 19, Line 302 (Quiet Enjoyment)',
        originalText:
          'Upon paying base rent and observing covenants, Tenant shall peaceably and quietly hold and enjoy the Leased Premises.',
        explanation:
          'Standard protective tenant provision confirming undisturbed possession during tenancy.',
        recommendation:
          'Clause is standard and beneficial to Tenant. Approve without changes.',
      },
    ],
  },
];

export default function ProductShowcase() {
  const [activeContractIndex, setActiveContractIndex] = useState(0);
  const [activeStep, setActiveStep] = useState<0 | 1 | 2 | 3>(1);
  const [selectedClauseIndex, setSelectedClauseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [copied, setCopied] = useState(false);

  const contract = CONTRACT_SAMPLES[activeContractIndex];
  const activeClause = contract.clauses[selectedClauseIndex] || contract.clauses[0];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => ((prev + 1) % 4) as 0 | 1 | 2 | 3);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="demo" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F7F8FC] via-white to-[#F7F8FC] relative overflow-hidden">
      {/* Decorative ambient elements */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-[#EEF2FF] border border-[#DBEAFE] px-4 py-1.5 rounded-full text-[12px] font-semibold text-[#1D4ED8] mb-4 shadow-xs">
            <Sparkles size={14} className="text-[#2563EB]" />
            LIVE PRODUCT DEMO
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0B1B3B]">
            See What You&apos;re Really Signing.
          </h2>
          <p className="mt-4 text-[16px] sm:text-[18px] text-[#4B5563] leading-relaxed">
            Upload a sample contract and discover how DealSafe AI turns complicated legal language into clear, useful insights.
          </p>

          {/* Contract Selector & Play/Pause */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex p-1 bg-[#E8EDF5] rounded-xl border border-[#D6DEEE]">
              {CONTRACT_SAMPLES.map((sample, idx) => (
                <button
                  key={sample.id}
                  onClick={() => {
                    setActiveContractIndex(idx);
                    setSelectedClauseIndex(0);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${activeContractIndex === idx
                      ? 'bg-white text-[#0B1B3B] shadow-sm'
                      : 'text-[#64748B] hover:text-[#0B1B3B]'
                    }`}
                >
                  {sample.type}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D6DEEE] bg-white text-[12px] font-medium text-[#4B5563] hover:text-[#0B1B3B] hover:bg-[#F8FAFC] transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause size={13} className="text-[#1D4ED8]" />
                  <span>Pause Demo</span>
                </>
              ) : (
                <>
                  <Play size={13} className="text-[#1D4ED8]" />
                  <span>Resume Demo</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Pipeline Step Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-6">
          {[
            { step: 0, label: '01. Document Upload', desc: 'Fast, Secure Parsing' },
            { step: 1, label: '02. Clause Scanner', desc: 'Reading Every Line' },
            { step: 2, label: '03. Risk Detection', desc: 'High, Medium & Low Risks' },
            { step: 3, label: '04. Actionable Advice', desc: 'Clear Recommendations' },
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => {
                setActiveStep(item.step as 0 | 1 | 2 | 3);
                setIsPlaying(false);
              }}
              className={`p-3 sm:p-4 rounded-xl text-left border transition-all ${activeStep === item.step
                  ? 'bg-white border-[#2563EB] shadow-md shadow-blue-600/5 ring-2 ring-blue-500/20'
                  : 'bg-white/60 border-[#E2E8F0] hover:bg-white text-[#64748B]'
                }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[11px] sm:text-[12px] font-bold ${activeStep === item.step ? 'text-[#1D4ED8]' : 'text-[#64748B]'
                    }`}
                >
                  {item.label}
                </span>
                {activeStep > item.step ? (
                  <CheckCircle2 size={14} className="text-emerald-500" />
                ) : activeStep === item.step ? (
                  <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-ping" />
                ) : null}
              </div>
              <p
                className={`text-[12px] sm:text-[13px] font-semibold truncate ${activeStep === item.step ? 'text-[#0B1B3B]' : 'text-[#94A3B8]'
                  }`}
              >
                {item.desc}
              </p>
            </button>
          ))}
        </div>

        {/* Live Interactive Product Interface Container */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E2E8F0] shadow-[0_20px_50px_rgba(11,27,59,0.08)] overflow-hidden">
          {/* Mock Browser/App Header */}
          <div className="h-12 bg-[#F8FAFC] border-b border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5F57] inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#FEBC2E] inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#28C840] inline-block" />
              <span className="ml-3 text-[12px] font-semibold text-[#334155] flex items-center gap-1.5">
                <FileText size={14} className="text-[#2563EB]" />
                {contract.title}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium text-[#64748B] bg-white border border-[#E2E8F0] px-2.5 py-1 rounded-md">
                <Layers size={12} className="text-[#1D4ED8]" />
                {contract.pages} Pages Parsed
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ANALYSIS COMPLETE
              </span>
            </div>
          </div>

          {/* App Body: Document Viewer (Left) + Intelligence Drawer (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
            {/* Left: Document Viewport with Active Laser Scan & Highlighted Text */}
            <div className="lg:col-span-7 p-5 sm:p-7 bg-[#FCFDFE] border-b lg:border-b-0 lg:border-r border-[#E2E8F0] relative overflow-hidden flex flex-col justify-between">
              {(activeStep === 0 || activeStep === 1) && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#2563EB] to-transparent shadow-[0_0_15px_#2563EB] animate-scan z-20 pointer-events-none" />
              )}

              {/* Status Header Bar inside document */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-[#475569]">
                    Page {activeClause.page} of {contract.pages}
                  </span>
                  <span className="text-[#CBD5E1]">·</span>
                  <span className="text-[12px] font-medium text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded">
                    {activeClause.section}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#64748B]">
                  Source: <span className="font-semibold text-[#0B1B3B]">{activeClause.sourceRef}</span>
                </div>
              </div>

              {/* Document Text Mockup */}
              <div className="space-y-4 font-mono text-[13px] leading-relaxed text-[#334155] select-none">
                <p className="text-xs text-[#94A3B8] italic">
                  [... PRECEDING PROVISIONS OMITTED FOR BRIEFING ...]
                </p>

                <p>
                  <strong className="text-[#0B1B3B]">14.1 Standard Warranties.</strong> Contractor warrants that deliverables shall conform to industry specifications for ninety (90) days following delivery.
                </p>

                {/* The Flagged Clause highlighted */}
                <div
                  className={`p-4 rounded-xl border transition-all duration-300 relative ${activeClause.risk === 'High'
                      ? 'bg-rose-50/70 border-rose-300 text-rose-950 ring-2 ring-rose-400/20'
                      : activeClause.risk === 'Medium'
                        ? 'bg-amber-50/70 border-amber-300 text-amber-950 ring-2 ring-amber-400/20'
                        : 'bg-emerald-50/70 border-emerald-300 text-emerald-950 ring-2 ring-emerald-400/20'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[12px] tracking-wide uppercase flex items-center gap-1.5">
                      {activeClause.risk === 'High' && <ShieldAlert size={14} className="text-rose-600" />}
                      {activeClause.risk === 'Medium' && <AlertTriangle size={14} className="text-amber-600" />}
                      {activeClause.risk === 'Low' && <ShieldCheck size={14} className="text-emerald-600" />}
                      FLAGGED CLAUSE — {activeClause.section}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeClause.risk === 'High'
                          ? 'bg-rose-600 text-white'
                          : activeClause.risk === 'Medium'
                            ? 'bg-amber-600 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}
                    >
                      {activeClause.risk} Risk
                    </span>
                  </div>
                  <p className="font-sans font-medium text-[14px] leading-snug">
                    &ldquo;{activeClause.originalText}&rdquo;
                  </p>
                </div>

                <p>
                  <strong className="text-[#0B1B3B]">14.3 Governing Law &amp; Jurisdiction.</strong> This agreement shall be governed in accordance with Delaware state law.
                </p>
              </div>

              {/* Bottom Interactive Clause Switcher */}
              <div className="pt-6 mt-6 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between gap-3">
                <span className="text-[12px] font-semibold text-[#64748B]">
                  Identified Clauses ({contract.clauses.length}):
                </span>
                <div className="flex items-center gap-1.5">
                  {contract.clauses.map((clause, idx) => (
                    <button
                      key={clause.id}
                      onClick={() => {
                        setSelectedClauseIndex(idx);
                        setActiveStep(2);
                        setIsPlaying(false);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors ${selectedClauseIndex === idx
                          ? 'bg-[#0B1B3B] text-white'
                          : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                        }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${clause.risk === 'High'
                            ? 'bg-rose-500'
                            : clause.risk === 'Medium'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                      />
                      {clause.section}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: AI Intelligence Panel & Recommendations */}
            <div className="lg:col-span-5 p-5 sm:p-7 bg-white flex flex-col justify-between">
              <div>
                {/* Health & Score Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F1F5F9]">
                  <div>
                    <h3 className="font-bold text-[15px] text-[#0B1B3B] flex items-center gap-1.5">
                      <Sparkles size={16} className="text-[#2563EB]" />
                      Contract Risk Assessment
                    </h3>
                    <p className="text-[11px] text-[#64748B]">Context-Aware Clause Analysis</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#0B1B3B]">{contract.overallScore}</span>
                    <span className="text-xs text-[#94A3B8]">/100</span>
                  </div>
                </div>

                {/* Risk Distribution Meters */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 text-center">
                    <span className="block text-[16px] font-black text-rose-700">
                      {contract.riskSummary.high}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                      High Risks
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 text-center">
                    <span className="block text-[16px] font-black text-amber-700">
                      {contract.riskSummary.med}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                      Medium
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-center">
                    <span className="block text-[16px] font-black text-emerald-700">
                      {contract.riskSummary.low}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                      Safe / Low
                    </span>
                  </div>
                </div>

                {/* Active Analysis Details Card */}
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[13px] font-bold text-[#0B1B3B]">{activeClause.title}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeClause.risk === 'High'
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : activeClause.risk === 'Medium'
                            ? 'bg-amber-100 text-amber-700 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}
                    >
                      {activeClause.risk} Severity
                    </span>
                  </div>
                  <p className="text-[12px] text-[#475569] leading-relaxed mb-3">
                    {activeClause.explanation}
                  </p>

                  {/* AI Recommendation Box */}
                  <div className="p-3 bg-white rounded-lg border border-[#DBEAFE] shadow-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-[#1D4ED8] flex items-center gap-1">
                        <FileCheck2 size={13} />
                        Suggested Improvement
                      </span>
                      <button
                        onClick={() => handleCopy(activeClause.recommendation)}
                        className="text-[11px] font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 transition-colors"
                      >
                        {copied ? (
                          <>
                            <Check size={12} className="text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy Rewrite</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[12px] font-medium text-[#1E293B] italic leading-normal">
                      &ldquo;{activeClause.recommendation}&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Action CTA */}
              <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                <span className="text-[11px] text-[#64748B]">
                  Ready to test with your contracts?
                </span>
                <Link
                  href="/auth/login?mode=signup"
                  className="inline-flex items-center gap-1 text-[13px] font-bold text-[#1D4ED8] hover:text-[#1E3A8A] hover:underline"
                >
                  <span>Try the Interactive Demo →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
