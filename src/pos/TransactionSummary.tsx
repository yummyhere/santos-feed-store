import React from 'react';
import { CreditCard, Minus, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatUSD } from '../utils/format';

interface TransactionSummaryProps {
  onOpenCheckout: () => void;
}

export function TransactionSummary({ onOpenCheckout }: TransactionSummaryProps) {
  const {
    posCart,
    posItemCount,
    posSubtotal,
    taxEnabled,
    setTaxEnabled,
    taxRatePercent,
    setTaxRatePercent,
    posTaxAmount,
    posTotal,
    lastScannedLineId,
    updatePosQty,
    removeFromPosCart,
    clearPosCart,
  } = useStore();

  return (
    <section
      aria-label="Current transaction cart"
      className="w-full lg:w-[380px] xl:w-[410px] bg-white border-t lg:border-t-0 lg:border-l border-[#E4E1D8] flex flex-col shrink-0"
    >
      {/* Panel Header */}
      <div className="px-4 py-3.5 border-b border-[#E4E1D8] flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-[#292B27]">
            Current Transaction (Demo)
          </h2>
          <p className="text-[11px] text-[#595C54] tabular-nums">
            {posCart.length} line {posCart.length === 1 ? 'item' : 'items'} &middot; {posItemCount}{' '}
            total units
          </p>
        </div>

        {posCart.length > 0 && (
          <button
            type="button"
            onClick={clearPosCart}
            className="px-2.5 py-1.5 text-xs font-medium text-[#595C54] hover:text-red-700 bg-[#F7F5EF] hover:bg-red-50 border border-[#E4E1D8] rounded transition-colors cursor-pointer"
          >
            Clear Cart
          </button>
        )}
      </div>

      {/* Line Items List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#E4E1D8] min-h-[180px]">
        {posCart.length === 0 ? (
          <div className="p-8 text-center space-y-1.5">
            <p className="text-sm font-medium text-[#292B27]">Transaction cart is empty</p>
            <p className="text-xs text-[#595C54]">
              Scan a barcode above or click any product tile on the left to add items.
            </p>
          </div>
        ) : (
          posCart.map((item) => {
            const isLastScanned = lastScannedLineId === item.lineId;
            return (
              <div
                key={item.lineId}
                className={`p-3.5 space-y-2 transition-colors ${
                  isLastScanned ? 'bg-[#E9DFC9]/35' : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[#292B27] leading-snug">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-[#595C54] mt-0.5 tabular-nums">
                      {item.packageSize} &middot;{' '}
                      <span className="font-mono">{item.sku}</span> &middot;{' '}
                      {formatUSD(item.sampleUnitPrice)} sample
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromPosCart(item.lineId)}
                    aria-label={`Remove ${item.name}`}
                    className="p-1 text-[#595C54] hover:text-red-700 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center border border-[#E4E1D8] rounded bg-[#F7F5EF]">
                    <button
                      type="button"
                      onClick={() => updatePosQty(item.lineId, item.quantity - 1)}
                      aria-label={`Decrease quantity of ${item.name}`}
                      className="w-8 h-7 inline-flex items-center justify-center text-[#292B27] hover:bg-[#E9DFC9]/70 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={999}
                      aria-label={`Quantity for ${item.name}`}
                      value={item.quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (Number.isFinite(val)) {
                          updatePosQty(item.lineId, val);
                        }
                      }}
                      className="w-11 h-7 text-center font-mono text-xs font-semibold tabular-nums text-[#292B27] bg-transparent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => updatePosQty(item.lineId, item.quantity + 1)}
                      aria-label={`Increase quantity of ${item.name}`}
                      className="w-8 h-7 inline-flex items-center justify-center text-[#292B27] hover:bg-[#E9DFC9]/70 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="font-mono text-sm font-semibold tabular-nums text-[#292B27]">
                    {formatUSD(item.sampleUnitPrice * item.quantity)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Financial Totals & Checkout Button */}
      <div className="p-4 bg-[#F7F5EF] border-t border-[#E4E1D8] space-y-3">
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-[#595C54]">
            <span>Sample Subtotal</span>
            <span className="font-mono font-medium text-[#292B27] tabular-nums">
              {formatUSD(posSubtotal)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 text-[#595C54]">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={taxEnabled}
                onChange={(e) => setTaxEnabled(e.target.checked)}
                className="rounded border-[#E4E1D8] text-[#263C2D] focus:ring-[#263C2D]"
              />
              <span>Configured Tax (%)</span>
              <input
                type="number"
                step="0.05"
                min="0"
                max="20"
                aria-label="Configured demo tax percentage"
                disabled={!taxEnabled}
                value={taxRatePercent}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setTaxRatePercent(Number.isFinite(val) && val >= 0 ? Math.min(25, val) : 0);
                }}
                className="w-14 h-6 px-1.5 font-mono text-[11px] text-right bg-white border border-[#E4E1D8] rounded tabular-nums disabled:opacity-50"
              />
            </label>
            <span className="font-mono font-medium text-[#292B27] tabular-nums">
              {formatUSD(posTaxAmount)}
            </span>
          </div>
        </div>

        <div className="pt-2.5 border-t border-[#E4E1D8] flex items-baseline justify-between">
          <span className="text-sm font-semibold text-[#292B27]">Total (USD)</span>
          <span className="font-mono text-2xl font-semibold text-[#263C2D] tabular-nums">
            {formatUSD(posTotal)}
          </span>
        </div>

        <button
          type="button"
          disabled={posCart.length === 0}
          onClick={onOpenCheckout}
          className={`w-full h-12 px-4 inline-flex items-center justify-between text-sm font-semibold rounded-md transition-colors duration-100 cursor-pointer ${
            posCart.length === 0
              ? 'bg-[#E4E1D8] text-[#595C54] cursor-not-allowed'
              : 'bg-[#263C2D] hover:bg-[#1E3024] text-white'
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <CreditCard className="w-4 h-4" aria-hidden="true" />
            <span>Checkout</span>
          </span>
          <kbd className="px-1.5 py-0.5 text-[11px] font-mono bg-white/15 rounded">
            F9
          </kbd>
        </button>
      </div>
    </section>
  );
}
