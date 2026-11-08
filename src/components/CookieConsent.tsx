import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, Check, X, Sliders } from 'lucide-react';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  personalization: boolean;
  consentGiven: boolean;
  timestamp: string;
}

const STORAGE_KEY = 'sjo_cookie_consent_v1';

export const CookieConsent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [personalizationEnabled, setPersonalizationEnabled] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        // Show banner after brief delay
        const timer = setTimeout(() => setIsOpen(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // localStorage may fail in some iframe environments
    }
  }, []);

  // Listen for custom trigger to reopen cookie settings from footer
  useEffect(() => {
    const handleReopen = () => {
      setIsOpen(true);
      setShowSettings(true);
    };
    window.addEventListener('openCookieSettings', handleReopen);
    return () => window.removeEventListener('openCookieSettings', handleReopen);
  }, []);

  const saveConsent = (analytics: boolean, personalization: boolean) => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics,
      personalization,
      consentGiven: true,
      timestamp: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {}
    setIsOpen(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () => saveConsent(true, true);
  const handleRejectNonEssential = () => saveConsent(false, false);
  const handleSaveCustom = () => saveConsent(analyticsEnabled, personalizationEnabled);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-700/80 rounded-2xl p-5 shadow-2xl shadow-black/30 dark:shadow-black/80 text-neutral-900 dark:text-white text-xs transition-colors">
        {/* Banner view */}
        {!showSettings ? (
          <div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-600 dark:text-red-500 shrink-0">
                <Cookie className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white font-display">
                    Cookie &amp; Privacy Preferences
                  </h4>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white p-1"
                    aria-label="Dismiss cookie notice"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  We use cookies to maintain your active vehicle fitment, remember your wrap studio selections, and optimize site speed and analytics for SJO Motorsport.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center gap-2">
              <button
                onClick={handleAcceptAll}
                className="flex-1 py-2 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors cursor-pointer text-center shadow-sm shadow-red-600/20"
              >
                Accept All
              </button>
              <button
                onClick={handleRejectNonEssential}
                className="py-2 px-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium transition-colors cursor-pointer"
              >
                Essential Only
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="py-2 px-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:border-neutral-400 transition-colors cursor-pointer"
                title="Customize cookies"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Detailed Customization Modal View */
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-600 dark:text-red-500" />
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white font-display">
                  Customize Cookie Options
                </h4>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {/* Essential */}
              <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <span>Strictly Essential Cookies</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Always Active</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-0.5">
                    Vehicle fitment cache, quotation bag, and M-Pesa payment security tokens.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="rounded text-red-600 bg-neutral-200 dark:bg-neutral-800 border-neutral-400 opacity-60"
                />
              </div>

              {/* Analytics */}
              <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-neutral-900 dark:text-white">Performance &amp; Analytics</div>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-0.5">
                    Anonymous telemetry tracking page speed, fitment searches, and error diagnostics.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 w-4 h-4 cursor-pointer"
                />
              </div>

              {/* Personalization */}
              <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-neutral-900 dark:text-white">Styling &amp; Personalization</div>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-0.5">
                    Remembers wrap studio custom colors, tint levels, and preferred branch.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={personalizationEnabled}
                  onChange={(e) => setPersonalizationEnabled(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
              <button
                onClick={handleSaveCustom}
                className="flex-1 py-2 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors cursor-pointer text-center shadow-md shadow-red-600/20"
              >
                Save My Preferences
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="py-2 px-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium transition-colors cursor-pointer"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
