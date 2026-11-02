// src/lib/ai/evidence-validator.ts
// Programmatically verify that quoted text exists in extracted document text

export interface EvidenceValidationResult {
  isValid: boolean;
  verifiedQuote?: string;
  pageNumber?: number;
  matchType?: 'exact' | 'fuzzy' | 'not_found';
}

export function validateEvidence(
  quotedText: string,
  pageNumber: number,
  documentPages: Array<{ page_number: number; text: string }>
): EvidenceValidationResult {
  const targetPage = documentPages.find((p) => p.page_number === pageNumber);

  if (!targetPage) {
    return { isValid: false, matchType: 'not_found' };
  }

  const pageText = targetPage.text;
  const normalizedQuote = normalizeText(quotedText);
  const normalizedPage = normalizeText(pageText);

  // Exact match
  if (normalizedPage.includes(normalizedQuote)) {
    return {
      isValid: true,
      verifiedQuote: quotedText,
      pageNumber,
      matchType: 'exact',
    };
  }

  // Fuzzy match (allow for minor differences in whitespace/punctuation)
  const fuzzyQuote = normalizedQuote.replace(/\s+/g, '\\s*');
  const fuzzyPattern = new RegExp(fuzzyQuote, 'i');
  if (fuzzyPattern.test(normalizedPage)) {
    return {
      isValid: true,
      verifiedQuote: quotedText,
      pageNumber,
      matchType: 'fuzzy',
    };
  }

  // Check if quote exists on adjacent pages (page numbering might be off)
  const adjacentPages = documentPages.filter(
    (p) => Math.abs(p.page_number - pageNumber) <= 1
  );

  for (const page of adjacentPages) {
    const normalizedAdjacent = normalizeText(page.text);
    if (normalizedAdjacent.includes(normalizedQuote)) {
      return {
        isValid: true,
        verifiedQuote: quotedText,
        pageNumber: page.page_number,
        matchType: 'exact',
      };
    }
  }

  return { isValid: false, matchType: 'not_found' };
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .trim();
}
