'use client';

import React, { useState } from 'react';
import AppShell from '@/components/AppShell';
import {
  HelpCircle,
  Mail,
  MessageSquare,
  FileText,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ExternalLink,
  Send,
  BookOpen,
  Shield,
  LifeBuoy,
} from 'lucide-react';

interface FAQ {
  q: string;
  a: string;
}

const FAQS: FAQ[] = [
  {
    q: 'How does DealSafe AI evaluate contract risks?',
    a: 'DealSafe AI scans agreement clauses against institutional benchmark standards, identifying unlimited liability provisions, unilateral indemnity obligations, non-standard renewal windows, and jurisdictional exposure.',
  },
  {
    q: 'Are my uploaded agreements kept private and confidential?',
    a: 'Yes. DealSafe AI enforces strict Row-Level Security (RLS) in Supabase. Your documents are accessible exclusively to your authenticated workspace user and are never used to train public machine learning models.',
  },
  {
    q: 'What file formats can I analyze?',
    a: 'We support PDF, Microsoft Word (.docx), and plain text (.txt / .md) documents up to 15MB per file.',
  },
  {
    q: 'How do monthly analysis credits work?',
    a: 'Each analysis credit allows you to run a complete multi-clause risk audit on a contract. Credits reset at the start of your monthly billing cycle based on your plan tier.',
  },
  {
    q: 'Can I export comparison and audit reports?',
    a: 'Yes. You can download text and markdown audit summaries directly from the Document Comparison and Risk Assessment workspaces.',
  },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('technical');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setSubmitted(true);
    setSubject('');
    setMessage('');
  };

  return (
    <AppShell title="Help & Support">
      <main className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-6xl mx-auto">
        {/* Banner */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-xs">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2458D3] bg-[#EAF1FF] px-2.5 py-0.5 rounded-full mb-1">
              <LifeBuoy size={13} />
              <span>Customer Care & Documentation</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#17243A]">
              Help & Support Center
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Browse product guides, read FAQs, or open a direct ticket with our support engineers.
            </p>
          </div>
        </div>

        {/* 3 Quick Resource Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2458D3] flex items-center justify-center font-bold">
              <BookOpen size={18} />
            </div>
            <h3 className="font-bold text-sm text-[#17243A]">Platform Guide</h3>
            <p className="text-xs text-[#64748B]">
              Learn how to interpret risk severity scores and negotiation suggestions.
            </p>
            <span className="inline-block text-xs font-semibold text-[#2458D3] pt-1">
              Read docs &rarr;
            </span>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Shield size={18} />
            </div>
            <h3 className="font-bold text-sm text-[#17243A]">Security & Privacy</h3>
            <p className="text-xs text-[#64748B]">
              Details on SOC2 compliance, data retention policies, and encryption standards.
            </p>
            <span className="inline-block text-xs font-semibold text-emerald-600 pt-1">
              Security overview &rarr;
            </span>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Mail size={18} />
            </div>
            <h3 className="font-bold text-sm text-[#17243A]">Direct Email Support</h3>
            <p className="text-xs text-[#64748B]">
              Send inquiries to support@dealsafe.ai with typical response within 4 business hours.
            </p>
            <span className="inline-block text-xs font-semibold text-amber-700 pt-1">
              support@dealsafe.ai
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* FAQ Accordion (Left Column) */}
          <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
              <HelpCircle size={18} className="text-[#2458D3]" />
              <h2 className="font-bold text-base text-[#17243A]">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-[#E2E8F0] rounded-xl overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-4 text-left font-semibold text-xs sm:text-sm text-[#17243A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-[#64748B] leading-relaxed border-t border-[#F1F5F9] bg-[#F8FAFC]/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Support Form (Right Column) */}
          <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
              <MessageSquare size={18} className="text-[#2458D3]" />
              <h2 className="font-bold text-base text-[#17243A]">Submit Support Request</h2>
            </div>

            {submitted ? (
              <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 size={32} className="text-emerald-600 mx-auto" />
                <h3 className="font-bold text-sm text-emerald-900">Support Ticket Created!</h3>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Thank you for reaching out. A confirmation has been sent to your email and our team will respond shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
                >
                  Submit another inquiry &rarr;
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#17243A] mb-1">Issue Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#17243A] focus:outline-none focus:border-[#2458D3]"
                  >
                    <option value="technical">Technical / Extraction Issue</option>
                    <option value="billing">Billing & Subscriptions</option>
                    <option value="analysis">Contract Analysis Feedback</option>
                    <option value="feature">Feature Request</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#17243A] mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief description of the problem"
                    required
                    className="w-full bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl px-3.5 py-2 text-[#17243A] focus:outline-none focus:border-[#2458D3]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#17243A] mb-1">Message Details</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="Please include contract name, steps taken, or specific error messages…"
                    required
                    className="w-full bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl p-3 text-[#17243A] focus:outline-none focus:border-[#2458D3] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#2458D3] hover:bg-[#193F9B] text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                >
                  <Send size={13} />
                  <span>Send Ticket</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </AppShell>
  );
}

