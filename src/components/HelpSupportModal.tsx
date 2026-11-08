import React, { useState } from 'react';
import { X, Mail, Send, CheckCircle2, Car, HelpCircle, Phone, ArrowUpRight, MessageSquare } from 'lucide-react';
import { SelectedVehicle } from '../types';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeVehicle: SelectedVehicle | null;
}

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({
  isOpen,
  onClose,
  activeVehicle,
}) => {
  const COMPANY_GMAIL = 'sjomotorsport@gmail.com';

  const [category, setCategory] = useState('Fitment Compatibility Help');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+254 ');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTicketId = `SJO-${Math.floor(10000 + Math.random() * 90000)}`;
    setTicketId(newTicketId);

    const subject = `[${newTicketId}] ${category} - ${activeVehicle ? `${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}` : 'Customer Inquiry'}`;
    const body = `Dear SJO Motorsport Team,

Ticket ID: ${newTicketId}
Category: ${category}
Customer Name: ${name}
Phone: ${phone}
Email: ${email}
Vehicle: ${activeVehicle ? `${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model} (${activeVehicle.trim || 'Standard'})` : 'Not specified'}

Inquiry / Question:
${message}

---
Sent via SJO Motorsport Direct Help Center`;

    // 1. Direct Gmail web compose link (opens in Gmail web)
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      COMPANY_GMAIL
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // 2. Standard mailto fallback
    const mailtoUrl = `mailto:${COMPANY_GMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Fire backend log
    fetch('/api/support/ticket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId: newTicketId, name, email, phone, category, message, vehicle: activeVehicle }),
    }).catch(() => {});

    // Try opening Gmail compose tab
    const newWindow = window.open(gmailComposeUrl, '_blank');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      window.location.href = mailtoUrl;
    }

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] text-neutral-900 dark:text-neutral-100 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-600 dark:text-red-500">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-neutral-900 dark:text-white">
                Contact SJO Motorsport Support
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Direct route to <span className="font-semibold text-red-600 dark:text-red-400">{COMPANY_GMAIL}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">
                  Message Dispatched
                </span>
                <h4 className="text-xl font-bold font-display mt-0.5 text-neutral-900 dark:text-white">
                  Email Prepared for SJO Motorsport!
                </h4>
                <p className="text-neutral-600 dark:text-neutral-400 text-xs mt-1 max-w-sm mx-auto">
                  Your message has been opened in Gmail directed to <strong className="text-neutral-900 dark:text-white">{COMPANY_GMAIL}</strong> under reference <strong className="text-red-600 dark:text-red-400 font-mono">{ticketId}</strong>.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${COMPANY_GMAIL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-red-600/20"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Re-open Gmail Compose</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium text-xs hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
                  Topic / Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-white focus:border-red-500 outline-none"
                >
                  <option value="Fitment Compatibility Help">Vehicle Fitment &amp; Compatibility</option>
                  <option value="Custom Vinyl Wrap & Livery Quote">Custom Vinyl Wrap ("Rapper") &amp; Livery Quote</option>
                  <option value="Window Tint Regulations & Quote">Window Tint Darkness &amp; Legal Regulations</option>
                  <option value="M-Pesa STK Payment Inquiry">M-Pesa STK Payment or Order Help</option>
                  <option value="Workshop Bay Appointment">Workshop Bay Appointment in Nairobi/Mombasa</option>
                  <option value="Other SJO Motorsport Inquiry">Other Inquiries</option>
                </select>
              </div>

              {activeVehicle && (
                <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center gap-2.5 text-xs">
                  <Car className="w-4 h-4 text-red-600 dark:text-red-500 shrink-0" />
                  <div>
                    <span className="text-[11px] text-neutral-500 block">Attached Vehicle Info:</span>
                    <span className="font-bold text-neutral-900 dark:text-white">
                      {activeVehicle.year} {activeVehicle.make} {activeVehicle.model} ({activeVehicle.trim || 'Standard'})
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Kamau"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:border-red-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+254 7..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-white font-mono placeholder-neutral-400 dark:placeholder-neutral-600 focus:border-red-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                  Your Email Address
                </label>
                <input
                  type="email"
                  placeholder="your.email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:border-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                  Describe Your Vehicle Question or Request *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell our motorsport mechanics what accessories, wrap finish, or tint you are looking for..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:border-red-500 outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-600/25"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Directly to SJO Motorsport Gmail ({COMPANY_GMAIL})</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
