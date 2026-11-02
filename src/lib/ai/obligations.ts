// src/lib/ai/obligations.ts
import { z } from 'zod';
import { openai } from '@/lib/openai';

export interface Obligation {
  id: string;
  type: 'payment' | 'expiry' | 'renewal' | 'notice' | 'deliverable' | 'other';
  description: string;
  date: string; // ISO date string or relative
  isRelative: boolean;
  relativeDays?: number;
  page: number;
  quotedText: string;
  evidence_verified: boolean;
  confirmed: boolean;
  reminderEnabled: boolean;
}

const ObligationSchema = z.object({
  type: z.enum(['payment', 'expiry', 'renewal', 'notice', 'deliverable', 'other']),
  description: z.string(),
  date: z.string(),
  isRelative: z.boolean(),
  relativeDays: z.number().optional(),
  page: z.number(),
  quotedText: z.string(),
});

export async function extractObligations(contractText: string): Promise<Obligation[]> {
  const prompt = `You are a contract obligation extractor. Extract all dates, deadlines, and obligations from this contract.

Contract text:
${contractText.slice(0, 10000)}

Return JSON:
{
  "obligations": [
    {
      "type": "payment" | "expiry" | "renewal" | "notice" | "deliverable" | "other",
      "description": "what is due",
      "date": "ISO date YYYY-MM-DD or relative like '30 days after signing'",
      "isRelative": true/false,
      "relativeDays": number (if relative),
      "page": page number,
      "quotedText": "exact quote from contract"
    }
  ]
}

Extract: payment dates, contract expiry, renewal periods, notice periods, deliverables, milestones.
Every quotedText must be an exact substring from the contract text.
Return strictly valid JSON.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
    max_tokens: 3000,
    response_format: { type: 'json_object' },
  });

  const raw = completion.choices[0].message.content || '{"obligations":[]}';
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = { obligations: [] };
  }

  const obligations: Obligation[] = (parsed.obligations || []).map((o: any, idx: number) => {
    const verified = contractText.includes((o.quotedText || '').slice(0, 40));
    return {
      id: `obl-${idx + 1}`,
      type: o.type || 'other',
      description: o.description,
      date: o.date,
      isRelative: o.isRelative || false,
      relativeDays: o.relativeDays,
      page: o.page || 1,
      quotedText: o.quotedText || '',
      evidence_verified: verified,
      confirmed: false,
      reminderEnabled: false,
    };
  });

  return obligations;
}
