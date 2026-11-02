'use client';

import { useState } from 'react';
import {
  GitCompare,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Download,
  Copy,
  Check,
  RefreshCw,
  PlusCircle,
  MinusCircle,
  FileDiff,
  Sparkles,
  Loader2,
} from 'lucide-react';
import AppShell from '@/components/AppShell';

interface DiffChange {
  id: string;
  clause: string;
  type: 'added' | 'removed' | 'modified';
  versionA?: string;
  versionB?: string;
  riskImpact: 'High' | 'Medium' | 'Low';
  description: string;
  recommendation: string;
}

interface CompareResult {
  summary: string;
  overallImpact: string;
  totalChanges: number;
  changes: DiffChange[];
}

const SAMPLE_A = `MASTER SERVICES AGREEMENT (VERSION 1.0)

Section 4. Payment Terms
Client shall pay all undisputed invoices within thirty (30) calendar days following receipt of the invoice.

Section 8. Term & Renewal
This Agreement shall commence on the Effective Date and remain in effect for twelve (12) months. Either party may terminate with thirty (30) days prior written notice.

Section 14. Limitation of Liability
Each party's maximum aggregate liability under this Agreement shall be limited to the total fees paid by Client during the preceding twelve (12) months.

Section 16. Mutual Indemnification
Each party shall defend, indemnify, and hold harmless the other party against any third-party claims arising out of gross negligence or willful misconduct.`;

const SAMPLE_B = `MASTER SERVICES AGREEMENT (VERSION 2.0 - REVISED)

Section 4. Payment Terms
Client shall pay all undisputed invoices within fifteen (15) calendar days following receipt. A late fee of 2.0% per month shall apply to past-due balances.

Section 8. Term & Renewal
This Agreement automatically renews for successive twenty-four (24) month periods unless written notice is delivered not less than ninety (90) days prior to renewal.

Section 14. Limitation of Liability
Provider's liability is capped at $5,000. Client's liability remains uncapped for indemnification, intellectual property breaches, and indirect damages.

Section 16. Unilateral Indemnification
Client shall indemnify, defend, and hold harmless Provider against all third-party claims, regulatory fines, and legal expenses without limitation.

Section 19. Non-Compete & Exclusivity
Client agrees not to procure similar services from any competitor for a period of two (2) years following termination.`;

