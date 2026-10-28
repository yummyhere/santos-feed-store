import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Phone, ShoppingBag, X, MapPin, Terminal, Wheat } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { STORE_INFO } from '../data/products';
import { STORE_LOGO } from '../data/images';

const NAV_ITEMS = [
  { label: 'Shop Feed', to: '/shop' },
  { label: 'Livestock Feed', to: '/shop?category=livestock' },
  { label: 'Poultry Feed', to: '/shop?category=poultry' },
  { label: 'Pigeon Feed', to: '/shop?category=pigeon' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export function Navbar() {
  const { preOrderCount, setIsCartDrawerOpen } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  const isNavItemActive = (to: string) => {
    const currentFull = `${location.pathname}${location.search}`;
    if (to.includes('?')) {
      return currentFull === to;
    }
    if (to === '/shop') {
      return location.pathname === '/shop' && !location.search;
    }
    return location.pathname === to;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F7F5EF]/95 backdrop-blur-md border-b border-[#E4E1D8]">
      {/* Top Announcement Bar */}
      <div className="bg-[#263C2D] text-[#E9DFC9] px-4 py-1.5 text-[11px] border-b border-[#1E3024]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-[#697A45] shrink-0" aria-hidden="true" />
            <span className="truncate">
              <strong>Open for Walk-In Pickup:</strong> {STORE_INFO.fullAddress} &middot; Truck bed &amp; trailer loading
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 shrink-0 text-xs">
            <a
              href={STORE_INFO.phoneHref}
              className="hover:text-white transition-colors tabular-nums font-medium flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-[#E9DFC9]" />
              <span>{STORE_INFO.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-8">
        {/* Zone 1: Official Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 whitespace-nowrap shrink-0 group py-1"
        >
          <img
            src={STORE_LOGO}
            alt="Santos Feed Store"
            className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        {/* Zone 2: Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#292B27]"
        >
          {NAV_ITEMS.map((item) => {
            const active = isNavItemActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`py-1 whitespace-nowrap shrink-0 border-b-2 transition-colors duration-150 ${
                  active
                    ? 'border-[#263C2D] text-[#263C2D] font-bold'
                    : 'border-transparent text-[#595C54] hover:text-[#263C2D] hover:border-[#697A45]/40'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Pre-Order CTA & Mobile Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <a
            href={STORE_INFO.phoneHref}
            aria-label={`Call ${STORE_INFO.name} at ${STORE_INFO.phoneDisplay}`}
            className="lg:hidden inline-flex items-center gap-1.5 h-10 px-2.5 sm:px-3 text-xs font-semibold text-[#263C2D] bg-white border border-[#E4E1D8] rounded-md hover:border-[#263C2D] transition-colors whitespace-nowrap shrink-0"
          >
            <Phone className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Call</span>
          </a>

          <button
            type="button"
            onClick={() => setIsCartDrawerOpen(true)}
            aria-label={`Open pre-order list (${preOrderCount} items)`}
            className="inline-flex items-center gap-1.5 sm:gap-2 h-10 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-white bg-[#263C2D] hover:bg-[#1E3024] rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-sm active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 shrink-0 text-[#E9DFC9]" aria-hidden="true" />
            <span className="hidden sm:inline">Pre-Order List</span>
            <span className="tabular-nums font-mono px-1.5 py-0.5 rounded bg-white/15 text-xs">
              {preOrderCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-store-menu"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 text-[#292B27] bg-white border border-[#E4E1D8] rounded-md hover:border-[#263C2D] transition-colors shrink-0 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile collapsible navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-store-menu"
          className="lg:hidden bg-[#F7F5EF] border-b border-[#E4E1D8] px-4 pt-2 pb-5 space-y-4"
        >
          <nav aria-label="Mobile navigation" className="flex flex-col divide-y divide-[#E4E1D8]">
            {NAV_ITEMS.map((item) => {
              const active = isNavItemActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`py-3 text-base font-medium transition-colors ${
                    active ? 'text-[#263C2D] font-bold' : 'text-[#292B27]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link to="/pre-order" className="py-3 text-base font-semibold text-[#263C2D] flex items-center justify-between">
              <span>Review Pre-Order List</span>
              <span className="font-mono text-xs px-2 py-0.5 bg-[#263C2D] text-white rounded">
                {preOrderCount} items
              </span>
            </Link>
            <Link to="/pos" className="py-3 text-sm font-semibold text-[#697A45] flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              <span>Cashier Barcode POS Demo (/pos)</span>
            </Link>
          </nav>

          <div className="pt-3 border-t border-[#E4E1D8] space-y-2 text-xs text-[#595C54]">
            <p className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#263C2D]" />
              <span>{STORE_INFO.fullAddress}</span>
            </p>
            <a
              href={STORE_INFO.phoneHref}
              className="inline-flex items-center justify-center gap-2 w-full h-11 px-4 font-semibold text-white bg-[#263C2D] rounded-md tabular-nums"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              <span>Call Store: {STORE_INFO.phoneDisplay}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
