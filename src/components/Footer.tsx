import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E6EAF2] pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Brand Column */}
        <div className="md:col-span-4 space-y-4">
          <Logo />
          <p className="text-[14px] text-[#64748B] leading-relaxed max-w-sm">
            Making contracts easier to understand, one agreement at a time.
          </p>
          <div className="text-xs text-[#94A3B8] pt-2">
            Built for founders, freelancers, agencies, educators, and businesses.
          </div>
        </div>

        {/* Product Column */}
        <div className="md:col-span-3 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1B3B]">
            Product
          </h3>
          <ul className="space-y-2.5 text-[14px] text-[#64748B]">
            <li>
              <Link href="/#features" className="hover:text-[#1D4ED8] transition-colors">
                Features
              </Link>
            </li>
            <li>
              <Link href="/#how-it-works" className="hover:text-[#1D4ED8] transition-colors">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/#demo" className="hover:text-[#1D4ED8] transition-colors">
                Interactive Demo
              </Link>
            </li>
            <li>
              <Link href="/#intelligence" className="hover:text-[#1D4ED8] transition-colors">
                AI Intelligence
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-[#1D4ED8] transition-colors">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="hover:text-[#1D4ED8] transition-colors">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal Column */}
        <div className="md:col-span-3 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1B3B]">
            Legal &amp; Privacy
          </h3>
          <ul className="space-y-2.5 text-[14px] text-[#64748B]">
            <li>
              <Link href="/privacy" className="hover:text-[#1D4ED8] transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-[#1D4ED8] transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/refund" className="hover:text-[#1D4ED8] transition-colors">
                Refund &amp; Cancellation
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#1D4ED8] transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Account Column */}
        <div className="md:col-span-2 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1B3B]">
            Account
          </h3>
          <ul className="space-y-2.5 text-[14px] text-[#64748B]">
            <li>
              <Link href="/auth/login" className="hover:text-[#1D4ED8] transition-colors">
                Sign In
              </Link>
            </li>
            <li>
              <Link href="/auth/login?mode=signup" className="hover:text-[#1D4ED8] transition-colors font-medium">
                Get Started
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-[#1D4ED8] transition-colors">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Disclaimer & Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-[#E6EAF2] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#94A3B8]">
        <p>
          © {new Date().getFullYear()} DealSafe AI. All rights reserved.
        </p>
        <p className="text-center sm:text-right">
          DealSafe AI provides informational analysis and productivity assistance and does not provide formal legal advice.
        </p>
      </div>
    </footer>
  );
}
