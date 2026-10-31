import React, { useState, useMemo } from 'react';
import { Search, RotateCcw, ChevronDown, ChevronUp, Check, Sliders } from 'lucide-react';
import { FilterState } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { BRANDS } from '../../data/brands';
import { PRODUCTS } from '../../data/products';

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (updated: FilterState) => void;
  onReset: () => void;
  className?: string;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  onReset,
  className = '',
}) => {
  const [brandSearch, setBrandSearch] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    brands: true,
    subcategories: false,
    sizes: true,
    price: true,
    abv: false,
    origin: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Dynamically derive unique options from catalog as requested in prompt!
  const availableSubcategories = useMemo(() => {
    const set = new Set<string>();
    PRODUCTS.forEach((p) => {
      if (filters.categories.length === 0 || filters.categories.includes(p.categoryId)) {
        set.add(p.subCategory);
      }
    });
    return Array.from(set).sort();
  }, [filters.categories]);

  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    PRODUCTS.forEach((p) => {
      p.bottleSizes.forEach((s) => set.add(s.size));
    });
    return Array.from(set).sort();
  }, []);

  const availableOrigins = useMemo(() => {
    const set = new Set<string>();
    PRODUCTS.forEach((p) => set.add(p.origin));
    return Array.from(set).sort();
  }, []);

  // Filtered brands list based on search inside brands
  const displayedBrands = useMemo(() => {
    const q = brandSearch.trim().toLowerCase();
    if (!q) return BRANDS;
    return BRANDS.filter((b) => b.name.toLowerCase().includes(q));
  }, [brandSearch]);

  const handleCheckboxToggle = (
    key: 'categories' | 'brands' | 'subCategories' | 'sizes' | 'origins',
    value: string
  ) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    onChange({ ...filters, [key]: updated });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-bold tracking-wide uppercase text-neutral-900">
            Filters
          </h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-neutral-500 hover:text-amber-700 flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* 1. Category Filter */}
      <div className="border-b border-neutral-200/80 pb-4">
        <button
          onClick={() => toggleSection('categories')}
          className="w-full flex items-center justify-between text-xs font-semibold text-neutral-800 mb-2 uppercase tracking-wider"
        >
          <span>Category ({filters.categories.length})</span>
          {expandedSections.categories ? (
            <ChevronUp className="w-4 h-4 text-neutral-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-neutral-500" />
          )}
        </button>

        {expandedSections.categories && (
          <div className="space-y-1.5 mt-2 max-h-48 overflow-y-auto pr-1">
            {CATEGORIES.map((cat) => {
              const checked = filters.categories.includes(cat.id);
              const count = PRODUCTS.filter((p) => p.categoryId === cat.id).length;
              return (
                <label
                  key={cat.id}
                  className="flex items-center justify-between text-xs text-neutral-700 hover:text-neutral-900 cursor-pointer py-1 px-1 rounded hover:bg-neutral-100 transition"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleCheckboxToggle('categories', cat.id)}
                      className="rounded border-neutral-300 text-amber-600 focus:ring-amber-500 w-3.5 h-3.5 cursor-pointer"
                    />
                    <span className={checked ? 'font-semibold text-amber-800' : ''}>
                      {cat.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">({count})</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Brand Filter with Search within Brands */}
      <div className="border-b border-neutral-200/80 pb-4">
        <button
          onClick={() => toggleSection('brands')}
          className="w-full flex items-center justify-between text-xs font-semibold text-neutral-800 mb-2 uppercase tracking-wider"
        >
          <span>Brands ({filters.brands.length})</span>
          {expandedSections.brands ? (
            <ChevronUp className="w-4 h-4 text-neutral-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-neutral-500" />
          )}
        </button>

        {expandedSections.brands && (
          <div className="space-y-2 mt-2">
            {/* Search inside brands */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder="Search brands..."
                className="w-full text-xs bg-neutral-100 border border-neutral-200 rounded-lg pl-8 pr-2 py-1.5 focus:outline-none focus:border-amber-500 text-neutral-800"
              />
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {displayedBrands.map((brand) => {
                const checked = filters.brands.includes(brand.id);
                const count = PRODUCTS.filter((p) => p.brandId === brand.id).length;
                return (
                  <label
                    key={brand.id}
                    className="flex items-center justify-between text-xs text-neutral-700 hover:text-neutral-900 cursor-pointer py-1 px-1 rounded hover:bg-neutral-100 transition"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleCheckboxToggle('brands', brand.id)}
                        className="rounded border-neutral-300 text-amber-600 focus:ring-amber-500 w-3.5 h-3.5 cursor-pointer"
                      />
                      <span className={checked ? 'font-semibold text-amber-800' : ''}>
                        {brand.name}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-400">({count})</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. Bottle Size / Volume */}
      <div className="border-b border-neutral-200/80 pb-4">
        <button
          onClick={() => toggleSection('sizes')}
          className="w-full flex items-center justify-between text-xs font-semibold text-neutral-800 mb-2 uppercase tracking-wider"
        >
          <span>Bottle Size ({filters.sizes.length})</span>
          {expandedSections.sizes ? (
            <ChevronUp className="w-4 h-4 text-neutral-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-neutral-500" />
          )}
        </button>

        {expandedSections.sizes && (
          <div className="space-y-1.5 mt-2 max-h-40 overflow-y-auto pr-1">
            {availableSizes.map((size) => {
              const checked = filters.sizes.includes(size);
              return (
                <label
                  key={size}
                  className="flex items-center gap-2 text-xs text-neutral-700 hover:text-neutral-900 cursor-pointer py-1 px-1 rounded hover:bg-neutral-100 transition"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleCheckboxToggle('sizes', size)}
                    className="rounded border-neutral-300 text-amber-600 focus:ring-amber-500 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span className={checked ? 'font-semibold text-amber-800' : ''}>
                    {size}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Type / Subcategory */}
      <div className="border-b border-neutral-200/80 pb-4">
        <button
          onClick={() => toggleSection('subcategories')}
          className="w-full flex items-center justify-between text-xs font-semibold text-neutral-800 mb-2 uppercase tracking-wider"
        >
          <span>Type / Style ({filters.subCategories.length})</span>
          {expandedSections.subcategories ? (
            <ChevronUp className="w-4 h-4 text-neutral-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-neutral-500" />
          )}
        </button>

        {expandedSections.subcategories && (
          <div className="space-y-1.5 mt-2 max-h-40 overflow-y-auto pr-1">
            {availableSubcategories.map((sub) => {
              const checked = filters.subCategories.includes(sub);
              return (
                <label
                  key={sub}
                  className="flex items-center gap-2 text-xs text-neutral-700 hover:text-neutral-900 cursor-pointer py-1 px-1 rounded hover:bg-neutral-100 transition"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleCheckboxToggle('subCategories', sub)}
                    className="rounded border-neutral-300 text-amber-600 focus:ring-amber-500 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span className={checked ? 'font-semibold text-amber-800' : ''}>
                    {sub}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Max Price Range Slider */}
      <div className="border-b border-neutral-200/80 pb-4">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between text-xs font-semibold text-neutral-800 mb-2 uppercase tracking-wider"
        >
          <span>Max Price: ₹{filters.priceRange[1].toLocaleString('en-IN')}</span>
          {expandedSections.price ? (
            <ChevronUp className="w-4 h-4 text-neutral-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-neutral-500" />
          )}
        </button>

        {expandedSections.price && (
          <div className="mt-2 space-y-2">
            <input
              type="range"
              min={200}
              max={30000}
              step={200}
              value={filters.priceRange[1]}
              onChange={(e) =>
                onChange({
                  ...filters,
                  priceRange: [filters.priceRange[0], Number(e.target.value)],
                })
              }
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-neutral-500">
              <span>₹200</span>
              <span>₹15,000</span>
              <span>₹30,000+</span>
            </div>
          </div>
        )}
      </div>

      {/* 6. Country of Origin */}
      <div className="border-b border-neutral-200/80 pb-4">
        <button
          onClick={() => toggleSection('origin')}
          className="w-full flex items-center justify-between text-xs font-semibold text-neutral-800 mb-2 uppercase tracking-wider"
        >
          <span>Origin ({filters.origins.length})</span>
          {expandedSections.origin ? (
            <ChevronUp className="w-4 h-4 text-neutral-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-neutral-500" />
          )}
        </button>

        {expandedSections.origin && (
          <div className="space-y-1.5 mt-2 max-h-36 overflow-y-auto pr-1">
            {availableOrigins.map((origin) => {
              const checked = filters.origins.includes(origin);
              return (
                <label
                  key={origin}
                  className="flex items-center gap-2 text-xs text-neutral-700 hover:text-neutral-900 cursor-pointer py-1 px-1 rounded hover:bg-neutral-100 transition"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleCheckboxToggle('origins', origin)}
                    className="rounded border-neutral-300 text-amber-600 focus:ring-amber-500 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span className={checked ? 'font-semibold text-amber-800' : ''}>
                    {origin}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 7. In-Stock Only Toggle */}
      <div className="pt-2">
        <label className="flex items-center gap-2.5 text-xs text-neutral-800 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
            className="rounded border-neutral-300 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
          />
          <span className="font-medium">In-Stock Vault Items Only</span>
        </label>
      </div>
    </div>
  );
};
