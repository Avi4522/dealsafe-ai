// src/app/privacy/page.tsx
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-[#E6EAF2]">
        <h1 className="font-serif text-3xl font-bold text-[#0B1B3B] mb-6">Privacy & Data Handling</h1>

        <div className="space-y-6 text-[#475569] text-[15px] leading-relaxed">
          <section>
            <h2 className="font-bold text-[#0B1B3B] mb-2">Where files are stored</h2>
            <p>
              Your uploaded contracts are stored in a private Supabase Storage bucket.
              Files are organized under your user ID and are not publicly accessible.
              Access is restricted to you through Row Level Security policies.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-[#0B1B3B] mb-2">Which AI provider receives the text</h2>
            <p>
              Contract text is sent to OpenAI for analysis. The text is processed according to
              OpenAI's API data retention and training terms. You should review OpenAI's
              current data policies before using this service.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-[#0B1B3B] mb-2">Retention setting</h2>
            <p>
              Original uploaded files are retained until you delete them or your account.
              You can enable "Delete original after analysis" in settings to automatically
              remove the source file once analysis completes.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-[#0B1B3B] mb-2">Deletion</h2>
            <p>
              You can delete individual documents or your entire account from the Settings page.
              Deletion removes the stored file, extracted text, analysis results, and related
              database records. Deletion is irreversible.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-[#0B1B3B] mb-2">What we do NOT claim</h2>
            <p>
              This service provides AI-assisted analysis only. It is not legal advice.
              We do not claim compliance with specific regulations (GDPR, HIPAA, SOC 2, etc.)
              unless independently verified. Security claims in this notice reflect only
              implemented and tested features.
            </p>
          </section>

          <div className="pt-6 border-t border-[#E6EAF2]">
            <Link href="/dashboard" className="text-[#1D4ED8] font-semibold hover:underline">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