export default function DocumentComparisonPage() {
  const [versionAText, setVersionAText] = useState('');
  const [versionBText, setVersionBText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompareResult | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadSample = () => {
    setVersionAText(SAMPLE_A);
    setVersionBText(SAMPLE_B);
  };

  const clearAll = () => {
    setVersionAText('');
    setVersionBText('');
    setResult(null);
  };

  const handleCompare = async () => {
    if (!versionAText.trim() || !versionBText.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractA: versionAText,
          contractB: versionBText,
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Comparison error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadReport = () => {
    if (!result) return;
    const content = `DEALSAFE AI - CONTRACT COMPARISON AUDIT REPORT\nGenerated: ${new Date().toLocaleString()}\n\nOVERALL SUMMARY:\n${result.summary}\nRisk Impact: ${result.overallImpact}\nTotal Changes Detected: ${result.totalChanges}\n\n=========================================\nDETAILED CLAUSE-BY-CLAUSE CHANGES:\n=========================================\n\n` +
      result.changes
        .map(
          (c, idx) =>
            `${idx + 1}. [${c.type.toUpperCase()}] ${c.clause} (Risk: ${c.riskImpact})\n` +
            `Description: ${c.description}\n` +
            (c.versionA ? `Version A: "${c.versionA}"\n` : '') +
            (c.versionB ? `Version B: "${c.versionB}"\n` : '') +
            `Recommendation: ${c.recommendation}\n`
        )
        .join('\n-----------------------------------------\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DealSafe_Contract_Comparison_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell title="Compare Your Contracts">
      <main className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2458D3] bg-[#EAF1FF] px-2.5 py-0.5 rounded-full mb-1">
              <GitCompare size={13} />
              <span>Version Diff Engine</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#17243A]">
              Compare Your Contracts
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              See what changed between two versions of an agreement before you sign.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={loadSample}
              className="inline-flex items-center gap-1.5 bg-[#F4F7FC] hover:bg-[#E2E8F0] text-[#17243A] text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] transition-colors cursor-pointer"
            >
              <Sparkles size={14} className="text-[#2458D3]" />
              <span>Load Sample Comparison</span>
            </button>
            {(versionAText || versionBText || result) && (
              <button
                onClick={clearAll}
                className="text-xs text-[#64748B] hover:text-[#17243A] px-3 py-2 cursor-pointer font-medium"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Input Workstations: Version A vs Version B */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Version A */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs space-y-3 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-slate-100 text-[#17243A] font-bold text-xs flex items-center justify-center">
                  A
                </span>
                <h3 className="font-bold text-sm text-[#17243A]">Version A (Original Agreement)</h3>
              </div>
              <span className="text-[11px] text-[#64748B]">
                {versionAText ? `${versionAText.split(/\s+/).filter(Boolean).length} words` : 'Empty'}
              </span>
            </div>
            <textarea
              value={versionAText}
              onChange={(e) => setVersionAText(e.target.value)}
              placeholder="Paste original contract text here, or load the sample above…"
              className="w-full flex-1 min-h-[220px] p-4 text-xs font-mono bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-[#17243A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2458D3] focus:bg-white resize-y leading-relaxed"
            />
          </div>

          {/* Version B */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs space-y-3 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-blue-100 text-[#2458D3] font-bold text-xs flex items-center justify-center">
                  B
                </span>
                <h3 className="font-bold text-sm text-[#17243A]">Version B (Revised Agreement)</h3>
              </div>
              <span className="text-[11px] text-[#64748B]">
                {versionBText ? `${versionBText.split(/\s+/).filter(Boolean).length} words` : 'Empty'}
              </span>
            </div>
            <textarea
              value={versionBText}
              onChange={(e) => setVersionBText(e.target.value)}
              placeholder="Paste revised contract text here, or load the sample above…"
              className="w-full flex-1 min-h-[220px] p-4 text-xs font-mono bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-[#17243A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2458D3] focus:bg-white resize-y leading-relaxed"
            />
          </div>
        </div>

        {/* Compare Action Button */}
        <div className="flex justify-center">
          <button
            onClick={handleCompare}
            disabled={loading || !versionAText.trim() || !versionBText.trim()}
            className="inline-flex items-center gap-2 bg-[#2458D3] hover:bg-[#193F9B] disabled:opacity-40 text-white font-semibold text-sm px-8 py-3.5 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Comparing Agreements…</span>
              </>
            ) : (
              <>
                <GitCompare size={16} />
                <span>Run Version Comparison</span>
              </>
            )}
          </button>
        </div>

        {/* Comparison Results */}
        {result && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Summary Banner */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9]">
                <div>
                  <h2 className="text-base font-bold text-[#17243A]">Comparison Summary</h2>
                  <p className="text-xs text-[#64748B]">
                    {result.totalChanges} total modifications detected across key provisions
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      result.overallImpact === 'High'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {result.overallImpact} Risk Shift
                  </span>
                  <button
                    onClick={downloadReport}
                    className="inline-flex items-center gap-1.5 bg-[#F4F7FC] hover:bg-[#E2E8F0] text-[#17243A] text-xs font-semibold px-3.5 py-1.5 rounded-xl border border-[#E2E8F0] transition-colors cursor-pointer"
                  >
                    <Download size={13} />
                    <span>Download Report</span>
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#17243A] leading-relaxed">{result.summary}</p>
            </div>

            {/* Changed Clauses Breakdown */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-[#64748B]">
                Detailed Clause Differences ({result.changes.length})
              </h3>

              {result.changes.map((c) => (
                <div
                  key={c.id}
                  className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1F5F9] pb-3">
                    <div className="flex items-center gap-2.5">
                      <ChangeTypeBadge type={c.type} />
                      <h4 className="font-bold text-sm sm:text-base text-[#17243A]">{c.clause}</h4>
                    </div>
                    <span
                      className={`self-start sm:self-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        c.riskImpact === 'High'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : c.riskImpact === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {c.riskImpact} Risk Impact
                    </span>
                  </div>

                  <p className="text-xs text-[#17243A] leading-relaxed">{c.description}</p>

                  {/* Side-by-Side Clause Diff */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* Version A */}
                    <div className="bg-[#FFF1F2]/60 border border-rose-200 rounded-xl p-3.5 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-rose-800">
                        Version A (Original):
                      </span>
                      <p className="font-mono text-[11px] text-[#881337] leading-relaxed whitespace-pre-wrap">
                        {c.versionA || '(Not present in Version A)'}
                      </p>
                    </div>

                    {/* Version B */}
                    <div className="bg-[#ECFDF5]/60 border border-emerald-200 rounded-xl p-3.5 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-emerald-800">
                        Version B (Revised):
                      </span>
                      <p className="font-mono text-[11px] text-[#064E3B] leading-relaxed whitespace-pre-wrap">
                        {c.versionB || '(Removed in Version B)'}
                      </p>
                    </div>
                  </div>

                  {/* AI Recommendation */}
                  <div className="bg-[#EAF1FF]/40 border border-[#2458D3]/15 rounded-xl p-3.5 flex items-start gap-2.5 text-xs">
                    <Sparkles size={15} className="text-[#2458D3] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#2458D3]">Recommendation: </span>
                      <span className="text-[#17243A]">{c.recommendation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </AppShell>
  );
}

function ChangeTypeBadge({ type }: { type: 'added' | 'removed' | 'modified' }) {
  if (type === 'added') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#059669] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
        <PlusCircle size={12} />
        Added Clause
      </span>
    );
  }
  if (type === 'removed') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#DC2626] bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
        <MinusCircle size={12} />
        Removed Clause
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D97706] bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
      <FileDiff size={12} />
      Modified Clause
    </span>
  );
}

