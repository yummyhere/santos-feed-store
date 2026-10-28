import React, { useMemo, useState } from 'react';
import { Ban, CheckCircle2, Info, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PaymentMethod, PosTransaction, TransactionStatus } from '../types/store';
import { formatDateTime, formatUSD } from '../utils/format';
import { SearchBar } from '../components/SearchBar';

function getPaymentLabel(method: PaymentMethod): string {
  switch (method) {
    case PaymentMethod.Cash:
      return 'Cash (Demo)';
    case PaymentMethod.CardTerminal:
      return 'External Card (Demo)';
    case PaymentMethod.CheckOrAccount:
      return 'Check / Memo (Demo)';
  }
}

export function SalesHistory() {
  const { posTransactions, voidDemoTransaction } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TransactionStatus>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | PaymentMethod>('all');
  const [selectedTxId, setSelectedTxId] = useState<string | null>(
    posTransactions[0]?.id ?? null
  );

  const filteredTransactions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return posTransactions.filter((tx) => {
      if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
      if (paymentFilter !== 'all' && tx.paymentMethod !== paymentFilter) return false;
      if (!q) return true;

      const itemMatch = tx.items.some(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.sku.toLowerCase().includes(q) ||
          i.barcode.includes(q)
      );
      return (
        tx.id.toLowerCase().includes(q) ||
        (tx.customerMemo?.toLowerCase().includes(q) ?? false) ||
        itemMatch
      );
    });
  }, [posTransactions, statusFilter, paymentFilter, searchQuery]);

  const selectedTransaction: PosTransaction | undefined = useMemo(
    () => posTransactions.find((tx) => tx.id === selectedTxId),
    [posTransactions, selectedTxId]
  );

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Explicit Demo Notice */}
      <div className="flex items-start sm:items-center gap-2.5 px-4 py-3 bg-[#E9DFC9]/55 border border-[#E4E1D8] rounded-md text-xs text-[#292B27]">
        <Info className="w-4 h-4 text-[#79583D] shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
        <p>
          <strong>Demonstration Sales Log:</strong> Every entry listed below is a simulated UI
          record (<code className="font-mono text-[11px]">DEMO-TX-*</code>) stored locally in your
          browser—not an actual store sale or financial ledger.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="w-full lg:w-96">
          <SearchBar
            id="sales-history-search"
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search transaction ID, customer memo, or item..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            aria-label="Filter by payment method"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value as 'all' | PaymentMethod)}
            className="h-10 px-3 bg-white border border-[#E4E1D8] rounded-md text-xs font-medium text-[#292B27] cursor-pointer"
          >
            <option value="all">All Payment Types</option>
            <option value={PaymentMethod.Cash}>Cash (Demo)</option>
            <option value={PaymentMethod.CardTerminal}>External Card (Demo)</option>
            <option value={PaymentMethod.CheckOrAccount}>Check / Memo (Demo)</option>
          </select>

          <select
            aria-label="Filter by transaction status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | TransactionStatus)}
            className="h-10 px-3 bg-white border border-[#E4E1D8] rounded-md text-xs font-medium text-[#292B27] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value={TransactionStatus.CompletedDemo}>Completed (Demo)</option>
            <option value={TransactionStatus.VoidedDemo}>Voided (Demo)</option>
          </select>
        </div>
      </div>

      {/* Master-Detail Split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Transactions Table */}
        <div className="xl:col-span-8 bg-white border border-[#E4E1D8] rounded-md overflow-hidden">
          {filteredTransactions.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <p className="text-sm font-semibold text-[#292B27]">
                No matching demonstration transactions found.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setPaymentFilter('all');
                }}
                className="text-xs font-medium text-[#263C2D] underline underline-offset-4 cursor-pointer"
              >
                Reset search &amp; filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F7F5EF] border-b border-[#E4E1D8] text-[11px] font-semibold text-[#595C54]">
                    <th className="py-3 px-3.5">Transaction ID</th>
                    <th className="py-3 px-3.5">Date &amp; Time</th>
                    <th className="py-3 px-3.5">Items Summary</th>
                    <th className="py-3 px-3.5">Status</th>
                    <th className="py-3 px-3.5 text-right">Total (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E1D8] text-sm">
                  {filteredTransactions.map((tx) => {
                    const isSelected = tx.id === selectedTxId;
                    const totalBags = tx.items.reduce((s, i) => s + i.quantity, 0);

                    return (
                      <tr
                        key={tx.id}
                        tabIndex={0}
                        onClick={() => setSelectedTxId(tx.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedTxId(tx.id);
                          }
                        }}
                        className={`cursor-pointer transition-colors duration-75 ${
                          isSelected ? 'bg-[#E9DFC9]/45' : 'hover:bg-[#F7F5EF]/70'
                        }`}
                      >
                        <td className="py-3 px-3.5 align-middle">
                          <div className="font-mono text-xs font-semibold text-[#292B27] tabular-nums">
                            {tx.id}
                          </div>
                          {tx.customerMemo && (
                            <div className="text-[11px] text-[#595C54] truncate max-w-[165px]">
                              {tx.customerMemo}
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-3.5 align-middle text-xs text-[#595C54] tabular-nums whitespace-nowrap">
                          {formatDateTime(tx.createdAtIso)}
                        </td>

                        <td className="py-3 px-3.5 align-middle text-xs text-[#292B27] max-w-[230px]">
                          <span className="font-medium tabular-nums">
                            {totalBags === 1 ? '1 unit' : `${totalBags} units`}
                          </span>
                          <span className="text-[#595C54]">
                            {' '}
                            &middot; {tx.items[0]?.name}
                            {tx.items.length > 1 ? ` +${tx.items.length - 1} more` : ''}
                          </span>
                        </td>

                        <td className="py-3 px-3.5 align-middle whitespace-nowrap">
                          {tx.status === TransactionStatus.CompletedDemo ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#263C2D]">
                              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Completed (Demo)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#595C54] line-through">
                              <Ban className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Voided (Demo)</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3.5 align-middle text-right font-mono text-sm font-semibold text-[#292B27] tabular-nums whitespace-nowrap">
                          {formatUSD(tx.total)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Transaction Detail Inspector */}
        <div className="xl:col-span-4 bg-white border border-[#E4E1D8] rounded-md p-5 space-y-4">
          {selectedTransaction ? (
            <>
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#E4E1D8]">
                <div>
                  <span className="text-[11px] font-medium text-[#79583D]">
                    Demonstration Ticket Detail
                  </span>
                  <h2 className="font-mono text-base font-semibold text-[#292B27] mt-0.5 tabular-nums">
                    {selectedTransaction.id}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTxId(null)}
                  aria-label="Close detail view"
                  className="xl:hidden p-1 text-[#595C54] hover:text-[#292B27]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <dl className="grid grid-cols-2 gap-2.5 text-xs">
                <div>
                  <dt className="text-[#595C54]">Timestamp</dt>
                  <dd className="font-medium text-[#292B27] tabular-nums mt-0.5">
                    {formatDateTime(selectedTransaction.createdAtIso)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#595C54]">Payment</dt>
                  <dd className="font-medium text-[#292B27] mt-0.5">
                    {getPaymentLabel(selectedTransaction.paymentMethod)}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-[#595C54]">Memo / Customer Note</dt>
                  <dd className="text-[#292B27] mt-0.5">
                    {selectedTransaction.customerMemo || '—'}
                  </dd>
                </div>
              </dl>

              <div className="pt-3 border-t border-[#E4E1D8] space-y-2">
                <h3 className="text-xs font-semibold text-[#595C54]">Line Items</h3>
                <div className="divide-y divide-[#E4E1D8]">
                  {selectedTransaction.items.map((item, idx) => (
                    <div
                      key={`${item.sku}-${idx}`}
                      className="py-2 flex items-start justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-medium text-[#292B27]">{item.name}</div>
                        <div className="text-[11px] text-[#595C54] font-mono tabular-nums">
                          {item.packageSize} &middot; {item.quantity} &times;{' '}
                          {formatUSD(item.sampleUnitPrice)}
                        </div>
                      </div>
                      <span className="font-mono font-semibold text-[#292B27] tabular-nums">
                        {formatUSD(item.lineTotal)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#E4E1D8] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#595C54]">
                  <span>Sample Subtotal</span>
                  <span className="font-mono tabular-nums">
                    {formatUSD(selectedTransaction.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-[#595C54]">
                  <span>Tax ({selectedTransaction.taxRatePercent}%)</span>
                  <span className="font-mono tabular-nums">
                    {formatUSD(selectedTransaction.taxAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#292B27] pt-1 border-t border-[#E4E1D8]">
                  <span>Total</span>
                  <span className="font-mono tabular-nums">
                    {formatUSD(selectedTransaction.total)}
                  </span>
                </div>
                {typeof selectedTransaction.cashTendered === 'number' && (
                  <div className="flex justify-between text-[#595C54] pt-1">
                    <span>Cash Tendered / Change</span>
                    <span className="font-mono tabular-nums">
                      {formatUSD(selectedTransaction.cashTendered)} /{' '}
                      {formatUSD(selectedTransaction.changeDue ?? 0)}
                    </span>
                  </div>
                )}
              </div>

              {selectedTransaction.status === TransactionStatus.CompletedDemo && (
                <div className="pt-3 border-t border-[#E4E1D8]">
                  <button
                    type="button"
                    onClick={() => voidDemoTransaction(selectedTransaction.id)}
                    className="w-full h-9 px-3 text-xs font-medium text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors cursor-pointer"
                  >
                    Mark Demo Record as Void (Restores Sample Stock)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center text-xs text-[#595C54]">
              Select any demonstration transaction row to inspect line items and totals.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
