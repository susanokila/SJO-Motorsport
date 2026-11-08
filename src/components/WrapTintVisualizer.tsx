import React, { useState } from 'react';
import { Eye, Shield, Check, Sparkles, ArrowRight, Palette, Sun, Layers } from 'lucide-react';
import { WRAP_COLORS, TINT_LEVELS } from '../data/catalog';
import { SelectedVehicle } from '../types';

interface WrapTintVisualizerProps {
  activeVehicle: SelectedVehicle | null;
  currency: 'KES' | 'USD';
  onBookSpec: (spec: {
    vehicleType: string;
    wrapColor: string;
    wrapFinish: string;
    tintLevel: number;
    chromeDelete: boolean;
    carbonHood: boolean;
    totalKes: number;
    totalUsd: number;
  }) => void;
}

type BodyStyle = 'suv' | 'pickup' | 'sedan';

export const WrapTintVisualizer: React.FC<WrapTintVisualizerProps> = ({
  activeVehicle,
  currency,
  onBookSpec,
}) => {
  // Infer initial body style from active vehicle if present
  const initialBodyStyle: BodyStyle =
    activeVehicle?.model.toLowerCase().includes('hilux') ||
    activeVehicle?.model.toLowerCase().includes('ranger') ||
    activeVehicle?.model.toLowerCase().includes('d-max') ||
    activeVehicle?.model.toLowerCase().includes('79')
      ? 'pickup'
      : activeVehicle?.model.toLowerCase().includes('c-class') ||
        activeVehicle?.model.toLowerCase().includes('3-series') ||
        activeVehicle?.model.toLowerCase().includes('wrx')
      ? 'sedan'
      : 'suv';

  const [bodyStyle, setBodyStyle] = useState<BodyStyle>(initialBodyStyle);
  const [selectedWrapColor, setSelectedWrapColor] = useState(WRAP_COLORS[0]);
  const [selectedTint, setSelectedTint] = useState(TINT_LEVELS[1]); // 20%
  const [chromeDelete, setChromeDelete] = useState<boolean>(true);
  const [carbonHood, setCarbonHood] = useState<boolean>(false);

  // Pricing calculation
  const baseWrapKes = bodyStyle === 'suv' ? 195000 : bodyStyle === 'pickup' ? 185000 : 165000;
  const baseWrapUsd = Math.round(baseWrapKes / 130);

  const tintKes = 35000;
  const tintUsd = Math.round(tintKes / 130);

  const chromeDeleteKes = chromeDelete ? 38000 : 0;
  const chromeDeleteUsd = chromeDelete ? Math.round(38000 / 130) : 0;

  const carbonHoodKes = carbonHood ? 28000 : 0;
  const carbonHoodUsd = carbonHood ? Math.round(28000 / 130) : 0;

  const totalKes = baseWrapKes + tintKes + chromeDeleteKes + carbonHoodKes;
  const totalUsd = baseWrapUsd + tintUsd + chromeDeleteUsd + carbonHoodUsd;

  // Window tint opacity mapping
  const windowOpacity =
    selectedTint.percent === 5
      ? 0.94
      : selectedTint.percent === 20
      ? 0.82
      : selectedTint.percent === 35
      ? 0.65
      : selectedTint.percent === 50
      ? 0.45
      : 0.25;

  const handleOrder = () => {
    onBookSpec({
      vehicleType:
        bodyStyle === 'suv'
          ? 'Full-Size SUV (Prado / Land Cruiser / Patrol)'
          : bodyStyle === 'pickup'
          ? '4x4 Double Cab (Hilux / Ranger / D-Max)'
          : 'Performance Sedan (C-Class / 3-Series / WRX)',
      wrapColor: selectedWrapColor.name,
      wrapFinish: selectedWrapColor.finish,
      tintLevel: selectedTint.percent,
      chromeDelete,
      carbonHood,
      totalKes,
      totalUsd,
    });
  };

  return (
    <section id="visualizer" className="py-16 bg-slate-100 dark:bg-neutral-950 border-t border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title & domain intro */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-500">
              <Palette className="w-3.5 h-3.5" />
              <span>Interactive Wrap &amp; Tint Studio</span>
              <span className="text-neutral-400 dark:text-neutral-600">·</span>
              <span className="text-neutral-600 dark:text-neutral-400">SJO Motorsport Customizer</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-display mt-1">
              Visualize Your Vehicle Transformation
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-2xl">
              Preview real 3M &amp; Avery Dennison vinyl wrap colors, ceramic window darkness percentages, and blackout packages before setting foot in the fitment bay.
            </p>
          </div>

          {/* Body Style Selector tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setBodyStyle('suv')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                bodyStyle === 'suv'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              SUV / 4x4
            </button>
            <button
              onClick={() => setBodyStyle('pickup')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                bodyStyle === 'pickup'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Double-Cab Pickup
            </button>
            <button
              onClick={() => setBodyStyle('sedan')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                bodyStyle === 'sedan'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Sport Sedan
            </button>
          </div>
        </div>

        {/* Studio Grid: Left Visualizer Display | Right Customization Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Visualizer Canvas */}
          <div className="lg:col-span-7 bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl">
            {/* Studio ceiling hexagonal light effect */}
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

            {/* Spec status pills */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedWrapColor.hex }} />
                <span className="font-bold text-white">{selectedWrapColor.name}</span>
                <span className="text-neutral-500">·</span>
                <span className="text-neutral-400">{selectedWrapColor.finish}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300 bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-md">
                <Sun className="w-3.5 h-3.5 text-red-500" />
                <span>{selectedTint.label}</span>
              </div>
            </div>

            {/* Vector Vehicle Simulation Graphic */}
            <div className="relative my-8 sm:my-12 flex items-center justify-center min-h-[220px] sm:min-h-[280px]">
              <svg
                viewBox="0 0 600 240"
                className="w-full max-w-[560px] h-auto drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)]"
              >
                <defs>
                  {/* Gloss / Satin Reflection Gradient */}
                  <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.32" />
                    <stop offset="35%" stopColor={selectedWrapColor.hex} />
                    <stop offset="85%" stopColor={selectedWrapColor.hex} />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
                  </linearGradient>

                  {/* Carbon Fiber pattern */}
                  <pattern id="carbonPattern" width="6" height="6" patternUnits="userSpaceOnUse">
                    <rect width="6" height="6" fill="#18181b" />
                    <rect width="3" height="3" fill="#27272a" />
                    <rect x="3" y="3" width="3" height="3" fill="#3f3f46" />
                  </pattern>

                  {/* Glass tint gradient */}
                  <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0a0a0c" stopOpacity={windowOpacity} />
                    <stop offset="50%" stopColor="#18181b" stopOpacity={windowOpacity} />
                    <stop offset="100%" stopColor="#030712" stopOpacity={Math.min(1, windowOpacity + 0.1)} />
                  </linearGradient>

                  {/* Headlight beam */}
                  <linearGradient id="headlightBeam" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Ground shadow */}
                <ellipse cx="300" cy="215" rx="270" ry="16" fill="#000000" opacity="0.8" />

                {/* ================= BODY SHAPES ================= */}
                {bodyStyle === 'suv' && (
                  <g id="suv-body">
                    {/* Main SUV Body Silhouette */}
                    <path
                      d="M 60,165 L 75,120 L 140,115 L 200,60 L 440,60 L 515,100 L 535,140 L 540,170 L 480,175 C 475,145 425,145 420,175 L 180,175 C 175,145 125,145 120,175 Z"
                      fill="url(#bodyGradient)"
                      stroke="#18181b"
                      strokeWidth="2"
                    />

                    {/* Carbon Hood option */}
                    {carbonHood && (
                      <path
                        d="M 60,165 L 75,120 L 140,115 L 180,115 L 160,165 Z"
                        fill="url(#carbonPattern)"
                        stroke="#27272a"
                      />
                    )}

                    {/* Window Pillars & Trim (Chrome Delete or Chrome) */}
                    <path
                      d="M 205,65 L 435,65 L 495,105 L 205,105 Z"
                      fill={chromeDelete ? '#18181b' : '#cbd5e1'}
                    />

                    {/* Windows with Tint Darkness */}
                    <path
                      d="M 215,70 L 310,70 L 310,103 L 215,103 Z"
                      fill="url(#glassGrad)"
                      stroke={chromeDelete ? '#09090b' : '#94a3b8'}
                      strokeWidth="1.5"
                    />
                    <path
                      d="M 318,70 L 420,70 L 420,103 L 318,103 Z"
                      fill="url(#glassGrad)"
                      stroke={chromeDelete ? '#09090b' : '#94a3b8'}
                      strokeWidth="1.5"
                    />
                    <path
                      d="M 428,72 L 485,103 L 428,103 Z"
                      fill="url(#glassGrad)"
                      stroke={chromeDelete ? '#09090b' : '#94a3b8'}
                      strokeWidth="1.5"
                    />

                    {/* Roof Rails */}
                    <rect
                      x="230"
                      y="52"
                      width="190"
                      height="6"
                      rx="3"
                      fill={chromeDelete ? '#09090b' : '#94a3b8'}
                    />

                    {/* Door Line accents */}
                    <line x1="314" y1="65" x2="314" y2="175" stroke="#121215" strokeWidth="2" />
                    <line x1="424" y1="65" x2="424" y2="175" stroke="#121215" strokeWidth="2" />

                    {/* Front Headlight (LED Crisp) */}
                    <polygon points="62,130 95,125 90,145 60,145" fill="#e0f2fe" />
                    <polygon points="50,130 65,130 65,145 50,145" fill="url(#headlightBeam)" />

                    {/* Rear Taillight */}
                    <polygon points="530,120 540,125 538,150 525,148" fill="#ef4444" />
                  </g>
                )}

                {bodyStyle === 'pickup' && (
                  <g id="pickup-body">
                    {/* Pickup Cab + Bed Silhouette */}
                    <path
                      d="M 60,165 L 75,125 L 145,120 L 195,65 L 360,65 L 375,120 L 530,120 L 535,170 L 475,175 C 470,145 420,145 415,175 L 180,175 C 175,145 125,145 120,175 Z"
                      fill="url(#bodyGradient)"
                      stroke="#18181b"
                      strokeWidth="2"
                    />

                    {carbonHood && (
                      <path
                        d="M 60,165 L 75,125 L 145,120 L 180,120 L 160,165 Z"
                        fill="url(#carbonPattern)"
                      />
                    )}

                    {/* Windows */}
                    <path
                      d="M 205,72 L 275,72 L 275,115 L 205,115 Z"
                      fill="url(#glassGrad)"
                      stroke={chromeDelete ? '#09090b' : '#94a3b8'}
                      strokeWidth="1.5"
                    />
                    <path
                      d="M 285,72 L 350,72 L 355,115 L 285,115 Z"
                      fill="url(#glassGrad)"
                      stroke={chromeDelete ? '#09090b' : '#94a3b8'}
                      strokeWidth="1.5"
                    />

                    {/* Sports Bar / Rollbar in the bed */}
                    <path
                      d="M 370,118 L 390,75 L 435,118"
                      stroke={chromeDelete ? '#18181b' : '#94a3b8'}
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                    />

                    <line x1="280" y1="70" x2="280" y2="175" stroke="#121215" strokeWidth="2" />
                    <line x1="365" y1="120" x2="365" y2="175" stroke="#121215" strokeWidth="2" />

                    <polygon points="62,130 95,125 90,145 60,145" fill="#e0f2fe" />
                    <polygon points="528,125 536,128 534,152 524,150" fill="#ef4444" />
                  </g>
                )}

                {bodyStyle === 'sedan' && (
                  <g id="sedan-body">
                    {/* Sleek Low Profile Sedan */}
                    <path
                      d="M 65,170 L 95,130 L 170,120 L 235,70 L 415,70 L 485,125 L 535,135 L 535,170 L 475,175 C 470,148 425,148 420,175 L 180,175 C 175,148 130,148 125,175 Z"
                      fill="url(#bodyGradient)"
                      stroke="#18181b"
                      strokeWidth="2"
                    />

                    {carbonHood && (
                      <path
                        d="M 65,170 L 95,130 L 170,120 L 205,120 L 180,170 Z"
                        fill="url(#carbonPattern)"
                      />
                    )}

                    {/* Windows */}
                    <path
                      d="M 245,78 L 320,78 L 320,115 L 230,115 Z"
                      fill="url(#glassGrad)"
                      stroke={chromeDelete ? '#09090b' : '#94a3b8'}
                      strokeWidth="1.5"
                    />
                    <path
                      d="M 328,78 L 405,78 L 460,115 L 328,115 Z"
                      fill="url(#glassGrad)"
                      stroke={chromeDelete ? '#09090b' : '#94a3b8'}
                      strokeWidth="1.5"
                    />

                    <line x1="324" y1="75" x2="324" y2="175" stroke="#121215" strokeWidth="2" />
                    <polygon points="67,138 105,130 100,150 67,150" fill="#e0f2fe" />
                    <polygon points="525,135 535,138 532,155 520,152" fill="#ef4444" />
                  </g>
                )}

                {/* ================= WHEELS (Front & Rear) ================= */}
                {/* Front Wheel */}
                <g transform="translate(150, 175)">
                  <circle cx="0" cy="0" r="38" fill="#18181b" stroke="#09090b" strokeWidth="4" />
                  <circle cx="0" cy="0" r="28" fill="#27272a" stroke="#3f3f46" strokeWidth="2" />
                  <line x1="-22" y1="0" x2="22" y2="0" stroke="#a1a1aa" strokeWidth="4" />
                  <line x1="0" y1="-22" x2="0" y2="22" stroke="#a1a1aa" strokeWidth="4" />
                  <line x1="-15" y1="-15" x2="15" y2="15" stroke="#a1a1aa" strokeWidth="4" />
                  <line x1="-15" y1="15" x2="15" y2="-15" stroke="#a1a1aa" strokeWidth="4" />
                  {/* Caliper Accent (Red) */}
                  <rect x="-14" y="-20" width="8" height="14" rx="2" fill="#dc2626" />
                  <circle cx="0" cy="0" r="8" fill="#09090b" />
                </g>

                {/* Rear Wheel */}
                <g transform="translate(445, 175)">
                  <circle cx="0" cy="0" r="38" fill="#18181b" stroke="#09090b" strokeWidth="4" />
                  <circle cx="0" cy="0" r="28" fill="#27272a" stroke="#3f3f46" strokeWidth="2" />
                  <line x1="-22" y1="0" x2="22" y2="0" stroke="#a1a1aa" strokeWidth="4" />
                  <line x1="0" y1="-22" x2="0" y2="22" stroke="#a1a1aa" strokeWidth="4" />
                  <line x1="-15" y1="-15" x2="15" y2="15" stroke="#a1a1aa" strokeWidth="4" />
                  <line x1="-15" y1="15" x2="15" y2="-15" stroke="#a1a1aa" strokeWidth="4" />
                  <rect x="6" y="-20" width="8" height="14" rx="2" fill="#dc2626" />
                  <circle cx="0" cy="0" r="8" fill="#09090b" />
                </g>
              </svg>
            </div>

            {/* Bottom summary specs strip */}
            <div className="relative z-10 pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-400">
              <div className="flex items-center gap-4">
                <span>
                  Estimated Installation: <strong className="text-white">4 - 5 Days</strong>
                </span>
                <span>·</span>
                <span>
                  Warranty: <strong className="text-white">3-Year Cast Guarantee</strong>
                </span>
              </div>
              <div className="font-mono text-neutral-300">
                Studio: Westlands &amp; Mombasa Rd
              </div>
            </div>
          </div>

          {/* Right Customization Controls */}
          <div className="lg:col-span-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col gap-6 shadow-xl transition-colors">
            {/* 1. Wrap Color Palettes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-300 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-red-600 dark:text-red-500" />
                  1. Vinyl Wrap Color &amp; Finish
                </label>
                <span className="text-xs text-red-600 dark:text-red-400 font-semibold">{selectedWrapColor.name}</span>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                {WRAP_COLORS.map((color) => {
                  const isSelected = selectedWrapColor.id === color.id;
                  return (
                    <button
                      key={color.id}
                      onClick={() => setSelectedWrapColor(color)}
                      className={`relative flex flex-col items-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-red-600 bg-red-600/10 dark:bg-neutral-950 ring-1 ring-red-600'
                          : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/60 hover:border-neutral-400 dark:hover:border-neutral-700'
                      }`}
                    >
                      <span
                        className="w-7 h-7 rounded-full shadow-inner mb-1.5 border border-white/20"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-[11px] font-medium text-neutral-900 dark:text-white truncate max-w-[70px]">
                        {color.name.split(' ')[1] || color.name.split(' ')[0]}
                      </span>
                      <span className="text-[9px] text-neutral-500 dark:text-neutral-400 truncate max-w-[70px]">
                        {color.finish}
                      </span>
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-600 rounded-full flex items-center justify-center text-white">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Window Tint Darkness VLT */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-300 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-red-600 dark:text-red-500" />
                  2. Nano-Ceramic Window Tint VLT
                </label>
                <span className="text-xs text-red-600 dark:text-red-400 font-semibold">{selectedTint.label}</span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {TINT_LEVELS.map((tint) => {
                  const isSelected = selectedTint.percent === tint.percent;
                  return (
                    <button
                      key={tint.percent}
                      onClick={() => setSelectedTint(tint)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-red-600 bg-red-600/10 dark:bg-neutral-950 ring-1 ring-red-600'
                          : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/60 hover:border-neutral-400 dark:hover:border-neutral-700'
                      }`}
                    >
                      <div className="text-sm font-extrabold text-neutral-900 dark:text-white font-mono">{tint.percent}%</div>
                      <div className="text-[9px] text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                        {tint.label.split(' ')[1]}
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                {selectedTint.desc}
              </p>
            </div>

            {/* 3. Styling Package Toggles */}
            <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-300 flex items-center gap-1.5 mb-1">
                <Layers className="w-4 h-4 text-red-600 dark:text-red-500" />
                3. Additional Styling Packages
              </label>

              {/* Chrome Delete */}
              <div
                onClick={() => setChromeDelete(!chromeDelete)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  chromeDelete
                    ? 'border-red-600/60 bg-red-600/5'
                    : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/60 hover:border-neutral-400 dark:hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-neutral-900 dark:text-white">Stealth Chrome Delete (Blackout)</div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Window surrounds, front grille &amp; mirrors in gloss piano black
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <div className="text-xs font-bold text-red-600 dark:text-red-500 font-mono">
                    +{currency === 'KES' ? 'KES 38,000' : '$290'}
                  </div>
                  <input
                    type="checkbox"
                    checked={chromeDelete}
                    onChange={() => {}}
                    className="rounded text-red-600 bg-white dark:bg-neutral-950 border-neutral-300 dark:border-neutral-700 pointer-events-none mt-1"
                  />
                </div>
              </div>

              {/* Forged Carbon Hood */}
              <div
                onClick={() => setCarbonHood(!carbonHood)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  carbonHood
                    ? 'border-red-600/60 bg-red-600/5'
                    : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/60 hover:border-neutral-400 dark:hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-neutral-900 dark:text-white">Forged Carbon Fiber Bonnet Wrap</div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    3D embossed realistic marble forged carbon on engine hood
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <div className="text-xs font-bold text-red-600 dark:text-red-500 font-mono">
                    +{currency === 'KES' ? 'KES 28,000' : '$215'}
                  </div>
                  <input
                    type="checkbox"
                    checked={carbonHood}
                    onChange={() => {}}
                    className="rounded text-red-600 bg-white dark:bg-neutral-950 border-neutral-300 dark:border-neutral-700 pointer-events-none mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Total Price & Direct CTA */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 block">Total Package Estimate</span>
                  <span className="text-xs text-neutral-400 dark:text-neutral-500">Includes materials &amp; fitment</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-red-600 dark:text-red-500 font-mono">
                    {currency === 'KES'
                      ? `KES ${totalKes.toLocaleString()}`
                      : `$${totalUsd.toLocaleString()}`}
                  </div>
                </div>
              </div>

              <button
                onClick={handleOrder}
                className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-600/25"
              >
                <span>Book This Custom Spec</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
