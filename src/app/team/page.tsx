'use client';

import React, { useState } from 'react';
import AppShell from '@/components/AppShell';
import { Users, Mail, UserPlus, Shield, CheckCircle2 } from 'lucide-react';

interface TeamMember {
  name: string;
  email: string;
  role: 'Owner' | 'Editor' | 'Viewer';
  status: 'Active' | 'Pending';
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([
    { name: 'Avi Beladiya', email: 'avi@dealsafe.ai', role: 'Owner', status: 'Active' },
    { name: 'Anna K.', email: 'anna@dealsafe.ai', role: 'Editor', status: 'Active' },
  ]);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'Editor' | 'Viewer'>('Viewer');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setMembers((prev) => [
      ...prev,
      {
        name: newEmail.split('@')[0],
        email: newEmail,
        role: newRole,
        status: 'Pending',
      },
    ]);
    setNewEmail('');
  };

  return (
    <AppShell title="Team & Workspaces">
      <main className="px-4 sm:px-6 py-6 max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#0B1B3B]">Team Workspaces</h1>
          <p className="text-xs text-[#64748B]">
            Collaborate on contracts, share clause evaluations, and manage workspace permissions.
          </p>
        </div>

        {/* Invite Member Card */}
        <section className="bg-white border border-[#EEF1F6] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#F1F5F9] pb-3">
            <UserPlus size={18} className="text-[#1D4ED8]" />
            <h2 className="font-bold text-sm text-[#0B1B3B]">Invite Team Member</h2>
          </div>

          <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="colleague@company.com"
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#0B1B3B] placeholder-[#94A3B8] focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>

            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as any)}
              className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#0B1B3B] focus:outline-none focus:border-[#1E3A8A]"
            >
              <option value="Editor">Editor (Can analyze & draft)</option>
              <option value="Viewer">Viewer (Read only)</option>
            </select>

            <button
              type="submit"
              className="bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors shrink-0 cursor-pointer"
            >
              Send Invite
            </button>
          </form>
        </section>

        {/* Members Table */}
        <section className="bg-white border border-[#EEF1F6] rounded-2xl p-6 shadow-xs space-y-4 overflow-x-auto">
          <div className="flex items-center gap-2 border-b border-[#F1F5F9] pb-3">
            <Users size={18} className="text-[#1D4ED8]" />
            <h2 className="font-bold text-sm text-[#0B1B3B]">Active Workspace Members</h2>
          </div>

          <table className="w-full text-left text-xs min-w-[500px]">
            <thead className="text-[11px] uppercase tracking-wider text-[#94A3B8] border-b border-[#F1F5F9]">
              <tr>
                <th className="pb-3 font-semibold">User</th>
                <th className="pb-3 font-semibold">Role</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F8FAFC]">
              {members.map((m, idx) => (
                <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1D4ED8] font-bold flex items-center justify-center text-xs">
                        {m.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-[#0B1B3B]">{m.name}</p>
                        <p className="text-[11px] text-[#64748B]">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 font-medium text-[#0B1B3B]">{m.role}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        m.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </AppShell>
  );
}
