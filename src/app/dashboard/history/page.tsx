'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import {
  History,
  Search,
  Calendar,
  FileText,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Filter,
  Loader2,
} from 'lucide-react';
import { createBrowserSupabase } from '@/lib/supabase/browser';

interface HistoryItem {
  id: string;
  title: string;
  document_status: string;
  overall_risk_level: string | null;
  overall_risk_score: number | null;
  clause_count: number | null;
  created_at: string;
  updated_at: string;
}

export default function DocumentHistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const supabase = createBrowserSupabase();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase
          .from('contracts')
          .select('id, title, document_status, overall_risk_level, overall_risk_score, clause_count, created_at, updated_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setItems(data as HistoryItem[]);
        }
      } catch (err) {
        console.error('History load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (riskFilter !== 'all') {
        if (item.overall_risk_level?.toLowerCase() !== riskFilter) return false;
      }
      return true;
    });
  }, [items, searchQuery, riskFilter]);

  return (
    <AppShell title="Document History">
      <main className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-7xl mx-auto">
        {/* Banner */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2458D3] bg-[#EAF1FF] px-2.5 py-0.5 rounded-full mb-1">
              <History size={13} />
              <span>Audit Trail & Records</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#17243A]">
              Document History
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Chronological log of contract uploads, AI risk audits, and analysis reports.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-[#64748B] font-semibold block">Total Audit Records</span>
            <span className="text-2xl font-black text-[#17243A]">{items.length}</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history by contract title…"
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-[#17243A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2458D3]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#64748B] font-medium">Risk Filter:</span>
            {(['all', 'high', 'medium', 'low'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition-all cursor-pointer ${
                  riskFilter === r
                    ? 'bg-[#17243A] text-white shadow-xs'
                    : 'bg-[#F4F7FC] text-[#64748B] hover:text-[#17243A]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 size={24} className="animate-spin text-[#2458D3] mx-auto mb-2" />
              <p className="text-xs text-[#64748B]">Loading audit logs…</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#64748B]">
              No history records found. Upload a contract to record your first audit.
            </div>
          ) : (
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="text-[11px] uppercase tracking-wider text-[#94A3B8] border-b border-[#F1F5F9] bg-[#F8FAFC]">
                <tr>
                  <th className="py-3 px-5 font-semibold">Activity & Agreement</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                  <th className="py-3 px-3 font-semibold">Risk Level</th>
                  <th className="py-3 px-3 font-semibold">Score</th>
                  <th className="py-3 px-3 font-semibold">Audit Timestamp</th>
                  <th className="py-3 px-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFC]">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8FAFC] transition-colors group">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#EAF1FF] text-[#2458D3] flex items-center justify-center shrink-0">
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-xs sm:text-sm text-[#17243A] group-hover:text-[#2458D3] transition-colors">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-[#64748B]">
                            {item.clause_count ? `${item.clause_count} clauses analyzed` : 'Full audit complete'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full capitalize">
                        <CheckCircle2 size={12} />
                        {item.document_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.overall_risk_level === 'High' || item.overall_risk_level === 'Critical'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : item.overall_risk_level === 'Medium'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {item.overall_risk_level || 'Pending'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-[#17243A]">
                      {item.overall_risk_score !== null ? `${item.overall_risk_score}/100` : '—'}
                    </td>
                    <td className="py-3.5 px-3 text-[#64748B]">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <Link
                        href={`/dashboard/risk-assessment?id=${item.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#2458D3] hover:underline"
                      >
                        <span>Inspect Audit</span>
                        <ChevronRight size={13} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </AppShell>
  );
}

