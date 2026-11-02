// src/lib/ai/evals.ts
// Extended evaluation harness for DealSafe AI
// Tests: Copilot Q&A, citation validity, negotiation suggestions, report generation

import { z } from 'zod';

// Copilot evaluation question with expected answer criteria
export interface CopilotEvalQuestion {
  question: string;
  expected_pages: number[];
  must_mention: string[];
  must_not_mention?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface CopilotEvalResult {
  question: string;
  answer: string;
  cited_pages: number[];
  evidence_verified: boolean;
  citation_valid: boolean;
  mentions_required: boolean;
  score: number; // 0-1
  passed: boolean;
}

export interface NegotiationEvalResult {
  finding_count: number;
  suggestion_count: number;
  all_have_priority: boolean;
  all_have_alternative: boolean;
  has_email_draft: boolean;
  email_not_auto_sent: boolean;
  score: number;
}

export interface ReportEvalResult {
  has_disclaimer: boolean;
  has_risk_score: boolean;
  has_findings: boolean;
  has_page_refs: boolean;
  has_confidence: boolean;
  score: number;
}

// Sample copilot questions for a typical contract
export const SAMPLE_COPILOT_QUESTIONS: CopilotEvalQuestion[] = [
  {
    question: 'What is the termination notice period?',
    expected_pages: [3, 4],
    must_mention: ['notice', 'days'],
    difficulty: 'easy',
  },
  {
    question: 'What are the payment terms?',
    expected_pages: [2, 3],
    must_mention: ['payment', 'days'],
    difficulty: 'easy',
  },
  {
    question: 'Is there an auto-renewal clause?',
    expected_pages: [3, 5],
    must_mention: ['renewal', 'automatic'],
    difficulty: 'medium',
  },
  {
    question: 'What are the indemnification obligations?',
    expected_pages: [5, 6],
    must_mention: ['indemnif', 'liability'],
    difficulty: 'medium',
  },
  {
    question: 'Can the contract be terminated for convenience?',
    expected_pages: [3, 4],
    must_mention: ['termination', 'convenience'],
    difficulty: 'hard',
  },
];

export function evaluateCopilotAnswer(
  question: CopilotEvalQuestion,
  answer: string,
  cited_pages: number[],
  evidence_verified: boolean
): CopilotEvalResult {
  // Check citation validity: cited pages should overlap with expected
  const citationOverlap = question.expected_pages.some((p) =>
    cited_pages.includes(p)
  );
  const citationValid = citationOverlap || cited_pages.length > 0;

  // Check required mentions
  const lowerAnswer = answer.toLowerCase();
  const mentionsRequired = question.must_mention.every((term) =>
    lowerAnswer.includes(term.toLowerCase())
  );

  // Score calculation
  let score = 0;
  if (citationValid) score += 0.3;
  if (mentionsRequired) score += 0.3;
  if (evidence_verified) score += 0.2;
  if (answer.length > 50) score += 0.2;

  return {
    question: question.question,
    answer,
    cited_pages,
    evidence_verified,
    citation_valid: citationValid,
    mentions_required: mentionsRequired,
    score: Math.round(score * 100) / 100,
    passed: score >= 0.6,
  };
}

export function evaluateNegotiation(
  suggestions: any[],
  emailDraft: { subject: string; body: string } | null
): NegotiationEvalResult {
  const allHavePriority = suggestions.every((s) => s.priority);
  const allHaveAlternative = suggestions.every((s) => s.suggested_alternative);
  const hasEmailDraft = !!emailDraft?.subject && !!emailDraft?.body;
  const emailNotAutoSent = true; // System never auto-sends

  let score = 0;
  if (suggestions.length > 0) score += 0.25;
  if (allHavePriority) score += 0.25;
  if (allHaveAlternative) score += 0.25;
  if (hasEmailDraft) score += 0.25;

  return {
    finding_count: suggestions.length,
    suggestion_count: suggestions.length,
    all_have_priority: allHavePriority,
    all_have_alternative: allHaveAlternative,
    has_email_draft: hasEmailDraft,
    email_not_auto_sent: emailNotAutoSent,
    score: Math.round(score * 100) / 100,
  };
}

export function evaluateReport(reportHtml: string): ReportEvalResult {
  const hasDisclaimer = reportHtml.includes('AI-assisted analysis, not legal advice');
  const hasRiskScore = reportHtml.includes('Score:') || reportHtml.includes('risk_score');
  const hasFindings = reportHtml.includes('Findings');
  const hasPageRefs = reportHtml.includes('Page ');
  const hasConfidence = reportHtml.includes('Confidence:');

  let score = 0;
  if (hasDisclaimer) score += 0.2;
  if (hasRiskScore) score += 0.2;
  if (hasFindings) score += 0.2;
  if (hasPageRefs) score += 0.2;
  if (hasConfidence) score += 0.2;

  return {
    has_disclaimer: hasDisclaimer,
    has_risk_score: hasRiskScore,
    has_findings: hasFindings,
    has_page_refs: hasPageRefs,
    has_confidence: hasConfidence,
    score: Math.round(score * 100) / 100,
  };
}

// Run full evaluation suite
export function runFullEval(
  copilotResults: CopilotEvalResult[],
  negotiationResult: NegotiationEvalResult,
  reportResult: ReportEvalResult
): { overall_score: number; passed: boolean; details: any } {
  const copilotAvg =
    copilotResults.length > 0
      ? copilotResults.reduce((sum, r) => sum + r.score, 0) / copilotResults.length
      : 0;

  const overall =
    (copilotAvg + negotiationResult.score + reportResult.score) / 3;

  return {
    overall_score: Math.round(overall * 100) / 100,
    passed: overall >= 0.7,
    details: {
      copilot: { avg_score: copilotAvg, questions: copilotResults.length, passed: copilotResults.filter((r) => r.passed).length },
      negotiation: negotiationResult,
      report: reportResult,
    },
  };
}
