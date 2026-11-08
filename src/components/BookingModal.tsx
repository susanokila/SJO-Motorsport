import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Car, CheckCircle2, MessageSquare, Phone, User, Mail, ShieldCheck } from 'lucide-react';
import { SelectedVehicle, ProductItem } from '../types';
import { BRANCHES } from '../data/catalog';
import { ALL_MAKES, POPULAR_YEARS } from '../data/vehicles';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeVehicle: SelectedVehicle | null;
  initialService?: string;
  initialProduct?: ProductItem | null;
  currency: 'KES' | 'USD';
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  activeVehicle,
  initialService,
  initialProduct,
  currency,
}) => {
  // Service selection
  const [service, setService] = useState<string>(
    initialProduct?.name ||
      initialService ||
      'Custom Full Vehicle Vinyl Wrap (Color Change)'
  );

  // Vehicle info
  const [year, setYear] = useState<number>(activeVehicle?.year || 2023);
  const [make, setMake] = useState<string>(activeVehicle?.make || 'Toyota');
  const [model, setModel] = useState<string>(
    activeVehicle?.model || 'Land Cruiser Prado (150/250)'
  );
  const [regPlate, setRegPlate] = useState<string>('KDA 123X');

  // Branch & appointment
  const [branchId, setBranchId] = useState<string>('nairobi-westlands');
  const [date, setDate] = useState<string>('2026-11-12');
  const [timeSlot, setTimeSlot] = useState<string>('09:00 AM');

  // Customer info
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('+254 ');
  const [email, setEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Confirmation state
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [bookingRef, setBookingRef] = useState<string>('');

  if (!isOpen) return null;

  const selectedBranch = BRANCHES.find((b) => b.id === branchId) || BRANCHES[0];

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `SJO-${Math.floor(10000 + Math.random() * 90000)}`;
    setBookingRef(ref);
    setBookingConfirmed(true);
  };

  const generateWhatsAppUrl = () => {
    const text = `*New Fitment & Styling Booking Request - SJO Motorsport*
- Service: ${service}
- Vehicle: ${year} ${make} ${model} (Plate: ${regPlate || 'N/A'})
- Fitment Branch: ${selectedBranch.name} (${selectedBranch.city})
- Preferred Date: ${date} at ${timeSlot}
- Customer: ${fullName || 'Client'} (${phone})
- Notes: ${notes || 'Standard fitment'}`;

    return `https://wa.me/254712345678?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col text-neutral-900 dark:text-neutral-100 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-red-600 dark:text-red-500" />
            <span className="font-bold text-base font-display text-neutral-900 dark:text-white">
              Book SJO Motorsport Bay Fitment
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1">
          {bookingConfirmed ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-500">
                  Appointment Reserved
                </span>
                <h3 className="text-2xl font-black font-display mt-1 text-neutral-900 dark:text-white">
                  Fitment Bay Booked Successfully!
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-md mx-auto">
                  Your appointment slot is held at{' '}
                  <strong className="text-neutral-900 dark:text-white">{selectedBranch.name}</strong> on{' '}
                  <strong className="text-neutral-900 dark:text-white">{date}</strong> at{' '}
                  <strong className="text-neutral-900 dark:text-white">{timeSlot}</strong>.
                </p>
              </div>

              <div className="bg-neutral-100 dark:bg-neutral-950 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 max-w-sm mx-auto text-left space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Booking Reference:</span>
                  <span className="font-mono font-bold text-red-600 dark:text-red-500">{bookingRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Vehicle:</span>
                  <span className="font-medium text-neutral-900 dark:text-white">
                    {year} {make} {model}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Service:</span>
                  <span className="font-medium text-neutral-900 dark:text-white truncate max-w-[200px]">{service}</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Confirmation via WhatsApp</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium text-xs transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleConfirmReservation} className="space-y-6">
              {/* Service Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                  1. Selected Service / Package
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 focus:border-red-500 rounded-lg px-3 py-2.5 text-xs text-neutral-900 dark:text-white transition-colors cursor-pointer outline-none"
                >
                  <option value="Custom Full Vehicle Vinyl Wrap (Color Change)">
                    Custom Full Vehicle Vinyl Wrap (Color Change / Matte / Satin)
                  </option>
                  <option value="Nano-Ceramic IR 98% Heat-Rejection Complete Vehicle Tint Package">
                    Nano-Ceramic IR 98% Heat-Rejection Complete Vehicle Tint Package
                  </option>
                  <option value="8-Mil Ballistic-Grade Anti-Smash & Grab Security Film Package">
                    8-Mil Anti-Smash &amp; Grab Security Window Tint Package
                  </option>
                  <option value="Stealth Blackout Chrome Delete Package">
                    Stealth Blackout Chrome Delete Package (Trim + Grille)
                  </option>
                  <option value="Velox 9H Graphene Ceramic Coating Matrix">
                    9H Graphene Ceramic Coating Matrix (5-Year Gloss Shield)
                  </option>
                  <option value="Self-Healing TPU Paint Protection Film (PPF) — Full Front Impact Kit">
                    Self-Healing TPU Paint Protection Film (PPF) — Full Front Kit
                  </option>
                  <option value="Summit Series Heavy-Duty Steel Bullbar Fitment">
                    Summit Series Heavy-Duty Steel Bullbar Fitment
                  </option>
                  <option value="Low-Profile Modular Aluminum Roof Rack Platform Fitment">
                    Low-Profile Modular Aluminum Roof Rack Platform Fitment
                  </option>
                  <option value="3D Laser-Scanned Floor Liners & Dashcam Fitment">
                    3D Laser-Scanned Floor Liners &amp; Dual 4K Dashcam Installation
                  </option>
                </select>
              </div>

              {/* Vehicle Model Information */}
              <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-500 flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5" />
                    2. Vehicle Fitment Information
                  </span>
                  {activeVehicle && (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Synced with Garage
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-neutral-500 dark:text-neutral-400 block mb-1">Year</label>
                    <select
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 dark:text-white"
                    >
                      {POPULAR_YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-500 dark:text-neutral-400 block mb-1">Make</label>
                    <select
                      value={make}
                      onChange={(e) => setMake(e.target.value)}
                      className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 dark:text-white"
                    >
                      {ALL_MAKES.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-500 dark:text-neutral-400 block mb-1">Model Name</label>
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="e.g. Prado / Hilux / D-Max"
                      className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-neutral-500 dark:text-neutral-400 block mb-1">
                    Registration Plate (Optional)
                  </label>
                  <input
                    type="text"
                    value={regPlate}
                    onChange={(e) => setRegPlate(e.target.value)}
                    placeholder="e.g. KDA 420Y"
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Branch & Date Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-600 dark:text-red-500" />
                    3. Studio Branch
                  </label>
                  <select
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    className="w-full bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-900 dark:text-white"
                  >
                    {BRANCHES.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-red-600 dark:text-red-500" />
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-red-600 dark:text-red-500" />
                    Time Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-900 dark:text-white"
                  >
                    <option value="08:30 AM">08:30 AM (Early Drop-off)</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="01:00 PM">01:00 PM (Afternoon Slot)</option>
                    <option value="03:30 PM">03:30 PM</option>
                  </select>
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="space-y-3 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  4. Your Contact Details
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Full Name *"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-900 dark:text-white placeholder-neutral-400"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone / WhatsApp Number *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    rows={2}
                    placeholder="Specific requests, color preferences, or fitment notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-600/25"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Online Reservation</span>
                </button>

                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Book via WhatsApp</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
