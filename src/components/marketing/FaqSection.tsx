'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, Mail } from 'lucide-react';

const faqs = [
  {
    q: 'What is DealSafe AI?',
    a: 'DealSafe AI is an AI contract assistant built for founders, freelancers, agencies, and businesses. It reads your agreements, points out hidden risks, explains confusing clauses in plain English, and helps you make confident decisions before you sign.',
  },
  {
    q: 'How does contract analysis work?',
    a: 'Just upload your agreement. DealSafe AI reads every line, identifies key clauses, flags anything unusual or risky, and gives you clear explanations with exact page references so you know where everything lives.',
  },
  {
    q: 'Which document formats are supported?',
    a: 'You can upload PDF files (both standard digital PDFs and scanned copies) as well as Microsoft Word documents (.docx and .doc).',
  },
  {
    q: 'Can DealSafe AI identify risky clauses?',
    a: 'Yes. DealSafe AI specifically checks for high-risk clauses like unlimited liability, unfair auto-renewals, broad indemnity terms, and restrictive non-competes, tagging each by risk level.',
  },
  {
    q: 'Does DealSafe AI provide legal advice?',
    a: 'No. DealSafe AI provides helpful contract analysis and negotiation insights to save you time and confusion. We are not a law firm, and our insights do not replace a licensed attorney.',
  },
  {
    q: 'Is my uploaded contract secure?',
    a: 'Yes. Your contracts are private to you. Everything is encrypted in transit and at rest, and our database rules ensure nobody else has access to your files.',
  },
  {
    q: 'Can I ask questions about my document?',
    a: 'Yes! With Contract Copilot (available on Pro and Business), you can ask specific questions about your agreement and get immediate answers with direct quotes from your document.',
  },
  {
    q: 'Can I cancel my subscription?',
    a: 'Yes, you can cancel anytime from your account settings with a single click. You will keep access until the end of your billing cycle.',
  },
  {
    q: 'What happens to my uploaded documents?',
    a: 'Your files are strictly yours. We never sell your data or train public AI models on your contracts. You can delete any document permanently whenever you choose.',
  },
  {
    q: 'How do I contact support?',
    a: "Need help? Just reach out to us at support@dealsafe.ai or send a message through our Contact page. We're always here to help.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] relative">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 bg-[#EEF2FF] border border-[#DBEAFE] px-4 py-1.5 rounded-full text-[12px] font-semibold text-[#1D4ED8] mb-4">
            <HelpCircle size={14} className="text-[#2563EB]" />
            FAQS
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0B1B3B]">
            Got Questions? We&apos;ve Got Answers.
          </h2>
          <p className="mt-4 text-[16px] sm:text-[18px] text-[#4B5563] leading-relaxed">
            Everything you need to know about DealSafe AI, how it works, and how it protects your agreements.
          </p>
        </div>

        {/* Interactive Accordion Stack (All 10 Questions) */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${isOpen
                    ? 'border-[#2563EB] shadow-md shadow-blue-900/5'
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
                  }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left font-bold text-[15px] sm:text-[16px] text-[#0B1B3B] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4">{faq.q}</span>
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen
                        ? 'bg-[#1D4ED8] text-white rotate-180'
                        : 'bg-[#F1F5F9] text-[#64748B]'
                      }`}
                  >
                    <ChevronDown size={15} />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-[#475569] text-[14px] sm:text-[15px] leading-relaxed border-t border-[#F1F5F9]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Callout */}
        <div className="mt-12 text-center p-6 bg-white rounded-2xl border border-[#E2E8F0]">
          <p className="text-[14px] text-[#475569]">
            Have a question that isn&apos;t covered here?
          </p>
          <div className="mt-2.5 flex items-center justify-center gap-2 text-[14px] font-semibold text-[#1D4ED8]">
            <Mail size={16} />
            <Link href="/contact" className="hover:underline">
              Contact our team at support@dealsafe.ai
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
