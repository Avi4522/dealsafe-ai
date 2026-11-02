'use client';

import { ShieldCheck, Lock, EyeOff, Server, KeyRound, Trash2 } from 'lucide-react';

const securityControls = [
  {
    icon: Lock,
    title: 'Secure Authentication',
    description:
      'Protected account access with verified email sign-ins and secure session tokens.',
  },
  {
    icon: KeyRound,
    title: 'Encrypted Transfers',
    description:
      'Everything sent between your browser and DealSafe AI is encrypted using modern TLS standards.',
  },
  {
    icon: Server,
    title: 'Protected Storage',
    description:
      'Your uploaded documents and reports are encrypted at rest in isolated cloud storage.',
  },
  {
    icon: EyeOff,
    title: 'Private to You',
    description:
      'Only you can see your contracts. Strict workspace isolation keeps your files completely confidential.',
  },
  {
    icon: Trash2,
    title: 'You Own Your Data',
    description:
      'Delete any contract or report whenever you want. We remove it from our servers immediately.',
  },
  {
    icon: ShieldCheck,
    title: 'Zero AI Model Training',
    description:
      'Your contracts are never used to train or improve public AI models. Ever.',
  },
];

export default function TrustSecurity() {
  return (
    <section id="security" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 bg-[#EEF2FF] border border-[#DBEAFE] px-4 py-1.5 rounded-full text-[12px] font-semibold text-[#1D4ED8] mb-4">
            <ShieldCheck size={14} className="text-[#2563EB]" />
            BUILT-IN PRIVACY
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0B1B3B]">
            Your Documents. Your Privacy. Your Control.
          </h2>
          <p className="mt-4 text-[16px] sm:text-[18px] text-[#4B5563] leading-relaxed">
            Your contracts deserve careful handling. Explore how DealSafe AI protects your documents and keeps your workspace secure.
          </p>
        </div>

        {/* Security Cards Grid (5-6 Implemented Controls) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityControls.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-7 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] text-[#1D4ED8] flex items-center justify-center mb-5">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-[17px] font-bold text-[#0B1B3B] mb-2.5">
                    {item.title}
                  </h3>
                  <p className="text-[14px] text-[#64748B] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Summary Callout */}
        <div className="mt-12 bg-white rounded-2xl border border-[#DBEAFE] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <ShieldCheck size={26} />
            </div>
            <div>
              <h4 className="text-[16px] font-bold text-[#0B1B3B]">
                Confidentiality Guaranteed
              </h4>
              <p className="text-[13px] text-[#64748B] mt-0.5">
                Every analysis is sandboxed per user workspace. We never share, sell, or train public AI models on customer agreements.
              </p>
            </div>
          </div>
          <a
            href="/contact"
            className="shrink-0 text-[13px] font-semibold text-[#1D4ED8] hover:text-[#1E3A8A] bg-[#EEF2FF] hover:bg-[#DBEAFE] px-5 py-2.5 rounded-full transition-colors"
          >
            Questions on Security? Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}
