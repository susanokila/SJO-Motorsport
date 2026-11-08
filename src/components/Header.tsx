import React from 'react';
import { ShoppingBag, Calendar, ShieldCheck, Car, Sun, Moon, HelpCircle, Mail } from 'lucide-react';
import { SelectedVehicle } from '../types';

interface HeaderProps {
  activeVehicle: SelectedVehicle | null;
  onOpenVehicleSelector: () => void;
  onOpenBooking: () => void;
  onOpenCart: () => void;
  cartCount: number;
  currency: 'KES' | 'USD';
  onToggleCurrency: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenSecurityConsole: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenHelpModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeVehicle,
  onOpenVehicleSelector,
  onOpenBooking,
  onOpenCart,
  cartCount,
  currency,
  onToggleCurrency,
  onNavigateSection,
  onOpenSecurityConsole,
  theme,
  onToggleTheme,
  onOpenHelpModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      {/* Top micro announcement bar */}
      <div className="bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800/80 px-4 py-1.5 text-xs text-neutral-600 dark:text-neutral-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-red-600 dark:text-red-500 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              SJO Motorsport Kenya
            </span>
            <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-neutral-700 dark:text-neutral-300">
              Guaranteed Vehicle Fitment · Ceramic Tint · Custom Vinyl Wraps · 4x4 Accessories
            </span>
          </div>

          <div className="flex items-center gap-4 text-neutral-600 dark:text-neutral-300">
            {/* Help & Support Button linking directly to Gmail */}
            <button
              onClick={onOpenHelpModal}
              className="flex items-center gap-1.5 text-red-600 dark:text-red-400 hover:underline font-semibold cursor-pointer"
              title="Contact SJO Motorsport via Gmail (sjomotorsport@gmail.com)"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Help &amp; Support</span>
            </button>
            <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">|</span>

            {/* Infrastructure & WAF status */}
            <button
              onClick={onOpenSecurityConsole}
              className="hidden lg:flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 hover:opacity-80 font-mono transition-opacity cursor-pointer"
              title="View live WAF, Rate Limiting & Health Telemetry"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>WAF &amp; Health: 200 OK</span>
            </button>
            <span className="text-neutral-300 dark:text-neutral-700 hidden lg:inline">|</span>

            <button
              onClick={onToggleCurrency}
              className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-mono text-[11px]"
              title="Switch currency"
            >
              Currency: <strong className="text-red-600 dark:text-red-500">{currency}</strong>
            </button>

            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="p-1 rounded-md text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden md:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden md:inline">Dark</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (4-5 text links) - Zone 3 (Action) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark SJO MOTORSPORT */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigateSection('hero')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            {/* The SJO Logo */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-black text-base tracking-tighter shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
              SJO
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-neutral-900 dark:text-white block leading-none font-display">
                SJO<span className="text-red-600 dark:text-red-500 ml-1">MOTORSPORT</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-semibold">
                Styling · Tint · Wraps · 4x4
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-neutral-600 dark:text-neutral-300">
          <button
            onClick={() => onNavigateSection('vehicle-filter')}
            className="hover:text-red-600 dark:hover:text-red-400 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
          >
            <Car className="w-4 h-4 text-neutral-400" />
            Vehicle Search
          </button>
          <button
            onClick={() => onNavigateSection('catalog-accessories')}
            className="hover:text-red-600 dark:hover:text-red-400 transition-colors whitespace-nowrap cursor-pointer"
          >
            Accessories &amp; 4x4
          </button>
          <button
            onClick={() => onNavigateSection('catalog-tint')}
            className="hover:text-red-600 dark:hover:text-red-400 transition-colors whitespace-nowrap cursor-pointer"
          >
            Ceramic Tint
          </button>
          <button
            onClick={() => onNavigateSection('catalog-wraps')}
            className="hover:text-red-600 dark:hover:text-red-400 transition-colors whitespace-nowrap cursor-pointer"
          >
            Car Wraps &amp; Livery
          </button>
          <button
            onClick={() => onNavigateSection('catalog-paint')}
            className="hover:text-red-600 dark:hover:text-red-400 transition-colors whitespace-nowrap cursor-pointer"
          >
            Paint &amp; PPF
          </button>
          <button
            onClick={() => onNavigateSection('visualizer')}
            className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors whitespace-nowrap cursor-pointer font-bold flex items-center gap-1"
          >
            Wrap &amp; Tint Studio
          </button>
          <button
            onClick={() => onNavigateSection('branches')}
            className="hover:text-red-600 dark:hover:text-red-400 transition-colors whitespace-nowrap cursor-pointer"
          >
            Fitment Centers
          </button>
        </nav>

        {/* Zone 3: Primary Action & Garage Widget */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Active vehicle quick chip */}
          <button
            onClick={onOpenVehicleSelector}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
              activeVehicle
                ? 'bg-red-600/10 border-red-600/40 text-red-600 dark:text-red-400 hover:bg-red-600/20'
                : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
            }`}
            title="Select vehicle model for guaranteed fitment"
          >
            <Car className="w-3.5 h-3.5 text-red-600 dark:text-red-500 shrink-0" />
            <span className="truncate max-w-[120px] sm:max-w-[170px] font-medium">
              {activeVehicle
                ? `${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model.split(' ')[0]}`
                : 'Select Your Vehicle'}
            </span>
          </button>

          {/* Cart drawer button */}
          <button
            onClick={onOpenCart}
            className="relative p-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors cursor-pointer"
            aria-label="View quotation cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Primary CTA: Book Fitment */}
          <button
            onClick={onOpenBooking}
            className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-md shadow-red-600/25 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Book Fitment</span>
            <span className="sm:hidden">Book</span>
          </button>
        </div>
      </div>
    </header>
  );
};
