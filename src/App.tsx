import React, { useState, useMemo, useEffect } from 'react';
import {
  Car,
  ShieldCheck,
  Search,
  Sparkles,
  Palette,
  Sun,
  Wrench,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Phone,
  MessageSquare,
  SlidersHorizontal,
  X,
  Mail,
  HelpCircle
} from 'lucide-react';
import { Header } from './components/Header';
import { VehicleSelector } from './components/VehicleSelector';
import { WrapTintVisualizer } from './components/WrapTintVisualizer';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { BookingModal } from './components/BookingModal';
import { CartDrawer } from './components/CartDrawer';
import { BranchLocator } from './components/BranchLocator';
import { Footer } from './components/Footer';
import { CookieConsent } from './components/CookieConsent';
import { AiChatbot } from './components/AiChatbot';
import { PaymentModal } from './components/PaymentModal';
import { SecurityTelemetryModal } from './components/SecurityTelemetryModal';
import { HelpSupportModal } from './components/HelpSupportModal';

import {
  CATALOG_PRODUCTS,
  HERO_IMAGE,
  WRAP_STUDIO_IMAGE,
  TINT_STUDIO_IMAGE,
  ACCESSORIES_4X4_IMAGE
} from './data/catalog';
import { ProductItem, SelectedVehicle, CartItem, ProductCategory } from './types';

