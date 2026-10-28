import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Plus, Eye, Wheat } from 'lucide-react';
import { FeedProduct, ProductVariant, StockStatus } from '../types/store';
import { getCategoryById } from '../data/categories';
import { formatUSD, getStockStatus } from '../utils/format';
import { useStore } from '../context/StoreContext';
import { SmartImage } from './SmartImage';
import { GrainInspectModal } from './GrainInspectModal';

interface ProductCardProps {
  product: FeedProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToPreOrder } = useStore();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.[0]
  );
  const [justAdded, setJustAdded] = useState(false);
  const [inspectOpen, setInspectOpen] = useState(false);

  const category = getCategoryById(product.category);
  const stockStatus = getStockStatus(product.stockQty, product.lowStockThreshold);

  const activePrice = selectedVariant ? selectedVariant.samplePrice : product.samplePrice;
  const activePackageSize = selectedVariant ? selectedVariant.packageSize : product.packageSize;
  const activeSku = selectedVariant ? selectedVariant.sku : product.sku;

  const handleQuickAdd = () => {
    addToPreOrder(product, 1, selectedVariant, false);
    setJustAdded(true);
    window.setTimeout(() => {
      setJustAdded(false);
    }, 1400);
  };

  return (
    <>
      <article className="group flex flex-col h-full bg-white border border-[#E4E1D8] rounded-xl overflow-hidden hover:border-[#263C2D] hover:shadow-md transition-all duration-300 relative">
        {/* Image & Quick Actions Area */}
        <div className="relative aspect-[4/3] w-full bg-[#E9DFC9]/20 overflow-hidden border-b border-[#E4E1D8]">
          <Link
            to={`/product/${product.id}`}
            className="block w-full h-full focus-visible:outline-none"
            aria-label={`View details for ${product.name}`}
          >
            <SmartImage
              src={product.image}
              alt={product.imageAlt}
              fallbackTitle={product.name}
              className="w-full h-full"
              imgClassName="transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </Link>

          {/* Stenciled Vintage Sack Badge */}
          <div className="absolute top-2.5 left-2.5 bg-[#263C2D]/90 text-white backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-mono tracking-wider uppercase flex items-center gap-1 shadow-xs">
            <Wheat className="w-3 h-3 text-[#E9DFC9]" />
            <span>{category?.shortName || 'Feed'}</span>
          </div>

          {/* Grain Texture Inspect Quick Button */}
          <button
            type="button"
            onClick={() => setInspectOpen(true)}
            aria-label={`Inspect grain texture for ${product.name}`}
            className="absolute bottom-2.5 right-2.5 bg-white/95 text-[#263C2D] hover:bg-[#263C2D] hover:text-white backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Inspect Texture</span>
          </button>
        </div>

        {/* Details & Controls */}
        <div className="p-5 flex flex-col flex-1 justify-between gap-4">
          <div className="space-y-2">
            {/* Unboxed clean metadata */}
            <div className="flex flex-wrap items-center justify-between text-xs text-[#595C54]">
              <span className="font-mono text-[11px] tabular-nums">SKU: {activeSku}</span>
              <span
                className={`text-[11px] font-medium ${
                  stockStatus === StockStatus.OutOfStock
                    ? 'text-red-700'
                    : stockStatus === StockStatus.LowStock
                    ? 'text-amber-700 font-semibold'
                    : 'text-[#263C2D]'
                }`}
              >
                {stockStatus === StockStatus.OutOfStock
                  ? 'Call to Check'
                  : stockStatus === StockStatus.LowStock
                  ? `Low Stock (${product.stockQty})`
                  : `In Stock (${product.stockQty})`}
              </span>
            </div>

            <h3 className="font-serif text-lg font-semibold text-[#292B27] leading-snug">
              <Link
                to={`/product/${product.id}`}
                className="hover:text-[#263C2D] transition-colors"
              >
                {product.name}
              </Link>
            </h3>

            <p className="text-xs text-[#595C54] line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quick Package Size Switcher if Variants Exist */}
          {product.variants && product.variants.length > 1 && (
            <div className="pt-2 border-t border-[#E4E1D8]/70">
              <div className="flex items-center gap-1.5">
                {product.variants.map((v) => {
                  const isSelected = (selectedVariant?.id || product.variants?.[0]?.id) === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`flex-1 py-1 px-2 text-[11px] font-medium rounded border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#F7F5EF] text-[#263C2D] border-[#263C2D] font-semibold'
                          : 'bg-white text-[#595C54] border-[#E4E1D8] hover:border-[#697A45]'
                      }`}
                    >
                      {v.weightLbs} lb ({formatUSD(v.samplePrice)})
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Price & Action Row */}
          <div className="space-y-3 pt-3 border-t border-[#E4E1D8]">
            <div className="flex items-baseline justify-between gap-2">
              <div>
                <span className="font-mono text-xl font-bold text-[#263C2D] tabular-nums">
                  {formatUSD(activePrice)}
                </span>
                <span className="ml-1.5 text-xs text-[#595C54]">
                  sample / {activePackageSize}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Link
                to={`/product/${product.id}`}
                className="inline-flex items-center justify-center h-10 px-3 text-xs font-semibold text-[#292B27] bg-[#F7F5EF] hover:bg-[#E9DFC9]/70 border border-[#E4E1D8] rounded-md transition-colors whitespace-nowrap"
              >
                Full Specs
              </Link>

              <button
                type="button"
                onClick={handleQuickAdd}
                disabled={stockStatus === StockStatus.OutOfStock}
                className={`inline-flex items-center justify-center gap-1.5 h-10 px-3 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                  stockStatus === StockStatus.OutOfStock
                    ? 'bg-[#E4E1D8]/60 text-[#595C54] cursor-not-allowed'
                    : justAdded
                    ? 'bg-[#697A45] text-white scale-[0.98]'
                    : 'bg-[#263C2D] hover:bg-[#1E3024] text-white shadow-xs'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Pre-Order</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Grain Texture Inspection Modal */}
      <GrainInspectModal
        product={product}
        isOpen={inspectOpen}
        onClose={() => setInspectOpen(false)}
      />
    </>
  );
}
