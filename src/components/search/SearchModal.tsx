import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles, Plus, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../../data/products';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRENDING_SEARCHES = [
  'Single Malt',
  'Johnnie Walker',
  'Absolut Vodka',
  'Bombay Sapphire',
  'Moët Champagne',
  'Old Monk',
  'Corona Beer',
  'Hendrick’s Gin',
];

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return PRODUCTS.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchBrand = p.brandName.toLowerCase().includes(q);
      const matchCategory = p.categoryName.toLowerCase().includes(q);
      const matchSub = p.subCategory.toLowerCase().includes(q);
      const matchSize = p.bottleSizes.some((s) => s.size.toLowerCase().includes(q));
      const matchNotes = p.tastingNotes.some((t) => t.toLowerCase().includes(q));
      return matchName || matchBrand || matchCategory || matchSub || matchSize || matchNotes;
    }).slice(0, 8); // Top 8 results
  }, [query]);

  if (!isOpen) return null;

  const handleProductClick = (productId: string) => {
    onClose();
    navigate(`/product/${productId}`);
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const defaultSize = product.bottleSizes[0];
    addToCart(product, defaultSize.size);

    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl mx-auto p-4 md:pt-10 flex-1 flex flex-col">
        {/* Search Header Bar */}
        <div className="relative flex items-center bg-[#171822] border border-amber-500/30 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.15)] overflow-hidden">
          <Search className="w-6 h-6 text-amber-400 ml-4 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by brand, product, category, size (e.g. 'Johnnie Walker', 'Single Malt', '750 ML')..."
            className="w-full bg-transparent px-4 py-4 text-base md:text-lg text-white placeholder-neutral-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-2 text-neutral-400 hover:text-white mr-1"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-4 border-l border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800/50 text-sm font-medium transition"
          >
            Esc
          </button>
        </div>

        {/* Trending Tags */}
        {!query && (
          <div className="mt-6 bg-[#12131A]/90 border border-neutral-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-amber-400 uppercase mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Trending Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {TRENDING_SEARCHES.map((item) => (
                <button
                  key={item}
                  onClick={() => setQuery(item)}
                  className="px-3.5 py-1.5 rounded-full text-xs bg-neutral-900 border border-neutral-700 text-neutral-300 hover:border-amber-400 hover:text-amber-300 hover:bg-amber-950/20 transition"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
              <span>Quick category shortcuts:</span>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    onClose();
                    navigate('/catalog?category=whisky');
                  }}
                  className="text-amber-400 hover:underline"
                >
                  Whisky
                </button>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/catalog?category=vodka');
                  }}
                  className="text-amber-400 hover:underline"
                >
                  Vodka
                </button>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/catalog?category=gin');
                  }}
                  className="text-amber-400 hover:underline"
                >
                  Gin
                </button>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/catalog?category=beer');
                  }}
                  className="text-amber-400 hover:underline"
                >
                  Beer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Container */}
        {query && (
          <div className="mt-4 flex-1 bg-[#12131A]/95 border border-neutral-800 rounded-2xl p-4 overflow-y-auto max-h-[70vh]">
            <div className="flex justify-between items-center mb-3 px-2">
              <span className="text-xs text-neutral-400">
                Found {searchResults.length} matching bottles
              </span>
              <button
                onClick={() => {
                  onClose();
                  navigate(`/catalog?q=${encodeURIComponent(query)}`);
                }}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>View all in catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-12 text-neutral-400">
                <p className="text-base text-neutral-300 mb-1">No spirits found matching "{query}"</p>
                <p className="text-xs text-neutral-500">
                  Try searching for general terms like 'Whisky', 'Single Malt', 'Bacardi', or '750 ML'
                </p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-800">
                {searchResults.map((product) => {
                  const defaultSize = product.bottleSizes[0];
                  const isAdded = !!addedIds[product.id];

                  return (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      className="group flex items-center justify-between p-3 rounded-xl hover:bg-neutral-800/40 cursor-pointer transition"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 bg-neutral-900 rounded-lg p-1.5 border border-neutral-800 shrink-0 flex items-center justify-center">
                          <ImageWithFallback
                            src={product.imageUrl}
                            alt={product.name}
                            fallbackTitle={product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono tracking-wider text-amber-400/90 uppercase">
                              {product.brandName}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 bg-neutral-800 text-neutral-400 rounded">
                              {product.subCategory}
                            </span>
                          </div>
                          <h4 className="text-sm font-medium text-white group-hover:text-amber-300 transition">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                            <span className="font-semibold text-amber-200">
                              ₹{defaultSize.price.toLocaleString('en-IN')}
                            </span>
                            <span>•</span>
                            <span>{defaultSize.size}</span>
                            <span>•</span>
                            <span>{product.abv}% ABV</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-500 hover:bg-amber-400 text-neutral-950'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
