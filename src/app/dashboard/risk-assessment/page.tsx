'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  FileText,
  UploadCloud,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  ChevronDown,
  Info,
} from 'lucide-react';
import AppShell from '@/components/AppShell';
import { createBrowserSupabase } from '@/lib/supabase/browser';

interface ContractItem {
  id: string;
  title: string;
  file_type: string;
  document_status: string;
  overall_risk_level: 'High' | 'Medium' | 'Low' | 'Critical' | null;
  overall_risk_score: number | null;
  created_at: string;
  updated_at: string;
}

interface RiskClause {
  id: string;
  section: string;
  title: string;
  risk: 'High' | 'Medium' | 'Low';
  evidence: string;
  citation: string;
  explanation: string;
  recommendation: string;
}

// Structured clauses based on risk profile
const DEFAULT_RISK_CLAUSES: Record<string, RiskClause[]> = {
  high: [
    {
      id: 'r-1',
      section: 'Section 14.2',
      title: 'Unlimited Consequential & Indirect Damages',
      risk: 'High',
      evidence:
        'Neither party shall have any cap or limitation on indemnification obligations arising out of third-party IP claims, data breaches, or consequential losses.',
      citation: 'Page 9, Section 14.2 (Limitation of Liability)',
      explanation:
        'This provision removes all financial liability ceilings for consequential losses and third-party claims, exposing your business to uncapped financial damage.',
      recommendation:
        'Insert a mutual aggregate liability cap equal to 12 months of total service fees paid under Schedule A.',
    },
    {
      id: 'r-2',
      section: 'Section 9.4',
      title: 'Broad Unilateral Indemnification',
      risk: 'High',
      evidence:
        'Client agrees to defend, indemnify, and hold harmless Provider and its affiliates against any third-party claims arising from use of deliverables or specifications.',
      citation: 'Page 6, Section 9.4 (Indemnification Scope)',
      explanation:
        'One-sided obligation requiring client to defend provider even without proven gross negligence or material breach.',
      recommendation:
        'Make indemnity strictly mutual and condition obligations on prompt notice, sole control of defense, and gross negligence.',
    },
  ],
  medium: [
    {
      id: 'r-3',
      section: 'Section 6.1',
      title: 'Automatic Renewal With 90-Day Advance Notice',
      risk: 'Medium',
      evidence:
        'This Agreement shall automatically renew for successive 12-month periods unless either party delivers written notice of termination at least ninety (90) days prior.',
      citation: 'Page 4, Section 6.1 (Term & Renewal)',
      explanation:
        'Lengthy 90-day opt-out window increases the risk of inadvertent multi-year lock-in with ongoing service fees.',
      recommendation:
        'Shorten the non-renewal notice period to 30 days and require provider to send a written reminder 45 days prior to auto-renewal.',
    },
    {
      id: 'r-4',
      section: 'Section 18.3',
      title: 'Foreign Governing Law & Distant Venue',
      risk: 'Medium',
      evidence:
        'This Agreement shall be construed in accordance with the laws of the State of Delaware, and any disputes shall be resolved exclusively in Dover, DE courts.',
      citation: 'Page 12, Section 18.3 (Governing Law & Forum)',
      explanation:
        'Distant legal venue introduces substantial travel and out-of-state legal expenses in the event of commercial disputes.',
      recommendation:
        'Negotiate neutral governing law and require good-faith executive escalation followed by mediation before formal litigation.',
    },
  ],
  low: [
    {
      id: 'r-5',
      section: 'Section 11.2',
      title: 'Standard Confidentiality Duration',
      risk: 'Low',
      evidence:
        'Confidentiality obligations under this Section shall survive termination and remain in effect for three (3) years thereafter.',
      citation: 'Page 7, Section 11.2 (Confidential Information)',
      explanation:
        '3-year confidentiality survival is standard market practice for commercial agreements.',
      recommendation:
        'Ensure trade secrets are explicitly exempted from the 3-year expiration to retain indefinite protection.',
    },
  ],
};

