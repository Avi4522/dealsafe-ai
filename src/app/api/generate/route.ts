import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

export async function POST(req: NextRequest) {
  try {
    const {
      formType,
      partyA = 'Company Inc.',
      partyB = 'Contractor / Counterparty',
      effectiveDate = new Date().toISOString().split('T')[0],
      jurisdiction = 'State of Delaware',
      scope = 'Professional services as defined in Schedule A',
      compensation = 'Fixed fee payable within 30 days of monthly milestone delivery',
      termDuration = '12 months from Effective Date',
    } = await req.json();

    const formNames: Record<string, string> = {
      nda: 'Non-Disclosure Agreement (NDA)',
      service: 'Master Services Agreement (MSA)',
      freelance: 'Freelance Agreement',
      employment: 'Employment Agreement',
      partnership: 'Partnership Agreement',
      consultancy: 'Consultancy Agreement',
      vendor: 'Vendor & Supplier Agreement',
      saas: 'SaaS Agreement',
    };

    const agreementTitle = formNames[formType] || 'Commercial Agreement';

    const prompt = `You are a legal contract specialist. Draft a complete, high-quality, professional ${agreementTitle}.

Key Details:
- Disclosing / Primary Party (Party A): ${partyA}
- Receiving / Second Party (Party B): ${partyB}
- Effective Date: ${effectiveDate}
- Governing Law & Jurisdiction: ${jurisdiction}
- Scope of Work / Purpose: ${scope}
- Compensation / Payment: ${compensation}
- Term Duration: ${termDuration}

Structure:
1. Preamble & Recitals (clearly identifying ${partyA} and ${partyB})
2. Scope of Services & Responsibilities
3. Payment & Invoicing Terms
4. Confidentiality & Non-Disclosure
5. Intellectual Property & Ownership
6. Representations & Warranties
7. Limitation of Liability
8. Term and Termination
9. Dispute Resolution & Governing Law (${jurisdiction})
10. Signatures and Execution Block

Draft the complete agreement in clean, readable text. Ensure balanced, professional terms suitable for modern SaaS and business use.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 3000,
    });

    const generated = completion.choices[0].message.content || '';
    return NextResponse.json({ contract: generated, ok: true });
  } catch (error: any) {
    console.error('Generate API Error:', error);
    // Provide a well-drafted legal fallback template
    const fallbackTemplate = `
MASTER SERVICES AGREEMENT

This Agreement is entered into on this day between Party A and Party B.

1. SCOPE OF SERVICES
Party B shall provide professional services in accordance with the specifications agreed upon by both parties.

2. PAYMENT TERMS
Party A agrees to remit payments in accordance with agreed milestone schedules within thirty (30) days of invoice date.

3. CONFIDENTIALITY
Each party agrees to maintain in confidence and not disclose to third parties any proprietary or confidential information.

4. INTELLECTUAL PROPERTY
All custom deliverables created specifically for Party A shall be deemed work made for hire upon full payment.

5. LIMITATION OF LIABILITY
Neither party's aggregate liability shall exceed the total amount paid under this Agreement in the twelve months preceding any claim.

6. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with standard commercial contract principles.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.
    `.trim();

    return NextResponse.json({
      contract: fallbackTemplate,
      ok: true,
      fallback: true,
    });
  }
}