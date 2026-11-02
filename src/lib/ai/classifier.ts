import { openai } from '@/lib/openai';

export interface ClassificationResult {
  contract_type: string;
  confidence: number;
  category: string;
  subcategory: string;
}

export async function classifyContract(text: string): Promise<ClassificationResult> {
  const prompt = `You are an expert legal contract classifier. Analyze the following contract text and classify it.

Return a JSON object with:
- contract_type: The specific type (e.g., "NDA", "Employment Agreement", "SaaS Terms of Service", "Vendor Agreement", "Freelance Service Agreement", "Brand Sponsorship Agreement", "Rental Agreement", "Shareholder Agreement", "Investment Agreement")
- confidence: A percentage 0-100 indicating confidence
- category: Broad category ("Business", "Employment", "IP/Licensing", "Real Estate", "Investment", "Consumer")
- subcategory: More specific subcategory

Contract Text:
${text.slice(0, 8000)}

Return ONLY valid JSON, no markdown formatting.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.1,
  });

  const result = JSON.parse(completion.choices[0].message.content || '{}');
  return {
    contract_type: result.contract_type || 'Unknown',
    confidence: result.confidence || 0,
    category: result.category || 'Business',
    subcategory: result.subcategory || 'General',
  };
}