'use client';

import { useState } from 'react';
import {
  FilePlus2,
  Sparkles,
  Download,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  FileCheck2,
  FileText,
  Sliders,
  ChevronRight,
  ShieldAlert,
  Loader2,
  Info,
} from 'lucide-react';
import AppShell from '@/components/AppShell';
import { createBrowserSupabase } from '@/lib/supabase/browser';

interface TemplateOption {
  id: string;
  title: string;
  desc: string;
  category: string;
}

const TEMPLATES: TemplateOption[] = [
  {
    id: 'nda',
    title: 'Non-Disclosure Agreement (NDA)',
    desc: 'Protect confidential discussions, trade secrets, and proprietary information between parties.',
    category: 'Confidentiality',
  },
  {
    id: 'service',
    title: 'Master Services Agreement (MSA)',
    desc: 'Commercial agreement governing deliverables, payments, service levels, and warranties.',
    category: 'Commercial',
  },
  {
    id: 'freelance',
    title: 'Freelance & Contractor Agreement',
    desc: 'Clear scope of work, intellectual property transfer, and milestone invoicing.',
    category: 'Independent Work',
  },
  {
    id: 'employment',
    title: 'Employment Agreement',
    desc: 'Standard employment contract including duties, compensation, benefits, and non-disclosure.',
    category: 'HR & Staffing',
  },
  {
    id: 'vendor',
    title: 'Vendor / Supplier Agreement',
    desc: 'Procurement agreement specifying goods, delivery timelines, inspection, and return rights.',
    category: 'Procurement',
  },
  {
    id: 'saas',
    title: 'SaaS Terms of Service',
    desc: 'End-user cloud software terms governing license grant, uptime SLAs, and acceptable use.',
    category: 'Software & IP',
  },
];

