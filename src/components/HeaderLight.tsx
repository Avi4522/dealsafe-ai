'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Search,
  Upload,
  Bell,
  User,
  Menu,
  X
} from 'lucide-react';

export default function HeaderLight() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [mobileMenuOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:flex h-20 bg-content-bg border-b border-card-border px-6 lg:px-8 items-center justify-between shrink-0">
        {/* Search Bar - Centered */}
        <div className="flex-1 max-w-2xl mx-auto">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-content-text dim" />
            <input
              type="text"
              placeholder="Search legal clauses, precedents, and documents..."
              className="w-full pl-12 pr-4 py-2.5 bg-card-bg border border-card-border rounded-xl text-sm text-content-text placeholder:text-content-text dim focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg bg-sb-bg border border-card-border text-content-text dim hover:text-content-text transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand rounded-full"></span>
          </button>

          {/* Upload */}
          <button className="p-2 rounded-lg bg-sb-bg border border-card-border text-content-text dim hover:text-content-text transition-colors">
            <Upload size={20} />
          </button>

          {/* Profile Avatar */}
          <div className="relative">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-brand-deep flex items-center justify-center text-white font-medium text-sm shadow-sm hover:scale-105 transition-transform"
            >
              A
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden flex h-16 bg-content-bg border-b border-card-border px-4 items-center justify-between shrink-0">
        {/* Left: Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-sb-bg border border-card-border text-content-text hover:bg-content-bg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Center: Title */}
        <div className="text-center">
          <h1 className="text-sm font-bold text-content-text">DealSafe AI</h1>
          <p className="text-xs text-content-text dim">AI Analysis</p>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center space-x-1">
          <button className="p-1.5 rounded-full bg-sb-bg border border-card-border text-content-text dim hover:bg-content-bg transition-colors">
            <Bell size={18} />
          </button>
          <button className="p-1.5 rounded-full bg-sb-bg border border-card-border text-content-text dim hover:bg-content-bg transition-colors">
            <User size={18} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden absolute top-full left-0 right-0 bg-content-bg border-b border-card-border shadow-lg z-40"
        >
          <div className="px-4 py-3 space-y-1">
            {/* Search */}
            <div className="relative mb-2">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-text dim" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-1.5 bg-sb-bg border border-card-border rounded-lg text-xs text-content-text placeholder:text-content-text dim focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            {/* Nav Items */}
            <a href="/dashboard" className="block px-3 py-2 text-sm font-medium text-content-text dim hover:text-content-text hover:bg-sb-bg-soft rounded-lg transition-colors">
              Dashboard
            </a>
            <a href="/cases" className="block px-3 py-2 text-sm font-medium text-content-text dim hover:text-content-text hover:bg-sb-bg-soft rounded-lg transition-colors">
              Cases & Vault
            </a>
            <a href="/search" className="block px-3 py-2 text-sm font-medium text-content-text dim hover:text-content-text hover:bg-sb-bg-soft rounded-lg transition-colors">
              Legal Search
            </a>
            <a href="/copilot" className="block px-3 py-2 text-sm font-medium text-content-text dim hover:text-content-text hover:bg-sb-bg-soft rounded-lg transition-colors">
              Smart Review
            </a>
            <a href="/compliance" className="block px-3 py-2 text-sm font-medium text-content-text dim hover:text-content-text hover:bg-sb-bg-soft rounded-lg transition-colors">
              Compliance
            </a>
            <a href="/forms" className="block px-3 py-2 text-sm font-medium text-content-text dim hover:text-content-text hover:bg-sb-bg-soft rounded-lg transition-colors">
              Legal Forms
            </a>
            <a href="/pricing" className="block px-3 py-2 text-sm font-medium text-brand dim hover:text-content-text hover:bg-sb-bg-soft rounded-lg transition-colors">
              Pricing
            </a>
            <a href="/team" className="block px-3 py-2 text-sm font-medium text-content-text dim hover:text-content-text hover:bg-sb-bg-soft rounded-lg transition-colors">
              Team Workspaces
            </a>
          </div>
        </div>
      )}
    </>
  );
}