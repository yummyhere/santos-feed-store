import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, MapPin, Phone, Terminal } from 'lucide-react';
import { FEED_CATEGORIES } from '../data/categories';
import { STORE_INFO } from '../data/products';
import { STORE_LOGO } from '../data/images';
import { HandDrawnWheat } from './HandDrawnWheat';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#263C2D] text-[#F7F5EF] border-t border-[#1E3024]">
      {/* Subtle hand-drawn golden wheat marginalia on dark barn green */}
      <HandDrawnWheat
        variant="footer-gold"
        flip={true}
        rotate={14}
        sway="slow"
        opacity={0.3}
        heightClass="h-64 sm:h-80"
        className="hidden md:block absolute -right-4 -bottom-10 pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1: Brand & Address */}
          <div className="space-y-3">
            <Link
              to="/"
              className="inline-block"
            >
              <div className="bg-white/95 rounded-lg px-3 py-1.5 inline-block shadow-sm border border-[#E9DFC9]/40">
                <img
                  src={STORE_LOGO}
                  alt="Santos Feed Store"
                  className="h-10 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="text-sm text-[#E9DFC9]/90 leading-relaxed max-w-xs">
              Local agricultural feed supplier for livestock, backyard and ranch poultry, and
              pigeon lofts in Fresno, California.
            </p>
            <div className="pt-1 space-y-1.5 text-sm text-[#E9DFC9]">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#E9DFC9]/80" aria-hidden="true" />
                <span>{STORE_INFO.fullAddress}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-[#E9DFC9]/80" aria-hidden="true" />
                <a
                  href={STORE_INFO.phoneHref}
                  className="hover:underline underline-offset-4 tabular-nums font-medium text-white"
                >
                  {STORE_INFO.phoneDisplay}
                </a>
              </p>
            </div>
          </div>

          {/* Column 2: Feed Categories */}
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide mb-3.5">
              Feed Categories
            </h2>
            <ul className="space-y-2.5 text-sm text-[#E9DFC9]/90">
              {FEED_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/shop?category=${cat.id}`}
                    className="hover:text-white hover:underline underline-offset-4 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/shop"
                  className="hover:text-white hover:underline underline-offset-4 transition-colors"
                >
                  All Sample Feed Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Store Navigation */}
          <div>
            <h2 className="text-sm font-semibold text-white tracking-wide mb-3.5">
              Store &amp; Pre-Order
            </h2>
            <ul className="space-y-2.5 text-sm text-[#E9DFC9]/90">
              <li>
                <Link
                  to="/pre-order"
                  className="hover:text-white hover:underline underline-offset-4 transition-colors"
                >
                  Online Pre-Order Form (Demo)
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-white hover:underline underline-offset-4 transition-colors"
                >
                  About the Store
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white hover:underline underline-offset-4 transition-colors"
                >
                  Contact &amp; Store Enquiry
                </Link>
              </li>
              <li>
                <a
                  href={STORE_INFO.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-white hover:underline underline-offset-4 transition-colors"
                >
                  <span>Directions to 8844 S Elm Ave</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Staff POS Demo & Store Hours Notice */}
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-white tracking-wide mb-2">
                Hours &amp; Stock Inquiries
              </h2>
              <p className="text-sm text-[#E9DFC9]/85 leading-relaxed">
                Please call{' '}
                <a
                  href={STORE_INFO.phoneHref}
                  className="text-white underline underline-offset-4 tabular-nums"
                >
                  {STORE_INFO.phoneDisplay}
                </a>{' '}
                to confirm current operating hours, bag availability, and pallet pricing before
                driving out.
              </p>
            </div>

            <div className="pt-2 border-t border-white/15">
              <Link
                to="/pos"
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#263C2D] bg-[#E9DFC9] hover:bg-white rounded-md transition-colors whitespace-nowrap"
              >
                <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Open Desktop Barcode POS UI</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#E9DFC9]/75">
          <p>
            &copy; {currentYear} {STORE_INFO.name} &middot; {STORE_INFO.fullAddress}
          </p>
          <p>
            Frontend UI prototype &middot; Sample catalog records &amp; browser-local state only.
          </p>
        </div>
      </div>
    </footer>
  );
}
