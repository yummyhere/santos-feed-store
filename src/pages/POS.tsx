import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { FEED_CATEGORIES } from '../data/categories';
import { FeedCategoryId, StockStatus } from '../types/store';
import { formatUSD, getStockStatus } from '../utils/format';
import { SearchBar } from '../components/SearchBar';
import { BarcodeInput } from '../pos/BarcodeInput';
import { TransactionSummary } from '../pos/TransactionSummary';
import { CheckoutModal } from '../pos/CheckoutModal';

export function POS() {
  const { products, posCart, addToPosCart } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | FeedCategoryId>('all');
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const barcodeInputRef = useRef<HTMLInputElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    barcodeInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        barcodeInputRef.current?.focus();
        barcodeInputRef.current?.select();
      } else if (e.key === 'F4') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      } else if (e.key === 'F9') {
        if (posCart.length > 0) {
          e.preventDefault();
          setCheckoutOpen(true);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [posCart.length]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      if (categoryFilter !== 'all' && p.category !== categoryFilter) {
        return false;
      }
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.barcode.includes(q) ||
        p.feedType.toLowerCase().includes(q)
      );
    });
  }, [products, categoryFilter, searchQuery]);

  return (
    <div className="lg:h-full lg:overflow-hidden flex flex-col lg:flex-row">
      {/* Main Product Lookup & Selection Area */}
      <div className="flex-1 p-4 lg:p-5 space-y-4 lg:overflow-y-auto">
        {/* 1. Prominent Keyboard-Wedge Barcode Entry */}
        <BarcodeInput inputRef={barcodeInputRef} />

        {/* 2. Manual Product Search & Category Filters */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          <div className="flex-1 max-w-md">
            <SearchBar
              id="pos-manual-search"
              label="Manual product search"
              value={searchQuery}
              onChange={setSearchQuery}
              inputRef={searchInputRef}
              shortcutHint="F4"
              placeholder="Manual search by feed name, SKU, or UPC..."
            />
          </div>

          <div
            role="group"
            aria-label="Filter register products by category"
            className="flex flex-wrap items-center gap-1 p-1 bg-white border border-[#E4E1D8] rounded-md"
          >
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors duration-75 whitespace-nowrap cursor-pointer ${
                categoryFilter === 'all'
                  ? 'bg-[#263C2D] text-white'
                  : 'text-[#595C54] hover:text-[#292B27]'
              }`}
            >
              All ({products.length})
            </button>
            {FEED_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors duration-75 whitespace-nowrap cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-[#263C2D] text-white'
                    : 'text-[#595C54] hover:text-[#292B27]'
                }`}
              >
                {cat.shortName}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Fast Product Selection Tiles */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-[#E4E1D8] rounded-md p-8 text-center space-y-2">
            <p className="text-sm font-medium text-[#292B27]">No matching sample products</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
              }}
              className="text-xs font-medium text-[#263C2D] underline underline-offset-4 cursor-pointer"
            >
              Clear search &amp; category filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredProducts.map((product) => {
              const status = getStockStatus(product.stockQty, product.lowStockThreshold);

              // If product has multiple size variants, show clean quick buttons for each size
              if (product.variants && product.variants.length > 1) {
                return (
                  <div
                    key={product.id}
                    className="bg-white border border-[#E4E1D8] rounded-md p-3.5 flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-[#292B27] leading-snug">
                          {product.name}
                        </h3>
                        <span className="font-mono text-[11px] text-[#595C54] tabular-nums shrink-0">
                          Qty: {product.stockQty}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#595C54] mt-0.5">{product.feedType}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E4E1D8]">
                      {product.variants.map((variant) => (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => addToPosCart(product, variant, 1)}
                          className="p-2 text-left bg-[#F7F5EF] hover:bg-[#E9DFC9]/70 border border-[#E4E1D8] hover:border-[#263C2D] rounded transition-colors duration-75 cursor-pointer"
                        >
                          <div className="text-[11px] font-semibold text-[#292B27] truncate">
                            {variant.packageSize}
                          </div>
                          <div className="flex items-center justify-between mt-0.5">
                            <span className="font-mono text-xs font-semibold text-[#263C2D] tabular-nums">
                              {formatUSD(variant.samplePrice)}
                            </span>
                            <Plus className="w-3 h-3 text-[#263C2D]" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => addToPosCart(product, undefined, 1)}
                  className="text-left bg-white hover:bg-[#F7F5EF] border border-[#E4E1D8] hover:border-[#263C2D] rounded-md p-3.5 flex flex-col justify-between gap-3 transition-colors duration-75 cursor-pointer"
                >
                  <div className="w-full">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-[#292B27] leading-snug">
                        {product.name}
                      </h3>
                      <span
                        className={`font-mono text-[11px] tabular-nums shrink-0 ${
                          status === StockStatus.OutOfStock
                            ? 'text-red-700 font-semibold'
                            : status === StockStatus.LowStock
                            ? 'text-amber-800 font-medium'
                            : 'text-[#595C54]'
                        }`}
                      >
                        Qty: {product.stockQty}
                      </span>
                    </div>
                    <p className="text-xs text-[#595C54] mt-0.5">{product.packageSize}</p>
                  </div>

                  <div className="w-full pt-2 border-t border-[#E4E1D8] flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[#595C54] tabular-nums">
                      {product.barcode}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-sm font-semibold text-[#263C2D] tabular-nums">
                      <span>{formatUSD(product.samplePrice)}</span>
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Persistent Right Checkout Panel */}
      <TransactionSummary onOpenCheckout={() => setCheckoutOpen(true)} />

      {/* Checkout Modal */}
      <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </div>
  );
}
