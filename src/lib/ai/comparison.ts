// src/lib/ai/comparison.ts
import { z } from 'zod';
import { openai } from '@/lib/openai';

export interface ClauseChange {
  id: string;
  clause: string;
  type: 'added' | 'removed' | 'modified';
  versionA_text: string;
  versionB_text: string;
  pageA?: number;
  pageB?: number;
  riskImpact: 'High' | 'Medium' | 'Low';
  description: string;
  recommendation: string;
  evidence_verified: boolean;
}

export interface ComparisonResult {
  summary: string;
  overallImpact: 'Favorable' | 'Unfavorable' | 'Neutral';
  totalChanges: number;
  changes: ClauseChange[];
  riskScoreA?: number;
  riskScoreB?: number;
  keyAreas: string[];
}

const ComparisonSchema = z.object({
  summary: z.string(),
  overallImpact: z.enum(['Favorable', 'Unfavorable', 'Neutral']),
  totalChanges: z.number(),
  changes: z.array(z.object({
    id: z.string(),
    clause: z.string(),
    type: z.enum(['added', 'removed', 'modified']),
    versionA_text: z.string(),
    versionB_text: z.string(),
    pageA: z.number().optional(),
    pageB: z.number().optional(),
    riskImpact: z.enum(['High', 'Medium', 'Low']),
    description: z.string(),
    recommendation: z.string(),
  })),
  keyAreas: z.array(z.string()).optional(),
});

export async function compareContracts(
  textA: string,
  textB: string,
  pagesA?: string[],
  pagesB?: string[]
): Promise<ComparisonResult> {
  const prompt = `You are an expert contract comparison analyst. Compare Version A and Version B.

Version A (Original):
${textA.slice(0, 8000)}

Version B (Revised):
${textB.slice(0, 8000)}

Return JSON with this exact structure:
{
  "summary": "plain-English overview of main differences and risk shift",
  "overallImpact": "Favorable" | "Unfavorable" | "Neutral",
  "totalChanges": number,
  "changes": [
    {
      "id": "c-1",
      "clause": "clause name",
      "type": "added" | "removed" | "modified",
      "versionA_text": "quoted text from A (or empty if added)",
      "versionB_text": "quoted text from B (or empty if removed)",
      "pageA": page number or null,
      "pageB": page number or null,
      "riskImpact": "High" | "Medium" | "Low",
      "description": "what changed and why it matters",
      "recommendation": "action recommended"
    }
  ],
  "keyAreas": ["Payment", "Liability", ...]
}

Focus on: payment terms, liability, termination, IP, indemnification, confidentiality.
Every versionA_text and versionB_text must be exact quotes from the provided text.
Return strictly valid JSON.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
    max_tokens: 3000,
    response_format: { type: 'json_object' },
  });

  const raw = completion.choices[0].message.content || '{}';
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = { summary: raw, overallImpact: 'Neutral', totalChanges: 0, changes: [], keyAreas: [] };
  }

  // Verify evidence quotes against source text
  const changes: ClauseChange[] = (parsed.changes || []).map((c: any) => {
    const verifiedA = c.versionA_text ? textA.includes(c.versionA_text.slice(0, 50)) : true;
    const verifiedB = c.versionB_text ? textB.includes(c.versionB_text.slice(0, 50)) : true;
    return {
      id: c.id || `c-${Math.random().toString(36).slice(2, 6)}`,
      clause: c.clause,
      type: c.type,
      versionA_text: c.versionA_text || '',
      versionB_text: c.versionB_text || '',
      pageA: c.pageA,
      pageB: c.pageB,
      riskImpact: c.riskImpact,
      description: c.description,
      recommendation: c.recommendation,
      evidence_verified: verifiedA && verifiedB,
    };
  });

  return {
    summary: parsed.summary || '',
    overallImpact: parsed.overallImpact || 'Neutral',
    totalChanges: changes.length,
    changes,
    keyAreas: parsed.keyAreas || [],
  };
}
