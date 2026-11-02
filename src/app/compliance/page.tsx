'use client';

import React from 'react';
import AppShell from '@/components/AppShell';
import { ShieldCheck, CheckCircle2, AlertTriangle, Globe } from 'lucide-react';

export default function CompliancePage() {
  const regulations = [
    { regulation: 'GDPR', region: 'European Union', status: 'Compliant', score: 94 },
    { regulation: 'CCPA', region: 'California, USA', status: 'Compliant', score: 88 },
    { regulation: 'PCI DSS', region: 'Global (Payments)', status: 'Needs Review', score: 72 },
    { regulation: 'HIPAA', region: 'USA (Healthcare)', status: 'N/A', score: 0 },
    { regulation: 'Labor Law', region: 'Local Jurisdiction', status: 'Compliant', score: 91 },
    { regulation: 'IP / Copyright', region: 'Global', status: 'Compliant', score: 96 },
  ];

  return (
    <AppShell title="Compliance View">
      <main className="px-4 sm:px-6 py-6 max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#0B1B3B]">Compliance View</h1>
          <p className="text-xs text-[#64748B]">
            Regulatory alignment, jurisdiction guidelines, and cross-border data protection checks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {regulations.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#EEF1F6] p-5 rounded-2xl shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#0B1B3B]">{item.regulation}</h3>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                    item.status === 'Compliant'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : item.status === 'Needs Review'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-[#64748B] flex items-center gap-1.5">
                <Globe size={13} className="text-[#94A3B8]" />
                <span>{item.region}</span>
              </p>
              {item.score > 0 ? (
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[#64748B]">Alignment Score</span>
                    <span className="text-[#0B1B3B] font-mono">{item.score}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#EEF1F6] overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        item.score >= 85 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-[#94A3B8] italic pt-1">
                  Not applicable to current document types
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </AppShell>
  );
}
