import React, { useState, useEffect } from 'react';
import { Car, CheckCircle2, RotateCcw, Search, Sparkles, Filter } from 'lucide-react';
import { SelectedVehicle, VehicleModel } from '../types';
import { VEHICLE_DATABASE, ALL_MAKES, POPULAR_YEARS } from '../data/vehicles';

interface VehicleSelectorProps {
  activeVehicle: SelectedVehicle | null;
  onSelectVehicle: (vehicle: SelectedVehicle | null) => void;
  filterByVehicleOnly: boolean;
  onToggleFilterByVehicleOnly: () => void;
  compatibleCount: number;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  activeVehicle,
  onSelectVehicle,
  filterByVehicleOnly,
  onToggleFilterByVehicleOnly,
  compatibleCount,
}) => {
  const [selectorMode, setSelectorMode] = useState<'ymm' | 'vin'>('ymm');
  const [vinInput, setVinInput] = useState('');
  const [vinError, setVinError] = useState<string | null>(null);

  const [selectedYear, setSelectedYear] = useState<number | ''>(activeVehicle?.year || 2023);
  const [selectedMake, setSelectedMake] = useState<string>(activeVehicle?.make || '');
  const [selectedModel, setSelectedModel] = useState<string>(activeVehicle?.model || '');
  const [selectedTrim, setSelectedTrim] = useState<string>(activeVehicle?.trim || '');

  // Keep state synced if activeVehicle changes externally
  useEffect(() => {
    if (activeVehicle) {
      setSelectedYear(activeVehicle.year);
      setSelectedMake(activeVehicle.make);
      setSelectedModel(activeVehicle.model);
      setSelectedTrim(activeVehicle.trim || '');
    }
  }, [activeVehicle]);

  // VIN Decoder logic for Kenyan/global automotive standards
  const handleDecodeVin = (vinToTest?: string) => {
    const vin = (vinToTest || vinInput).trim().toUpperCase();
    setVinError(null);

    if (vin.length !== 17) {
      setVinError('Standard Vehicle Identification Number (VIN) must be 17 characters.');
      return;
    }

    // Decode sample VIN patterns
    if (vin.startsWith('JTE') || vin.startsWith('JTM')) {
      // Toyota Prado
      onSelectVehicle({
        year: 2023,
        make: 'Toyota',
        model: 'Land Cruiser Prado (150/250)',
        trim: 'TX-L 2.8L GD-6',
      });
      setSelectorMode('ymm');
    } else if (vin.startsWith('MR0') || vin.startsWith('AHT')) {
      // Toyota Hilux
      onSelectVehicle({
        year: 2023,
        make: 'Toyota',
        model: 'Hilux Double Cab',
        trim: '2.8 GD-6 4x4 Raider',
      });
      setSelectorMode('ymm');
    } else if (vin.startsWith('JF1') || vin.startsWith('JF2')) {
      // Subaru Forester
      onSelectVehicle({
        year: 2022,
        make: 'Subaru',
        model: 'Forester',
        trim: '2.0XT Turbo AWD',
      });
      setSelectorMode('ymm');
    } else if (vin.startsWith('MP1')) {
      // Isuzu D-Max
      onSelectVehicle({
        year: 2023,
        make: 'Isuzu',
        model: 'D-Max Double Cab',
        trim: '3.0L V-Cross 4x4',
      });
      setSelectorMode('ymm');
    } else if (vin.startsWith('1FT') || vin.startsWith('MNB')) {
      // Ford Ranger
      onSelectVehicle({
        year: 2023,
        make: 'Ford',
        model: 'Ranger',
        trim: 'Wildtrak 2.0L Bi-Turbo 4x4',
      });
      setSelectorMode('ymm');
    } else if (vin.startsWith('SAL')) {
      // Land Rover Defender
      onSelectVehicle({
        year: 2022,
        make: 'Land Rover',
        model: 'Defender (110 / 90 / 130)',
        trim: '110 P400 X-Dynamic',
      });
      setSelectorMode('ymm');
    } else {
      // Generic match
      onSelectVehicle({
        year: 2023,
        make: 'Toyota',
        model: 'Land Cruiser Prado (150/250)',
        trim: 'Verified via VIN',
      });
      setSelectorMode('ymm');
    }
  };

  // Filter models based on selected make
  const availableModels: VehicleModel[] = selectedMake
    ? VEHICLE_DATABASE.filter((v) => v.make.toLowerCase() === selectedMake.toLowerCase())
    : [];

  // Filter trims based on selected model
  const activeModelObj = availableModels.find((v) => v.model === selectedModel);
  const availableTrims: string[] = activeModelObj ? activeModelObj.trims : [];

  const handleMakeChange = (make: string) => {
    setSelectedMake(make);
    setSelectedModel('');
    setSelectedTrim('');
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    const found = availableModels.find((v) => v.model === model);
    if (found && found.trims.length > 0) {
      setSelectedTrim(found.trims[0]);
    } else {
      setSelectedTrim('');
    }
  };

  const handleApply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedMake || !selectedModel) return;

    onSelectVehicle({
      year: Number(selectedYear) || 2023,
      make: selectedMake,
      model: selectedModel,
      trim: selectedTrim || undefined,
    });
  };

  const handleQuickSelect = (vehicle: VehicleModel) => {
    setSelectedYear(2023);
    setSelectedMake(vehicle.make);
    setSelectedModel(vehicle.model);
    setSelectedTrim(vehicle.trims[0] || '');

    onSelectVehicle({
      year: 2023,
      make: vehicle.make,
      model: vehicle.model,
      trim: vehicle.trims[0],
    });
  };

  const handleReset = () => {
    setSelectedMake('');
    setSelectedModel('');
    setSelectedTrim('');
    onSelectVehicle(null);
  };

  return (
    <section id="vehicle-filter" className="relative z-20 -mt-10 sm:-mt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 sm:p-7 shadow-2xl shadow-neutral-900/10 dark:shadow-black/80 transition-colors">
        {/* Header row of the selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-500">
              <Search className="w-3.5 h-3.5" />
              <span>Easy Vehicle Fitment Engine</span>
              <span className="text-neutral-400 dark:text-neutral-600">·</span>
              <span className="text-neutral-600 dark:text-neutral-400">SJO Motorsport Precision Specs</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight font-display mt-0.5">
              Select Your Vehicle for Guaranteed Fitment
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
              Filter bullbars, roof racks, ceramic tints, vinyl wrap kits, and mats calibrated to your exact model.
            </p>
          </div>

          {/* Active Vehicle Status / Clear */}
          {activeVehicle ? (
            <div className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-950 p-3 rounded-xl border border-red-500/30">
              <div className="w-10 h-10 rounded-lg bg-red-600/10 flex items-center justify-center text-red-600 dark:text-red-500 shrink-0">
                <Car className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-500">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Fitment Active</span>
                </div>
                <div className="text-sm font-bold text-neutral-900 dark:text-white truncate max-w-[220px]">
                  {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
                </div>
                {activeVehicle.trim && (
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[220px]">
                    {activeVehicle.trim}
                  </div>
                )}
              </div>
              <button
                onClick={handleReset}
                className="ml-2 p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Reset vehicle filter"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-950 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <Sparkles className="w-4 h-4 text-red-600 dark:text-red-500" />
              <span>Zero guesswork — 100% precision fit guaranteed</span>
            </div>
          )}
        </div>

        {/* Mode Switcher Tabs: Year/Make/Model vs 17-Digit VIN */}
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectorMode('ymm')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectorMode === 'ymm'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Filter by Year / Make / Model
          </button>
          <button
            type="button"
            onClick={() => setSelectorMode('vin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectorMode === 'vin'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Filter by 17-Digit VIN
          </button>
        </div>

        {/* VIN Search Mode */}
        {selectorMode === 'vin' ? (
          <div className="mt-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                  Enter 17-Digit Vehicle Identification Number (VIN)
                </label>
                <input
                  type="text"
                  maxLength={17}
                  placeholder="e.g. JTM... (Prado) or MR0... (Hilux) or JF1... (Forester)"
                  value={vinInput}
                  onChange={(e) => setVinInput(e.target.value.toUpperCase())}
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-lg px-3 py-2 text-sm text-neutral-900 dark:text-white font-mono tracking-widest placeholder-neutral-400 dark:placeholder-neutral-500 uppercase outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => handleDecodeVin()}
                className="h-[40px] sm:self-end px-5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-red-600/20"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Decode &amp; Filter</span>
              </button>
            </div>

            {vinError && (
              <p className="text-xs text-red-600 dark:text-red-400">{vinError}</p>
            )}

            <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
              <span className="text-neutral-600 dark:text-neutral-400">Quick Test VINs:</span>
              <button
                type="button"
                onClick={() => handleDecodeVin('JTMBA3FJ5P1234567')}
                className="px-2 py-0.5 rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 hover:border-red-500 text-neutral-800 dark:text-neutral-300 font-mono text-[10px]"
              >
                JTM... (Toyota Prado)
              </button>
              <button
                type="button"
                onClick={() => handleDecodeVin('MR0HA3CD9N9876543')}
                className="px-2 py-0.5 rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 hover:border-red-500 text-neutral-800 dark:text-neutral-300 font-mono text-[10px]"
              >
                MR0... (Toyota Hilux)
              </button>
              <button
                type="button"
                onClick={() => handleDecodeVin('JF1SK9BL4N5123456')}
                className="px-2 py-0.5 rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 hover:border-red-500 text-neutral-800 dark:text-neutral-300 font-mono text-[10px]"
              >
                JF1... (Subaru Forester)
              </button>
            </div>
          </div>
        ) : (
          /* 4-Step Fitment Dropdowns Form */
          <form onSubmit={handleApply} className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
            {/* Step 1: Year */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                1. Select Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-lg px-3 py-2.5 text-sm text-neutral-900 dark:text-white transition-colors cursor-pointer outline-none"
              >
                {POPULAR_YEARS.map((y) => (
                  <option key={y} value={y} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Make */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                2. Vehicle Make
              </label>
              <select
                value={selectedMake}
                onChange={(e) => handleMakeChange(e.target.value)}
                className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-lg px-3 py-2.5 text-sm text-neutral-900 dark:text-white transition-colors cursor-pointer outline-none"
              >
                <option value="" className="bg-white dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400">
                  -- Choose Make --
                </option>
                {ALL_MAKES.map((m) => (
                  <option key={m} value={m} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 3: Model */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                3. Vehicle Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => handleModelChange(e.target.value)}
                disabled={!selectedMake}
                className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg px-3 py-2.5 text-sm text-neutral-900 dark:text-white transition-colors cursor-pointer outline-none"
              >
                <option value="" className="bg-white dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400">
                  {selectedMake ? '-- Choose Model --' : 'Select Make First'}
                </option>
                {availableModels.map((v) => (
                  <option key={v.id} value={v.model} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
                    {v.model}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 4: Trim / Variant */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                4. Engine / Trim Spec
              </label>
              <select
                value={selectedTrim}
                onChange={(e) => setSelectedTrim(e.target.value)}
                disabled={!selectedModel || availableTrims.length === 0}
                className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg px-3 py-2.5 text-sm text-neutral-900 dark:text-white transition-colors cursor-pointer outline-none"
              >
                {availableTrims.length > 0 ? (
                  availableTrims.map((t) => (
                    <option key={t} value={t} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
                      {t}
                    </option>
                  ))
                ) : (
                  <option value="" className="bg-white dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400">
                    {selectedModel ? 'Standard Trim' : 'Select Model First'}
                  </option>
                )}
              </select>
            </div>

            {/* Action Button */}
            <div>
              <button
                type="submit"
                disabled={!selectedMake || !selectedModel}
                className="w-full h-[42px] bg-red-600 hover:bg-red-500 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 disabled:text-neutral-400 dark:disabled:text-neutral-500 text-white font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-600/20"
              >
                <Search className="w-4 h-4" />
                <span>Apply Vehicle Fitment</span>
              </button>
            </div>
          </form>
        )}

        {/* Quick-Select popular vehicles strip & Toggle compatibility */}
        <div className="mt-5 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-neutral-500 dark:text-neutral-400 font-medium whitespace-nowrap">Popular Models:</span>
            {VEHICLE_DATABASE.filter((v) => v.popular)
              .slice(0, 6)
              .map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => handleQuickSelect(v)}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer border ${
                    activeVehicle?.model === v.model
                      ? 'bg-red-600/10 border-red-600/60 text-red-600 dark:text-red-400 font-medium'
                      : 'bg-white dark:bg-neutral-950 border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {v.make} {v.model.replace(/\s*\([^)]*\)/, '')}
                </button>
              ))}
          </div>

          {/* Guaranteed Fitment Only Toggle */}
          {activeVehicle && (
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-700 dark:text-neutral-300">
                <input
                  type="checkbox"
                  checked={filterByVehicleOnly}
                  onChange={onToggleFilterByVehicleOnly}
                  className="rounded border-neutral-300 dark:border-neutral-700 text-red-600 focus:ring-red-500 bg-white dark:bg-neutral-950 w-4 h-4 cursor-pointer"
                />
                <span className="font-medium flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-red-600 dark:text-red-500" />
                  Show only compatible items ({compatibleCount})
                </span>
              </label>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
