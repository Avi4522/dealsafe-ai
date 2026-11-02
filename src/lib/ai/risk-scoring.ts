// src/lib/ai/risk-scoring.ts
// Deterministic risk scoring engine - AI explains, code scores

const CATEGORY_WEIGHTS: Record<string, number> = {
  financial_liability: 0.25,
  termination_renewal: 0.20,
  intellectual_property: 0.20,
  payment_conditions: 0.15,
  indemnification: 0.10,
  confidentiality: 0.10,
};

const SEVERITY_SCORES: Record<string, number> = {
  critical: 100,
  high: 75,
  medium: 50,
  low: 25,
};

export interface RiskScoringInput {
  findings: Array<{
    category: string;
    severity: string;
    confidence: number;
  }>;
}

export interface RiskScoringResult {
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  category_scores: Record<string, number>;
  rubric_version: string;
}

export function calculateRiskScore(input: RiskScoringInput): RiskScoringResult {
  const categoryScores: Record<string, number> = {};
  const categoryFindings: Record<string, Array<{ severity: string; confidence: number }>> = {};

  // Group findings by category
  for (const finding of input.findings) {
    const category = finding.category;
    if (!categoryFindings[category]) {
      categoryFindings[category] = [];
    }
    categoryFindings[category].push({
      severity: finding.severity,
      confidence: finding.confidence,
    });
  }

  // Calculate score for each category
  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const [category, weight] of Object.entries(CATEGORY_WEIGHTS)) {
    const findings = categoryFindings[category] || [];

    if (findings.length === 0) {
      // No findings in this category - assign neutral score (not zero)
      categoryScores[category] = 30; // Default moderate risk for unanalyzed categories
    } else {
      // Calculate average severity score weighted by confidence
      let categoryScore = 0;
      let totalConfidence = 0;

      for (const finding of findings) {
        const severityScore = SEVERITY_SCORES[finding.severity] || 50;
        categoryScore += severityScore * finding.confidence;
        totalConfidence += finding.confidence;
      }

      categoryScores[category] = totalConfidence > 0
        ? categoryScore / totalConfidence
        : 50;
    }

    totalWeightedScore += categoryScores[category] * weight;
    totalWeight += weight;
  }

  // Normalize to 0-100 scale
  const riskScore = totalWeight > 0
    ? Math.round(totalWeightedScore / totalWeight)
    : 50;

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  if (riskScore >= 80) riskLevel = 'critical';
  else if (riskScore >= 60) riskLevel = 'high';
  else if (riskScore >= 40) riskLevel = 'medium';
  else riskLevel = 'low';

  return {
    risk_score: riskScore,
    risk_level: riskLevel,
    category_scores: categoryScores,
    rubric_version: '1.0.0',
  };
}
