import React from 'react';
import { ShieldCheck, Phone, Mail, MapPin, ArrowUpRight, HelpCircle } from 'lucide-react';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenBooking: () => void;
  onOpenSecurityConsole?: () => void;
  onOpenHelpModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateSection,
  onOpenBooking,
  onOpenSecurityConsole,
  onOpenHelpModal,
}) => {
  const handleOpenCookies = () => {
    window.dispatchEvent(new CustomEvent('openCookieSettings'));
  };

  return (
    <footer className="bg-neutral-100 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-black text-sm shadow-md shadow-red-600/30">
                SJO
              </div>
              <span className="text-lg font-black text-neutral-900 dark:text-white tracking-tight font-display">
                SJO<span className="text-red-600 dark:text-red-500 ml-1">MOTORSPORT</span>
              </span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed max-w-sm">
              Kenya’s premier automotive styling powerhouse. Specializing in bespoke vehicle vinyl wraps ("rapper" studio), high-heat rejection nano-ceramic window tinting, self-healing PPF, and rugged 4x4 expedition accessories.
            </p>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Certified 3M, Avery Dennison &amp; AutoXpress Network Standard</span>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              Styling Services
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigateSection('visualizer')}
                  className="hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                >
                  Custom Vinyl Color Wraps
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('catalog-tint')}
                  className="hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                >
                  Nano-Ceramic IR Tinting
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('catalog-paint')}
                  className="hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                >
                  9H Graphene Ceramic Coating
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('catalog-paint')}
                  className="hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                >
                  Self-Healing PPF Clear Bra
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('visualizer')}
                  className="hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                >
                  Chrome Delete Blackout
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Accessories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              Car Accessories &amp; 4x4
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigateSection('catalog-accessories')}
                  className="hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                >
                  Summit Steel Bullbars
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('catalog-accessories')}
                  className="hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                >
                  Expedition Roof Racks
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('catalog-accessories')}
                  className="hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                >
                  Laser Scanned Floor Liners
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('catalog-accessories')}
                  className="hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                >
                  4K Stealth Dual Dashcams
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('catalog-accessories')}
                  className="hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                >
                  Osram LED Driving Lightbars
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Studios & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              Direct Contact
            </h4>
            <div className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-600 dark:text-red-500 shrink-0 mt-0.5" />
                <span>Rhapta Rd Westlands &amp; Mombasa Rd, Nairobi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-red-600 dark:text-red-500 shrink-0" />
                <span className="font-mono text-neutral-900 dark:text-white">+254 712 345 678</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-red-600 dark:text-red-500 shrink-0" />
                <a
                  href="mailto:sjomotorsport@gmail.com"
                  className="hover:underline text-red-600 dark:text-red-400 font-semibold"
                >
                  sjomotorsport@gmail.com
                </a>
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={onOpenHelpModal}
                  className="w-full py-2 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-red-600/20"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Email to SJO Gmail</span>
                </button>

                <button
                  onClick={onOpenBooking}
                  className="w-full py-2 px-3 rounded-lg bg-neutral-200 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 hover:border-red-500 text-neutral-900 dark:text-white font-medium text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Book Installation Bay</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500">
          <p>© {new Date().getFullYear()} SJO Motorsport Kenya. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button
              onClick={handleOpenCookies}
              className="hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
            >
              Cookie Settings
            </button>
            <span aria-hidden="true">·</span>
            {onOpenHelpModal && (
              <>
                <button
                  onClick={onOpenHelpModal}
                  className="hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3 text-red-600 dark:text-red-500" />
                  <span>Gmail Support Desk</span>
                </button>
                <span aria-hidden="true">·</span>
              </>
            )}
            {onOpenSecurityConsole && (
              <>
                <button
                  onClick={onOpenSecurityConsole}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1 font-mono text-[11px]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  System Security &amp; WAF Status
                </button>
                <span aria-hidden="true">·</span>
              </>
            )}
            <span>Guaranteed Fitment Policy</span>
            <span aria-hidden="true">·</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
