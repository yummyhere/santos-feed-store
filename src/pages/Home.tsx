import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Info, MapPin, Phone, Terminal, Wheat, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { FEED_CATEGORIES } from '../data/categories';
import { STORE_IMAGES } from '../data/images';
import { STORE_INFO } from '../data/products';
import { FeedCategoryId } from '../types/store';
import { CategoryGrid } from '../components/CategoryGrid';
import { ProductCard } from '../components/ProductCard';
import { Reveal } from '../components/Reveal';
import { SmartImage } from '../components/SmartImage';
import { HandDrawnWheat } from '../components/HandDrawnWheat';

export function Home() {
  const { products } = useStore();
  const [featuredFilter, setFeaturedFilter] = useState<'all' | FeedCategoryId>('all');

  const displayedProducts = useMemo(() => {
    const pool =
      featuredFilter === 'all'
        ? products.filter((p) => p.featured)
        : products.filter((p) => p.category === featuredFilter);
    return pool.slice(0, 6);
  }, [products, featuredFilter]);

  return (
    <div className="space-y-0">
      {/* 1. Clear Agricultural Hero Section with Background Barn Photo & Official Logo */}
      <section className="relative border-b border-[#E4E1D8] overflow-hidden min-h-[580px] sm:min-h-[640px] lg:min-h-[680px] flex items-center justify-center">
        {/* Background Photo - 100% Clear & Vivid (No White Wash Overlay) */}
        <img
          src={STORE_IMAGES.heroLightBg}
          alt="Santos Feed Store Fresno Barn Interior"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />

        {/* Very subtle edge vignette only (no milky white wash) to ground the photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 pointer-events-none" />

        {/* Subtle decorative top and bottom architectural hairline borders */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#263C2D]/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-[#E4E1D8]" />

        {/* Centered Hero Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 relative z-10 text-center flex flex-col items-center">
          {/* Centered Location & Phone Badge */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-[#E4E1D8] text-xs font-semibold text-[#79583D] shadow-md backdrop-blur-md mb-6">
            <span className="inline-flex items-center gap-1.5 text-[#263C2D]">
              <MapPin className="w-3.5 h-3.5" />
              <span>Fresno, California &middot; 8844 S Elm Ave</span>
            </span>
            <span className="hidden sm:inline text-[#E4E1D8]">&middot;</span>
            <span className="hidden sm:inline text-[#595C54] font-normal">Open Mon–Sat 8am–5pm</span>
          </div>

          {/* Centered Main Brand Heading with High Contrast against Barn Photo */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.65rem] font-bold tracking-tight text-[#1E3024] leading-[1.12] balance-text mb-4 max-w-3xl drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)]">
            Good Feed. Healthy Flocks. Stronger Herds.
          </h1>

          {/* Centered Supporting Copy */}
          <p className="text-base sm:text-lg lg:text-xl text-[#242721] leading-relaxed max-w-2xl mx-auto mb-8 font-medium drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]">
            Essential sacked rations, triple-cleaned grains, and everyday barn supplies for livestock,
            poultry keepers, and pigeon fanciers across Fresno and the Central Valley.
          </p>

          {/* Centered Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8 w-full">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 h-12 px-7 text-sm font-semibold text-white bg-[#263C2D] hover:bg-[#1E3024] rounded-md transition-all shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer hover:-translate-y-0.5"
            >
              <span>Browse Feed Catalog</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>

            <a
              href={STORE_INFO.phoneHref}
              className="inline-flex items-center justify-center gap-2 h-12 px-6 text-sm font-semibold text-[#292B27] bg-white/95 hover:bg-white border border-[#E4E1D8] rounded-md transition-colors whitespace-nowrap tabular-nums shadow-md cursor-pointer hover:-translate-y-0.5"
            >
              <Phone className="w-4 h-4 text-[#263C2D]" aria-hidden="true" />
              <span>Call Store: {STORE_INFO.phoneDisplay}</span>
            </a>
          </div>

          {/* Centered Value Highlights Harmonized with Clear Barn Background */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-3xl pt-6 border-t border-[#263C2D]/20 text-left">
            <div className="p-3.5 rounded-lg bg-white/95 border border-[#E4E1D8] shadow-md backdrop-blur-sm flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#263C2D]/10 text-[#263C2D] flex items-center justify-center shrink-0 mt-0.5">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#292B27]">Direct Truck Bed Loading</div>
                <div className="text-[11px] text-[#595C54] mt-0.5">Back up to loading doors for fast 50 lb sack stacking</div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-white/95 border border-[#E4E1D8] shadow-md backdrop-blur-sm flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#697A45]/15 text-[#697A45] flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#292B27]">Triple-Cleaned Grains</div>
                <div className="text-[11px] text-[#595C54] mt-0.5">Clean, dust-reduced grains for pigeons, poultry & stock</div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-white/95 border border-[#E4E1D8] shadow-md backdrop-blur-sm flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#79583D]/15 text-[#79583D] flex items-center justify-center shrink-0 mt-0.5">
                <Wheat className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#292B27]">Online Pre-Order Pickup</div>
                <div className="text-[11px] text-[#595C54] mt-0.5">Submit sacks online for walk-in Fresno yard pickup</div>
              </div>
            </div>
          </div>

          {/* Quick Species Footer Bar */}
          <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-2 text-xs text-[#292B27] bg-white/90 px-4 py-2 rounded-full border border-[#E4E1D8] shadow-sm backdrop-blur-sm">
            <span className="font-semibold text-[#79583D]">Formulated for:</span>
            <span className="font-semibold text-[#263C2D]">Beef &amp; Dairy Cattle</span>
            <span aria-hidden="true" className="text-[#E4E1D8]">&middot;</span>
            <span className="font-semibold text-[#263C2D]">Meat &amp; Dairy Goats</span>
            <span aria-hidden="true" className="text-[#E4E1D8]">&middot;</span>
            <span className="font-semibold text-[#263C2D]">Layer Hens &amp; Broilers</span>
            <span aria-hidden="true" className="text-[#E4E1D8]">&middot;</span>
            <span className="font-semibold text-[#263C2D]">Racing &amp; Show Pigeons</span>
          </div>
        </div>
      </section>

      {/* 2. Shop by Category with Animal Badges */}
      <section className="relative overflow-hidden py-14 sm:py-18 border-b border-[#E4E1D8] bg-white">
        {/* Subtle authentic hand-drawn wheat marginalia along right edge */}
        <HandDrawnWheat
          variant="image"
          flip={false}
          rotate={6}
          sway="normal"
          opacity={0.55}
          heightClass="h-64 sm:h-80 lg:h-96"
          className="hidden md:block absolute -right-6 lg:right-2 top-8"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
          <Reveal immediate>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1.5">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#697A45]">
                  Organized by Animal Care
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#292B27] tracking-tight">
                  Shop by Animal Category
                </h2>
                <p className="text-sm sm:text-base text-[#595C54]">
                  Straightforward pelleted rations, whole grain mixes, and barn supplies.
                </p>
              </div>

              <Link
                to="/shop"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#263C2D] hover:underline underline-offset-4 whitespace-nowrap shrink-0"
              >
                <span>View Full Feed Catalog</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>

          <CategoryGrid />
        </div>
      </section>

      {/* 3. Featured Products Catalog with Grain Inspection */}
      <section className="relative overflow-hidden py-14 sm:py-18 border-b border-[#E4E1D8] bg-white">
        {/* Subtle authentic hand-drawn wheat marginalia along left edge (mirrored) */}
        <HandDrawnWheat
          variant="image"
          flip={true}
          rotate={-6}
          sway="reverse"
          opacity={0.5}
          heightClass="h-64 sm:h-80 lg:h-96"
          className="hidden xl:block absolute -left-8 top-16"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <Reveal immediate>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div className="space-y-1.5">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#697A45]">
                  In-Store Feeds
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#292B27] tracking-tight">
                  Sample Feed &amp; Supply Catalog
                </h2>
                <p className="text-sm text-[#595C54]">
                  Select feeds to inspect physical grain texture or prepare a demonstration pickup pre-order.
                </p>
              </div>

              {/* Interactive Category Filter Pills */}
              <div
                role="group"
                aria-label="Filter sample products by category"
                className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F7F5EF] border border-[#E4E1D8] rounded-lg self-start lg:self-auto"
              >
                <button
                  type="button"
                  onClick={() => setFeaturedFilter('all')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    featuredFilter === 'all'
                      ? 'bg-[#263C2D] text-white shadow-xs'
                      : 'text-[#595C54] hover:text-[#292B27]'
                  }`}
                >
                  Featured
                </button>
                {FEED_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFeaturedFilter(cat.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      featuredFilter === cat.id
                        ? 'bg-[#263C2D] text-white shadow-xs'
                        : 'text-[#595C54] hover:text-[#292B27]'
                    }`}
                  >
                    {cat.shortName}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Sample Data Notice */}
          <div className="flex items-start sm:items-center gap-2.5 px-4 py-3 bg-[#E9DFC9]/50 border border-[#E4E1D8] rounded-xl text-xs text-[#292B27]">
            <Info className="w-4 h-4 text-[#79583D] shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
            <p>
              <strong>Sample Catalog Data:</strong> Bag weights, prices, and stock indicators below
              are sample entries for storefront demonstration. Call{' '}
              <a
                href={STORE_INFO.phoneHref}
                className="font-bold text-[#263C2D] underline underline-offset-2 tabular-nums"
              >
                {STORE_INFO.phoneDisplay}
              </a>{' '}
              to verify current Santos Feed Store inventory and live pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="pt-4 flex justify-center sm:justify-end">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 h-11 px-6 text-sm font-semibold text-[#292B27] bg-[#F7F5EF] hover:bg-[#E9DFC9]/60 border border-[#E4E1D8] rounded-md transition-colors whitespace-nowrap shadow-xs"
            >
              <span>Browse All {products.length} Sample Products</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Fresno Store Location & Direct Bed Loading */}
      <section className="relative overflow-hidden py-14 sm:py-18 bg-[#F7F5EF]">
        {/* Subtle authentic hand-drawn wheat marginalia tucked on right */}
        <HandDrawnWheat
          variant="image"
          flip={false}
          rotate={8}
          sway="slow"
          opacity={0.45}
          heightClass="h-60 sm:h-72 lg:h-84"
          className="hidden md:block absolute -right-6 -bottom-8 pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal immediate>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white border border-[#E4E1D8] rounded-2xl p-6 sm:p-10 shadow-lg">
              <div className="lg:col-span-7">
                <SmartImage
                  src={STORE_IMAGES.fresnoFeedYard}
                  alt="Feed store loading dock and stacked grain pallets in Central Valley California"
                  fallbackTitle="Santos Feed Store — South Elm Ave, Fresno"
                  className="aspect-[16/9] w-full rounded-xl border border-[#E4E1D8]"
                />
              </div>

              <div className="lg:col-span-5 space-y-5">
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#697A45]">
                    Established Fresno Supplier
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#292B27] tracking-tight balance-text">
                    Practical Feed &amp; Direct Bed Loading on South Elm Avenue
                  </h2>
                </div>

                <p className="text-sm sm:text-base text-[#595C54] leading-relaxed">
                  Located at 8844 S Elm Ave in South Fresno, Santos Feed Store supplies local ranchers,
                  family coops, and pigeon flyers with sacked rations and farm room essentials.
                  Truck and trailer access ensures fast in-and-out loading.
                </p>

                <div className="pt-3 border-t border-[#E4E1D8] space-y-2.5 text-sm text-[#292B27]">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#263C2D] mt-0.5 shrink-0" aria-hidden="true" />
                    <span className="font-medium">{STORE_INFO.fullAddress}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#263C2D] shrink-0" aria-hidden="true" />
                    <a
                      href={STORE_INFO.phoneHref}
                      className="font-bold text-[#263C2D] hover:underline underline-offset-4 tabular-nums"
                    >
                      {STORE_INFO.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={STORE_INFO.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 h-11 px-5 text-xs font-semibold text-white bg-[#263C2D] hover:bg-[#1E3024] rounded-md transition-colors whitespace-nowrap shadow-xs"
                  >
                    <span>Get Directions to Store</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>

                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 h-11 px-5 text-xs font-semibold text-[#292B27] bg-[#F7F5EF] hover:bg-[#E9DFC9]/60 border border-[#E4E1D8] rounded-md transition-colors whitespace-nowrap"
                  >
                    <span>Store Enquiry</span>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
