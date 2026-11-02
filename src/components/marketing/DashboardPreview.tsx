'use client';

import { useState } from 'react';
import {
  FileText,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Layers,
} from 'lucide-react';

interface ContractRow {
  id: string;
  name: string;
  category: string;
  catClass: string;
  risk: 'Low' | 'Medium' | 'High';
  riskClass: string;
  badgeBg: string;
  expiry: string;
  pages: number;
  score: number;
  citation: string;
  summary: string;
  recommendation: string;
}

const demoContracts: ContractRow[] = [
  {
    id: 'c1',
    name: 'Master_Services_Agreement_2026.pdf',
    category: 'SaaS / Services',
    catClass: 'bg-[#EEF2FF] text-[#1D4ED8]',
    risk: 'High',
    riskClass: 'text-rose-700',
    badgeBg: 'bg-rose-50 border-rose-200',
    expiry: 'Dec 15, 2026',
    pages: 14,
    score: 68,
    citation: 'Page 9, Section 14.2',
    summary: 'Uncapped consequential and indirect liability clause with broad indemnification exposure.',
    recommendation: 'Insert mutual liability cap tied to 12 months of total service fees paid under Schedule A.',
  },
  {
    id: 'c2',
    name: 'Commercial_Office_Lease_Suite400.pdf',
    category: 'Real Estate',
    catClass: 'bg-[#FEF3C7] text-[#B45309]',
    risk: 'Medium',
    riskClass: 'text-amber-700',
    badgeBg: 'bg-amber-50 border-amber-200',
    expiry: 'Mar 1, 2027',
    pages: 22,
    score: 61,
    citation: 'Page 7, Section 9.3',
    summary: 'Uncapped CAM pass-through expenses without annual index limits or tenant audit rights.',
    recommendation: 'Negotiate a 5% cumulative annual cap on operating expenses and reserve annual audit rights.',
  },
  {
    id: 'c3',
    name: 'Mutual_Non_Disclosure_Agreement.pdf',
    category: 'Confidentiality',
    catClass: 'bg-[#ECFDF5] text-[#059669]',
    risk: 'Low',
    riskClass: 'text-emerald-700',
    badgeBg: 'bg-emerald-50 border-emerald-200',
    expiry: 'Nov 30, 2028',
    pages: 4,
    score: 95,
    citation: 'Page 2, Section 4.1',
    summary: 'Standard 3-year confidentiality term with mutual obligations and standard exclusions.',
    recommendation: 'Balanced and protective for both parties. Approve as drafted.',
  },
];

