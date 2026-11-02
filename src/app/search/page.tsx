'use client';

import React, { useState } from 'react';
import AppShell from '@/components/AppShell';
import { Search, FileText, ArrowRight, Sparkles } from 'lucide-react';
import { createBrowserSupabase } from '@/lib/supabase/browser';
import Link from 'next/link';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const supabase = createBrowserSupabase();
      const { data } = await supabase
        .from('contracts')
        .select('id, title, overall_risk_level, overall_risk_score, updated_at')
        .ilike('title', `%${query.trim()}%`);
      setResults(data || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Legal Search">
      <main className="px-4 sm:px-6 py-6 max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#0B1B3B]">Legal Search</h1>
          <p className="text-xs text-[#64748B]">
            Search across your contract database, clauses, and key legal provisions.
          </p>
        </div>

        {/* Search bar */}
        <section className="bg-white border border-[#EEF1F6] p-6 rounded-2xl shadow-xs">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search contract titles, indemnities, liability terms…"
                className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0B1B3B] placeholder-[#94A3B8] focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="bg-[#1E3A8A] hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl transition-colors cursor-pointer"
            >
              {loading ? 'Searching…' : 'Search'}
            </button>
          </form>
        </section>

        {/* Results */}
        {searched && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Search Results ({results.length})
            </h2>

            {results.length === 0 ? (
              <div className="bg-white border border-[#EEF1F6] rounded-2xl p-8 text-center text-xs text-[#64748B]">
                No matching contracts found for &ldquo;{query}&rdquo;. Try another keyword.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {results.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white border border-[#EEF1F6] hover:border-[#CBD5E1] p-4 rounded-xl shadow-xs flex items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#1D4ED8] flex items-center justify-center shrink-0">
                        <FileText size={18} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-xs sm:text-sm text-[#0B1B3B]">{r.title}</h3>
                        <p className="text-[11px] text-[#64748B]">
                          Risk Level: {r.overall_risk_level || 'Pending'} &bull; Updated:{' '}
                          {new Date(r.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/risk-assessment?id=${r.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D4ED8] hover:underline"
                    >
                      <span>Inspect</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </AppShell>
  );
}
