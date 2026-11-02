'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  UploadCloud,
  FileSearch,
  History,
  Bot,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShieldAlert,
  GitCompare,
  FilePlus2,
  Search,
  Filter,
  ArrowUpDown,
  Send,
  Loader2,
  ExternalLink,
  ChevronRight,
  Copy,
  Check,
  Flame,
  Info,
} from 'lucide-react';
import AppShell from '@/components/AppShell';
import { createBrowserSupabase } from '@/lib/supabase/browser';
import { USAGE_CREDITS } from '@/lib/plans';
import { formatFileSize } from '@/lib/utils';

type ContractRow = {
  id: string;
  title: string;
  file_type: string;
  file_size_bytes: number | null;
  document_status: string;
  overall_risk_level: string | null;
  overall_risk_score: number | null;
  created_at: string;
  updated_at: string;
  contract_analysis?: Array<{
    ai_confidence_percentage: number | null;
    clause_type: string | null;
    impact_summary: string | null;
    risk_zone: string | null;
    recommendations: string | null;
    suggested_rewrite: string | null;
  }>;
};

interface CopilotResponse {
  answer: string;
  references?: string[];
  keyTakeaways?: string[];
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contracts, setContracts] = useState<ContractRow[]>([]);
  const [tier, setTier] = useState('free');
  const [showRewrite, setShowRewrite] = useState(false);

  // Search, filter & sort state for Recent Documents
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'risk' | 'title'>('recent');

  // Embedded AI Contract Assistant state
  const [selectedContractId, setSelectedContractId] = useState<string>('general');
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantResponse, setAssistantResponse] = useState<CopilotResponse | null>(null);
  const [copiedAnswer, setCopiedAnswer] = useState(false);
  const assistantSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createBrowserSupabase();
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        const user = userData.user;
        if (!user) return;

        const [{ data: profile }, { data: docs, error: docsError }] = await Promise.all([
          supabase.from('profiles').select('subscription_tier').eq('id', user.id).maybeSingle(),
          supabase
            .from('contracts')
            .select(
              'id, title, file_type, file_size_bytes, document_status, overall_risk_level, overall_risk_score, created_at, updated_at'
            )
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false }),
        ]);

        if (docsError) {
          console.warn('Workspace contracts load warning:', docsError);
        }
        setTier(profile?.subscription_tier || 'free');
        setContracts((docs as ContractRow[]) || []);
      } catch (err: any) {
        setError(err.message || 'Could not load workspace data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const latest = contracts[0];
  const analysis = latest?.contract_analysis?.[0];
  const completedAnalyses = contracts.filter(
    (c) => c.document_status === 'analyzed' || c.contract_analysis?.length
  ).length;
  const potentialRisks = contracts.filter(
    (c) => c.overall_risk_level && c.overall_risk_level !== 'Low'
  ).length;

  const credits = USAGE_CREDITS[tier] ?? USAGE_CREDITS.free;
  const usedThisMonth = contracts.filter((c) => {
    const d = new Date(c.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const remainingCredits = Math.max(credits - usedThisMonth, 0);

  const riskCounts = {
    Low: contracts.filter((c) => c.overall_risk_level === 'Low').length,
    Medium: contracts.filter((c) => c.overall_risk_level === 'Medium').length,
    High: contracts.filter(
      (c) => c.overall_risk_level === 'High' || c.overall_risk_level === 'Critical'
    ).length,
  };

  // Filter & sort documents
  const filteredContracts = useMemo(() => {
    return contracts
      .filter((doc) => {
        const matchesQuery = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesQuery) return false;
        if (riskFilter === 'all') return true;
        if (riskFilter === 'high') {
          return doc.overall_risk_level === 'High' || doc.overall_risk_level === 'Critical';
        }
        if (riskFilter === 'medium') {
          return doc.overall_risk_level === 'Medium';
        }
        if (riskFilter === 'low') {
          return doc.overall_risk_level === 'Low';
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'recent') {
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        }
        if (sortBy === 'risk') {
          return (b.overall_risk_score || 0) - (a.overall_risk_score || 0);
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [contracts, searchQuery, riskFilter, sortBy]);

  // Handle embedded AI Copilot Ask
  const handleAskAssistant = async (questionToAsk?: string) => {
    const prompt = (questionToAsk || assistantInput).trim();
    if (!prompt || assistantLoading) return;

    setAssistantInput(prompt);
    setAssistantLoading(true);
    setAssistantResponse(null);

    try {
      const res = await fetch('/api/copilot/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: prompt,
          contractId: selectedContractId === 'general' ? 'general' : selectedContractId,
        }),
      });
      const data = await res.json();
      setAssistantResponse(data);
    } catch (err) {
      setAssistantResponse({
        answer: 'Failed to communicate with AI Assistant. Please check your connection and try again.',
      });
    } finally {
      setAssistantLoading(false);
    }
  };

  const copyAssistantAnswer = () => {
    if (!assistantResponse?.answer) return;
    navigator.clipboard.writeText(assistantResponse.answer);
    setCopiedAnswer(true);
    setTimeout(() => setCopiedAnswer(false), 2000);
  };

  const scrollToAssistant = () => {
    assistantSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AppShell title="Contract Workspace">
      <main className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-7xl mx-auto">
        {error && (
          <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        {/* SECTION A: Welcome Header */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#17243A]">
              Good to see you again.
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Your contracts, insights and next steps — all in one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/dashboard/analyze"
              className="inline-flex items-center gap-2 bg-[#2458D3] hover:bg-[#193F9B] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <UploadCloud size={16} />
              <span>Analyze a Contract</span>
            </Link>
            <button
              onClick={scrollToAssistant}
              className="inline-flex items-center gap-2 bg-[#F4F7FC] hover:bg-[#EAF1FF] text-[#17243A] hover:text-[#2458D3] border border-[#E2E8F0] text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              <Bot size={16} className="text-[#2458D3]" />
              <span>Ask AI About a Contract</span>
            </button>
          </div>
        </div>

        {/* SECTION B: Real Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            label="Total Documents"
            value={loading ? '—' : String(contracts.length)}
            hint={`${contracts.length} agreements stored in vault`}
            icon={FileText}
          />
          <StatCard
            label="Completed Analyses"
            value={loading ? '—' : String(completedAnalyses)}
            hint="Structured clause breakdowns"
            icon={CheckCircle2}
            accent="text-[#2458D3]"
          />
          <StatCard
            label="Potential Risks Identified"
            value={loading ? '—' : String(potentialRisks)}
            hint={potentialRisks ? `${potentialRisks} contracts have flagged items` : 'Zero elevated hazards detected'}
            icon={AlertTriangle}
            accent={potentialRisks > 0 ? 'text-[#DC2626]' : 'text-[#059669]'}
          />
          <StatCard
            label="Remaining Monthly Analyses"
            value={loading ? '—' : `${remainingCredits}/${credits}`}
            hint={`Monthly quota (${tier.toUpperCase()} Plan)`}
            icon={Sparkles}
          />
        </div>

        {/* SECTION C: 4 Quick Actions */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Quick Actions</h2>
            <span className="text-[11px] text-[#94A3B8]">Direct shortcuts</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/dashboard/analyze"
              className="group bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] p-5 rounded-2xl shadow-xs transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF1FF] text-[#2458D3] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#17243A] group-hover:text-[#2458D3] transition-colors flex items-center gap-1.5">
                    Analyze a Contract
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1 line-clamp-2">
                    Upload and audit any agreement for hidden clauses and liabilities in seconds.
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#2458D3] mt-4 inline-flex items-center gap-1">
                Start scanning &rarr;
              </span>
            </Link>

            <Link
              href="/dashboard/risk-assessment"
              className="group bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] p-5 rounded-2xl shadow-xs transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#17243A] group-hover:text-[#D97706] transition-colors flex items-center gap-1.5">
                    Risk Assessment
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1 line-clamp-2">
                    Inspect high, medium, and low risks across your active contract portfolio.
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#D97706] mt-4 inline-flex items-center gap-1">
                View risk audit &rarr;
              </span>
            </Link>

            <Link
              href="/dashboard/compare"
              className="group bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] p-5 rounded-2xl shadow-xs transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <GitCompare size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#17243A] group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                    Compare Documents
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1 line-clamp-2">
                    Detect added, deleted, and modified clauses between two contract versions.
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-indigo-600 mt-4 inline-flex items-center gap-1">
                Run comparison &rarr;
              </span>
            </Link>

            <Link
              href="/dashboard/document-generator"
              className="group bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] p-5 rounded-2xl shadow-xs transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FilePlus2 size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#17243A] group-hover:text-[#059669] transition-colors flex items-center gap-1.5">
                    Generate a Document
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1 line-clamp-2">
                    Draft legally sound NDAs, service contracts, and freelance agreements.
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#059669] mt-4 inline-flex items-center gap-1">
                Create agreement &rarr;
              </span>
            </Link>
          </div>
        </section>

        {/* SECTION D: Recent Documents with Search, Filter & Row Actions */}
        <section className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#F1F5F9]">
            <div>
              <h2 className="text-base font-bold text-[#17243A]">Recent Documents</h2>
              <p className="text-xs text-[#64748B]">Manage, inspect, and evaluate your uploaded contracts</p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search bar */}
              <div className="relative min-w-[200px] sm:min-w-[240px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search agreements…"
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-[#17243A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2458D3]"
                />
              </div>

              {/* Risk Filter Buttons */}
              <div className="flex items-center bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl p-0.5 text-xs">
                {(['all', 'high', 'medium', 'low'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setRiskFilter(lvl)}
                    className={`px-2.5 py-1 rounded-lg font-medium capitalize transition-all cursor-pointer ${
                      riskFilter === lvl
                        ? 'bg-white text-[#17243A] shadow-xs font-semibold'
                        : 'text-[#64748B] hover:text-[#17243A]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <ArrowUpDown size={13} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl px-2.5 py-1.5 text-xs text-[#17243A] focus:outline-none cursor-pointer"
                >
                  <option value="recent">Most Recent</option>
                  <option value="risk">Highest Risk</option>
                  <option value="title">Alphabetical</option>
                </select>
              </div>

              <Link
                href="/dashboard/documents"
                className="text-xs font-semibold text-[#2458D3] hover:underline px-2 py-1"
              >
                View all &rarr;
              </Link>
            </div>
          </div>

          {filteredContracts.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#EAF1FF] text-[#2458D3] flex items-center justify-center mx-auto">
                <UploadCloud size={28} />
              </div>
              <h3 className="font-bold text-[#17243A] text-base">
                {searchQuery || riskFilter !== 'all' ? 'No matching contracts found' : 'Nothing here yet.'}
              </h3>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto leading-relaxed">
                {searchQuery || riskFilter !== 'all'
                  ? 'Try clearing your search query or switching your risk filter tabs.'
                  : "Upload your first contract to start discovering what's inside."}
              </p>
              {searchQuery || riskFilter !== 'all' ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setRiskFilter('all');
                  }}
                  className="text-xs text-[#2458D3] font-semibold hover:underline cursor-pointer"
                >
                  Clear filters
                </button>
              ) : (
                <Link
                  href="/dashboard/analyze"
                  className="inline-flex items-center gap-1.5 bg-[#2458D3] hover:bg-[#193F9B] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors mt-2 cursor-pointer"
                >
                  <span>Analyze a Contract</span>
                  <ArrowRight size={13} />
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[700px]">
                <thead className="text-[11px] uppercase tracking-wider text-[#94A3B8] border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Document Title</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                    <th className="py-2.5 px-3 font-semibold">Risk Level</th>
                    <th className="py-2.5 px-3 font-semibold">Score</th>
                    <th className="py-2.5 px-3 font-semibold">Updated</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F8FAFC]">
                  {filteredContracts.slice(0, 8).map((doc) => (
                    <tr key={doc.id} className="hover:bg-[#F8FAFC] transition-colors group">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#EAF1FF] text-[#2458D3] text-[10px] font-bold flex items-center justify-center shrink-0">
                            {(doc.file_type || 'PDF').slice(0, 3).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-xs text-[#17243A] group-hover:text-[#2458D3] transition-colors line-clamp-1">
                              {doc.title}
                            </p>
                            <p className="text-[11px] text-[#94A3B8]">
                              {formatFileSize(doc.file_size_bytes)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={doc.document_status} riskLevel={doc.overall_risk_level} />
                      </td>
                      <td className="py-3 px-3">
                        <RiskBadge level={doc.overall_risk_level} />
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-xs text-[#17243A]">
                        {doc.overall_risk_score !== null ? `${doc.overall_risk_score}/100` : '—'}
                      </td>
                      <td className="py-3 px-3 text-xs text-[#64748B]">
                        {new Date(doc.updated_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <Link
                          href={`/dashboard/documents`}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2458D3] hover:text-[#193F9B] bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          View Details
                        </Link>
                        <Link
                          href={`/dashboard/risk-assessment?id=${doc.id}`}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          Check Risks
                        </Link>
                        <Link
                          href={`/dashboard/compare`}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-[#17243A] bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          Compare
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* SECTION E & F: Risk Overview & Activity Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* SECTION E: Dedicated Risk Overview Card */}
          <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-[#17243A]">Risk Overview</h2>
                  <p className="text-xs text-[#64748B]">Flagged vulnerabilities across contracts</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#D97706] flex items-center justify-center">
                  <ShieldAlert size={18} />
                </div>
              </div>

              {/* Risk Distribution Breakdown */}
              <div className="space-y-3.5">
                <RiskBarItem
                  label="High Risks"
                  count={riskCounts.High}
                  total={contracts.length || 1}
                  color="bg-[#DC2626]"
                  badgeClass="bg-rose-50 text-[#DC2626] border-rose-200"
                  description="Severe liability, uncapped damages or one-sided indemnity"
                />
                <RiskBarItem
                  label="Medium Risks"
                  count={riskCounts.Medium}
                  total={contracts.length || 1}
                  color="bg-[#D97706]"
                  badgeClass="bg-amber-50 text-[#D97706] border-amber-200"
                  description="Ambiguous deliverables, unilateral notice or warranty gaps"
                />
                <RiskBarItem
                  label="Low / Standard"
                  count={riskCounts.Low}
                  total={contracts.length || 1}
                  color="bg-[#059669]"
                  badgeClass="bg-emerald-50 text-[#059669] border-emerald-200"
                  description="Standard market terms, balanced liabilities"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
              <span className="text-xs text-[#64748B]">
                {potentialRisks > 0 ? `${potentialRisks} contracts require review` : 'All contracts within safe thresholds'}
              </span>
              <Link
                href="/dashboard/risk-assessment"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2458D3] hover:text-[#193F9B]"
              >
                <span>Open Risk Assessment</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* SECTION F: Activity Timeline */}
          <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#17243A]">Activity Timeline</h2>
                <p className="text-xs text-[#64748B]">Audit logs and contract analysis events</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2458D3] flex items-center justify-center">
                <Clock size={16} />
              </div>
            </div>

            {contracts.length === 0 ? (
              <div className="py-10 text-center text-xs text-[#64748B]">
                Activity events will be recorded here as you upload and review agreements.
              </div>
            ) : (
              <div className="space-y-3.5">
                {contracts.slice(0, 4).map((c) => (
                  <div key={c.id} className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#2458D3] mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#17243A] truncate">
                        {c.document_status === 'analyzed'
                          ? `Analysis completed for "${c.title}"`
                          : `Uploaded "${c.title}" for review`}
                      </p>
                      <p className="text-[11px] text-[#64748B] flex items-center gap-2 mt-0.5">
                        <span>{new Date(c.updated_at).toLocaleDateString()}</span>
                        <span>&bull;</span>
                        <span className={c.overall_risk_level === 'High' ? 'text-rose-600 font-semibold' : 'text-slate-600'}>
                          {c.overall_risk_level ? `${c.overall_risk_level} Risk Level` : 'Pending Score'}
                        </span>
                      </p>
                    </div>
                    <Link
                      href={`/dashboard/risk-assessment?id=${c.id}`}
                      className="text-[11px] font-semibold text-[#2458D3] hover:underline shrink-0"
                    >
                      Inspect
                    </Link>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
              <span className="text-[#94A3B8]">Audit logs retained securely</span>
              <Link href="/dashboard/history" className="font-semibold text-[#2458D3] hover:underline">
                View full history &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* SECTION G: Embedded AI Contract Assistant */}
        <section
          ref={assistantSectionRef}
          className="bg-white border border-[#CBD5E1] rounded-2xl p-6 sm:p-7 shadow-xs space-y-5"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2458D3] bg-[#EAF1FF] px-2.5 py-0.5 rounded-full mb-1">
                <Sparkles size={12} />
                <span>AI Copilot Engine</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#17243A]">
                Have a question about your contracts?
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B]">
                Ask DealSafe AI anything about your agreements, clauses, or liabilities.
              </p>
            </div>

            {/* Contract Context Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#64748B] font-medium shrink-0">Context:</span>
              <select
                value={selectedContractId}
                onChange={(e) => setSelectedContractId(e.target.value)}
                className="bg-[#F4F7FC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-semibold text-[#17243A] focus:outline-none focus:border-[#2458D3] max-w-[240px] truncate"
              >
                <option value="general">All Contracts (Workspace Context)</option>
                {contracts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Suggestion Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mr-1">
              Suggested:
            </span>
            {[
              'What are my main termination risks?',
              'Are there any automatic renewal clauses?',
              'Summarize my liability exposure',
              'What obligations are due soon?',
            ].map((q) => (
              <button
                key={q}
                onClick={() => handleAskAssistant(q)}
                disabled={assistantLoading}
                className="text-xs bg-[#F4F7FC] hover:bg-[#EAF1FF] hover:text-[#2458D3] hover:border-[#2458D3] border border-[#E2E8F0] rounded-xl px-3 py-1.5 font-medium text-[#17243A] transition-all cursor-pointer disabled:opacity-50 text-left"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box with Send Button */}
          <div className="relative">
            <input
              type="text"
              value={assistantInput}
              onChange={(e) => setAssistantInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAskAssistant();
              }}
              placeholder="e.g., Can the vendor terminate without cause? What is the notice period?"
              disabled={assistantLoading}
              className="w-full pl-4 pr-24 py-3.5 text-xs sm:text-sm bg-[#F4F7FC] border border-[#CBD5E1] rounded-xl text-[#17243A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2458D3] focus:bg-white transition-all shadow-inner"
            />
            <button
              onClick={() => handleAskAssistant()}
              disabled={!assistantInput.trim() || assistantLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#2458D3] hover:bg-[#193F9B] disabled:opacity-40 text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {assistantLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Scanning…</span>
                </>
              ) : (
                <>
                  <span>Ask AI</span>
                  <Send size={13} />
                </>
              )}
            </button>
          </div>

          {/* Live Assistant Answer Panel */}
          {assistantResponse && (
            <div className="bg-[#F4F7FC] border border-[#CBD5E1] rounded-xl p-5 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#2458D3] text-white flex items-center justify-center">
                    <Bot size={14} />
                  </div>
                  <span className="font-bold text-xs text-[#17243A]">DealSafe Intelligence Findings</span>
                </div>
                <button
                  onClick={copyAssistantAnswer}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#64748B] hover:text-[#17243A] bg-white border border-[#E2E8F0] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  {copiedAnswer ? (
                    <>
                      <Check size={12} className="text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy Answer</span>
                    </>
                  )}
                </button>
              </div>

              {/* Formatted Answer */}
              <div className="text-xs sm:text-sm text-[#1E293B] leading-relaxed whitespace-pre-wrap font-sans">
                {assistantResponse.answer}
              </div>

              {/* Key Takeaways */}
              {assistantResponse.keyTakeaways && assistantResponse.keyTakeaways.length > 0 && (
                <div className="bg-white border border-[#E2E8F0] rounded-lg p-3.5 space-y-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#2458D3]">Key Takeaways</p>
                  <ul className="list-disc pl-4 text-xs text-[#334155] space-y-1">
                    {assistantResponse.keyTakeaways.map((k, i) => (
                      <li key={i}>{k}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Clause References */}
              {assistantResponse.references && assistantResponse.references.length > 0 && (
                <div className="text-[11px] text-[#64748B] flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="font-semibold text-[#17243A]">Citations:</span>
                  {assistantResponse.references.map((r, i) => (
                    <span key={i} className="bg-white border border-[#E2E8F0] px-2 py-0.5 rounded text-[#475569]">
                      {r}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Suggested Rewrite Modal */}
      {showRewrite && analysis?.suggested_rewrite && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setShowRewrite(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E2E8F0]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-lg text-[#17243A] mb-2">DealSafe Suggested Rewrite</h3>
            <p className="text-xs text-[#64748B] mb-4">
              Balanced language designed to cap exposure while preserving commercial intent.
            </p>
            <div className="bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl p-4 font-mono text-xs text-[#1E293B] leading-relaxed whitespace-pre-wrap">
              {analysis.suggested_rewrite}
            </div>
            <button
              onClick={() => setShowRewrite(false)}
              className="mt-5 w-full bg-[#111C2E] hover:bg-[#263A59] text-white rounded-xl py-3 text-sm font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}

// Visual Risk Progress Bar Item
function RiskBarItem({
  label,
  count,
  total,
  color,
  badgeClass,
  description,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
  badgeClass: string;
  description: string;
}) {
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${badgeClass}`}>
            {label}
          </span>
          <span className="text-[#64748B]">{count} agreements</span>
        </div>
        <span className="font-mono font-bold text-[#17243A]">{percent}%</span>
      </div>
      <div className="h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
        <div
          className={`h-2 rounded-full ${color} transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-[10px] text-[#94A3B8]">{description}</p>
    </div>
  );
}

function RiskBadge({ level }: { level?: string | null }) {
  if (level === 'High' || level === 'Critical') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
        High Risk
      </span>
    );
  }
  if (level === 'Medium') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
        Medium Risk
      </span>
    );
  }
  if (level === 'Low') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
        Low Risk
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-full">
      Pending
    </span>
  );
}

function StatusBadge({ status, riskLevel }: { status: string; riskLevel?: string | null }) {
  if (status === 'processing') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        Processing
      </span>
    );
  }
  if (status === 'failed') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
        Failed
      </span>
    );
  }
  if (status === 'pending') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-full">
        Pending
      </span>
    );
  }
  if (riskLevel === 'High' || riskLevel === 'Critical') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
        Action Required
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
      Analysis Complete
    </span>
  );
}

function StatCard({
  label,
  value,
  hint,
  accent,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint: string;
  accent?: string;
  icon?: any;
}) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">{label}</p>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-[#F4F7FC] text-[#64748B] flex items-center justify-center">
            <Icon size={16} />
          </div>
        )}
      </div>
      <div>
        <p className={`text-2xl sm:text-3xl font-black ${accent || 'text-[#17243A]'}`}>{value}</p>
        <p className="mt-1 text-[11px] text-[#94A3B8]">{hint}</p>
      </div>
    </div>
  );
}
