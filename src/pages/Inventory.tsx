import React, { useMemo, useState } from 'react';
import { AlertCircle, Info, Plus, Wand2, X } from 'lucide-react';
import { NewProductInput, useStore } from '../context/StoreContext';
import { FEED_CATEGORIES } from '../data/categories';
import { FeedCategoryId, FeedProduct, StockStatus } from '../types/store';
import { getStockStatus } from '../utils/format';
import { SearchBar } from '../components/SearchBar';
import { InventoryTable } from '../pos/InventoryTable';

type StockAdjustmentMode = 'add' | 'subtract' | 'set';

export function Inventory() {
  const { products, addSampleProduct, updateSampleProduct, adjustProductStock } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | FeedCategoryId>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | StockStatus>('all');

  // Product Add/Edit Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<FeedProduct | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<NewProductInput>({
    name: '',
    category: FeedCategoryId.Livestock,
    feedType: '',
    species: '',
    form: '',
    packageSize: '50 lb Kraft Sack',
    sku: '',
    barcode: '',
    samplePrice: 18.5,
    stockQty: 20,
    lowStockThreshold: 8,
    description: '',
    handlingNotes: '',
  });

  // Stock Adjustment Modal State
  const [adjustingProduct, setAdjustingProduct] = useState<FeedProduct | null>(null);
  const [adjustMode, setAdjustMode] = useState<StockAdjustmentMode>('add');
  const [adjustQtyStr, setAdjustQtyStr] = useState<string>('10');
  const [adjustReason, setAdjustReason] = useState<string>('Demo pallet received');

  const stats = useMemo(() => {
    let totalUnits = 0;
    let lowCount = 0;
    let outCount = 0;
    for (const p of products) {
      totalUnits += p.stockQty;
      const st = getStockStatus(p.stockQty, p.lowStockThreshold);
      if (st === StockStatus.LowStock) lowCount += 1;
      if (st === StockStatus.OutOfStock) outCount += 1;
    }
    return {
      totalSkus: products.length,
      totalUnits,
      lowCount,
      outCount,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (statusFilter !== 'all') {
        const st = getStockStatus(p.stockQty, p.lowStockThreshold);
        if (st !== statusFilter) return false;
      }
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.barcode.includes(q) ||
        p.feedType.toLowerCase().includes(q)
      );
    });
  }, [products, categoryFilter, statusFilter, searchQuery]);

  const openAddModal = () => {
    const nextNum = 500 + products.length + 1;
    setEditingProduct(null);
    setFormError(null);
    setFormData({
      name: '',
      category: FeedCategoryId.Livestock,
      feedType: 'Pelleted Ration',
      species: 'Cattle, Goats & Sheep',
      form: 'Pellet',
      packageSize: '50 lb Kraft Sack',
      sku: `SFS-DEMO-${nextNum}`,
      barcode: `048210500${nextNum}`,
      samplePrice: 18.5,
      stockQty: 20,
      lowStockThreshold: 8,
      description: '',
      handlingNotes: 'Store in a dry barn area.',
    });
    setProductModalOpen(true);
  };

  const openEditModal = (product: FeedProduct) => {
    setEditingProduct(product);
    setFormError(null);
    setFormData({
      name: product.name,
      category: product.category,
      feedType: product.feedType,
      species: product.species,
      form: product.form,
      packageSize: product.packageSize,
      sku: product.sku,
      barcode: product.barcode,
      samplePrice: product.samplePrice,
      stockQty: product.stockQty,
      lowStockThreshold: product.lowStockThreshold,
      description: product.description,
      handlingNotes: product.handlingNotes,
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('Product name is required.');
      return;
    }
    if (!formData.packageSize.trim()) {
      setFormError('Package size is required (e.g., 50 lb Kraft Sack).');
      return;
    }
    if (!formData.sku.trim() || !formData.barcode.trim()) {
      setFormError('Both SKU and Barcode are required for POS lookup.');
      return;
    }

    // Check duplicate barcode against other products
    const duplicate = products.find(
      (p) =>
        p.id !== editingProduct?.id &&
        (p.barcode.toUpperCase() === formData.barcode.trim().toUpperCase() ||
          p.sku.toUpperCase() === formData.sku.trim().toUpperCase())
    );
    if (duplicate) {
      setFormError(`Barcode or SKU conflicts with existing sample item "${duplicate.name}".`);
      return;
    }

    if (editingProduct) {
      updateSampleProduct(editingProduct.id, {
        name: formData.name.trim(),
        category: formData.category,
        feedType: formData.feedType.trim(),
        species: formData.species.trim(),
        form: formData.form.trim(),
        packageSize: formData.packageSize.trim(),
        sku: formData.sku.trim().toUpperCase(),
        barcode: formData.barcode.trim(),
        samplePrice: Math.max(0, Number(formData.samplePrice) || 0),
        stockQty: Math.max(0, Math.floor(Number(formData.stockQty) || 0)),
        lowStockThreshold: Math.max(0, Math.floor(Number(formData.lowStockThreshold) || 0)),
        description: formData.description.trim(),
        handlingNotes: formData.handlingNotes.trim(),
      });
    } else {
      addSampleProduct(formData);
    }

    setProductModalOpen(false);
  };

  const openStockModal = (product: FeedProduct) => {
    setAdjustingProduct(product);
    setAdjustMode('add');
    setAdjustQtyStr('10');
    setAdjustReason('Demo pallet restock');
  };

  const previewAdjustedStock = useMemo(() => {
    if (!adjustingProduct) return 0;
    const val = Math.max(0, Math.floor(Number(adjustQtyStr) || 0));
    if (adjustMode === 'add') return adjustingProduct.stockQty + val;
    if (adjustMode === 'subtract') return Math.max(0, adjustingProduct.stockQty - val);
    return val;
  }, [adjustingProduct, adjustMode, adjustQtyStr]);

  const handleApplyStockAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProduct) return;
    adjustProductStock(adjustingProduct.id, previewAdjustedStock);
    setAdjustingProduct(null);
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Demo Inventory Banner */}
      <div className="flex items-start sm:items-center justify-between gap-4 px-4 py-3 bg-[#E9DFC9]/55 border border-[#E4E1D8] rounded-md text-xs text-[#292B27]">
        <div className="flex items-start sm:items-center gap-2.5">
          <Info className="w-4 h-4 text-[#79583D] shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
          <span>
            <strong>Demonstration Inventory Data:</strong> Records below are sample items stored in
            your browser for testing barcode lookup, edits, and stock adjustments.
          </span>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 h-9 px-3.5 text-xs font-semibold text-white bg-[#263C2D] hover:bg-[#1E3024] rounded-md whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Add Sample Product</span>
        </button>
      </div>

      {/* Summary Metrics Strip (Single-Elevation, Hairline Divided) */}
      <div className="bg-white border border-[#E4E1D8] rounded-md grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E4E1D8]">
        <div className="p-4">
          <div className="text-xs text-[#595C54]">Sample SKUs</div>
          <div className="font-mono text-xl font-semibold text-[#292B27] tabular-nums mt-1">
            {stats.totalSkus}
          </div>
        </div>
        <div className="p-4">
          <div className="text-xs text-[#595C54]">Sample Units on Hand</div>
          <div className="font-mono text-xl font-semibold text-[#292B27] tabular-nums mt-1">
            {stats.totalUnits}
          </div>
        </div>
        <div className="p-4">
          <div className="text-xs text-[#595C54]">Low Stock Alerts</div>
          <div className="font-mono text-xl font-semibold text-amber-800 tabular-nums mt-1">
            {stats.lowCount}
          </div>
        </div>
        <div className="p-4">
          <div className="text-xs text-[#595C54]">Out of Stock</div>
          <div className="font-mono text-xl font-semibold text-red-800 tabular-nums mt-1">
            {stats.outCount}
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        <div className="w-full xl:w-80">
          <SearchBar
            id="inventory-search"
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search barcode, SKU, or product..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            role="group"
            aria-label="Filter inventory by category"
            className="flex flex-wrap items-center gap-1 p-1 bg-white border border-[#E4E1D8] rounded-md"
          >
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded cursor-pointer ${
                categoryFilter === 'all'
                  ? 'bg-[#263C2D] text-white'
                  : 'text-[#595C54] hover:text-[#292B27]'
              }`}
            >
              All Categories
            </button>
            {FEED_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-[#263C2D] text-white'
                    : 'text-[#595C54] hover:text-[#292B27]'
                }`}
              >
                {cat.shortName}
              </button>
            ))}
          </div>

          <select
            aria-label="Filter by stock status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | StockStatus)}
            className="h-10 px-3 bg-white border border-[#E4E1D8] rounded-md text-xs font-medium text-[#292B27] cursor-pointer"
          >
            <option value="all">All Stock Statuses</option>
            <option value={StockStatus.InStock}>In Stock</option>
            <option value={StockStatus.LowStock}>Low Stock</option>
            <option value={StockStatus.OutOfStock}>Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <InventoryTable
        products={filteredProducts}
        onEditProduct={openEditModal}
        onAdjustStock={openStockModal}
      />

      {/* Add / Edit Sample Product Modal */}
      {productModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292B27]/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setProductModalOpen(false);
          }}
        >
          <div className="w-full max-w-2xl bg-white border border-[#E4E1D8] rounded-md max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 bg-[#F7F5EF] border-b border-[#E4E1D8] flex items-center justify-between">
              <h2 id="product-modal-title" className="text-base font-semibold text-[#292B27]">
                {editingProduct ? 'Edit Sample Product' : 'Add Sample Product (Demo)'}
              </h2>
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                aria-label="Close product form"
                className="p-1 text-[#595C54] hover:text-[#292B27] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              {formError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-300 rounded text-xs text-red-900">
                  <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#292B27] mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Rolled Corn & Oats Mix"
                    className="w-full h-10 px-3 text-sm bg-white border border-[#E4E1D8] rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#292B27] mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, category: e.target.value as FeedCategoryId }))
                    }
                    className="w-full h-10 px-3 text-sm bg-white border border-[#E4E1D8] rounded-md"
                  >
                    {FEED_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#292B27] mb-1">
                    Package Size *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.packageSize}
                    onChange={(e) => setFormData((p) => ({ ...p, packageSize: e.target.value }))}
                    placeholder="50 lb Kraft Sack"
                    className="w-full h-10 px-3 text-sm bg-white border border-[#E4E1D8] rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#292B27] mb-1">
                    SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData((p) => ({ ...p, sku: e.target.value }))}
                    className="w-full h-10 px-3 font-mono text-sm bg-white border border-[#E4E1D8] rounded-md"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[#292B27]">Barcode / UPC *</label>
                    <button
                      type="button"
                      onClick={() => {
                        const rand = Math.floor(100000 + Math.random() * 900000);
                        setFormData((p) => ({ ...p, barcode: `048210${rand}` }));
                      }}
                      className="inline-flex items-center gap-1 text-[11px] text-[#263C2D] hover:underline cursor-pointer"
                    >
                      <Wand2 className="w-3 h-3" />
                      <span>Generate Sample Code</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.barcode}
                    onChange={(e) => setFormData((p) => ({ ...p, barcode: e.target.value }))}
                    className="w-full h-10 px-3 font-mono text-sm bg-white border border-[#E4E1D8] rounded-md tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#292B27] mb-1">
                    Sample Unit Price (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.samplePrice}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, samplePrice: parseFloat(e.target.value) || 0 }))
                    }
                    className="w-full h-10 px-3 font-mono text-sm bg-white border border-[#E4E1D8] rounded-md tabular-nums"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#292B27] mb-1">
                      Sample Stock Qty
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stockQty}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, stockQty: parseInt(e.target.value, 10) || 0 }))
                      }
                      className="w-full h-10 px-3 font-mono text-sm bg-white border border-[#E4E1D8] rounded-md tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#292B27] mb-1">
                      Low Stock Alert
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.lowStockThreshold}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          lowStockThreshold: parseInt(e.target.value, 10) || 0,
                        }))
                      }
                      className="w-full h-10 px-3 font-mono text-sm bg-white border border-[#E4E1D8] rounded-md tabular-nums"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#292B27] mb-1">
                    Feed Type
                  </label>
                  <input
                    type="text"
                    value={formData.feedType}
                    onChange={(e) => setFormData((p) => ({ ...p, feedType: e.target.value }))}
                    placeholder="e.g. Whole Grain Mix"
                    className="w-full h-10 px-3 text-sm bg-white border border-[#E4E1D8] rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#292B27] mb-1">
                    Common Species
                  </label>
                  <input
                    type="text"
                    value={formData.species}
                    onChange={(e) => setFormData((p) => ({ ...p, species: e.target.value }))}
                    placeholder="e.g. Laying Hens, Goats"
                    className="w-full h-10 px-3 text-sm bg-white border border-[#E4E1D8] rounded-md"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#292B27] mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Practical product description..."
                    className="w-full p-3 text-sm bg-white border border-[#E4E1D8] rounded-md"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E4E1D8]">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="h-10 px-4 text-xs font-medium text-[#292B27] bg-[#F7F5EF] border border-[#E4E1D8] rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 text-xs font-semibold text-white bg-[#263C2D] hover:bg-[#1E3024] rounded-md cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Create Sample Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {adjustingProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292B27]/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="stock-adjust-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setAdjustingProduct(null);
          }}
        >
          <div className="w-full max-w-md bg-white border border-[#E4E1D8] rounded-md overflow-hidden">
            <div className="px-5 py-4 bg-[#F7F5EF] border-b border-[#E4E1D8] flex items-center justify-between">
              <h2 id="stock-adjust-title" className="text-base font-semibold text-[#292B27]">
                Adjust Sample Stock
              </h2>
              <button
                type="button"
                onClick={() => setAdjustingProduct(null)}
                aria-label="Close stock adjustment modal"
                className="p-1 text-[#595C54] hover:text-[#292B27] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplyStockAdjustment} className="p-5 space-y-4">
              <div>
                <div className="text-sm font-semibold text-[#292B27]">{adjustingProduct.name}</div>
                <div className="text-xs text-[#595C54] font-mono tabular-nums">
                  {adjustingProduct.sku} &middot; Current Sample Qty: {adjustingProduct.stockQty}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'add' as const, label: 'Receive (+)' },
                  { id: 'subtract' as const, label: 'Deduct (-)' },
                  { id: 'set' as const, label: 'Set Exact (=)' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAdjustMode(opt.id)}
                    className={`py-2 px-2 text-xs font-medium rounded border cursor-pointer ${
                      adjustMode === opt.id
                        ? 'bg-[#263C2D] text-white border-[#263C2D]'
                        : 'bg-white text-[#292B27] border-[#E4E1D8] hover:bg-[#F7F5EF]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#292B27] mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  max="9999"
                  value={adjustQtyStr}
                  onChange={(e) => setAdjustQtyStr(e.target.value)}
                  className="w-full h-10 px-3 font-mono text-sm bg-white border border-[#E4E1D8] rounded-md tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#292B27] mb-1">
                  Adjustment Memo (Local Demo)
                </label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full h-10 px-3 text-sm bg-white border border-[#E4E1D8] rounded-md"
                />
              </div>

              <div className="p-3 bg-[#F7F5EF] border border-[#E4E1D8] rounded flex items-center justify-between text-xs">
                <span className="text-[#595C54]">Resulting Sample Stock</span>
                <span className="font-mono text-base font-semibold text-[#263C2D] tabular-nums">
                  {adjustingProduct.stockQty} &rarr; {previewAdjustedStock}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E4E1D8]">
                <button
                  type="button"
                  onClick={() => setAdjustingProduct(null)}
                  className="h-10 px-4 text-xs font-medium text-[#292B27] bg-[#F7F5EF] border border-[#E4E1D8] rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 text-xs font-semibold text-white bg-[#263C2D] hover:bg-[#1E3024] rounded-md cursor-pointer"
                >
                  Apply Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
