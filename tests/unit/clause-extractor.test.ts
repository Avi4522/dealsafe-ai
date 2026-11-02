import { extractClausesAndAnalyze } from '../../src/lib/ai/clause-extractor';

describe('Clause Extractor', () => {
  it('should extract clauses and analyze risks', async () => {
    const contractText = 'This Employment Agreement is entered into...';
    const result = await extractClausesAndAnalyze(contractText, 'Employment Agreement');
    expect(result.clauses).toBeDefined();
    expect(Array.isArray(result.clauses)).toBe(true);
    expect(result.overall_risk_level).toBeDefined();
  }, 30000);
});