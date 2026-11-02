import AppSidebar from '@/components/AppSidebar';
import AppHeader from '@/components/AppHeader';

export default function AppShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="min-h-screen bg-[#F4F7FC] p-0 sm:p-3">
      <div className="flex gap-3 items-start">
        <AppSidebar />
        <div className="flex-1 min-w-0 bg-[#F4F7FC] sm:rounded-[22px] min-h-screen sm:min-h-[calc(100vh-24px)] flex flex-col overflow-hidden border border-[#E2E8F0] shadow-xs">
          <AppHeader title={title} />
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
