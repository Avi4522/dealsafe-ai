/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Primary Brand */
        brand: {
          blue: '#2458D3',
          deep: '#193F9B',
          soft: '#EAF1FF',
          DEFAULT: '#2458D3',
        },
        /* Soft Navy Sidebar */
        sb: {
          bg: '#111C2E',
          active: '#263A59',
          text: '#E2E8F0',
          dim: '#A9B7CA',
          border: 'rgba(226, 232, 240, 0.12)',
        },
        /* Content & Workspace */
        content: {
          bg: '#F4F7FC',
          card: '#FFFFFF',
          text: '#17243A',
          dim: '#64748B',
          border: '#E2E8F0',
        },
        /* Status */
        status: {
          success: '#059669',
          warning: '#D97706',
          danger: '#DC2626',
          info: '#2563EB',
        },
        /* Risk Badges */
        risk: {
          high: '#DC2626',
          med: '#D97706',
          low: '#059669',
          'bg-high': 'rgba(220, 38, 38, 0.10)',
          'bg-med': 'rgba(217, 119, 6, 0.10)',
          'bg-low': 'rgba(5, 150, 105, 0.10)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        hover: '0 10px 25px -5px rgba(29, 78, 216, 0.1), 0 8px 10px -6px rgba(29, 78, 216, 0.06)',
        elevated: '0 20px 40px -15px rgba(11, 27, 59, 0.12)',
        glow: '0 0 25px -5px rgba(37, 99, 235, 0.3)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.06)' },
        },
        scan: {
          '0%': { top: '0%', opacity: '0' },
          '15%': { opacity: '1' },
          '85%': { opacity: '1' },
          '100%': { top: '100%', opacity: '0' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'float-slow': 'float-slow 7s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 5s ease-in-out infinite',
        scan: 'scan 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        shimmer: 'shimmer 2s infinite',
      },
    },
  },
  plugins: [],
};