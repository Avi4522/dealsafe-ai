'use strict';

import { LayoutDashboard, Folder, Search, Sparkles, Shield, FileQuestion, Users, CreditCard, LogOut } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#0D1117] border-r border-[#21262D] flex flex-col justify-between hidden md:flex shrink-0">
      <div>
        {/* Brand Logo */}
        <div className="px-4 md:px-6 py-4 md:py-6 flex items-center space-x-3 border-b border-[#21262D]">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-base shrink-0">
            DS
          </div>
          <div>
            <span className="font-bold text-base md:text-lg tracking-tight text-[#C9D1D9]">DealSafe AI</span>
            <span className="block text-sm md:text-base text-[#58A6FF] font-medium">Contract Intelligence</span>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="px-3 md:px-4 py-4 space-y-5 md:space-y-6">
          {/* Main */}
          <div>
            <p className="px-2 md:px-3 text-sm font-semibold uppercase tracking-wider text-[#8B949E] mb-2">Main</p>
            <nav className="space-y-1">
              <a href="/dashboard" className="flex items-center px-3 py-2.5 rounded-lg text-sm md:text-base font-medium text-[#C9D1D9] hover:text-white hover:bg-[#161B22] transition-colors">
                <LayoutDashboard className="w-4 h-4 mr-3" />
                Dashboard
              </a>
              <a href="/cases" className="flex items-center px-3 py-2.5 rounded-lg text-sm md:text-base font-medium text-[#C9D1D9] hover:text-white hover:bg-[#161B22] transition-colors">
                <Folder className="w-4 h-4 mr-3" />
                Cases & Vault
              </a>
              <a href="/search" className="flex items-center px-3 py-2.5 rounded-lg text-sm md:text-base font-medium text-[#C9D1D9] hover:text-white hover:bg-[#161B22] transition-colors">
                <Search className="w-4 h-4 mr-3" />
                Legal Search
              </a>
              <a href="/copilot" className="flex items-center px-3 py-2.5 rounded-lg text-sm md:text-base font-medium text-[#C9D1D9] hover:text-white hover:bg-[#161B22] transition-colors">
                <Sparkles className="w-4 h-4 mr-3" />
                Smart Review & Copilot
              </a>
            </nav>
          </div>

          {/* Analytics */}
          <div>
            <p className="px-2 md:px-3 text-sm font-semibold uppercase tracking-wider text-[#8B949E] mb-2">Analytics</p>
            <nav className="space-y-1">
              <a href="/compliance" className="flex items-center px-3 py-2.5 rounded-lg text-sm md:text-base font-medium text-[#C9D1D9] hover:text-white hover:bg-[#161B22] transition-colors">
                <Shield className="w-4 h-4 mr-3" />
                Compliance View
              </a>
              <a href="/forms" className="flex items-center px-3 py-2.5 rounded-lg text-sm md:text-base font-medium text-[#C9D1D9] hover:text-white hover:bg-[#161B22] transition-colors">
                <FileQuestion className="w-4 h-4 mr-3" />
                Legal Forms & Generator
              </a>
            </nav>
          </div>

          {/* Management */}
          <div>
            <p className="px-2 md:px-3 text-sm font-semibold uppercase tracking-wider text-[#8B949E] mb-2">Management</p>
            <nav className="space-y-1">
              <a href="/pricing" className="flex items-center px-3 py-2.5 rounded-lg text-sm md:text-base font-medium text-[#58A6FF] hover:text-white hover:bg-[#161B22] transition-colors">
                <CreditCard className="w-4 h-4 mr-3" />
                Pricing & Billing
              </a>
              <a href="/team" className="flex items-center px-3 py-2.5 rounded-lg text-sm md:text-base font-medium text-[#C9D1D9] hover:text-white hover:bg-[#161B22] transition-colors">
                <Users className="w-4 h-4 mr-3" />
                Team Workspaces
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* User Profile & Logout */}
      <div className="px-3 md:px-4 py-4 border-t border-[#21262D]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-[#21262D] rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0">
              AB
            </div>
            <div>
              <p className="text-sm md:text-base font-medium text-[#C9D1D9]">Avi Beladiya</p>
              <p className="text-sm md:text-base text-[#58A6FF]">Pro Tier</p>
            </div>
          </div>
          <a href="/auth/login" className="p-2 text-[#8B949E] hover:text-white hover:bg-[#161B22] rounded-lg transition-colors" title="Logout">
            <LogOut className="w-4 h-4" />
          </a>
        </div>
      </div>
    </aside>
  );
}