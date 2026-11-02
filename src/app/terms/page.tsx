export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-200 p-8 md:p-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Terms & Conditions</h1>
          <p className="text-sm text-gray-400">Last Updated: November 2026</p>
        </div>

        <section className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-white">1. Service Description</h2>
          <p className="text-gray-300 leading-relaxed">
            DealSafe AI is an AI-powered contract intelligence platform that provides automated document analysis, risk scoring, clause extraction, and negotiation support. This is an informational and productivity tool, not a substitute for qualified legal advice.
          </p>
        </section>

        <section className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-white">2. Subscription Terms</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Subscriptions automatically renew on the billing date unless cancelled.</li>
            <li>Pro and Enterprise plans are billed monthly or annually based on your selection.</li>
            <li>Free tier includes limited monthly usage.</li>
          </ul>
        </section>

        <section className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-white">3. Auto-Renewal</h2>
          <p className="text-gray-300 leading-relaxed">
            All paid subscriptions auto-renew. You can cancel anytime from your billing settings. Cancellation takes effect at the end of the current billing period, and you retain access until that date.
          </p>
        </section>

        <section className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-white">4. Acceptable Use</h2>
          <p className="text-gray-300 leading-relaxed">
            You agree not to use DealSafe AI for illegal purposes, to violate third-party rights, to attempt unauthorized access, or to interfere with the platform infrastructure.
          </p>
        </section>

        <section className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-white">5. Account Termination</h2>
          <p className="text-gray-300 leading-relaxed">
            We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or abuse the platform. Upon termination, your access ends immediately.
          </p>
        </section>

        <section className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-white">6. Governing Law</h2>
          <p className="text-gray-300 leading-relaxed">
            These Terms are governed by the laws of the United States, without regard to conflict of law principles. For Indian users, Razorpay transactions are additionally governed by applicable Indian law.
          </p>
        </section>
      </div>
    </div>
  );
}