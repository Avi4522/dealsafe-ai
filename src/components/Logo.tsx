import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Logo({
  href = '/',
  light = false,
  compact = false,
}: {
  href?: string;
  light?: boolean;
  compact?: boolean;
}) {
  return (
    <Link href={href} className="flex items-center gap-2.5 min-h-0 min-w-0">
      <span className="w-8 h-8 rounded-lg bg-[#1D4ED8] text-white font-bold text-sm flex items-center justify-center shadow-sm">
        DS
      </span>
      {!compact && (
        <span
          className={cn(
            'font-semibold tracking-tight text-[17px]',
            light ? 'text-white' : 'text-[#0B1B3B]'
          )}
        >
          DealSafe AI
        </span>
      )}
    </Link>
  );
}
