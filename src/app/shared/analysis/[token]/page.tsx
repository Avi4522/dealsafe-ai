// src/app/shared/analysis/[token]/page.tsx
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function SharedAnalysisPage({ params }: { params: { token: string } }) {
  const { data: link } = await supabase
    .from('analysis_share_links')
    .select('*')
    .eq('token', params.token)
    .single();

  if (!link || link.revoked) return notFound();
  if (new Date(link.expires_at) < new Date()) return notFound();

  // Increment access count
  await supabase
    .from('analysis_share_links')
    .update({ access_count: (link.access_count || 0) + 1, last_accessed_at: new Date().toISOString() })
    .eq('id', link.id);

  const { data: analysis } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', link.analysis_id)
    .single();

  const { data: findings } = await supabase
    .from('analysis_findings')
    .select('*')
    .eq('analysis_id', link.analysis_id);

  const { data: document } = await supabase
    .from('documents')
    .select('file_name')
    .eq('id', link.document_id)
    .single();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Shared Contract Analysis</h1>
        <p className="text-sm text-slate-500 mb-6">
          Document: {document?.file_name || 'Unknown'} — Shared via DealSafe AI
        </p>

        {analysis && (
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg font-semibold">
                Risk: {analysis.risk_level?.toUpperCase()} ({analysis.risk_score}/100)
              </span>
            </div>
            <p className="text-slate-700">{analysis.summary}</p>
          </div>
        )}

        {findings && findings.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Findings ({findings.length})</h2>
            {findings.map((f: any, idx: number) => (
              <div key={f.id} className="border rounded-lg p-4 mb-3">
                <div className="font-medium">{idx + 1}. {f.title}</div>
                <div className="text-sm text-slate-500">Page {f.page_number} — {f.severity} — {f.category}</div>
                <div className="text-sm italic text-slate-600 my-2">"{f.quoted_text}"</div>
                <p className="text-sm text-slate-700">{f.explanation}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
          <strong>Notice:</strong> DealSafe AI does not provide legal advice and is not responsible for services provided by listed lawyers. This shared analysis is for informational purposes only.
        </div>

        <div className="mt-4 text-xs text-slate-400">
          This link expires on {new Date(link.expires_at).toLocaleDateString()}. Access count: {link.access_count + 1}
        </div>
      </div>
    </div>
  );
}
