import { openai } from '@/lib/openai';

export interface ExtractedClause {
  clause_type: string;
  text: string;
  page_number: number;
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  risk_score: number;
  explanation: string;
  recommendation: string;
  evidence_quote: string;
}

export interface ClauseExtractionResult {
  clauses: ExtractedClause[];
  missing_provisions: string[];
  overall_risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  overall_risk_score: number;
  summary: string;
}

export async function extractClausesAndAnalyze(
  contractText: string,
  contractType: string
): Promise<ClauseExtractionResult> {
  const prompt = `You are an expert contract analyst. Analyze this ${contractType} and extract key clauses with risk assessment.

Contract Text:
${contractText.slice(0, 12000)}

Return a JSON object with:
{
  "clauses": [
    {
      "clause_type": "e.g., Payment, Termination, IP Ownership, Confidentiality, Liability, Indemnification, Dispute Resolution, Governing Law",
      "text": "The exact clause text from the contract",
      "page_number": 1,
      "risk_level": "Low|Medium|High|Critical",
      "risk_score": 1-10,
      "explanation": "Plain English explanation of what this clause means",
      "recommendation": "What the user should do or negotiate",
      "evidence_quote": "Key quote from the clause"
    }
  ],
  "missing_provisions": ["List any standard provisions that are missing"],
  "overall_risk_level": "Low|Medium|High|Critical",
  "overall_risk_score": 1-10,
  "summary": "2-3 sentence summary of the contract's risk profile"
}

Return ONLY valid JSON, no markdown formatting.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.2,
  });

  return JSON.parse(completion.choices[0].message.content || '{}');
}