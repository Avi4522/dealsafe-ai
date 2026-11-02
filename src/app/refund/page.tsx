export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-200 p-8 md:p-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Refund & Cancellation Policy</h1>
          <p className="text-sm text-gray-400">Last Updated: November 2026</p>
        </div>

        <section className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-white">1. Cancellation</h2>
          <p className="text-gray-300 leading-relaxed">
            You can cancel your subscription at any time from your billing settings. Cancellation is effective immediately for future billing cycles, and you will retain access until the end of the current billing period.
          </p>
        </section>

        <section className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-white">2. Refund Policy</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Subscriptions cancelled within the first 7 days of billing are eligible for a full refund.</li>
            <li>After 7 days, refunds are issued on a pro-rata basis at our discretion.</li>
            <li>Refunds are processed to the original payment method within 5–10 business days.</li>
          </ul>
        </section>

        <section className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-white">3. No-Refund Window</h2>
          <p className="text-gray-300 leading-relaxed">
            Refunds are not issued for partial billing periods after 7 days, misuse of the service, or voluntary cancellation after the cooling-off window.
          </p>
        </section>

        <section className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-white">4. How to Request a Refund</h2>
          <p className="text-gray-300 leading-relaxed">
            To request a refund, email <a href="mailto:support@dealsafe.ai" className="text-blue-400 hover:underline">support@dealsafe.ai</a> with your account details and reason for the request. Our team will respond within 48 hours.
          </p>
        </section>

        <section className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-white">5. Digital SaaS Policy</h2>
          <p className="text-gray-300 leading-relaxed">
            DealSafe AI is a digital SaaS platform. There is no physical delivery of goods. All access is granted instantly after payment confirmation.
          </p>
        </section>
      </div>
    </div>
  );
}