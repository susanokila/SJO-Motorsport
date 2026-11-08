import React from 'react';
import { X, Trash2, Plus, Minus, Wrench, ArrowRight, MessageSquare, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currency: 'KES' | 'USD';
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onToggleInstallation: (productId: string) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  onOpenPayment: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  currency,
  onUpdateQuantity,
  onToggleInstallation,
  onRemoveItem,
  onCheckout,
  onOpenPayment,
}) => {
  if (!isOpen) return null;

  const subtotalKes = cartItems.reduce(
    (sum, item) => sum + item.product.priceKes * item.quantity,
    0
  );
  const subtotalUsd = cartItems.reduce(
    (sum, item) => sum + item.product.priceUsd * item.quantity,
    0
  );

  const totalKes = subtotalKes;
  const totalUsd = subtotalUsd;

  // WhatsApp order text
  const generateWhatsAppOrder = () => {
    const itemsList = cartItems
      .map(
        (item) =>
          `• ${item.quantity}x ${item.product.name} (${
            currency === 'KES'
              ? `KES ${(item.product.priceKes * item.quantity).toLocaleString()}`
              : `$${item.product.priceUsd * item.quantity}`
          })`
      )
      .join('\n');

    const message = `*SJO Motorsport Quotation Request*\n\n${itemsList}\n\n*Estimated Total: ${
      currency === 'KES' ? `KES ${totalKes.toLocaleString()}` : `$${totalUsd.toLocaleString()}`
    }*\n\nPlease confirm stock and available fitment dates in Nairobi/Mombasa.`;

    return `https://wa.me/254712345678?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col justify-between transition-colors">
          {/* Header */}
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-red-600 dark:text-red-500" />
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white font-display">
                Quotation &amp; Fitment Bag ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-600 mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-neutral-900 dark:text-white">Your quotation bag is empty</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto">
                  Browse our vehicle-filtered accessories, ceramic tints, vinyl wraps, and paint protection packages.
                </p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 flex gap-3 relative group"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover bg-neutral-200 dark:bg-neutral-900 shrink-0"
                  />

                  <div className="flex-1 min-w-0 pr-6">
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">{item.product.name}</h4>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {item.product.categoryLabel}
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-sm font-extrabold text-red-600 dark:text-red-500 font-mono tabular-nums">
                        {currency === 'KES'
                          ? `KES ${(item.product.priceKes * item.quantity).toLocaleString()}`
                          : `$${(item.product.priceUsd * item.quantity).toLocaleString()}`}
                      </div>

                      {/* Quantity buttons */}
                      <div className="flex items-center gap-1.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md px-1.5 py-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-neutral-900 dark:text-white px-1 font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Installation toggle */}
                    <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                        <Wrench className="w-3 h-3 text-red-600 dark:text-red-500" />
                        Professional Workshop Fitment
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">Included</span>
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="absolute top-3 right-3 text-neutral-400 hover:text-red-600 p-1 rounded transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-neutral-900 dark:text-white">
                    {currency === 'KES'
                      ? `KES ${subtotalKes.toLocaleString()}`
                      : `$${subtotalUsd.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Professional Fitment &amp; Quality Check</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Complimentary</span>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Taxes (16% VAT Kenya)</span>
                  <span className="text-neutral-500 dark:text-neutral-400">Included in Quote</span>
                </div>
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex justify-between text-base font-black">
                  <span className="text-neutral-900 dark:text-white">Total Estimate</span>
                  <span className="text-red-600 dark:text-red-500 font-mono tabular-nums">
                    {currency === 'KES'
                      ? `KES ${totalKes.toLocaleString()}`
                      : `$${totalUsd.toLocaleString()}`}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={onOpenPayment}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/25"
                >
                  <span>Pay with M-Pesa (STK) or Card</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onCheckout}
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Book In-Bay Installation Only</span>
                </button>

                <a
                  href={generateWhatsAppOrder()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-4 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 hover:border-red-500 text-neutral-700 dark:text-neutral-400 hover:text-black dark:hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />
                  <span>Send Quotation to WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
