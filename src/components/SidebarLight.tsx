'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Home,
  Folder,
  Search,
  Lightbulb,
  Shield,
  FileQuestion,
  Settings,
  CreditCard,
  Users,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  isCurrent?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Main',
    items: [
      { icon: Home, label: 'Dashboard', href: '/dashboard', isCurrent: true },
      { icon: Folder, label: 'Cases & Vault', href: '/cases' },
      { icon: Search, label: 'Legal Search', href: '/search' },
      { icon: Lightbulb, label: 'Smart Review & Copilot', href: '/copilot' },
    ]
  },
  {
    label: 'Analytics',
    items: [
      { icon: Shield, label: 'Compliance View', href: '/compliance' },
      { icon: FileQuestion, label: 'Legal Forms & Generator', href: '/forms' },
    ]
  },
  {
    label: 'Management',
    items: [
      { icon: CreditCard, label: 'Pricing & Billing', href: '/pricing' },
      { icon: Users, label: 'Team Workspaces', href: '/team' },
    ]
  }
];

export default function SidebarLight() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setMobileOpen(false);
      }
    };

    if (mobileOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [mobileOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-card-bg border border-card-border rounded-lg flex items-center justify-center text-content-text hover:bg-content-bg transition-colors"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-sb-bg border-r border-sb-border flex-shrink-0 h-screen overflow-y-auto">
        <SidebarContent mobileMode={false} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileOpen(false)}
          />

          {/* Mobile Sidebar */}
          <div
            ref={sidebarRef}
            className="fixed left-0 top-0 h-screen w-64 bg-sb-bg border-r border-sb-border z-50 transform transition-transform duration-200 ease-out"
          >
            <SidebarContent mobileMode={true} onClose={() => setMobileOpen(false)} />
          </div>
        </>
      )}
    </>
  );
}

interface SidebarContentProps {
  mobileMode?: boolean;
  onClose?: () => void;
}

function SidebarContent({ mobileMode = false, onClose }: SidebarContentProps) {
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Close avatar menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setAvatarMenuOpen(false);
      }
    };

    if (avatarMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [avatarMenuOpen]);

  const handleNavClick = () => {
    if (mobileMode && onClose) {
      onClose();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Brand Section */}
      <div className="p-4 md:p-6 flex items-center space-x-3 border-b border-sb-border">
        <div className="w-9 h-9 bg-brand rounded-lg flex items-center justify-center font-bold text-white text-lg">
          DS
        </div>
        <div>
          <div className="font-bold text-sm text-content-text">DealSafe AI</div>
          <div className="text-xs text-brand font-medium">Contract Intelligence</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 md:p-6 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-2 text-xs font-semibold uppercase tracking-wider text-content-text dim mb-2">
              {group.label}
            </p>
            <nav className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.isCurrent || false;

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand text-white'
                        : 'text-content-text dim hover:text-content-text hover:bg-sb-bg-soft'
                    }`}
                    onClick={handleNavClick}
                  >
                    <Icon size={18} className="mr-3" />
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* User Profile Section */}
      <div className="p-4 md:p-6 border-t border-sb-border">
        <button
          onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-content-text dim hover:text-content-text hover:bg-sb-bg-soft transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-brand rounded-full flex items-center justify-center font-bold text-white text-sm">
              A
            </div>
            <div>
              <div className="text-sm">Avi Beladiya</div>
              <div className="text-xs text-content-text dim">avi@dealsafe.ai</div>
            </div>
          </div>
          <div className="text-xs text-brand font-medium">Pro</div>
        </button>

        {/* Avatar Dropdown */}
        {avatarMenuOpen && (
          <div
            ref={avatarRef}
            className="mt-2 w-full bg-card-bg border border-card-border rounded-xl p-2 space-y-1"
          >
            <button
              onClick={() => setAvatarMenuOpen(false)}
              className="w-full flex items-center px-3 py-2 text-sm text-content-text dim hover:bg-sb-bg-soft rounded-lg transition-colors"
            >
              <Settings size={16} className="mr-2" />
              Settings
            </button>
            <button
              onClick={() => {
                setAvatarMenuOpen(false);
                if (onClose) onClose();
                window.location.href = '/auth/login';
              }}
              className="w-full flex items-center px-3 py-2 text-sm text-content-text dim hover:bg-sb-bg-soft rounded-lg transition-colors"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}