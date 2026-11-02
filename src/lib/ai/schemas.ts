// src/lib/ai/schemas.ts
import { z } from 'zod';

export const RiskFindingSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  page_number: z.number().int().positive(),
  quoted_text: z.string().min(1),
  explanation: z.string().min(1),
  recommended_action: z.string().optional(),
  confidence: z.number().min(0).max(1),
  is_missing_clause: z.boolean().default(false),
  is_favorable: z.boolean().default(false),
});

export const AnalysisResultSchema = z.object({
  contract_type: z.string().min(1),
  summary: z.string().min(1),
  findings: z.array(RiskFindingSchema),
  metadata: z.record(z.unknown()).optional(),
});

export type RiskFinding = z.infer<typeof RiskFindingSchema>;
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
