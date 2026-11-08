import React from 'react';
import { Star, ShieldCheck, Check, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { ProductItem, SelectedVehicle } from '../types';

interface ProductCardProps {
  product: ProductItem;
  currency: 'KES' | 'USD';
  activeVehicle: SelectedVehicle | null;
  onSelectProduct: (product: ProductItem) => void;
  onAddToCart: (product: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  activeVehicle,
  onSelectProduct,
  onAddToCart,
}) => {
  // Check fitment compatibility with active vehicle
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

  return (
    <article
      onClick={() => onSelectProduct(product)}
      className="group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-red-500/50 dark:hover:border-red-500/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/60 cursor-pointer text-neutral-900 dark:text-neutral-100"
    >
      {/* Top Image Showcase */}
      <div className="relative aspect-[4/3] w-full bg-neutral-100 dark:bg-neutral-950 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Subtle non-pill single badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 bg-neutral-950/85 backdrop-blur-md border border-red-600/50 text-red-400 text-[11px] font-bold px-2 py-0.5 rounded shadow">
            {product.badge}
          </div>
        )}

        {/* Quick add button overlay */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="p-2.5 rounded-xl bg-red-600 text-white hover:bg-red-500 shadow-lg font-bold flex items-center justify-center cursor-pointer transition-colors"
            title="Add to quotation cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Unboxed Metadata with Typographic Separator */}
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-1.5 font-medium">
            <span className="uppercase tracking-wider text-[11px] font-bold text-red-600 dark:text-red-500">
              {product.categoryLabel}
            </span>
            <span aria-hidden="true">·</span>
            <span>{product.subcategory}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-base font-bold text-neutral-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Fitment Status Text */}
          <div className="mt-2.5 flex items-center gap-1.5 text-xs">
            {activeVehicle ? (
              isFit ? (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  <span>Guaranteed fit for {activeVehicle.model.split(' ')[0]}</span>
                </span>
              ) : (
                <span className="text-neutral-400 dark:text-neutral-500 font-medium">
                  Not specific to {activeVehicle.model.split(' ')[0]}
                </span>
              )
            ) : product.fitmentType === 'universal' ? (
              <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                <span>Universal Fitment (All standard vehicles)</span>
              </span>
            ) : (
              <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-red-600 dark:text-red-500" />
                <span>Vehicle-specific laser fitment</span>
              </span>
            )}
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="mt-5 pt-3.5 border-t border-neutral-200 dark:border-neutral-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 block font-medium">
              Estimated Price
            </span>
            <div className="text-lg font-black text-neutral-900 dark:text-white font-mono tabular-nums">
              {currency === 'KES'
                ? `KES ${product.priceKes.toLocaleString()}`
                : `$${product.priceUsd.toLocaleString()}`}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
            <span>Details</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </article>
  );
};