export default function DocumentGeneratorPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('nda');
  const [partyA, setPartyA] = useState('Acme Technologies Inc.');
  const [partyB, setPartyB] = useState('Apex Digital Solutions LLC');
  const [effectiveDate, setEffectiveDate] = useState('2026-11-01');
  const [jurisdiction, setJurisdiction] = useState('Delaware, United States');
  const [scope, setScope] = useState('Confidential evaluation of SaaS software integration and proprietary APIs.');
  const [compensation, setCompensation] = useState('N/A - Mutual Non-Disclosure');
  const [termDuration, setTermDuration] = useState('2 Years');

  const [loading, setLoading] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [savedToVault, setSavedToVault] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setSavedToVault(false);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: selectedTemplate,
          partyA,
          partyB,
          effectiveDate,
          jurisdiction,
          scope,
          compensation,
          termDuration,
        }),
      });

      const data = await res.json();
      setGeneratedDoc(data.contract || 'Draft generation failed. Please try again.');
    } catch (err) {
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedDoc) return;
    navigator.clipboard.writeText(generatedDoc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    if (!generatedDoc) return;
    const blob = new Blob([generatedDoc], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate}_Agreement_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveToVault = async () => {
    if (!generatedDoc || savedToVault) return;
    try {
      const supabase = createBrowserSupabase();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        alert('Please sign in to save agreements to your vault.');
        return;
      }

      const templateObj = TEMPLATES.find((t) => t.id === selectedTemplate);
      const title = `${templateObj?.title || 'Legal Agreement'} (${partyA} & ${partyB})`;

      await supabase.from('contracts').insert({
        user_id: userData.user.id,
        title,
        file_path: `vault/${userData.user.id}/${selectedTemplate}_${Date.now()}.txt`,
        file_size_bytes: new Blob([generatedDoc]).size,
        file_type: 'TXT',
        document_status: 'analyzed',
        overall_risk_level: 'Low',
        overall_risk_score: 95,
      });

      setSavedToVault(true);
    } catch (err) {
      alert('Could not save to vault.');
    }
  };

  const activeTemplateObj = TEMPLATES.find((t) => t.id === selectedTemplate);

  return (
    <AppShell title="Legal Document Generator">
      <main className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#059669] bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1">
              <FilePlus2 size={13} />
              <span>Smart Drafting Studio</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#17243A]">
              Legal Document Generator
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Draft customized, legally structured agreements tailored to your business terms.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#64748B] bg-[#F4F7FC] border border-[#E2E8F0] px-3 py-1.5 rounded-xl">
              Model: Legal Intelligence v2
            </span>
          </div>
        </div>

        {/* Legal Notice Disclaimer */}
        <div className="bg-[#FFFBEB] border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900 leading-relaxed shadow-xs">
          <Info size={18} className="text-[#D97706] shrink-0 mt-0.5" />
          <p>
            <strong>LEGAL NOTICE:</strong> DealSafe AI provides automated contract drafting templates for commercial preparation and reference purposes. All agreements should be reviewed and customized with your licensed attorney prior to formal execution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Template Selection & Parameters */}
          <div className="lg:col-span-5 space-y-5">
            {/* Template Selection */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-[#17243A] uppercase tracking-wider">
                1. Select Agreement Template
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => setSelectedTemplate(tmpl.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedTemplate === tmpl.id
                        ? 'border-[#2458D3] bg-[#EAF1FF]/40 ring-1 ring-[#2458D3]'
                        : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1]'
                    }`}
                  >
                    <p className="font-bold text-xs text-[#17243A] truncate">{tmpl.title}</p>
                    <p className="text-[10px] text-[#64748B] line-clamp-1 mt-0.5">{tmpl.category}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Parameters Form */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-[#17243A] uppercase tracking-wider">
                2. Key Contract Parameters
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#17243A] mb-1">
                    First Party (Disclosing / Provider)
                  </label>
                  <input
                    type="text"
                    value={partyA}
                    onChange={(e) => setPartyA(e.target.value)}
                    className="w-full bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl px-3.5 py-2 text-[#17243A] focus:outline-none focus:border-[#2458D3]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#17243A] mb-1">
                    Second Party (Receiving / Client)
                  </label>
                  <input
                    type="text"
                    value={partyB}
                    onChange={(e) => setPartyB(e.target.value)}
                    className="w-full bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl px-3.5 py-2 text-[#17243A] focus:outline-none focus:border-[#2458D3]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-semibold text-[#17243A] mb-1">Effective Date</label>
                    <input
                      type="date"
                      value={effectiveDate}
                      onChange={(e) => setEffectiveDate(e.target.value)}
                      className="w-full bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#17243A] focus:outline-none focus:border-[#2458D3]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#17243A] mb-1">Term Duration</label>
                    <input
                      type="text"
                      value={termDuration}
                      onChange={(e) => setTermDuration(e.target.value)}
                      placeholder="e.g. 1 Year, 24 Months"
                      className="w-full bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#17243A] focus:outline-none focus:border-[#2458D3]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#17243A] mb-1">
                    Governing Law & Jurisdiction
                  </label>
                  <input
                    type="text"
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value)}
                    placeholder="e.g. Delaware, USA or London, UK"
                    className="w-full bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl px-3.5 py-2 text-[#17243A] focus:outline-none focus:border-[#2458D3]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#17243A] mb-1">Scope / Subject Matter</label>
                  <textarea
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    rows={2}
                    className="w-full bg-[#F4F7FC] border border-[#E2E8F0] rounded-xl p-3 text-[#17243A] focus:outline-none focus:border-[#2458D3] resize-none"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#2458D3] hover:bg-[#193F9B] disabled:opacity-40 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Generating Draft…</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Generate Structured Agreement</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Live Interactive Preview */}
          <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 min-h-[560px]">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F1F5F9]">
                <div>
                  <h3 className="font-bold text-base text-[#17243A]">Generated Draft Preview</h3>
                  <p className="text-xs text-[#64748B]">
                    {activeTemplateObj?.title || 'Contract Agreement'}
                  </p>
                </div>

                {generatedDoc && (
                  <div className="flex items-center gap-1.5 self-start sm:self-center">
                    <button
                      onClick={copyToClipboard}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#17243A] hover:bg-[#F4F7FC] px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check size={13} className="text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={downloadText}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#17243A] hover:bg-[#F4F7FC] px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] cursor-pointer"
                    >
                      <Download size={13} />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={handleSaveToVault}
                      disabled={savedToVault}
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border cursor-pointer ${
                        savedToVault
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-[#2458D3] text-white border-transparent hover:bg-[#193F9B]'
                      }`}
                    >
                      <FileCheck2 size={13} />
                      <span>{savedToVault ? 'Saved to Vault' : 'Save to Vault'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Draft Viewer */}
              <div className="mt-4">
                {generatedDoc ? (
                  <textarea
                    value={generatedDoc}
                    onChange={(e) => setGeneratedDoc(e.target.value)}
                    className="w-full h-[460px] p-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-mono text-xs text-[#17243A] leading-relaxed resize-y focus:outline-none focus:bg-white"
                  />
                ) : (
                  <div className="h-[460px] rounded-xl bg-[#F8FAFC] border border-dashed border-[#CBD5E1] flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-white text-[#2458D3] flex items-center justify-center shadow-xs">
                      <FileText size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#17243A]">Ready to Generate</p>
                      <p className="text-xs text-[#64748B] max-w-sm mt-1">
                        Select an agreement template on the left and click &ldquo;Generate Structured Agreement&rdquo; to preview the full legal draft.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#94A3B8]">
              <span>Format: Standard ASCII Plain Text / Markdown</span>
              <span>Protected by DealSafe Encryption</span>
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}

