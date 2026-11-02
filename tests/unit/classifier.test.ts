import { classifyContract } from '../../src/lib/ai/classifier';

describe('Contract Classifier', () => {
  it('should classify an NDA correctly', async () => {
    const ndaText = 'This Non-Disclosure Agreement is entered into by and between Party A and Party B...';
    const result = await classifyContract(ndaText);
    expect(result.contract_type).toBeDefined();
    expect(result.confidence).toBeGreaterThan(0);
  }, 15000);
});