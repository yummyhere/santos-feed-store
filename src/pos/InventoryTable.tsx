import React from 'react';
import { AlertTriangle, CheckCircle2, Edit2, SlidersHorizontal, XCircle } from 'lucide-react';
import { FeedProduct, StockStatus } from '../types/store';
import { getCategoryById } from '../data/categories';
import { formatUSD, getStockStatus } from '../utils/format';

interface InventoryTableProps {
  products: FeedProduct[];
  onEditProduct: (product: FeedProduct) => void;
  onAdjustStock: (product: FeedProduct) => void;
}

export function InventoryTable({
  products,
  onEditProduct,
  onAdjustStock,
}: InventoryTableProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white border border-[#E4E1D8] rounded-md p-10 text-center space-y-2">
        <p className="text-sm font-semibold text-[#292B27]">
          No sample inventory items match the current filter.
        </p>
        <p className="text-xs text-[#595C54]">
          Adjust your search query, category filter, or add a new sample item.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E4E1D8] rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F7F5EF] border-b border-[#E4E1D8] text-[11px] font-semibold text-[#595C54]">
              <th className="py-3 px-4">Barcode / SKU</th>
              <th className="py-3 px-4">Product Name (Sample)</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Package Size</th>
              <th className="py-3 px-4 text-right">Sample Price</th>
              <th className="py-3 px-4 text-right">Stock Qty</th>
              <th className="py-3 px-4">Stock Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E1D8] text-sm">
            {products.map((product) => {
              const cat = getCategoryById(product.category);
              const status = getStockStatus(product.stockQty, product.lowStockThreshold);

              return (
                <tr
                  key={product.id}
                  className="hover:bg-[#F7F5EF]/65 transition-colors duration-75"
                >
                  <td className="py-3 px-4 align-middle">
                    <div className="font-mono text-xs font-medium text-[#292B27] tabular-nums">
                      {product.barcode}
                    </div>
                    <div className="font-mono text-[11px] text-[#595C54] tabular-nums">
                      {product.sku}
                    </div>
                  </td>

                  <td className="py-3 px-4 align-middle">
                    <div className="font-medium text-[#292B27]">{product.name}</div>
                    <div className="text-xs text-[#595C54]">{product.feedType}</div>
                  </td>

                  <td className="py-3 px-4 align-middle text-xs text-[#595C54] whitespace-nowrap">
                    {cat?.name ?? product.category}
                  </td>

                  <td className="py-3 px-4 align-middle text-xs text-[#292B27] whitespace-nowrap">
                    {product.packageSize}
                  </td>

                  <td className="py-3 px-4 align-middle text-right font-mono text-xs font-semibold text-[#292B27] tabular-nums whitespace-nowrap">
                    {formatUSD(product.samplePrice)}
                  </td>

                  <td className="py-3 px-4 align-middle text-right font-mono text-sm font-semibold text-[#292B27] tabular-nums">
                    {product.stockQty}
                  </td>

                  <td className="py-3 px-4 align-middle whitespace-nowrap">
                    {status === StockStatus.InStock && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#263C2D]">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>In Stock</span>
                      </span>
                    )}
                    {status === StockStatus.LowStock && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>Low (&le;{product.lowStockThreshold})</span>
                      </span>
                    )}
                    {status === StockStatus.OutOfStock && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-800">
                        <XCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>Out of Stock</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 align-middle text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onAdjustStock(product)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#292B27] bg-[#F7F5EF] hover:bg-[#E9DFC9]/70 border border-[#E4E1D8] rounded transition-colors cursor-pointer"
                      >
                        <SlidersHorizontal className="w-3 h-3" aria-hidden="true" />
                        <span>Stock</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onEditProduct(product)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#263C2D] bg-white hover:bg-[#F7F5EF] border border-[#E4E1D8] rounded transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" aria-hidden="true" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
