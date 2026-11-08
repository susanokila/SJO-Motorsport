import React, { useState } from 'react';
import { MapPin, Phone, Clock, Shield, CheckCircle, Navigation } from 'lucide-react';
import { BRANCHES } from '../data/catalog';

interface BranchLocatorProps {
  onBookAtBranch: (branchId: string) => void;
}

export const BranchLocator: React.FC<BranchLocatorProps> = ({ onBookAtBranch }) => {
  const [selectedCity, setSelectedCity] = useState<string>('all');

  const filteredBranches =
    selectedCity === 'all'
      ? BRANCHES
      : BRANCHES.filter((b) => b.city.toLowerCase().includes(selectedCity.toLowerCase()));

  return (
    <section id="branches" className="py-16 bg-slate-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-500">
              <MapPin className="w-3.5 h-3.5" />
              <span>Nationwide Certified Studios</span>
              <span className="text-neutral-400 dark:text-neutral-600">·</span>
              <span className="text-neutral-600 dark:text-neutral-400">SJO Motorsport Precision Network</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-display mt-1">
              Our Fitment Centers &amp; Wrap Studios
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-xl">
              Equipped with pressurized dust-free tint booths, hydraulic 4x4 vehicle lifts, and certified master vinyl wrap installers.
            </p>
          </div>

          {/* City filter tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setSelectedCity('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedCity === 'all'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              All Locations
            </button>
            <button
              onClick={() => setSelectedCity('nairobi')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedCity === 'nairobi'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Nairobi
            </button>
            <button
              onClick={() => setSelectedCity('mombasa')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedCity === 'mombasa'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Mombasa
            </button>
            <button
              onClick={() => setSelectedCity('mobile')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedCity === 'mobile'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Mobile Unit
            </button>
          </div>
        </div>

        {/* Branch Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBranches.map((branch) => (
            <div
              key={branch.id}
              className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 hover:border-red-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all group shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                  <span className="text-red-600 dark:text-red-500 font-bold uppercase tracking-wider">{branch.city}</span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5" /> Open Today
                  </span>
                </div>

                <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  {branch.name}
                </h3>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                  <span>{branch.address}</span>
                </p>

                <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-900 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-300">
                    <Phone className="w-3.5 h-3.5 text-red-600 dark:text-red-500 shrink-0" />
                    <span className="font-mono">{branch.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>{branch.hours}</span>
                  </div>
                </div>

                {/* Features list */}
                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-900">
                  <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-2">
                    Studio Facilities:
                  </span>
                  <ul className="space-y-1 text-xs text-neutral-700 dark:text-neutral-300">
                    {branch.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-500" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
                <button
                  onClick={() => onBookAtBranch(branch.id)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-red-600/20"
                >
                  <span>Book at this Studio</span>
                </button>

                <a
                  href={`tel:${branch.phone.replace(/\s+/g, '')}`}
                  className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 hover:border-red-500 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
                  title="Call Branch"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
