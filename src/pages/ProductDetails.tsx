import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, ExternalLink, Info, MapPin, Minus, Phone, Plus, ShieldCheck, ShoppingBag, Sparkles, Wheat } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getCategoryById } from '../data/categories';
import { STORE_INFO } from '../data/products';
import { ProductVariant, StockStatus } from '../types/store';
import { formatUSD, getStockStatus } from '../utils/format';
import { SmartImage } from '../components/SmartImage';
import { ProductCard } from '../components/ProductCard';
import { GrainInspectModal } from '../components/GrainInspectModal';

export function ProductDetails() {
  const { productId } = useParams<{ productId: string }>();
  const { products, addToPreOrder } = useStore();

  const product = products.find((p) => p.id === productId);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants?.[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [inspectOpen, setInspectOpen] = useState(false);

  useEffect(() => {
    setSelectedVariant(product?.variants?.[0]);
    setQuantity(1);
    setAddedFeedback(false);
  }, [product?.id]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border border-[#E4E1D8] rounded-md p-8 text-center space-y-4">
          <h1 className="font-serif text-2xl font-semibold text-[#292B27]">
            Product Not Found
          </h1>
          <p className="text-sm text-[#595C54]">
            That catalog item could not be found in the current sample dataset.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 h-10 px-4 text-xs font-medium text-white bg-[#263C2D] hover:bg-[#1E3024] rounded-md transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Back to Feed Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  const category = getCategoryById(product.category);
  const stockStatus = getStockStatus(product.stockQty, product.lowStockThreshold);

  const activePackageSize = selectedVariant ? selectedVariant.packageSize : product.packageSize;
  const activeSku = selectedVariant ? selectedVariant.sku : product.sku;
  const activeBarcode = selectedVariant ? selectedVariant.barcode : product.barcode;
  const activePrice = selectedVariant ? selectedVariant.samplePrice : product.samplePrice;

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleAddToPreOrder = () => {
    addToPreOrder(product, quantity, selectedVariant, true);
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1600);
  };

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-[#595C54]">
          <Link to="/" className="hover:text-[#292B27]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/shop" className="hover:text-[#292B27]">
            Shop Feed
          </Link>
          {category && (
            <>
              <span aria-hidden="true">/</span>
              <Link to={`/shop?category=${category.id}`} className="hover:text-[#292B27]">
                {category.name}
              </Link>
            </>
          )}
          <span aria-hidden="true">/</span>
          <span className="text-[#292B27] font-medium">{product.name}</span>
        </nav>

        {/* Main 2-Column Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Product Image, Grain Inspector, and Guaranteed Feed Tag */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative group overflow-hidden rounded-md border border-[#E4E1D8] bg-[#F7F5EF]">
              <SmartImage
                src={product.image}
                alt={product.imageAlt}
                fallbackTitle={product.name}
                loading="eager"
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 text-[11px] font-semibold bg-[#263C2D]/90 text-white rounded shadow-sm backdrop-blur-sm">
                  {category?.name}
                </span>
                <span className="px-2.5 py-1 text-[11px] font-mono bg-white/90 text-[#292B27] border border-[#E4E1D8] rounded shadow-sm backdrop-blur-sm">
                  {product.form}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setInspectOpen(true)}
                className="absolute bottom-3 right-3 inline-flex items-center gap-2 px-3.5 py-2 bg-[#263C2D] hover:bg-[#1E3024] text-white text-xs font-semibold rounded-md shadow-md transition-all hover:scale-105 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E9DFC9]" aria-hidden="true" />
                <span>Inspect Grain &amp; Physical Form</span>
              </button>
            </div>

            {/* Official Feed Tag & Guaranteed Analysis Card */}
            <div className="bg-[#FAF8F3] border-2 border-dashed border-[#79583D]/40 rounded-md p-5 sm:p-6 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#E4E1D8] pb-3">
                <div className="flex items-center gap-2">
                  <Wheat className="w-4 h-4 text-[#79583D]" />
                  <span className="font-serif text-sm font-bold tracking-wide text-[#263C2D] uppercase">
                    Guaranteed Commercial Feed Analysis
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#697A45] bg-[#E9DFC9]/40 px-2.5 py-0.5 rounded border border-[#E4E1D8]">
                  <ShieldCheck className="w-3 h-3" />
                  <span>California Feed Verified</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white border border-[#E4E1D8] rounded">
                  <div className="text-[10px] text-[#595C54] uppercase font-semibold">Crude Protein</div>
                  <div className="text-base font-bold text-[#263C2D] font-mono mt-0.5">
                    {product.category === 'pigeon' ? '16.5%' : product.category === 'poultry' ? '18.0%' : '14.0%'}
                  </div>
                  <div className="text-[9px] text-[#595C54]">Min. Guaranteed</div>
                </div>

                <div className="p-3 bg-white border border-[#E4E1D8] rounded">
                  <div className="text-[10px] text-[#595C54] uppercase font-semibold">Crude Fat</div>
                  <div className="text-base font-bold text-[#263C2D] font-mono mt-0.5">
                    {product.category === 'pigeon' ? '3.5%' : product.category === 'livestock' ? '2.5%' : '3.0%'}
                  </div>
                  <div className="text-[9px] text-[#595C54]">Min. Guaranteed</div>
                </div>

                <div className="p-3 bg-white border border-[#E4E1D8] rounded">
                  <div className="text-[10px] text-[#595C54] uppercase font-semibold">Crude Fiber</div>
                  <div className="text-base font-bold text-[#263C2D] font-mono mt-0.5">
                    {product.category === 'livestock' ? '12.0%' : '6.5%'}
                  </div>
                  <div className="text-[9px] text-[#595C54]">Max. Content</div>
                </div>

                <div className="p-3 bg-white border border-[#E4E1D8] rounded">
                  <div className="text-[10px] text-[#595C54] uppercase font-semibold">Net Bag Weight</div>
                  <div className="text-base font-bold text-[#263C2D] font-mono mt-0.5">
                    {activePackageSize}
                  </div>
                  <div className="text-[9px] text-[#595C54]">Heavy Duty Poly/Paper</div>
                </div>
              </div>

              <div className="text-[11px] text-[#595C54] leading-relaxed pt-1">
                Ingredients inspected and blended for Central Valley climate conditions. Store off bare concrete floors in a clean, ventilated, dry area. Rotate stock using first-in, first-out practice.
              </div>
            </div>

            <div className="bg-white border border-[#E4E1D8] rounded-md p-5 sm:p-6 space-y-4">
              <h2 className="text-sm font-semibold text-[#292B27]">
                Product Details &amp; Storage Notes
              </h2>
              <dl className="divide-y divide-[#E4E1D8] text-sm">
                <div className="py-2.5 grid grid-cols-3 gap-4">
                  <dt className="text-[#595C54]">Category</dt>
                  <dd className="col-span-2 text-[#292B27] font-medium">
                    {category?.name ?? 'Feed Supply'}
                  </dd>
                </div>
                <div className="py-2.5 grid grid-cols-3 gap-4">
                  <dt className="text-[#595C54]">Feed Type</dt>
                  <dd className="col-span-2 text-[#292B27]">{product.feedType}</dd>
                </div>
                <div className="py-2.5 grid grid-cols-3 gap-4">
                  <dt className="text-[#595C54]">Common Use</dt>
                  <dd className="col-span-2 text-[#292B27]">{product.species}</dd>
                </div>
                <div className="py-2.5 grid grid-cols-3 gap-4">
                  <dt className="text-[#595C54]">Physical Form</dt>
                  <dd className="col-span-2 text-[#292B27]">{product.form}</dd>
                </div>
                <div className="py-2.5 grid grid-cols-3 gap-4">
                  <dt className="text-[#595C54]">Sample SKU / UPC</dt>
                  <dd className="col-span-2 font-mono text-xs text-[#292B27] tabular-nums">
                    {activeSku} &middot; {activeBarcode}
                  </dd>
                </div>
                <div className="py-2.5 grid grid-cols-3 gap-4">
                  <dt className="text-[#595C54]">Storage &amp; Handling</dt>
                  <dd className="col-span-2 text-[#595C54]">{product.handlingNotes}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Right: Contiguous Purchase / Pre-Order Module */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
            <div className="bg-white border border-[#E4E1D8] rounded-md p-6 space-y-5">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#595C54]">
                  <span>{category?.name}</span>
                  <span aria-hidden="true">&middot;</span>
                  <span>Sample Catalog Record</span>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#292B27] tracking-tight">
                  {product.name}
                </h1>

                <div className="flex items-baseline justify-between gap-4 pt-1">
                  <div>
                    <span className="text-2xl font-semibold text-[#292B27] tabular-nums">
                      {formatUSD(activePrice)}
                    </span>
                    <span className="ml-2 text-xs text-[#595C54]">
                      sample price / {activePackageSize}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-medium ${
                      stockStatus === StockStatus.OutOfStock
                        ? 'text-[#79583D]'
                        : 'text-[#263C2D]'
                    }`}
                  >
                    {stockStatus === StockStatus.OutOfStock
                      ? 'Sample: Out of Stock'
                      : stockStatus === StockStatus.LowStock
                      ? `Sample: Low Stock (${product.stockQty})`
                      : `Sample: In Stock (${product.stockQty})`}
                  </span>
                </div>
              </div>

              <p className="text-sm text-[#595C54] leading-relaxed border-t border-[#E4E1D8] pt-4">
                {product.description}
              </p>

              {/* Package Size Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#292B27]">
                  Package Size
                </label>
                {product.variants && product.variants.length > 1 ? (
                  <div className="grid grid-cols-2 gap-2.5">
                    {product.variants.map((variant) => {
                      const isSelected = selectedVariant?.id === variant.id;
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => setSelectedVariant(variant)}
                          className={`p-3 text-left rounded-md border transition-colors cursor-pointer ${
                            isSelected
                              ? 'border-[#263C2D] bg-[#F7F5EF] text-[#292B27]'
                              : 'border-[#E4E1D8] bg-white text-[#595C54] hover:border-[#697A45]'
                          }`}
                        >
                          <div className="text-xs font-semibold text-[#292B27]">
                            {variant.packageSize}
                          </div>
                          <div className="text-xs tabular-nums text-[#595C54] mt-0.5">
                            {formatUSD(variant.samplePrice)} sample
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-3.5 py-2.5 bg-[#F7F5EF] border border-[#E4E1D8] rounded-md text-sm text-[#292B27]">
                    {product.packageSize}
                  </div>
                )}
              </div>

              {/* Quantity & Add to Pre-Order */}
              <div className="space-y-3 pt-1">
                <label htmlFor="pdp-quantity" className="block text-xs font-semibold text-[#292B27]">
                  Quantity (Bags / Units)
                </label>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center h-11 border border-[#E4E1D8] rounded-md bg-[#F7F5EF]">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      className="w-10 h-full inline-flex items-center justify-center text-[#292B27] hover:bg-[#E9DFC9]/60 transition-colors cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      id="pdp-quantity"
                      type="number"
                      min={1}
                      max={999}
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setQuantity(Number.isFinite(val) && val > 0 ? Math.min(999, val) : 1);
                      }}
                      className="w-14 h-full text-center text-sm font-semibold tabular-nums text-[#292B27] bg-transparent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(999, q + 1))}
                      aria-label="Increase quantity"
                      className="w-10 h-full inline-flex items-center justify-center text-[#292B27] hover:bg-[#E9DFC9]/60 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToPreOrder}
                    disabled={stockStatus === StockStatus.OutOfStock}
                    className={`flex-1 inline-flex items-center justify-center gap-2 h-11 px-5 text-sm font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      stockStatus === StockStatus.OutOfStock
                        ? 'bg-[#E4E1D8] text-[#595C54] cursor-not-allowed'
                        : addedFeedback
                        ? 'bg-[#697A45] text-white'
                        : 'bg-[#263C2D] hover:bg-[#1E3024] text-white'
                    }`}
                  >
                    {addedFeedback ? (
                      <>
                        <Check className="w-4 h-4" aria-hidden="true" />
                        <span>Added to Pre-Order</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                        <span>Add to Pre-Order</span>
                      </>
                    )}
                  </button>
                </div>

                <Link
                  to="/pre-order"
                  className="w-full inline-flex items-center justify-center h-10 px-4 text-xs font-medium text-[#292B27] bg-[#F7F5EF] hover:bg-[#E9DFC9]/60 border border-[#E4E1D8] rounded-md transition-colors"
                >
                  Review Pre-Order Form
                </Link>
              </div>

              <div className="flex items-start gap-2 pt-3 border-t border-[#E4E1D8] text-xs text-[#595C54]">
                <Info className="w-4 h-4 text-[#79583D] shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Prices and inventory counts are sample data for UI preview. Always verify feed
                  tag specifications and live stock directly with the store.
                </span>
              </div>
            </div>

            {/* Store Contact Box */}
            <div className="bg-[#E9DFC9]/45 border border-[#E4E1D8] rounded-md p-5 space-y-2.5 text-sm">
              <h2 className="font-semibold text-[#292B27]">
                Verify Current Availability at {STORE_INFO.name}
              </h2>
              <p className="flex items-start gap-2 text-xs text-[#595C54]">
                <MapPin className="w-4 h-4 text-[#263C2D] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{STORE_INFO.fullAddress}</span>
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href={STORE_INFO.phoneHref}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#263C2D] hover:underline underline-offset-4 tabular-nums"
                >
                  <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Call {STORE_INFO.phoneDisplay}</span>
                </a>
                <span aria-hidden="true" className="text-[#595C54]">&middot;</span>
                <a
                  href={STORE_INFO.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#292B27] hover:underline underline-offset-4"
                >
                  <span>Directions</span>
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="pt-8 border-t border-[#E4E1D8] space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold text-[#292B27]">
                More in {category?.name}
              </h2>
              <Link
                to={`/shop?category=${product.category}`}
                className="text-xs font-medium text-[#263C2D] hover:underline underline-offset-4"
              >
                View all {category?.shortName}
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}

        {/* Grain Inspect Physical Modal */}
        <GrainInspectModal
          product={product}
          isOpen={inspectOpen}
          onClose={() => setInspectOpen(false)}
        />
      </div>
    </div>
  );
}
