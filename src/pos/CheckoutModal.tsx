import { useEffect, useState } from 'react';
import { AlertCircle, Banknote, CheckCircle2, CreditCard, FileText, Info, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PaymentMethod, PosTransaction } from '../types/store';
import { formatDateTime, formatUSD } from '../utils/format';
import { soundFx } from '../utils/audio';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const {
    posCart,
    posSubtotal,
    taxEnabled,
    taxRatePercent,
    posTaxAmount,
    posTotal,
    completeDemoPosSale,
  } = useStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.Cash);
  const [cashTenderedStr, setCashTenderedStr] = useState<string>('');
  const [customerMemo, setCustomerMemo] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [completedTx, setCompletedTx] = useState<PosTransaction | null>(null);

  useEffect(() => {
    if (isOpen && !completedTx) {
      setPaymentMethod(PaymentMethod.Cash);
      setCashTenderedStr(posTotal.toFixed(2));
      setCustomerMemo('');
      setErrorMsg(null);
    }
  }, [isOpen, posTotal]);

  useEffect(() => {
    if (!isOpen) {
      setCompletedTx(null);
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const parsedTender = parseFloat(cashTenderedStr);
  const computedChange =
    paymentMethod === PaymentMethod.Cash && Number.isFinite(parsedTender)
      ? Math.round((parsedTender - posTotal) * 100) / 100
      : 0;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (posCart.length === 0) {
      setErrorMsg('Cannot complete checkout with an empty cart.');
      return;
    }

    if (paymentMethod === PaymentMethod.Cash) {
      if (!Number.isFinite(parsedTender) || parsedTender < posTotal) {
        setErrorMsg(
          `Cash tendered must be at least ${formatUSD(posTotal)}.`
        );
        return;
      }
    }

    const tx = completeDemoPosSale({
      paymentMethod,
      cashTendered: paymentMethod === PaymentMethod.Cash ? parsedTender : undefined,
      customerMemo,
    });
    soundFx.playCashRegisterChime();
    setCompletedTx(tx);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292B27]/55"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pos-checkout-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl bg-white border border-[#E4E1D8] rounded-md overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#F7F5EF] border-b border-[#E4E1D8] flex items-center justify-between shrink-0">
          <h2 id="pos-checkout-modal-title" className="text-base font-semibold text-[#292B27]">
            {completedTx ? 'Demonstration Sale Recorded' : 'Complete POS Transaction (UI Prototype)'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout dialog"
            className="p-1 text-[#595C54] hover:text-[#292B27] rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {completedTx ? (
          <div className="p-6 space-y-5 overflow-y-auto">
            {/* Thermal Receipt Visual Slip with Serrated Edge and Slide-down animation */}
            <div className="receipt-serrated animate-receipt-print bg-[#FFFDF9] border border-[#E4E1D8] p-5 sm:p-6 shadow-sm font-mono text-xs text-[#292B27] space-y-4">
              {/* Receipt Header */}
              <div className="text-center space-y-1 pb-3 border-b border-dashed border-[#292B27]/30">
                <div className="font-bold tracking-wider text-sm sm:text-base text-[#263C2D]">
                  *** SANTOS FEED STORE ***
                </div>
                <div className="text-[11px] text-[#595C54]">
                  8844 S Elm Ave &middot; Fresno, CA 93706
                </div>
                <div className="text-[11px] text-[#595C54]">
                  Tel: (559) 834-5909 &middot; Yard Reg #1
                </div>
                <div className="text-[10px] text-[#79583D] font-semibold pt-1 uppercase tracking-wide">
                  --- PROTOTYPE DEMO RECEIPT ---
                </div>
              </div>

              {/* Transaction Metadata */}
              <div className="flex justify-between text-[11px] text-[#595C54] pb-2 border-b border-dashed border-[#292B27]/20">
                <div>
                  <span className="text-[#292B27] font-semibold">TX: {completedTx.id}</span>
                  {completedTx.customerMemo && (
                    <div className="text-[10px] text-[#79583D]">Memo: {completedTx.customerMemo}</div>
                  )}
                </div>
                <div className="text-right">
                  <div>{formatDateTime(completedTx.createdAtIso)}</div>
                  <div className="text-[10px] text-[#595C54]">Pay: {completedTx.paymentMethod}</div>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-1.5 py-1">
                {completedTx.items.map((item, idx) => (
                  <div key={`${item.sku}-${idx}`} className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-semibold text-[#292B27]">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-[#595C54]">
                        {item.quantity} @ {formatUSD(item.sampleUnitPrice)} / {item.packageSize}
                      </div>
                    </div>
                    <div className="tabular-nums font-semibold text-right">
                      {formatUSD(item.lineTotal)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals & Taxes */}
              <div className="pt-2 border-t border-dashed border-[#292B27]/30 space-y-1">
                <div className="flex justify-between text-[#595C54]">
                  <span>SUBTOTAL</span>
                  <span className="tabular-nums">{formatUSD(completedTx.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#595C54]">
                  <span>SALES TAX ({completedTx.taxRatePercent}%)</span>
                  <span className="tabular-nums">{formatUSD(completedTx.taxAmount)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#263C2D] pt-1 border-t border-[#292B27]/20">
                  <span>TOTAL DUE</span>
                  <span className="tabular-nums">{formatUSD(completedTx.total)}</span>
                </div>

                {completedTx.paymentMethod === PaymentMethod.Cash &&
                  typeof completedTx.cashTendered === 'number' && (
                    <div className="pt-2 border-t border-dashed border-[#292B27]/20 space-y-1">
                      <div className="flex justify-between text-[#595C54]">
                        <span>CASH TENDERED</span>
                        <span className="tabular-nums font-semibold">
                          {formatUSD(completedTx.cashTendered)}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-sm text-[#263C2D]">
                        <span>CHANGE RETURNED</span>
                        <span className="tabular-nums font-semibold">
                          {formatUSD(completedTx.changeDue ?? 0)}
                        </span>
                      </div>
                    </div>
                  )}
              </div>

              {/* Simulated Thermal Barcode and Footer Message */}
              <div className="pt-3 border-t border-dashed border-[#292B27]/30 text-center space-y-2">
                {/* CSS Barcode lines */}
                <div className="flex items-center justify-center gap-[2px] h-9 py-1 overflow-hidden opacity-80" aria-hidden="true">
                  {[3,1,2,4,1,3,1,2,5,2,1,4,2,3,1,2,4,1,3,2,1,5,3,1,2,4,1,2,3,4,1,2,5,1,3].map((w, i) => (
                    <div
                      key={i}
                      className="bg-[#292B27] h-full"
                      style={{ width: `${w}px` }}
                    />
                  ))}
                </div>
                <div className="text-[10px] text-[#595C54] tracking-widest font-mono">
                  *{completedTx.id}*
                </div>
                <div className="text-[11px] font-semibold text-[#263C2D]">
                  THANK YOU FOR SUPPORTING LOCAL CENTRAL VALLEY AGRICULTURE!
                </div>
                <div className="text-[9px] text-[#595C54]">
                  Please retain slip for exchange within 14 days of purchase. Bags must remain unopened.
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  soundFx.playCashRegisterChime();
                }}
                className="h-11 px-4 text-xs font-semibold text-[#292B27] bg-[#F7F5EF] hover:bg-[#E9DFC9] border border-[#E4E1D8] rounded-md transition-colors cursor-pointer"
              >
                Replay Chime
              </button>
              <button
                type="button"
                autoFocus
                onClick={onClose}
                className="flex-1 h-11 px-5 text-sm font-semibold text-white bg-[#263C2D] hover:bg-[#1E3024] rounded-md transition-colors cursor-pointer shadow-sm"
              >
                Start Next Transaction (Esc)
              </button>
            </div>
          </div>
        ) : (
          /* Payment Entry View */
          <form onSubmit={handleConfirm} className="p-6 space-y-5">
            {/* Order Total Summary */}
            <div className="p-4 bg-[#F7F5EF] border border-[#E4E1D8] rounded-md flex items-center justify-between">
              <div className="text-xs text-[#595C54] space-y-0.5">
                <div>
                  Subtotal {formatUSD(posSubtotal)} + Tax{' '}
                  {taxEnabled ? `(${taxRatePercent}%) ${formatUSD(posTaxAmount)}` : '$0.00'}
                </div>
                <div>{posCart.reduce((s, i) => s + i.quantity, 0)} total units in cart</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-medium text-[#595C54]">Amount Due</div>
                <div className="font-mono text-2xl font-semibold text-[#263C2D] tabular-nums">
                  {formatUSD(posTotal)}
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#292B27]">
                Payment Method (UI Simulation)
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod(PaymentMethod.Cash)}
                  className={`p-3 rounded-md border text-xs font-medium flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
                    paymentMethod === PaymentMethod.Cash
                      ? 'border-[#263C2D] bg-[#263C2D] text-white'
                      : 'border-[#E4E1D8] bg-white text-[#292B27] hover:bg-[#F7F5EF]'
                  }`}
                >
                  <Banknote className="w-4 h-4" />
                  <span>Cash</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod(PaymentMethod.CardTerminal)}
                  className={`p-3 rounded-md border text-xs font-medium flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
                    paymentMethod === PaymentMethod.CardTerminal
                      ? 'border-[#263C2D] bg-[#263C2D] text-white'
                      : 'border-[#E4E1D8] bg-white text-[#292B27] hover:bg-[#F7F5EF]'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>External Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod(PaymentMethod.CheckOrAccount)}
                  className={`p-3 rounded-md border text-xs font-medium flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
                    paymentMethod === PaymentMethod.CheckOrAccount
                      ? 'border-[#263C2D] bg-[#263C2D] text-white'
                      : 'border-[#E4E1D8] bg-white text-[#292B27] hover:bg-[#F7F5EF]'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Check / Memo</span>
                </button>
              </div>
            </div>

            {/* Cash Tendered Calculator */}
            {paymentMethod === PaymentMethod.Cash && (
              <div className="space-y-2.5 p-4 border border-[#E4E1D8] rounded-md bg-white">
                <div className="flex items-center justify-between">
                  <label htmlFor="cash-tender-input" className="text-xs font-semibold text-[#292B27]">
                    Cash Tendered (USD)
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[
                      { label: 'Exact', val: posTotal },
                      { label: '$20', val: Math.max(20, Math.ceil(posTotal / 20) * 20) },
                      { label: '$50', val: Math.max(50, Math.ceil(posTotal / 50) * 50) },
                      { label: '$100', val: Math.max(100, Math.ceil(posTotal / 100) * 100) },
                    ].map((quick) => (
                      <button
                        key={quick.label}
                        type="button"
                        onClick={() => {
                          setCashTenderedStr(quick.val.toFixed(2));
                          setErrorMsg(null);
                        }}
                        className="px-2 py-1 text-[11px] font-mono bg-[#F7F5EF] hover:bg-[#E9DFC9]/70 border border-[#E4E1D8] rounded cursor-pointer"
                      >
                        {quick.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center">
                  <input
                    id="cash-tender-input"
                    type="number"
                    step="0.01"
                    min="0"
                    value={cashTenderedStr}
                    onChange={(e) => {
                      setCashTenderedStr(e.target.value);
                      setErrorMsg(null);
                    }}
                    className="h-11 px-3 font-mono text-base font-semibold text-[#292B27] bg-[#F7F5EF] border border-[#E4E1D8] rounded-md focus:bg-white focus:border-[#263C2D] tabular-nums"
                  />

                  <div className="text-right">
                    <div className="text-[11px] text-[#595C54]">Change Due</div>
                    <div
                      className={`font-mono text-lg font-semibold tabular-nums ${
                        computedChange >= 0 ? 'text-[#263C2D]' : 'text-red-700'
                      }`}
                    >
                      {computedChange >= 0 ? formatUSD(computedChange) : 'Insufficient'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Optional Customer / Ranch Note */}
            <div>
              <label htmlFor="pos-customer-memo" className="block text-xs font-semibold text-[#292B27] mb-1.5">
                Customer Name / Ticket Memo <span className="font-normal text-[#595C54]">(optional)</span>
              </label>
              <input
                id="pos-customer-memo"
                type="text"
                value={customerMemo}
                onChange={(e) => setCustomerMemo(e.target.value)}
                placeholder="e.g. Walk-in customer or ranch pickup note"
                className="w-full h-10 px-3 text-sm bg-white border border-[#E4E1D8] rounded-md focus:border-[#263C2D]"
              />
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-300 rounded text-xs text-red-900">
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex items-start gap-2 text-[11px] text-[#595C54]">
              <Info className="w-3.5 h-3.5 text-[#79583D] shrink-0 mt-0.5" />
              <span>
                Prototype checkout only. Does not process real payments or connect to a merchant
                processor.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E4E1D8]">
              <button
                type="button"
                onClick={onClose}
                className="h-11 px-4 text-xs font-medium text-[#292B27] bg-[#F7F5EF] hover:bg-[#E9DFC9]/60 border border-[#E4E1D8] rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-11 px-6 text-sm font-semibold text-white bg-[#263C2D] hover:bg-[#1E3024] rounded-md cursor-pointer"
              >
                Confirm Demo Sale ({formatUSD(posTotal)})
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
