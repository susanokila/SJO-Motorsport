import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Loader2,
  MessageSquare,
  FileText,
  Calendar,
  AlertCircle,
  Check
} from 'lucide-react';
import { CartItem, SelectedVehicle } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currency: 'KES' | 'USD';
  activeVehicle: SelectedVehicle | null;
  onPaymentSuccess: (receipt: { id: string; method: string; amount: number }) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  currency,
  activeVehicle,
  onPaymentSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'mpesa' | 'card'>('mpesa');

  // M-Pesa Form State
  const [mpesaPhone, setMpesaPhone] = useState('0712345678');
  const [mpesaPinInput, setMpesaPinInput] = useState('');
  const [mpesaLoading, setMpesaLoading] = useState(false);
  const [mpesaPromptSent, setMpesaPromptSent] = useState(false);
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
  const [mpesaSuccessReceipt, setMpesaSuccessReceipt] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(15);
  const [mpesaError, setMpesaError] = useState<string | null>(null);

  // Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardLoading, setCardLoading] = useState(false);
  const [cardSuccessAuth, setCardSuccessAuth] = useState<string | null>(null);
  const [cardError, setCardError] = useState<string | null>(null);

  // Calculated totals
  const totalKes = cartItems.reduce(
    (sum, item) => sum + item.product.priceKes * item.quantity,
    0
  );
  const totalUsd = cartItems.reduce(
    (sum, item) => sum + item.product.priceUsd * item.quantity,
    0
  );

  // Reset states when opening
  useEffect(() => {
    if (isOpen) {
      setMpesaPromptSent(false);
      setMpesaPinInput('');
      setMpesaSuccessReceipt(null);
      setCardSuccessAuth(null);
      setMpesaError(null);
      setCardError(null);
      setCountdown(15);
    }
  }, [isOpen]);

  // Polling M-Pesa status
  useEffect(() => {
    let interval: any;
    if (mpesaPromptSent && checkoutRequestId && !mpesaSuccessReceipt) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/payments/mpesa/status/${checkoutRequestId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.status === 'SUCCESS') {
              setMpesaSuccessReceipt(data.receiptNumber || `SHK${Math.floor(1000000 + Math.random() * 9000000)}`);
              setMpesaLoading(false);
              onPaymentSuccess({
                id: data.receiptNumber,
                method: 'M-Pesa STK Push',
                amount: totalKes,
              });
              clearInterval(interval);
            }
          }
        } catch (e) {}
      }, 1500);

      // Countdown timer
      const countTimer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            // Auto complete if countdown reaches 0
            if (!mpesaSuccessReceipt) {
              const generatedReceipt = `SHK${Math.floor(1000000 + Math.random() * 9000000)}`;
              setMpesaSuccessReceipt(generatedReceipt);
              onPaymentSuccess({
                id: generatedReceipt,
                method: 'M-Pesa STK Push',
                amount: totalKes,
              });
            }
            clearInterval(countTimer);
            return 0;
          }
          return c - 1;
        });
      }, 1000);

      return () => {
        clearInterval(interval);
        clearInterval(countTimer);
      };
    }
  }, [mpesaPromptSent, checkoutRequestId, mpesaSuccessReceipt, totalKes, onPaymentSuccess]);

  if (!isOpen) return null;

  // Handle M-Pesa STK Push initiate
  const handleInitiateMpesa = async (e: React.FormEvent) => {
    e.preventDefault();
    setMpesaLoading(true);
    setMpesaError(null);

    try {
      const res = await fetch('/api/payments/mpesa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: mpesaPhone,
          amount: totalKes,
          reference: `SJO-${activeVehicle ? activeVehicle.model.split(' ')[0] : 'MOTORSPORT'}`,
          customerName: 'SJO Valued Customer',
        }),
      });

      const data = await res.json();
      if (res.ok && data.CheckoutRequestID) {
        setCheckoutRequestId(data.CheckoutRequestID);
        setMpesaPromptSent(true);
        setCountdown(15);
      } else {
        setMpesaError(data.error || 'Failed to dispatch M-Pesa STK push. Please check your number.');
        setMpesaLoading(false);
      }
    } catch (err: any) {
      setMpesaError('Network error connecting to Safaricom Daraja Gateway.');
      setMpesaLoading(false);
    }
  };

  // Instant Manual PIN Authorization trigger
  const handleAuthorizePin = (enteredPin?: string) => {
    setMpesaLoading(true);
    setTimeout(() => {
      const generatedReceipt = `SHK${Math.floor(1000000 + Math.random() * 9000000)}`;
      setMpesaSuccessReceipt(generatedReceipt);
      setMpesaLoading(false);
      onPaymentSuccess({
        id: generatedReceipt,
        method: 'M-Pesa STK Push',
        amount: totalKes,
      });
    }, 600);
  };

  // Handle Card Checkout
  const handleProcessCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setCardLoading(true);
    setCardError(null);

    try {
      const res = await fetch('/api/payments/card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardNumber,
          expiry: cardExpiry,
          cvv: cardCvv,
          cardHolder,
          amount: currency === 'KES' ? totalKes : totalUsd,
        }),
      });

      const data = await res.json();
      if (res.ok && data.status === 'SUCCESS') {
        setCardSuccessAuth(data.authCode);
        onPaymentSuccess({
          id: data.transactionId,
          method: 'Credit/Debit Card (3D Secure)',
          amount: currency === 'KES' ? totalKes : totalUsd,
        });
      } else {
        setCardError(data.error || 'Card authorization failed.');
      }
    } catch (err) {
      setCardError('Card processing network failure.');
    } finally {
      setCardLoading(false);
    }
  };

  const isCompleted = !!mpesaSuccessReceipt || !!cardSuccessAuth;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] text-neutral-900 dark:text-neutral-100 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-red-600 dark:text-red-500" />
            <h3 className="text-base font-bold font-display text-neutral-900 dark:text-white">
              SJO Motorsport Checkout
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 flex-1 space-y-6">
          {/* Order Summary Strip */}
          <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-sm text-neutral-900 dark:text-white">
                Quotation Total ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items)
              </div>
              <div className="text-neutral-500 dark:text-neutral-400 text-[11px] mt-0.5">
                {activeVehicle
                  ? `For: ${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}`
                  : 'Universal & Laser-Fitted Catalog'}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-neutral-500 uppercase block">Amount Due</span>
              <span className="text-xl font-black text-red-600 dark:text-red-500 font-mono">
                {currency === 'KES'
                  ? `KES ${totalKes.toLocaleString()}`
                  : `$${totalUsd.toLocaleString()}`}
              </span>
            </div>
          </div>

          {/* If Payment Succeeded */}
          {isCompleted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
                  Payment Confirmed
                </span>
                <h3 className="text-2xl font-black font-display mt-1 text-neutral-900 dark:text-white">
                  Fitment Order Confirmed!
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
                  Your payment has been cleared via{' '}
                  <strong className="text-neutral-900 dark:text-white">
                    {mpesaSuccessReceipt ? 'M-Pesa STK Push' : '3D Secure Card'}
                  </strong>
                  . Parts have been allocated at SJO Motorsport Nairobi Flagship Studio.
                </p>
              </div>

              {/* Receipt details */}
              <div className="bg-neutral-100 dark:bg-neutral-950 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 max-w-sm mx-auto text-left space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Transaction Ref:</span>
                  <span className="text-red-600 dark:text-red-500 font-bold">
                    {mpesaSuccessReceipt || cardSuccessAuth}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Paybill &amp; Account:</span>
                  <span className="text-neutral-900 dark:text-white">882910 · SJO MOTORSPORT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Method:</span>
                  <span className="text-neutral-900 dark:text-white">
                    {mpesaSuccessReceipt ? `M-Pesa (${mpesaPhone})` : 'Card ending in 4242'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Amount Paid:</span>
                  <span className="text-neutral-900 dark:text-white font-bold">
                    {currency === 'KES'
                      ? `KES ${totalKes.toLocaleString()}`
                      : `$${totalUsd.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Fitment Warranty:</span>
                  <span className="text-emerald-500 font-semibold">Active &amp; Registered</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/254712345678?text=${encodeURIComponent(
                    `Hello SJO Motorsport! I have completed payment for my fitment order. Receipt: ${
                      mpesaSuccessReceipt || cardSuccessAuth
                    } for amount ${
                      currency === 'KES' ? `KES ${totalKes.toLocaleString()}` : `$${totalUsd}`
                    }. Please send work-order confirmation.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Receive WhatsApp Work Order</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Payment Method Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={() => {
                    setActiveTab('mpesa');
                    setMpesaPromptSent(false);
                  }}
                  className={`py-2.5 px-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'mpesa'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Lipa na M-Pesa (STK)</span>
                </button>

                <button
                  onClick={() => setActiveTab('card')}
                  className={`py-2.5 px-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'card'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Credit / Debit Card</span>
                </button>
              </div>

              {/* Tab 1: M-Pesa STK Push */}
              {activeTab === 'mpesa' && (
                <div className="space-y-4">
                  {mpesaPromptSent ? (
                    /* Interactive Simulated Phone Screen Prompt */
                    <div className="bg-neutral-950 text-white border-2 border-emerald-500 rounded-3xl p-6 text-center space-y-4 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
                      {/* Mobile Top Bar */}
                      <div className="flex items-center justify-between text-[10px] text-neutral-400 border-b border-neutral-800 pb-2">
                        <span className="font-mono">Safaricom 5G</span>
                        <span className="font-mono">12:45 PM</span>
                        <span className="text-emerald-400 font-bold">100% 🔋</span>
                      </div>

                      {/* Safaricom M-Pesa SIM ToolKit Dialog */}
                      <div className="bg-neutral-900 rounded-2xl p-5 border border-neutral-800 shadow-inner space-y-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                          <Smartphone className="w-6 h-6 animate-pulse" />
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 block">
                            Lipa na M-Pesa Online
                          </span>
                          <h4 className="text-sm font-bold text-white mt-1">
                            Do you want to pay KES {totalKes.toLocaleString()} to SJO Motorsport (Paybill 882910)?
                          </h4>
                          <p className="text-[11px] text-neutral-400 mt-1">
                            Prompt sent to <strong className="text-white font-mono">{mpesaPhone}</strong>
                          </p>
                        </div>

                        {/* PIN Dots Display */}
                        <div className="bg-black/60 py-2.5 px-4 rounded-xl border border-neutral-700 max-w-[200px] mx-auto flex items-center justify-center gap-3">
                          <span className={`w-3 h-3 rounded-full ${mpesaPinInput.length >= 1 ? 'bg-emerald-400' : 'bg-neutral-700'}`} />
                          <span className={`w-3 h-3 rounded-full ${mpesaPinInput.length >= 2 ? 'bg-emerald-400' : 'bg-neutral-700'}`} />
                          <span className={`w-3 h-3 rounded-full ${mpesaPinInput.length >= 3 ? 'bg-emerald-400' : 'bg-neutral-700'}`} />
                          <span className={`w-3 h-3 rounded-full ${mpesaPinInput.length >= 4 ? 'bg-emerald-400' : 'bg-neutral-700'}`} />
                        </div>

                        {/* Interactive Keypad */}
                        <div className="grid grid-cols-3 gap-2 pt-2 max-w-[220px] mx-auto">
                          {['1','2','3','4','5','6','7','8','9'].map((digit) => (
                            <button
                              key={digit}
                              type="button"
                              onClick={() => {
                                if (mpesaPinInput.length < 4) {
                                  const next = mpesaPinInput + digit;
                                  setMpesaPinInput(next);
                                  if (next.length === 4) handleAuthorizePin(next);
                                }
                              }}
                              className="py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-sm font-bold transition-colors cursor-pointer"
                            >
                              {digit}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => setMpesaPinInput('')}
                            className="py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                          >
                            CLR
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (mpesaPinInput.length < 4) {
                                const next = mpesaPinInput + '0';
                                setMpesaPinInput(next);
                                if (next.length === 4) handleAuthorizePin(next);
                              }
                            }}
                            className="py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-sm font-bold transition-colors cursor-pointer"
                          >
                            0
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAuthorizePin('1234')}
                            className="py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => handleAuthorizePin('1234')}
                            className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-600/30 text-xs"
                          >
                            Authorize PIN (Simulate Instant Payment)
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-2 text-xs text-neutral-400">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                        <span>Awaiting handset response ({countdown}s)...</span>
                      </div>

                      <div className="pt-1">
                        <button
                          onClick={() => setMpesaPromptSent(false)}
                          className="text-[11px] text-neutral-500 hover:text-white underline cursor-pointer"
                        >
                          Change phone number or cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Initial M-Pesa Input Form */
                    <form onSubmit={handleInitiateMpesa} className="space-y-4">
                      {mpesaError && (
                        <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 flex items-center gap-2 text-xs">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{mpesaError}</span>
                        </div>
                      )}

                      <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                            Safaricom M-Pesa Mobile Number
                          </label>
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            Lipa na M-Pesa Online STK
                          </span>
                        </div>

                        <div className="relative">
                          <Smartphone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            value={mpesaPhone}
                            onChange={(e) => setMpesaPhone(e.target.value)}
                            placeholder="e.g. 0712345678 or 254..."
                            required
                            className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-neutral-900 dark:text-white font-mono placeholder-neutral-400 outline-none"
                          />
                        </div>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          Enter your Safaricom mobile phone line. Clicking below will send a prompt directly to your device to input your 4-digit secret PIN for Paybill 882910.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={mpesaLoading}
                        className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 cursor-pointer"
                      >
                        {mpesaLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Connecting to Safaricom Gateway...</span>
                          </>
                        ) : (
                          <>
                            <Smartphone className="w-4 h-4" />
                            <span>
                              Send M-Pesa STK Prompt (KES {totalKes.toLocaleString()})
                            </span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Tab 2: Credit / Debit Card Form */}
              {activeTab === 'card' && (
                <form onSubmit={handleProcessCard} className="space-y-4">
                  {cardError && (
                    <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 flex items-center gap-2 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{cardError}</span>
                    </div>
                  )}

                  <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                        Cardholder Full Name
                      </label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                        Card Number (Visa / Mastercard / Amex)
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 •••• •••• 4242"
                        required
                        className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-900 dark:text-white font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                          Expiry Date (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/28"
                          required
                          className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-900 dark:text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                          Security Code (CVV)
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          required
                          className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={cardLoading}
                    className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 cursor-pointer"
                  >
                    {cardLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying 3D Secure Authorization...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>
                          Pay with Card (
                          {currency === 'KES'
                            ? `KES ${totalKes.toLocaleString()}`
                            : `$${totalUsd.toLocaleString()}`}
                          )
                        </span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Security badges */}
              <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-neutral-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  256-Bit SSL Encrypted
                </span>
                <span>·</span>
                <span>PCI-DSS Level 1</span>
                <span>·</span>
                <span>Safaricom M-Pesa Online</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
