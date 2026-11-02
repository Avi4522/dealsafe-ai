// src/app/api/ai/report/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const ReportRequestSchema = z.object({
  documentId: z.string().uuid(),
  analysisId: z.string().uuid().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ReportRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { documentId, analysisId } = parsed.data;

    // Fetch document
    const { data: document } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    // Fetch analysis
    let analysis = null;
    if (analysisId) {
      const { data } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', analysisId)
        .single();
      analysis = data;
    } else {
      const { data } = await supabase
        .from('analyses')
        .select('*')
        .eq('document_id', documentId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      analysis = data;
    }

    // Fetch findings
    const { data: findings } = await supabase
      .from('analysis_findings')
      .select('*')
      .eq('analysis_id', analysis?.id || '')
      .order('created_at', { ascending: true });

    // Build report HTML
    const reportHtml = buildReportHtml(document, analysis, findings || []);

    // Return as downloadable content
    const reportBuffer = Buffer.from(reportHtml, 'utf-8');

    // Audit log
    try {
      await supabase.from('audit_logs').insert({
        action: 'report_downloaded',
        resource_type: 'document',
        resource_id: documentId,
        metadata: { analysis_id: analysis?.id },
      });
    } catch {}

    return new NextResponse(reportBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="DealSafe-Report-${documentId}.html"`,
      },
    });
  } catch (error: any) {
    console.error('Report Error:', error);
    return NextResponse.json(
      { error: error.message || 'Report generation failed' },
      { status: 500 }
    );
  }
}

function buildReportHtml(document: any, analysis: any, findings: any[]): string {
  const riskLevel = analysis?.risk_level || 'unknown';
  const riskScore = analysis?.risk_score || 0;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>DealSafe AI Contract Analysis Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1e293b; }
    h1 { color: #0B1B3B; border-bottom: 2px solid #1D4ED8; padding-bottom: 10px; }
    h2 { color: #1E3A8A; margin-top: 30px; }
    .risk-badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 14px; }
    .risk-high { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
    .risk-medium { background: #fffbeb; color: #d97706; border: 1px solid #fde68a; }
    .risk-low { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
    .finding { border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 12px 0; }
    .finding-title { font-weight: bold; color: #0B1B3B; }
    .quote { background: #f8fafc; border-left: 3px solid #1D4ED8; padding: 10px 14px; margin: 8px 0; font-style: italic; font-size: 13px; color: #475569; }
    .page-ref { color: #1D4ED8; font-weight: bold; font-size: 12px; }
    .disclaimer { background: #fef3c7; border: 1px solid #fde68a; padding: 12px; border-radius: 8px; margin-top: 30px; font-size: 13px; color: #92400e; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <h1>DealSafe AI — Contract Analysis Report</h1>

  <p><strong>Document:</strong> ${document?.file_name || 'Unknown'}</p>
  <p><strong>Analysis Date:</strong> ${analysis?.created_at ? new Date(analysis.created_at).toLocaleDateString() : 'N/A'}</p>
  <p><strong>Contract Type:</strong> ${analysis?.contract_type || 'Unknown'}</p>

  <h2>Risk Assessment</h2>
  <p>
    <span class="risk-badge ${riskLevel === 'high' || riskLevel === 'critical' ? 'risk-high' : riskLevel === 'medium' ? 'risk-medium' : 'risk-low'}">
      ${riskLevel.toUpperCase()} RISK
    </span>
    <span style="margin-left: 12px; font-size: 18px; font-weight: bold;">Score: ${riskScore}/100</span>
  </p>
  <p>${analysis?.summary || 'No summary available.'}</p>

  <h2>Findings (${findings.length})</h2>
  ${findings.map((f, idx) => `
    <div class="finding">
      <div class="finding-title">${idx + 1}. ${f.title}</div>
      <p><span class="page-ref">Page ${f.page_number}</span> — <strong>${f.severity.toUpperCase()}</strong> severity — ${f.category}</p>
      <div class="quote">"${f.quoted_text}"</div>
      <p>${f.explanation}</p>
      ${f.recommended_action ? `<p><strong>Recommendation:</strong> ${f.recommended_action}</p>` : ''}
      <p style="font-size: 11px; color: #94a3b8;">Confidence: ${Math.round(f.confidence * 100)}% | Evidence verified: ${f.evidence_verified ? 'Yes' : 'No'}</p>
    </div>
  `).join('')}

  ${analysis?.metadata?.missing_clauses ? `
    <h2>Missing Clauses</h2>
    <ul>
      ${(analysis.metadata.missing_clauses as string[]).map((c: string) => `<li>${c}</li>`).join('')}
    </ul>
  ` : ''}

  <div class="disclaimer">
    <strong>Disclaimer:</strong> This is an AI-assisted analysis, not legal advice.
    The findings are based on automated processing of the contract text and should be
    reviewed by a qualified legal professional before making any decisions.
  </div>

  <div class="footer">
    Generated by DealSafe AI — ${new Date().toISOString()}<br>
    This report is confidential and intended for the document owner only.
  </div>
</body>
</html>`;
}