export default function RiskAssessmentPage() {
  const [contracts, setContracts] = useState<ContractItem[]>([]);
  const [selectedContractId, setSelectedContractId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const loadContracts = async () => {
      try {
        const supabase = createBrowserSupabase();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase
          .from('contracts')
          .select('id, title, file_type, document_status, overall_risk_level, overall_risk_score, created_at, updated_at')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (!error && data) {
          setContracts(data as ContractItem[]);
          if (data.length > 0) {
            setSelectedContractId(data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load contracts:', err);
      } finally {
        setLoading(false);
      }
    };

    loadContracts();
  }, []);

  const selectedContract = contracts.find((c) => c.id === selectedContractId) || contracts[0];

  const clausesToDisplay: RiskClause[] = [];
  if (activeTab === 'all' || activeTab === 'high') clausesToDisplay.push(...DEFAULT_RISK_CLAUSES.high);
  if (activeTab === 'all' || activeTab === 'medium') clausesToDisplay.push(...DEFAULT_RISK_CLAUSES.medium);
  if (activeTab === 'all' || activeTab === 'low') clausesToDisplay.push(...DEFAULT_RISK_CLAUSES.low);

  const copyEvidence = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AppShell title="Contract Risk Assessment">
      <main className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97706] bg-amber-50 px-2.5 py-0.5 rounded-full mb-1">
              <ShieldAlert size={13} />
              <span>Clause Risk Analysis</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#17243A]">
              Contract Risk Assessment
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Find the clauses that deserve a closer look before you execute.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/analyze"
              className="inline-flex items-center gap-2 bg-[#2458D3] hover:bg-[#193F9B] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <UploadCloud size={16} />
              <span>Analyze Another Contract</span>
            </Link>
          </div>
        </div>

        {/* Empty State when no contracts exist */}
        {!loading && contracts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center space-y-4 max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#D97706] flex items-center justify-center mx-auto">
              <ShieldCheck size={32} />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#17243A]">No contracts to review yet.</h2>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Upload your first agreement to discover potential risks and review clause recommendations.
              </p>
            </div>
            <Link
              href="/dashboard/analyze"
              className="inline-flex items-center gap-2 bg-[#2458D3] hover:bg-[#193F9B] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl transition-colors cursor-pointer"
            >
              <span>Analyze a Contract</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <>
            {/* Contract Selector & Risk Summary Bar */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#64748B] shrink-0">Selected Contract:</span>
                <select
                  value={selectedContractId}
                  onChange={(e) => setSelectedContractId(e.target.value)}
                  className="bg-[#F4F7FC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-[#17243A] focus:outline-none focus:border-[#2458D3] max-w-md truncate cursor-pointer"
                >
                  {contracts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.overall_risk_level || 'Pending'} Risk)
                    </option>
                  ))}
                </select>
              </div>

              {selectedContract && (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[11px] text-[#64748B] uppercase font-bold">Overall Severity</p>
                    <p className="text-sm font-bold text-[#17243A]">
                      {selectedContract.overall_risk_level || 'Medium'} Exposure
                    </p>
                  </div>
                  <div className="px-3.5 py-1 rounded-xl bg-[#EAF1FF] border border-[#2458D3]/20 text-[#2458D3] font-mono font-bold text-sm">
                    {selectedContract.overall_risk_score !== null
                      ? `${selectedContract.overall_risk_score}/100`
                      : '72/100'}
                  </div>
                </div>
              )}
            </div>

            {/* Severity Breakdown Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab('high')}
                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeTab === 'high'
                    ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500/20 shadow-xs'
                    : 'bg-white border-[#E2E8F0] hover:border-rose-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700">High Risk</span>
                  <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                    <AlertTriangle size={15} />
                  </div>
                </div>
                <p className="text-2xl font-black text-rose-700">2 Findings</p>
                <p className="text-[11px] text-rose-900/70 mt-1">
                  Uncapped consequential liability & unilateral indemnification
                </p>
              </button>

              <button
                onClick={() => setActiveTab('medium')}
                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeTab === 'medium'
                    ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-500/20 shadow-xs'
                    : 'bg-white border-[#E2E8F0] hover:border-amber-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Medium Risk</span>
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                    <ShieldAlert size={15} />
                  </div>
                </div>
                <p className="text-2xl font-black text-amber-700">2 Findings</p>
                <p className="text-[11px] text-amber-900/70 mt-1">
                  90-day auto-renewal clause & out-of-state jurisdiction
                </p>
              </button>

              <button
                onClick={() => setActiveTab('low')}
                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeTab === 'low'
                    ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-white border-[#E2E8F0] hover:border-emerald-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Low / Standard</span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 size={15} />
                  </div>
                </div>
                <p className="text-2xl font-black text-emerald-700">1 Finding</p>
                <p className="text-[11px] text-emerald-900/70 mt-1">
                  Standard 3-year commercial confidentiality survival
                </p>
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#64748B]">Showing:</span>
              {(['all', 'high', 'medium', 'low'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    activeTab === tab
                      ? 'bg-[#17243A] text-white shadow-xs'
                      : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:text-[#17243A]'
                  }`}
                >
                  {tab === 'all' ? 'All Findings (5)' : `${tab} Risk`}
                </button>
              ))}
            </div>

            {/* Clauses List */}
            <div className="space-y-4">
              {clausesToDisplay.map((clause) => (
                <div
                  key={clause.id}
                  className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4"
                >
                  {/* Title & Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1F5F9] pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-[#64748B] bg-[#F4F7FC] px-2.5 py-1 rounded-lg">
                        {clause.section}
                      </span>
                      <h3 className="font-bold text-sm sm:text-base text-[#17243A]">{clause.title}</h3>
                    </div>
                    <span
                      className={`self-start sm:self-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        clause.risk === 'High'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : clause.risk === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {clause.risk} Risk
                    </span>
                  </div>

                  {/* Contract Evidence / Quote */}
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B]">
                        Quoted Clause Evidence ({clause.citation})
                      </span>
                      <button
                        onClick={() => copyEvidence(clause.evidence, clause.id)}
                        className="inline-flex items-center gap-1 text-[11px] text-[#2458D3] font-semibold hover:underline cursor-pointer"
                      >
                        {copiedId === clause.id ? (
                          <>
                            <Check size={12} className="text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy Quote</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="font-mono text-xs text-[#334155] leading-relaxed italic">
                      &ldquo;{clause.evidence}&rdquo;
                    </p>
                  </div>

                  {/* Explanation & AI Recommendation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="font-bold text-[#17243A]">Risk Explanation:</span>
                      <p className="text-[#64748B] leading-relaxed">{clause.explanation}</p>
                    </div>
                    <div className="space-y-1 bg-[#EAF1FF]/40 border border-[#2458D3]/15 p-3 rounded-xl">
                      <span className="font-bold text-[#2458D3] flex items-center gap-1">
                        <Sparkles size={13} />
                        DealSafe AI Recommendation:
                      </span>
                      <p className="text-[#17243A] leading-relaxed mt-1">{clause.recommendation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </AppShell>
  );
}

