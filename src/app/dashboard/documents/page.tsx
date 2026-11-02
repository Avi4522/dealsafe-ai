'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import {
  Folder,
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  FileText,
  Trash2,
  Edit2,
  Download,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  Clock,
  LayoutGrid,
  List,
  AlertTriangle,
  Loader2,
  Calendar,
  Layers,
  ChevronRight,
  X,
  FileCheck2,
} from 'lucide-react';
import { createBrowserSupabase } from '@/lib/supabase/browser';
import { formatFileSize } from '@/lib/utils';

interface ContractItem {
  id: string;
  title: string;
  file_type: string;
  file_size_bytes: number | null;
  document_status: string;
  overall_risk_level: string | null;
  overall_risk_score: number | null;
  clause_count: number | null;
  created_at: string;
  updated_at: string;
}

export default function MyDocumentsPage() {
  const [documents, setDocuments] = useState<ContractItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'pdf' | 'docx' | 'txt'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | '7d' | '30d' | 'older'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'risk'>('newest');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Modals
  const [selectedDoc, setSelectedDoc] = useState<ContractItem | null>(null);
  const [docToRename, setDocToRename] = useState<ContractItem | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [docToDelete, setDocToDelete] = useState<ContractItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDocuments = async () => {
    try {
      const supabase = createBrowserSupabase();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Filter & Sort logic
  const filteredDocuments = useMemo(() => {
    const now = new Date().getTime();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    return documents
      .filter((doc) => {
        // Search
        if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }

        // Type
        if (typeFilter !== 'all') {
          const ext = (doc.file_type || '').toLowerCase();
          if (!ext.includes(typeFilter)) return false;
        }

        // Status
        if (statusFilter !== 'all') {
          if (statusFilter === 'action_required') {
            if (doc.overall_risk_level !== 'High' && doc.overall_risk_level !== 'Critical') {
              return false;
            }
          } else if (doc.document_status !== statusFilter) {
            return false;
          }
        }

        // Risk
        if (riskFilter !== 'all') {
          if (doc.overall_risk_level?.toLowerCase() !== riskFilter.toLowerCase()) {
            return false;
          }
        }

        // Date
        if (dateFilter !== 'all') {
          const docTime = new Date(doc.created_at).getTime();
          if (dateFilter === '7d' && docTime < sevenDaysAgo) return false;
          if (dateFilter === '30d' && (docTime < thirtyDaysAgo || docTime >= sevenDaysAgo)) {
            return false;
          }
          if (dateFilter === 'older' && docTime >= thirtyDaysAgo) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        if (sortBy === 'name') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'risk') {
          return (b.overall_risk_score || 0) - (a.overall_risk_score || 0);
        }
        return 0;
      });
  }, [documents, searchQuery, typeFilter, statusFilter, riskFilter, dateFilter, sortBy]);

  // Rename action
  const handleRename = async () => {
    if (!docToRename || !newTitle.trim()) return;
    setActionLoading(true);

    try {
      const supabase = createBrowserSupabase();
      const { error } = await supabase
        .from('contracts')
        .update({ title: newTitle.trim(), updated_at: new Date().toISOString() })
        .eq('id', docToRename.id);

      if (error) throw error;
      setDocuments((prev) =>
        prev.map((d) => (d.id === docToRename.id ? { ...d, title: newTitle.trim() } : d))
      );
      setDocToRename(null);
    } catch (err) {
      alert('Failed to rename document. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete action
  const handleDelete = async () => {
    if (!docToDelete) return;
    setActionLoading(true);

    try {
      const supabase = createBrowserSupabase();
      const { error } = await supabase.from('contracts').delete().eq('id', docToDelete.id);
      if (error) throw error;

      setDocuments((prev) => prev.filter((d) => d.id !== docToDelete.id));
      setDocToDelete(null);
    } catch (err) {
      alert('Failed to delete document. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Download simulation
  const handleDownload = (doc: ContractItem) => {
    const textContent = `DEALSAFE AI - CONTRACT SUMMARY\n\nTitle: ${doc.title}\nStatus: ${doc.document_status}\nRisk Level: ${doc.overall_risk_level || 'Pending'}\nRisk Score: ${doc.overall_risk_score ?? 'N/A'}/100\nCreated: ${new Date(doc.created_at).toLocaleString()}\n\nDownloaded from DealSafe AI Workspace.`;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell title="My Documents">
      <main className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-7xl mx-auto">
        {/* Workspace Banner */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2458D3] bg-[#EAF1FF] px-2.5 py-0.5 rounded-full mb-1">
              <Folder size={13} />
              <span>Contract Vault</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#17243A]">
              Your Document Workspace
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              All your agreements, organized and ready when you need them.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/analyze"
              className="inline-flex items-center gap-2 bg-[#2458D3] hover:bg-[#193F9B] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Plus size={16} />
              <span>Upload Document</span>
            </Link>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contracts by name or title…"
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl text-[#17243A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2458D3]"
              />
            </div>

            {/* Filter Selectors & View Toggle */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl px-2.5 py-2 text-xs text-[#17243A] focus:outline-none"
              >
                <option value="all">All File Formats</option>
                <option value="pdf">PDF Documents</option>
                <option value="docx">DOCX Word</option>
                <option value="txt">TXT Plain Text</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl px-2.5 py-2 text-xs text-[#17243A] focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="uploaded">Uploaded</option>
                <option value="processing">Processing</option>
                <option value="analyzed">Analysis Complete</option>
                <option value="action_required">Action Required</option>
              </select>

              {/* Risk Level Filter */}
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl px-2.5 py-2 text-xs text-[#17243A] focus:outline-none"
              >
                <option value="all">All Risk Levels</option>
                <option value="high">High Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="low">Low Risk</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl px-2.5 py-2 text-xs text-[#17243A] focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name (A-Z)</option>
                <option value="risk">Highest Risk</option>
              </select>

              {/* View Toggle */}
              <div className="flex items-center bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl p-0.5 ml-auto">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-white text-[#2458D3] shadow-xs'
                      : 'text-[#64748B] hover:text-[#17243A]'
                  }`}
                  aria-label="List View"
                >
                  <List size={15} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white text-[#2458D3] shadow-xs'
                      : 'text-[#64748B] hover:text-[#17243A]'
                  }`}
                  aria-label="Grid View"
                >
                  <LayoutGrid size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section: List vs Grid vs Empty State */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center">
            <Loader2 size={24} className="animate-spin text-[#2458D3] mx-auto mb-2" />
            <p className="text-xs text-[#64748B]">Loading your contract vault…</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-[#EAF1FF] text-[#2458D3] flex items-center justify-center mx-auto shadow-xs">
              <Folder size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#17243A]">
                {searchQuery || typeFilter !== 'all' || riskFilter !== 'all'
                  ? 'No matching agreements found'
                  : 'No contracts yet.'}
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto">
                {searchQuery || typeFilter !== 'all' || riskFilter !== 'all'
                  ? 'Try adjusting your search criteria or resetting the active filters.'
                  : 'Upload your first agreement and keep everything organized in one place.'}
              </p>
            </div>
            <div>
              {searchQuery || typeFilter !== 'all' || riskFilter !== 'all' ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setTypeFilter('all');
                    setStatusFilter('all');
                    setRiskFilter('all');
                    setDateFilter('all');
                  }}
                  className="text-xs text-[#2458D3] font-semibold hover:underline cursor-pointer"
                >
                  Reset all filters
                </button>
              ) : (
                <Link
                  href="/dashboard/analyze"
                  className="inline-flex items-center gap-2 bg-[#2458D3] hover:bg-[#193F9B] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <span>Upload Your First Contract</span>
                  <ChevronRight size={14} />
                </Link>
              )}
            </div>
          </div>
        ) : viewMode === 'list' ? (
          /* Table / List View */
          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[760px]">
              <thead className="text-[11px] uppercase tracking-wider text-[#94A3B8] border-b border-[#F1F5F9] bg-[#F8FAFC]">
                <tr>
                  <th className="py-3 px-5 font-semibold">Contract Title</th>
                  <th className="py-3 px-3 font-semibold">Format</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                  <th className="py-3 px-3 font-semibold">Risk Level</th>
                  <th className="py-3 px-3 font-semibold">Clauses</th>
                  <th className="py-3 px-3 font-semibold">Last Updated</th>
                  <th className="py-3 px-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFC]">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#F8FAFC] transition-colors group">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#EAF1FF] text-[#2458D3] text-xs font-bold flex items-center justify-center shrink-0">
                          <FileText size={16} />
                        </div>
                        <div className="min-w-0">
                          <button
                            onClick={() => setSelectedDoc(doc)}
                            className="font-bold text-xs sm:text-sm text-[#17243A] hover:text-[#2458D3] transition-colors text-left truncate block cursor-pointer"
                          >
                            {doc.title}
                          </button>
                          <span className="text-[11px] text-[#94A3B8]">
                            {formatFileSize(doc.file_size_bytes)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-mono text-[11px] uppercase font-bold text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded">
                        {(doc.file_type || 'PDF').slice(0, 4)}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <DocumentStatusBadge
                        status={doc.document_status}
                        riskLevel={doc.overall_risk_level}
                      />
                    </td>
                    <td className="py-3.5 px-3">
                      <RiskBadge level={doc.overall_risk_level} score={doc.overall_risk_score} />
                    </td>
                    <td className="py-3.5 px-3 font-mono text-xs text-[#17243A]">
                      {doc.clause_count ? `${doc.clause_count} clauses` : '—'}
                    </td>
                    <td className="py-3.5 px-3 text-[#64748B]">
                      {new Date(doc.updated_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/dashboard/risk-assessment?id=${doc.id}`}
                          className="p-1.5 rounded-lg text-[#2458D3] hover:bg-blue-50 transition-colors"
                          title="View Risk Analysis"
                        >
                          <ExternalLink size={14} />
                        </Link>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#17243A] hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Download Document Summary"
                        >
                          <Download size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setDocToRename(doc);
                            setNewTitle(doc.title);
                          }}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#17243A] hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Rename Document"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDocToDelete(doc)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Document"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-2xl p-5 shadow-xs space-y-4 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF1FF] text-[#2458D3] flex items-center justify-center shrink-0">
                      <FileText size={20} />
                    </div>
                    <DocumentStatusBadge
                      status={doc.document_status}
                      riskLevel={doc.overall_risk_level}
                    />
                  </div>

                  <div>
                    <h3
                      onClick={() => setSelectedDoc(doc)}
                      className="font-bold text-sm text-[#17243A] hover:text-[#2458D3] transition-colors truncate cursor-pointer"
                    >
                      {doc.title}
                    </h3>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">
                      {formatFileSize(doc.file_size_bytes)} &bull;{' '}
                      {new Date(doc.updated_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                    <span className="text-[#64748B]">Risk Score:</span>
                    <RiskBadge level={doc.overall_risk_level} score={doc.overall_risk_score} />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                  <Link
                    href={`/dashboard/risk-assessment?id=${doc.id}`}
                    className="text-xs font-semibold text-[#2458D3] hover:underline flex items-center gap-1"
                  >
                    <span>View Analysis</span>
                    <ChevronRight size={13} />
                  </Link>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="p-1 rounded text-[#64748B] hover:text-[#17243A] cursor-pointer"
                    >
                      <Download size={13} />
                    </button>
                    <button
                      onClick={() => {
                        setDocToRename(doc);
                        setNewTitle(doc.title);
                      }}
                      className="p-1 rounded text-[#64748B] hover:text-[#17243A] cursor-pointer"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => setDocToDelete(doc)}
                      className="p-1 rounded text-rose-500 hover:text-rose-700 cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Document Details Modal */}
      {selectedDoc && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setSelectedDoc(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E2E8F0] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-[#17243A]">{selectedDoc.title}</h3>
                <p className="text-xs text-[#64748B]">Vault Document Information</p>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="text-[#94A3B8] hover:text-[#17243A]">
                <X size={18} />
              </button>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Document Status:</span>
                <span className="font-bold text-[#17243A] capitalize">{selectedDoc.document_status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Risk Level:</span>
                <span className="font-bold text-[#17243A]">{selectedDoc.overall_risk_level || 'Pending'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Risk Score:</span>
                <span className="font-bold font-mono text-[#17243A]">
                  {selectedDoc.overall_risk_score !== null ? `${selectedDoc.overall_risk_score}/100` : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">File Size:</span>
                <span className="font-mono text-[#17243A]">{formatFileSize(selectedDoc.file_size_bytes)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Uploaded On:</span>
                <span className="text-[#17243A]">{new Date(selectedDoc.created_at).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <Link
                href={`/dashboard/risk-assessment?id=${selectedDoc.id}`}
                className="flex-1 bg-[#2458D3] hover:bg-[#193F9B] text-white text-xs font-semibold py-2.5 rounded-xl text-center transition-colors"
              >
                Open Full Analysis
              </Link>
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2.5 border border-[#E2E8F0] text-xs font-semibold rounded-xl text-[#17243A] hover:bg-[#F4F7FC]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {docToRename && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setDocToRename(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2E8F0] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-[#17243A]">Rename Document</h3>
            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-1.5">New Document Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#17243A] focus:outline-none focus:border-[#2458D3]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDocToRename(null)}
                className="px-4 py-2 text-xs font-semibold text-[#17243A] hover:bg-[#F4F7FC] rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleRename}
                disabled={actionLoading || !newTitle.trim()}
                className="px-4 py-2 text-xs font-semibold bg-[#2458D3] hover:bg-[#193F9B] text-white rounded-xl"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {docToDelete && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setDocToDelete(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2E8F0] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                <Trash2 size={20} />
              </div>
              <h3 className="font-bold text-base text-[#17243A]">Delete Document?</h3>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Are you sure you want to delete &ldquo;{docToDelete.title}&rdquo;? This will permanently remove its audit records and risk analyses.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDocToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-[#17243A] hover:bg-[#F4F7FC] rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl"
              >
                {actionLoading ? 'Deleting…' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function DocumentStatusBadge({ status, riskLevel }: { status: string; riskLevel?: string | null }) {
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
  if (status === 'uploaded') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-full">
        Uploaded
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

function RiskBadge({ level, score }: { level?: string | null; score?: number | null }) {
  if (level === 'High' || level === 'Critical') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
        High {score !== null && score !== undefined ? `(${score})` : ''}
      </span>
    );
  }
  if (level === 'Medium') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
        Medium {score !== null && score !== undefined ? `(${score})` : ''}
      </span>
    );
  }
  if (level === 'Low') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
        Low {score !== null && score !== undefined ? `(${score})` : ''}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
      Unscored
    </span>
  );
}