export default function DashboardPreview() {
  const [selectedId, setSelectedId] = useState<string>('c1');
  const selectedContract = demoContracts.find((c) => c.id === selectedId) || demoContracts[0];

  return (
    <div className="relative mx-auto max-w-[1040px] -mb-20 md:-mb-28">
      {/* Glow highlight behind dashboard */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600/20 via-indigo-500/20 to-sky-400/20 rounded-[30px] blur-xl opacity-75 pointer-events-none" />

      {/* Main Glass Dashboard Card */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-[24px] border border-[#E2E8F0] shadow-[0_30px_90px_rgba(11,27,59,0.14)] overflow-hidden text-left">
        {/* App Bar Window Controls */}
        <div className="h-12 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF5F57] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#FEBC2E] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#28C840] inline-block" />
            <div className="ml-3 hidden sm:flex items-center gap-2 text-[12px] font-semibold text-[#475569] bg-white border border-[#E2E8F0] px-3 py-1 rounded-md">
              <span className="w-2 h-2 rounded-full bg-[#1D4ED8]" />
              <span>app.dealsafe.ai/workspace</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#1D4ED8] bg-[#EEF2FF] border border-[#DBEAFE] px-3 py-1 rounded-full">
              <Sparkles size={11} className="text-[#2563EB]" />
              DEMONSTRATION PREVIEW
            </span>
          </div>
        </div>

        {/* Dashboard Shell Body */}
        <div className="flex flex-col lg:flex-row">
          {/* Main Dashboard Canvas */}
          <div className="flex-1 p-5 sm:p-7 bg-[#F8FAFC]">
            {/* Top 4 KPI Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-2xs">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Total Documents</p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-[#0B1B3B]">24</span>
                  <span className="text-[11px] font-medium text-emerald-600 flex items-center">
                    <TrendingUp size={12} className="mr-0.5" /> +15%
                  </span>
                </div>
                <p className="text-[11px] text-[#94A3B8] mt-1">Organized in Vault</p>
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-2xs">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Completed Analyses</p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-[#0B1B3B]">24</span>
                  <span className="text-[11px] text-[#64748B]">100% cited</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] mt-1">Page-level citations</p>
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-2xs">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Potential Risks Identified</p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-rose-600">3</span>
                  <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">Action Required</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] mt-1">Review before signing</p>
              </div>

              <div className="bg-gradient-to-br from-[#1E3A8A] to-[#1D4ED8] text-white rounded-2xl p-4 shadow-md flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                    ANALYSIS STATUS
                  </span>
                  <CheckCircle2 size={14} className="text-emerald-300" />
                </div>
                <div>
                  <p className="text-[15px] font-bold">Analysis Complete</p>
                  <p className="text-[11px] text-blue-100">All clauses verified</p>
                </div>
              </div>
            </div>

            {/* Contract List Table */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 mb-4 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-[14px] font-bold text-[#0B1B3B]">Uploaded Contracts</h4>
                  <p className="text-[11px] text-[#64748B]">Select an agreement to preview AI findings &amp; citations</p>
                </div>
                <span className="text-[11px] font-semibold text-[#1D4ED8] bg-blue-50 px-2.5 py-1 rounded-md">
                  Interactive Demo
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-[#F1F5F9] text-[11px] uppercase tracking-wider text-[#94A3B8] font-bold">
                      <th className="pb-3 font-semibold">Contract Title</th>
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold">Risk Level</th>
                      <th className="pb-3 font-semibold">Health Score</th>
                      <th className="pb-3 font-semibold text-right">Evidence Citation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F8FAFC]">
                    {demoContracts.map((row) => {
                      const isSelected = row.id === selectedId;
                      return (
                        <tr
                          key={row.id}
                          onClick={() => setSelectedId(row.id)}
                          className={`cursor-pointer transition-colors ${isSelected ? 'bg-[#EFF6FF]' : 'hover:bg-[#F8FAFC]'
                            }`}
                        >
                          <td className="py-3 font-semibold text-[#0B1B3B] flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] text-[#1D4ED8] flex items-center justify-center shrink-0">
                              <FileText size={15} />
                            </div>
                            <span className="truncate max-w-[180px] sm:max-w-[220px]">{row.name}</span>
                          </td>
                          <td className="py-3">
                            <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${row.catClass}`}>
                              {row.category}
                            </span>
                          </td>
                          <td className="py-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${row.badgeBg} ${row.riskClass}`}
                            >
                              {row.risk === 'High' && <ShieldAlert size={12} />}
                              {row.risk === 'Medium' && <AlertTriangle size={12} />}
                              {row.risk === 'Low' && <ShieldCheck size={12} />}
                              {row.risk} Risk
                            </span>
                          </td>
                          <td className="py-3 font-mono font-bold text-[#0B1B3B]">
                            {row.score}/100
                          </td>
                          <td className="py-3 text-right font-mono text-[#64748B] text-[12px]">{row.citation}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Inspector Drawer (Inspecting Selected Contract) */}
          <div className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-[#E2E8F0] p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F1F5F9]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                  Contract Summary
                </span>
                <span className="text-[11px] font-mono font-bold text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded">
                  {selectedContract.pages} Pages
                </span>
              </div>

              <h4 className="text-[14px] font-bold text-[#0B1B3B] mb-1">
                {selectedContract.name}
              </h4>
              <p className="text-[11px] font-mono text-[#2563EB] mb-4">
                Cited: {selectedContract.citation}
              </p>

              {/* Health Score Gauge */}
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] mb-4 text-center">
                <span className="text-3xl font-black text-[#0B1B3B]">
                  {selectedContract.score}
                </span>
                <span className="text-xs text-[#94A3B8]">/100</span>
                <p className="text-[11px] font-semibold text-[#64748B] mt-0.5">
                  Overall Risk Indicator
                </p>
              </div>

              {/* Detected Risky Clause */}
              <div className="mb-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5 flex items-center gap-1">
                  <ShieldAlert size={12} className="text-rose-600" />
                  Detected Risky Clause
                </p>
                <div className="p-3 rounded-xl bg-[#FEF2F2] border border-rose-200 text-rose-950 text-[12px] leading-relaxed">
                  {selectedContract.summary}
                </div>
              </div>

              {/* Recommended Action */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#1D4ED8] mb-1.5 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  Recommended Action
                </p>
                <div className="p-3 rounded-xl bg-[#EFF6FF] border border-blue-200 text-[#1E3A8A] text-[12px] leading-relaxed">
                  {selectedContract.recommendation}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#F1F5F9]">
              <a
                href="/auth/login?mode=signup"
                className="w-full py-2.5 px-4 rounded-xl bg-[#0B1B3B] hover:bg-[#1E3A8A] text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Analyze Your Contract</span>
                <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
