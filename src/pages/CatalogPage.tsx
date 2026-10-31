import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  SlidersHorizontal, 
  X, 
  ArrowUpDown, 
  Grid, 
  Layers, 
  RotateCcw,
  Search,
  Sparkles
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { BRANDS } from '../data/brands';
import { CATEGORIES } from '../data/categories';
import { FilterState, Product } from '../types';
import { ProductCard } from '../components/catalog/ProductCard';
import { FilterSidebar } from '../components/catalog/FilterSidebar';

const INITIAL_FILTERS: FilterState = {
  categories: [],
  brands: [],
  subCategories: [],
  sizes: [],
  priceRange: [200, 30000],
  abvRange: [0, 60],
  origins: [],
  inStockOnly: false,
  sortBy: 'recommended',
  searchQuery: '',
};

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(() => {
    const cat = searchParams.get('category');
    const brand = searchParams.get('brand');
    const sub = searchParams.get('sub');
    const q = searchParams.get('q');

    return {
      ...INITIAL_FILTERS,
      categories: cat ? [cat] : [],
      brands: brand ? [brand] : [],
      subCategories: sub ? [sub] : [],
      searchQuery: q || '',
    };
  });

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync URL params when they change
  useEffect(() => {
    const cat = searchParams.get('category');
    const brand = searchParams.get('brand');
    const sub = searchParams.get('sub');
    const q = searchParams.get('q');

    setFilters((prev) => ({
      ...prev,
      categories: cat ? [cat] : prev.categories,
      brands: brand ? [brand] : prev.brands,
      subCategories: sub ? [sub] : prev.subCategories,
      searchQuery: q !== null ? q : prev.searchQuery,
    }));
  }, [searchParams]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // 1. Search Query
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(q);
        const matchBrand = product.brandName.toLowerCase().includes(q);
        const matchCategory = product.categoryName.toLowerCase().includes(q);
        const matchSub = product.subCategory.toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchCategory && !matchSub) {
          return false;
        }
      }

      // 2. Category
      if (filters.categories.length > 0 && !filters.categories.includes(product.categoryId)) {
        return false;
      }

      // 3. Brand
      if (filters.brands.length > 0 && !filters.brands.includes(product.brandId)) {
        return false;
      }

      // 4. SubCategory / Type
      if (filters.subCategories.length > 0 && !filters.subCategories.includes(product.subCategory)) {
        return false;
      }

      // 5. Bottle Sizes
      if (filters.sizes.length > 0) {
        const hasMatchingSize = product.bottleSizes.some((s) => filters.sizes.includes(s.size));
        if (!hasMatchingSize) return false;
      }

      // 6. Max Price check across bottle sizes
      const minBottlePrice = Math.min(...product.bottleSizes.map((s) => s.price));
      if (minBottlePrice > filters.priceRange[1]) {
        return false;
      }

      // 7. Country of Origin
      if (filters.origins.length > 0 && !filters.origins.includes(product.origin)) {
        return false;
      }

      // 8. In-stock check
      if (filters.inStockOnly) {
        const hasStock = product.bottleSizes.some((s) => s.inStock && s.stockCount > 0);
        if (!hasStock) return false;
      }

      return true;
    });
  }, [filters]);

  // Sorting Logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (filters.sortBy) {
      case 'popularity':
        return list.sort((a, b) => b.reviewCount - a.reviewCount);
      case 'price-asc':
        return list.sort((a, b) => a.bottleSizes[0].price - b.bottleSizes[0].price);
      case 'price-desc':
        return list.sort((a, b) => b.bottleSizes[0].price - a.bottleSizes[0].price);
      case 'new-arrivals':
        return list.sort((a, b) => (b.recentlyAdded ? 1 : 0) - (a.recentlyAdded ? 1 : 0));
      case 'brand-az':
        return list.sort((a, b) => a.brandName.localeCompare(b.brandName));
      case 'recommended':
      default:
        return list.sort((a, b) => b.rating - a.rating);
    }
  }, [filteredProducts, filters.sortBy]);

  // Active filter chip helpers
  const removeChip = (type: 'category' | 'brand' | 'sub' | 'size' | 'origin', val: string) => {
    switch (type) {
      case 'category':
        setFilters((f) => ({ ...f, categories: f.categories.filter((c) => c !== val) }));
        break;
      case 'brand':
        setFilters((f) => ({ ...f, brands: f.brands.filter((b) => b !== val) }));
        break;
      case 'sub':
        setFilters((f) => ({ ...f, subCategories: f.subCategories.filter((s) => s !== val) }));
        break;
      case 'size':
        setFilters((f) => ({ ...f, sizes: f.sizes.filter((s) => s !== val) }));
        break;
      case 'origin':
        setFilters((f) => ({ ...f, origins: f.origins.filter((o) => o !== val) }));
        break;
    }
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSearchParams({});
  };

  // Count active filter criteria
  const activeFilterCount =
    filters.categories.length +
    filters.brands.length +
    filters.subCategories.length +
    filters.sizes.length +
    filters.origins.length +
    (filters.inStockOnly ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900">
      {/* Top Breadcrumb & Header Ribbon (Dark Charcoal & Warm Gold) */}
      <div className="bg-[#111219] text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
              <span>Cellar Inventory</span>
              <span>/</span>
              <span>All Spirits</span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-white">
              Spirits & Cellar Catalog
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Showing {sortedProducts.length} premium bottles available for 28-min express dispatch
            </p>
          </div>

          {/* Quick Search within Catalog */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              placeholder="Filter by spirit name..."
              className="w-full bg-[#1B1D2B] border border-neutral-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-amber-400"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters({ ...filters, searchQuery: '' })}
                className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Layout Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs h-fit sticky top-24">
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Main Product Grid Area */}
          <main className="flex-1 min-w-0">
            {/* Control Bar: Mobile Filter Button, Active Chips & Sort */}
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 mb-6 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition"
                >
                  <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                  <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
                </button>

                {/* Sort By Dropdown */}
                <div className="flex items-center gap-2 self-end sm:self-auto ml-auto">
                  <ArrowUpDown className="w-4 h-4 text-neutral-500 shrink-0" />
                  <label className="text-xs font-medium text-neutral-600 shrink-0">
                    Sort by:
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })
                    }
                    className="text-xs bg-neutral-100 hover:bg-neutral-200/80 text-neutral-800 font-medium py-1.5 px-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="recommended">Recommended (Rating)</option>
                    <option value="popularity">Popularity (Most Reviews)</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="new-arrivals">New Arrivals</option>
                    <option value="brand-az">Brand: A to Z</option>
                  </select>
                </div>
              </div>

              {/* Removable Active Filter Chips */}
              {activeFilterCount > 0 && (
                <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mr-1">
                    Active Filters:
                  </span>

                  {/* Categories */}
                  {filters.categories.map((c) => {
                    const catObj = CATEGORIES.find((cat) => cat.id === c);
                    return (
                      <span
                        key={c}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-amber-100/80 text-amber-900 border border-amber-300"
                      >
                        <span>{catObj ? catObj.name : c}</span>
                        <button
                          onClick={() => removeChip('category', c)}
                          className="hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}

                  {/* Brands */}
                  {filters.brands.map((b) => {
                    const brandObj = BRANDS.find((brand) => brand.id === b);
                    return (
                      <span
                        key={b}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-neutral-900 text-amber-300 border border-amber-500/40"
                      >
                        <span>{brandObj ? brandObj.name : b}</span>
                        <button
                          onClick={() => removeChip('brand', b)}
                          className="hover:text-amber-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}

                  {/* Subcategories */}
                  {filters.subCategories.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-neutral-200 text-neutral-800"
                    >
                      <span>{s}</span>
                      <button
                        onClick={() => removeChip('sub', s)}
                        className="hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {/* Bottle Sizes */}
                  {filters.sizes.map((sz) => (
                    <span
                      key={sz}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-blue-100 text-blue-900 border border-blue-200"
                    >
                      <span>{sz}</span>
                      <button
                        onClick={() => removeChip('size', sz)}
                        className="hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {/* Origins */}
                  {filters.origins.map((o) => (
                    <span
                      key={o}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-purple-100 text-purple-900 border border-purple-200"
                    >
                      <span>{o}</span>
                      <button
                        onClick={() => removeChip('origin', o)}
                        className="hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {/* In stock */}
                  {filters.inStockOnly && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-emerald-100 text-emerald-900 border border-emerald-300">
                      <span>In Stock Only</span>
                      <button
                        onClick={() => setFilters({ ...filters, inStockOnly: false })}
                        className="hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {/* Clear All */}
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-amber-700 hover:text-amber-900 font-semibold underline ml-2"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Products Grid */}
            {sortedProducts.length === 0 ? (
              <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center shadow-xs">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
                  <RotateCcw className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-bold text-neutral-800 mb-1">
                  No spirits match your filter criteria
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
                  Try clearing specific brand or bottle size filters, or reset all filters to view our full collection.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="py-2.5 px-6 rounded-xl bg-neutral-900 hover:bg-amber-600 text-white font-medium text-xs transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer Overlay */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200">
          <div className="w-full max-w-xs bg-white h-full p-5 overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
                <h3 className="font-bold text-sm tracking-wide uppercase text-neutral-900">
                  Filter Catalog
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-neutral-500 hover:text-neutral-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <FilterSidebar
                filters={filters}
                onChange={setFilters}
                onReset={handleResetFilters}
              />
            </div>

            <div className="pt-4 border-t border-neutral-200 sticky bottom-0 bg-white">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs uppercase tracking-wider"
              >
                Apply Filters ({sortedProducts.length} bottles)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
