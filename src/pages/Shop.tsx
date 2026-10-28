import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Info, Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { FEED_CATEGORIES, getCategoryById } from '../data/categories';
import { STORE_INFO } from '../data/products';
import { FeedCategoryId } from '../types/store';
import { SearchBar } from '../components/SearchBar';
import { ProductCard } from '../components/ProductCard';
import { Reveal } from '../components/Reveal';
import { HandDrawnWheat } from '../components/HandDrawnWheat';

type SortOption = 'featured' | 'name-asc' | 'price-asc' | 'price-desc';

const VALID_CATEGORIES = new Set<string>(Object.values(FeedCategoryId));

export function Shop() {
  const { products } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const rawCategoryParam = searchParams.get('category') || 'all';
  const selectedCategory: 'all' | FeedCategoryId = VALID_CATEGORIES.has(rawCategoryParam)
    ? (rawCategoryParam as FeedCategoryId)
    : 'all';

  const activeCategoryInfo =
    selectedCategory !== 'all' ? getCategoryById(selectedCategory) : undefined;

  const handleCategoryChange = (cat: 'all' | FeedCategoryId) => {
    if (cat === 'all') {
      const next = new URLSearchParams(searchParams);
      next.delete('category');
      setSearchParams(next);
    } else {
      setSearchParams({ category: cat });
    }
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const matches = products.filter((product) => {
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      return (
        product.name.toLowerCase().includes(q) ||
        product.feedType.toLowerCase().includes(q) ||
        product.species.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.sku.toLowerCase().includes(q) ||
        product.barcode.includes(q)
      );
    });

    const sorted = [...matches];
    switch (sortBy) {
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        sorted.sort((a, b) => a.samplePrice - b.samplePrice);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.samplePrice - a.samplePrice);
        break;
      case 'featured':
      default:
        sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
        break;
    }

    return sorted;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSortBy('featured');
    handleCategoryChange('all');
  };

  return (
    <div className="py-8 sm:py-12 relative overflow-hidden">
      {/* Subtle authentic hand-drawn wheat marginalia tucked along top right */}
      <HandDrawnWheat
        variant="image"
        flip={true}
        rotate={-8}
        sway="reverse"
        opacity={0.42}
        heightClass="h-56 sm:h-72"
        className="hidden xl:block absolute right-4 top-10 pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E4E1D8]">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-[#79583D]">
              {STORE_INFO.name} &middot; Feed Catalog
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#292B27] tracking-tight">
              {activeCategoryInfo ? activeCategoryInfo.name : 'Shop All Feed & Supplies'}
            </h1>
            <p className="text-sm sm:text-base text-[#595C54] max-w-2xl">
              {activeCategoryInfo
                ? activeCategoryInfo.description
                : 'Browse sample livestock, poultry, and pigeon rations along with single grains and feed room essentials.'}
            </p>
          </div>

          <a
            href={STORE_INFO.phoneHref}
            className="inline-flex items-center gap-2 h-10 px-4 text-xs font-medium text-[#263C2D] bg-white border border-[#E4E1D8] hover:border-[#263C2D] rounded-md transition-colors whitespace-nowrap self-start md:self-auto tabular-nums"
          >
            <Phone className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Check Stock: {STORE_INFO.phoneDisplay}</span>
          </a>
        </div>

        {/* Sample Data Notice */}
        <div className="flex items-start sm:items-center gap-2.5 px-4 py-3 bg-[#E9DFC9]/50 border border-[#E4E1D8] rounded-md text-xs text-[#292B27]">
          <Info className="w-4 h-4 text-[#79583D] shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
          <p>
            <strong>Sample UI Catalog:</strong> Items, prices, and availability shown below are
            placeholder records for frontend demonstration and do not represent live store stock.
          </p>
        </div>

        {/* Controls Bar: Category Filter + Search + Sort */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div
            role="group"
            aria-label="Feed categories"
            className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-[#E4E1D8] rounded-md"
          >
            <button
              type="button"
              onClick={() => handleCategoryChange('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#263C2D] text-white'
                  : 'text-[#595C54] hover:text-[#292B27]'
              }`}
            >
              All Feed ({products.length})
            </button>
            {FEED_CATEGORIES.map((cat) => {
              const count = products.filter((p) => p.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#263C2D] text-white'
                      : 'text-[#595C54] hover:text-[#292B27]'
                  }`}
                >
                  {cat.shortName} ({count})
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div className="w-full sm:w-72">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search feed, animal, or SKU..."
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <label htmlFor="catalog-sort" className="text-xs font-medium text-[#595C54] whitespace-nowrap">
                Sort by
              </label>
              <select
                id="catalog-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-11 px-3 bg-white border border-[#E4E1D8] rounded-md text-sm text-[#292B27] focus:border-[#263C2D] cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="price-asc">Sample Price: Low to High</option>
                <option value="price-desc">Sample Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs text-[#595C54]">
          <span className="tabular-nums">
            Showing {filteredProducts.length} of {products.length} sample items
          </span>
          {(selectedCategory !== 'all' || searchQuery.trim() !== '') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="font-medium text-[#263C2D] hover:underline underline-offset-4 cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Product Grid or Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-[#E4E1D8] rounded-md p-10 text-center space-y-3">
            <h2 className="text-base font-semibold text-[#292B27]">
              No matching sample feed products found
            </h2>
            <p className="text-sm text-[#595C54] max-w-md mx-auto">
              Try clearing your search term or switching feed categories. Looking for a specific
              grain or brand? Call Santos Feed Store directly at {STORE_INFO.phoneDisplay}.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="h-10 px-4 text-xs font-medium text-white bg-[#263C2D] hover:bg-[#1E3024] rounded-md transition-colors cursor-pointer"
              >
                Show All Sample Products
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, idx) => (
              <Reveal key={product.id} immediate delay={Math.min(idx * 0.025, 0.15)}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
