import Link from 'next/link';

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#E6EAF2] p-8 text-center space-y-4">
        <h1 className="font-serif text-3xl font-bold">Payment not completed</h1>
        <p className="text-[#6B7280]">No charges were applied to your DealSafe AI plan. You can retry checkout or contact support.</p>
        <div className="flex flex-col gap-3">
          <Link href="/pricing" className="bg-[#1E3A8A] text-white rounded-full py-3 font-semibold">Retry checkout</Link>
          <a href="mailto:support@dealsafe.ai" className="text-sm text-[#1D4ED8]">support@dealsafe.ai</a>
        </div>
      </div>
    </div>
  );
}
