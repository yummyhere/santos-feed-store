import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatUSD } from '../utils/format';
import { SmartImage } from './SmartImage';

export function CartPanel() {
  const {
    preOrderCart,
    preOrderCount,
    preOrderSubtotal,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updatePreOrderQty,
    removeFromPreOrder,
    clearPreOrder,
  } = useStore();

  useEffect(() => {
    if (!isCartDrawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isCartDrawerOpen, setIsCartDrawerOpen]);

  if (!isCartDrawerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#292B27]/45"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preorder-drawer-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsCartDrawerOpen(false);
        }
      }}
    >
      <div className="w-full max-w-md bg-[#F7F5EF] h-full flex flex-col border-l border-[#E4E1D8]">
        {/* Header */}
        <div className="px-5 py-4 bg-white border-b border-[#E4E1D8] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-[#263C2D]" aria-hidden="true" />
            <h2 id="preorder-drawer-title" className="text-base font-semibold text-[#292B27]">
              Pre-Order List ({preOrderCount})
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsCartDrawerOpen(false)}
            aria-label="Close pre-order panel"
            className="p-2 text-[#595C54] hover:text-[#292B27] rounded-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Demo notice */}
        <div className="px-5 py-2.5 bg-[#E9DFC9]/55 border-b border-[#E4E1D8] text-xs text-[#292B27]">
          Sample catalog items &amp; prices. Pre-orders here run locally as a UI demonstration.
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {preOrderCart.length === 0 ? (
            <div className="bg-white border border-[#E4E1D8] rounded-md p-8 text-center space-y-3">
              <p className="text-sm font-medium text-[#292B27]">
                Your pre-order list is currently empty.
              </p>
              <p className="text-xs text-[#595C54] leading-relaxed">
                Add livestock, poultry, or pigeon feed sacks from the catalog to build a pickup
                inquiry list.
              </p>
              <Link
                to="/shop"
                onClick={() => setIsCartDrawerOpen(false)}
                className="inline-flex items-center justify-center h-10 px-4 text-xs font-medium text-white bg-[#263C2D] hover:bg-[#1E3024] rounded-md transition-colors"
              >
                Browse Feed Catalog
              </Link>
            </div>
          ) : (
            preOrderCart.map((item) => (
              <div
                key={item.lineId}
                className="bg-white border border-[#E4E1D8] rounded-md p-3.5 flex gap-3.5"
              >
                <SmartImage
                  src={item.image}
                  alt={item.name}
                  fallbackTitle={item.name}
                  className="w-16 h-16 rounded border border-[#E4E1D8] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={`/product/${item.productId}`}
                      onClick={() => setIsCartDrawerOpen(false)}
                      className="text-sm font-semibold text-[#292B27] hover:text-[#263C2D] truncate"
                    >
                      {item.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeFromPreOrder(item.lineId)}
                      aria-label={`Remove ${item.name}`}
                      className="p-1 text-[#595C54] hover:text-[#292B27] rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-[#595C54] mt-0.5">
                    {item.packageSize} &middot; {formatUSD(item.sampleUnitPrice)} ea
                  </p>

                  <div className="mt-2.5 flex items-center justify-between gap-2">
                    <div className="inline-flex items-center border border-[#E4E1D8] rounded-md bg-[#F7F5EF]">
                      <button
                        type="button"
                        onClick={() => updatePreOrderQty(item.lineId, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="w-8 h-8 inline-flex items-center justify-center text-[#292B27] hover:bg-[#E9DFC9]/60 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-semibold tabular-nums text-[#292B27]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updatePreOrderQty(item.lineId, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="w-8 h-8 inline-flex items-center justify-center text-[#292B27] hover:bg-[#E9DFC9]/60 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-sm font-semibold tabular-nums text-[#292B27]">
                      {formatUSD(item.sampleUnitPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {preOrderCart.length > 0 && (
          <div className="p-5 bg-white border-t border-[#E4E1D8] space-y-3.5">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-[#595C54]">Estimated Sample Subtotal</span>
              <span className="text-lg font-semibold tabular-nums text-[#292B27]">
                {formatUSD(preOrderSubtotal)}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={clearPreOrder}
                className="h-11 px-3.5 text-xs font-medium text-[#595C54] hover:text-[#292B27] bg-[#F7F5EF] border border-[#E4E1D8] rounded-md transition-colors whitespace-nowrap cursor-pointer"
              >
                Clear List
              </button>

              <Link
                to="/pre-order"
                onClick={() => setIsCartDrawerOpen(false)}
                className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-4 text-sm font-medium text-white bg-[#263C2D] hover:bg-[#1E3024] rounded-md transition-colors whitespace-nowrap"
              >
                <span>Continue to Pre-Order</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
