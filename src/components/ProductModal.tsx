import React, { useState } from 'react';
import { X, Check, Shield, Clock, Calendar, ShoppingBag, MessageSquare, Car, Mail } from 'lucide-react';
import { ProductItem, SelectedVehicle } from '../types';

interface ProductModalProps {
  product: ProductItem | null;
  currency: 'KES' | 'USD';
  activeVehicle: SelectedVehicle | null;
  onClose: () => void;
  onAddToCart: (product: ProductItem, includeInstallation: boolean) => void;
  onOpenBookingForProduct: (product: ProductItem) => void;
  onOpenHelpModal?: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  currency,
  activeVehicle,
  onClose,
  onAddToCart,
  onOpenBookingForProduct,
  onOpenHelpModal,
}) => {
  const [includeInstallation, setIncludeInstallation] = useState(true);
  const [addedToast, setAddedToast] = useState(false);

  if (!product) return null;

  // Determine fitment status
  const isCompatibleWithActiveVehicle = (): boolean => {
    if (!activeVehicle) return true;
    if (product.fitmentType === 'universal') return true;
    if (!product.compatibleVehicles) return false;

    return product.compatibleVehicles.some((compat) => {
      const makeMatches = compat.make.toLowerCase() === activeVehicle.make.toLowerCase();
      if (!makeMatches) return false;
      if (!compat.model) return true;
      return compat.model.toLowerCase() === activeVehicle.model.toLowerCase();
    });
  };

  const isFit = isCompatibleWithActiveVehicle();

  const handleAdd = () => {
    onAddToCart(product, includeInstallation);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2200);
  };

  // WhatsApp prefilled message
  const whatsappUrl = `https://wa.me/254712345678?text=${encodeURIComponent(
    `Hello SJO Motorsport! I would like to inquire about: ${product.name} (${
      currency === 'KES' ? `KES ${product.priceKes.toLocaleString()}` : `$${product.priceUsd}`
    })${
      activeVehicle
        ? ` for my ${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}`
        : ''
    }. Is this available for booking?`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col text-neutral-900 dark:text-neutral-100 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="text-red-600 dark:text-red-500 uppercase font-bold">{product.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{product.subcategory}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Scrollable */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left: Product Media & Fitment Notice */}
            <div>
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Fitment Status Callout */}
              <div
                className={`mt-4 p-4 rounded-xl border ${
                  activeVehicle && isFit
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300'
                    : 'bg-neutral-100 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shrink-0">
                    <Car className="w-5 h-5 text-red-600 dark:text-red-500" />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-sm text-neutral-900 dark:text-white mb-0.5">
                      {activeVehicle
                        ? isFit
                          ? `Guaranteed Fitment: ${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}`
                          : `Vehicle Compatibility Notice`
                        : 'SJO Motorsport Verified Catalog'}
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      {activeVehicle
                        ? isFit
                          ? 'This product has verified laser-measured mounting brackets or direct sizing for your garage vehicle.'
                          : `This product is not flagged as verified specifically for ${activeVehicle.model}. Ask our mechanics for custom fitting via Gmail or WhatsApp.`
                        : product.fitmentType === 'universal'
                        ? 'Engineered to fit all standard vehicle makes and models with zero chassis modifications.'
                        : 'Vehicle-specific sizing available for Toyota, Subaru, Isuzu, Ford, Land Rover, Mercedes and more.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick specs pill-free list */}
              <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                {product.installTime && (
                  <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-red-600 dark:text-red-500 shrink-0" />
                    <div>
                      <span className="text-neutral-500 text-[11px] block">Fitment Time</span>
                      <span className="font-bold text-neutral-900 dark:text-white">{product.installTime}</span>
                    </div>
                  </div>
                )}
                {product.warranty && (
                  <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center gap-2.5">
                    <Shield className="w-4 h-4 text-red-600 dark:text-red-500 shrink-0" />
                    <div>
                      <span className="text-neutral-500 text-[11px] block">Warranty</span>
                      <span className="font-bold text-neutral-900 dark:text-white">{product.warranty}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Product Details & Purchase Actions */}
            <div className="flex flex-col justify-between h-full">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white leading-tight font-display">
                  {product.name}
                </h2>

                <div className="mt-3 flex items-baseline gap-3">
                  <div className="text-3xl font-black text-red-600 dark:text-red-500 font-mono tabular-nums">
                    {currency === 'KES'
                      ? `KES ${product.priceKes.toLocaleString()}`
                      : `$${product.priceUsd.toLocaleString()}`}
                  </div>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                    (VAT &amp; standard fitting included)
                  </span>
                </div>

                <p className="mt-4 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {product.description}
                </p>

                {/* Key Features */}
                <div className="mt-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2.5">
                    Key Specifications &amp; Features
                  </h4>
                  <ul className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-red-600 dark:text-red-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technical Specs Table */}
                {Object.keys(product.specs).length > 0 && (
                  <div className="mt-5 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2.5">
                      Technical Parameters
                    </h4>
                    <dl className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(product.specs).map(([key, val]) => (
                        <div key={key} className="bg-neutral-100 dark:bg-neutral-950 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800">
                          <dt className="text-neutral-500 text-[11px]">{key}</dt>
                          <dd className="font-bold text-neutral-900 dark:text-white mt-0.5">{val}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </div>

              {/* Purchase and Inquiry Buttons */}
              <div className="mt-8 pt-5 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAdd}
                    className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-600/20"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{addedToast ? 'Added to Cart!' : 'Add to Quotation Cart'}</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenBookingForProduct(product);
                    }}
                    className="py-3 px-4 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-red-600 dark:text-red-500" />
                    <span className="hidden sm:inline">Book Fitment</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Inquire via WhatsApp</span>
                  </a>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenHelpModal?.();
                    }}
                    className="py-2.5 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 hover:border-red-500 text-neutral-800 dark:text-neutral-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-red-600 dark:text-red-500" />
                    <span>Email Support (Gmail)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
