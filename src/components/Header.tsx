'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen]);

  return (
    <header className="h-20 bg-[#111827] border-b border-[#1F2937] px-4 md:px-6 flex items-center justify-between shrink-0 relative">
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-[#0B0F19] text-gray-300 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          )}
        </button>
        <div>
          <h1 className="text-lg md:text-xl font-bold text-white">AI Analysis Overview</h1>
          <p className="text-sm text-gray-400 hidden sm:block">Legal Insight AI Tool & Contract Intelligence</p>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden lg:flex items-center bg-[#0B0F19] border border-[#1F2937] rounded-lg px-4 py-2 w-full max-w-md">
        <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          type="text"
          placeholder="Search contracts, clauses..."
          className="bg-transparent text-base text-white placeholder-gray-500 focus:outline-none w-full"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      {/* Right: Actions, Notifications, Upload, Profile Avatar */}
      <div className="flex items-center space-x-2 md:space-x-3">
        {/* Notifications */}
        <button className="p-2 bg-[#0B0F19] border border-[#1F2937] rounded-lg text-gray-400 hover:text-white relative transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
          </button>

        {/* Upload Action */}
        <button className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm items-center shadow-lg transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
          </svg>
          Upload
        </button>

        {/* User Avatar */}
        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center font-bold justify-center text-white text-base shadow-md cursor-pointer hover:scale-105 transition-transform">
          AB
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="absolute top-full left-0 w-full bg-[#111827] border-b border-[#1F2937] p-6 shadow-2xl z-50 md:hidden space-y-4 animate-in slide-in-from-top-2 duration-200"
        >
          {/* Search in mobile menu */}
          <div className="mb-4">
            <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg px-3 py-2 flex items-center">
              <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                placeholder="Search contracts, clauses..."
                className="bg-transparent text-base text-white placeholder-gray-500 focus:outline-none w-full"
                autoFocus
              />
            </div>
          </div>

          <a href="/dashboard" className="block text-sm font-medium text-white py-2 border-b border-[#1F2937]">Dashboard</a>
          <a href="/cases" className="block text-sm font-medium text-gray-300 py-2 border-b border-[#1F2937]">Cases & Vault</a>
          <a href="/search" className="block text-sm font-medium text-gray-300 py-2 border-b border-[#1F2937]">Legal Search</a>
          <a href="/copilot" className="block text-sm font-medium text-gray-300 py-2 border-b border-[#1F2937]">Smart Review & Copilot</a>
          <a href="/compliance" className="block text-sm font-medium text-gray-300 py-2 border-b border-[#1F2937]">Compliance View</a>
          <a href="/forms" className="block text-sm font-medium text-gray-300 py-2 border-b border-[#1F2937]">Legal Forms</a>
          <a href="/pricing" className="block text-sm font-medium text-emerald-400 py-2 border-b border-[#1F2937]">Pricing & Billing</a>
          <a href="/team" className="block text-sm font-medium text-gray-300 py-2">Team Workspaces</a>

          {/* Upload action in mobile menu */}
          <div className="pt-2">
            <button className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
              </svg>
              Upload Contract
            </button>
          </div>
        </div>
      )}
    </header>
  );
}