export default function App() {
  // Theme state: 'dark' (default motorsport dark) or 'light'
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('sjo_theme');
      return (saved === 'light' || saved === 'dark') ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
      localStorage.setItem('sjo_theme', theme);
    } catch {
      // noop
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Active selected vehicle for guaranteed fitment search
  const [activeVehicle, setActiveVehicle] = useState<SelectedVehicle | null>({
    year: 2023,
    make: 'Toyota',
    model: 'Land Cruiser Prado (150/250)',
    trim: 'TX-L 2.8L GD-6'
  });

  // Filter toggle: show only products compatible with active vehicle
  const [filterByVehicleOnly, setFilterByVehicleOnly] = useState<boolean>(false);

  // Currency: KES (Kenyan Shillings) or USD ($)
  const [currency, setCurrency] = useState<'KES' | 'USD'>('KES');

  // Search keyword and category tabs
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [sortOption, setSortOption] = useState<'recommended' | 'price-asc' | 'price-desc'>('recommended');

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [bookingInitialService, setBookingInitialService] = useState<string>('');
  const [bookingInitialProduct, setBookingInitialProduct] = useState<ProductItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);
  const [isSecurityConsoleOpen, setIsSecurityConsoleOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: CATALOG_PRODUCTS[0], // Heavy-Duty Steel Bullbar
      quantity: 1,
      includeInstallation: true
    },
    {
      product: CATALOG_PRODUCTS[6], // Nano-Ceramic Tint Package
      quantity: 1,
      includeInstallation: true
    }
  ]);

  // Handle vehicle compatibility check
  const isProductCompatible = (product: ProductItem, vehicle: SelectedVehicle | null): boolean => {
    if (!vehicle) return true;
    if (product.fitmentType === 'universal') return true;
    if (!product.compatibleVehicles) return false;

    return product.compatibleVehicles.some((compat) => {
      const makeMatches = compat.make.toLowerCase() === vehicle.make.toLowerCase();
      if (!makeMatches) return false;
      if (!compat.model) return true;
      return compat.model.toLowerCase() === vehicle.model.toLowerCase();
    });
  };

  // Count of compatible products for the current active vehicle
  const compatibleCount = useMemo(() => {
    if (!activeVehicle) return CATALOG_PRODUCTS.length;
    return CATALOG_PRODUCTS.filter((p) => isProductCompatible(p, activeVehicle)).length;
  }, [activeVehicle]);

  // Filtered & Sorted Catalog Products
  const filteredProducts = useMemo(() => {
    let result = [...CATALOG_PRODUCTS];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Vehicle compatibility filter toggle
    if (filterByVehicleOnly && activeVehicle) {
      result = result.filter((p) => isProductCompatible(p, activeVehicle));
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.features.some((f) => f.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortOption === 'price-asc') {
      result.sort((a, b) => a.priceKes - b.priceKes);
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => b.priceKes - a.priceKes);
    } else {
      // recommended: sort products that fit active vehicle first
      if (activeVehicle) {
        result.sort((a, b) => {
          const aFit = isProductCompatible(a, activeVehicle) ? 1 : 0;
          const bFit = isProductCompatible(b, activeVehicle) ? 1 : 0;
          return bFit - aFit;
        });
      }
    }

    return result;
  }, [selectedCategory, filterByVehicleOnly, activeVehicle, searchQuery, sortOption]);

  // Cart operations
  const handleAddToCart = (product: ProductItem, includeInstallation = true) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1, includeInstallation }
            : item
        );
      }
      return [...prev, { product, quantity: 1, includeInstallation }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleToggleInstallation = (productId: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, includeInstallation: !item.includeInstallation }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Open booking with prefilled service
  const handleOpenBooking = (serviceName?: string, product?: ProductItem) => {
    setBookingInitialService(serviceName || '');
    setBookingInitialProduct(product || null);
    setIsBookingOpen(true);
  };

  // Open booking from Visualizer spec
  const handleBookVisualizerSpec = (spec: {
    vehicleType: string;
    wrapColor: string;
    wrapFinish: string;
    tintLevel: number;
    chromeDelete: boolean;
    carbonHood: boolean;
    totalKes: number;
    totalUsd: number;
  }) => {
    const serviceTitle = `Custom Spec: ${spec.wrapFinish} ${spec.wrapColor} Wrap + ${
      spec.tintLevel
    }% Ceramic Tint${spec.chromeDelete ? ' + Chrome Delete' : ''}${
      spec.carbonHood ? ' + Carbon Bonnet' : ''
    }`;
    handleOpenBooking(serviceTitle);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans selection:bg-red-600 selection:text-white transition-colors duration-200">
      {/* Top Bar Header */}
      <Header
        activeVehicle={activeVehicle}
        onOpenVehicleSelector={() => scrollToSection('vehicle-filter')}
        onOpenBooking={() => handleOpenBooking()}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        currency={currency}
        onToggleCurrency={() => setCurrency((c) => (c === 'KES' ? 'USD' : 'KES'))}
        onNavigateSection={scrollToSection}
        onOpenSecurityConsole={() => setIsSecurityConsoleOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenHelpModal={() => setIsHelpOpen(true)}
      />

      <main className="flex-1">
        {/* ================= HERO SECTION ================= */}
        <section id="hero" className="relative min-h-[580px] lg:min-h-[640px] flex items-center bg-neutral-950 overflow-hidden">
          {/* Background Hero Image with atmospheric gradient overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={HERO_IMAGE}
              alt="SJO Motorsport Workshop & Styling Center"
              className="w-full h-full object-cover object-center scale-105"
            />
            {/* Measured multi-layer contrast scrim ensuring 4.5:1 text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/90 to-neutral-950/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/60" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
            <div className="max-w-2xl">
              {/* Quiet unboxed kicker */}
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-500 mb-3">
                <span>Certified AutoXpress &amp; MPPS Standards</span>
                <span aria-hidden="true">·</span>
                <span>East Africa Fitment Hub</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] font-display">
                Car Accessories, Ceramic Tint, Paint &amp;{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-rose-500">
                  Vinyl Wraps.
                </span>
              </h1>

              {/* Description */}
              <p className="mt-4 text-base sm:text-lg text-neutral-300 leading-relaxed">
                Nairobi and Mombasa’s premier automotive styling studio. Precision 4x4 accessories, 98% infrared heat-blocking ceramic tints, 3M vehicle wraps ("rapper" specialists), and self-healing paint protection film.
              </p>

              {/* Primary Actions */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => scrollToSection('vehicle-filter')}
                  className="px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm transition-all flex items-center gap-2.5 shadow-xl shadow-red-600/25 cursor-pointer"
                >
                  <Car className="w-4 h-4" />
                  <span>Search by Vehicle Model</span>
                </button>

                <button
                  onClick={() => scrollToSection('visualizer')}
                  className="px-6 py-3.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-500 text-white font-bold text-sm transition-all flex items-center gap-2.5 backdrop-blur-md cursor-pointer"
                >
                  <Palette className="w-4 h-4 text-red-500" />
                  <span>Open Wrap &amp; Tint Studio</span>
                </button>
              </div>

              {/* Unboxed Proof Strip Adjacent to Hero */}
              <div className="mt-10 pt-6 border-t border-neutral-800/80 flex flex-wrap items-center gap-6 text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-red-500" />
                  <span>100% Guaranteed Fitment</span>
                </div>
                <span className="text-neutral-700 hidden sm:inline">·</span>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-500" />
                  <span>10-Year Bubble-Free Tint Warranty</span>
                </div>
                <span className="text-neutral-700 hidden sm:inline">·</span>
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-red-500" />
                  <span>5 Dust-Free Fitment Bays</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= VEHICLE FITMENT SELECTOR ================= */}
        <VehicleSelector
          activeVehicle={activeVehicle}
          onSelectVehicle={setActiveVehicle}
          filterByVehicleOnly={filterByVehicleOnly}
          onToggleFilterByVehicleOnly={() => setFilterByVehicleOnly(!filterByVehicleOnly)}
          compatibleCount={compatibleCount}
        />

        {/* ================= CATALOG SECTION ================= */}
        <section id="catalog" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-500">
                <span>Automotive Catalog</span>
                <span className="text-neutral-400 dark:text-neutral-600">·</span>
                <span>
                  {activeVehicle
                    ? `Configured for ${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model}`
                    : 'All Vehicles'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-display mt-1">
                Accessories, Tint, Paint &amp; Wraps Catalog
              </h2>
            </div>

            {/* Quick Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search bullbars, tint, wraps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl pl-10 pr-9 py-2.5 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Tabs & Sort Controls */}
          <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Segmented Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border border-neutral-200 dark:border-neutral-800'
                }`}
              >
                All Products ({CATALOG_PRODUCTS.length})
              </button>
              <button
                id="catalog-accessories"
                onClick={() => setSelectedCategory('accessories')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  selectedCategory === 'accessories'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border border-neutral-200 dark:border-neutral-800'
                }`}
              >
                4x4 &amp; Accessories
              </button>
              <button
                id="catalog-tint"
                onClick={() => setSelectedCategory('tint')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  selectedCategory === 'tint'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border border-neutral-200 dark:border-neutral-800'
                }`}
              >
                Ceramic Window Tint
              </button>
              <button
                id="catalog-wraps"
                onClick={() => setSelectedCategory('wraps')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  selectedCategory === 'wraps'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border border-neutral-200 dark:border-neutral-800'
                }`}
              >
                Car Wraps &amp; Livery
              </button>
              <button
                id="catalog-paint"
                onClick={() => setSelectedCategory('paint_ppf')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  selectedCategory === 'paint_ppf'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border border-neutral-200 dark:border-neutral-800'
                }`}
              >
                Paint &amp; PPF
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end lg:self-auto text-xs text-neutral-500 dark:text-neutral-400">
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
              <span>Sort by:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 dark:text-white outline-none cursor-pointer"
              >
                <option value="recommended">Recommended (Fitment Priority)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Active Fitment Filter Banner if enabled */}
          {activeVehicle && filterByVehicleOnly && (
            <div className="mt-4 p-3 rounded-xl bg-red-600/10 border border-red-600/30 flex items-center justify-between text-xs text-red-600 dark:text-red-400">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-600 dark:text-red-500" />
                Filtering exclusively for items compatible with your{' '}
                <strong>
                  {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
                </strong>
              </span>
              <button
                onClick={() => setFilterByVehicleOnly(false)}
                className="text-red-600 dark:text-red-400 hover:underline font-medium cursor-pointer"
              >
                Show All Items
              </button>
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currency={currency}
                  activeVehicle={activeVehicle}
                  onSelectProduct={setSelectedProduct}
                  onAddToCart={(p) => handleAddToCart(p, true)}
                />
              ))}
            </div>
          ) : (
            <div className="mt-12 text-center py-16 bg-white dark:bg-neutral-900/50 rounded-2xl border border-neutral-200 dark:border-neutral-800">
              <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mx-auto mb-3">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">No matching products found</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mt-1">
                Try clearing your search query or disabling the vehicle-only filter to view universal accessories and services.
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setFilterByVehicleOnly(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-500 transition-colors cursor-pointer shadow-md shadow-red-600/20"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ================= INTERACTIVE WRAP & TINT STUDIO ================= */}
        <WrapTintVisualizer
          activeVehicle={activeVehicle}
          currency={currency}
          onBookSpec={handleBookVisualizerSpec}
        />

        {/* ================= 4 SERVICE PILLARS (AutoXpress & MPPS Standard) ================= */}
        <section className="py-16 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-500">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The SJO Motorsport Standard</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-display mt-1">
                Engineered for Durability &amp; Precision
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                Every vehicle leaves our bays with warranty-backed craftsmanship designed to handle African sun, terrain, and daily wear.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Pillar 1 */}
              <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-600 dark:text-red-500 mb-4">
                    <Sun className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2">
                    Pressurized Tint Cleanrooms
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Zero dust specks or hair trapped under tint. Installed in sealed, negative-pressure climate bays with reverse-osmosis slip water.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-red-600 dark:text-red-500 font-semibold">
                  10-Year Bubble-Free Guarantee
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-600 dark:text-red-500 mb-4">
                    <Palette className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2">
                    Master Vinyl Wrappers
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Tucked edges behind lights, door handles, and trims with zero razor contact on vehicle paint. 100% reversible factory paint protection.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-red-600 dark:text-red-500 font-semibold">
                  Avery &amp; 3M Certified Installers
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-600 dark:text-red-500 mb-4">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2">
                    4x4 Heavy Hoist Bays
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Reinforced vehicle lifts capable of handling fully kitted Land Cruisers, Patrols, and Hilux double-cabs for chassis bullbars &amp; suspensions.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-red-600 dark:text-red-500 font-semibold">
                  Airbag Sensor Compliant Fitment
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-600 dark:text-red-500 mb-4">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2">
                    Doorstep Mobile Fitment
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Our fully-equipped mobile service van travels across Nairobi metro for on-site dashcam, floor liner, and minor styling accessories fitment.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-red-600 dark:text-red-500 font-semibold">
                  Convenient Home &amp; Office Service
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= BRANCHES & FITMENT CENTERS ================= */}
        <BranchLocator
          onBookAtBranch={(branchId) => {
            handleOpenBooking();
          }}
        />

        {/* ================= INSTANT WHATSAPP / CALL CTA STRIP ================= */}
        <section className="py-12 bg-neutral-100 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-500">
                  Instant Automotive Consultation
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white font-display mt-0.5">
                  Have a custom vehicle styling or fleet requirement?
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Send your vehicle photos and desired wrap/tint spec directly to SJO Motorsport technicians on WhatsApp or Gmail.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => setIsHelpOpen(true)}
                  className="px-5 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:border-red-500 text-neutral-900 dark:text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-red-600 dark:text-red-500" />
                  <span>Email SJO Gmail Desk</span>
                </button>

                <a
                  href="https://wa.me/254712345678?text=Hello%20SJO%20Motorsport!%20I%20would%20like%20a%20consultation%20for%20my%20vehicle."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-emerald-600/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp (+254 712 345 678)</span>
                </a>

                <button
                  onClick={() => handleOpenBooking()}
                  className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-red-600/25"
                >
                  <span>Book Appointment Bay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer
        onNavigateSection={scrollToSection}
        onOpenBooking={() => handleOpenBooking()}
        onOpenSecurityConsole={() => setIsSecurityConsoleOpen(true)}
        onOpenHelpModal={() => setIsHelpOpen(true)}
      />

      {/* Modals & Drawers */}
      <ProductModal
        product={selectedProduct}
        currency={currency}
        activeVehicle={activeVehicle}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(product, includeInstall) => {
          handleAddToCart(product, includeInstall);
        }}
        onOpenBookingForProduct={(product) => {
          handleOpenBooking(product.name, product);
        }}
        onOpenHelpModal={() => setIsHelpOpen(true)}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        activeVehicle={activeVehicle}
        initialService={bookingInitialService}
        initialProduct={bookingInitialProduct}
        currency={currency}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        currency={currency}
        onUpdateQuantity={handleUpdateQuantity}
        onToggleInstallation={handleToggleInstallation}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setIsCartOpen(false);
          handleOpenBooking();
        }}
        onOpenPayment={() => {
          setIsCartOpen(false);
          setIsPaymentOpen(true);
        }}
      />

      {/* M-Pesa STK & Card Payment Checkout Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        cartItems={cartItems}
        currency={currency}
        activeVehicle={activeVehicle}
        onPaymentSuccess={() => {}}
      />

      {/* Direct SJO Help & Support Gmail Modal */}
      <HelpSupportModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        activeVehicle={activeVehicle}
      />

      {/* Infrastructure, Security & Telemetry Console */}
      <SecurityTelemetryModal
        isOpen={isSecurityConsoleOpen}
        onClose={() => setIsSecurityConsoleOpen(false)}
      />

      {/* GDPR / ePrivacy Cookie Preferences Banner */}
      <CookieConsent />

      {/* AI Fitment & Styling Chatbot Specialist */}
      <AiChatbot
        activeVehicle={activeVehicle}
        onOpenBooking={handleOpenBooking}
        onOpenVisualizer={() => scrollToSection('visualizer')}
        onOpenCatalogCategory={(cat) => {
          setSelectedCategory(cat as any);
          scrollToSection('catalog');
        }}
      />
    </div>
  );
}
