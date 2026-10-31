import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Heart, 
  Share2, 
  Star, 
  ShieldCheck, 
  Clock, 
  Check, 
  Plus, 
  Minus, 
  Wine, 
  ChevronRight,
  Sparkles,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { ProductCard } from '../components/catalog/ProductCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();
  const { toggleWishlist, isWishlisted } = useAuth();

  const product = useMemo(() => {
    return PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
  }, [id]);

  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const selectedSize = product.bottleSizes[selectedSizeIndex] || product.bottleSizes[0];
  const wishlisted = isWishlisted(product.id);

  // Similar products from same category or brand
  const similarProducts = useMemo(() => {
    return PRODUCTS.filter(
      (p) => (p.categoryId === product.categoryId || p.brandId === product.brandId) && p.id !== product.id
    ).slice(0, 4);
  }, [product]);

  const handleAddToCart = () => {
    addToCart(product, selectedSize.size, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize.size, quantity);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 pb-16">
      {/* Breadcrumbs Ribbon */}
      <div className="bg-[#111219] text-white py-3 px-4 sm:px-6 lg:px-8 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-neutral-400">
          <Link to="/" className="hover:text-amber-400 transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <Link to="/catalog" className="hover:text-amber-400 transition">
            Catalog
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <Link
            to={`/catalog?category=${product.categoryId}`}
            className="hover:text-amber-400 transition"
          >
            {product.categoryName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-amber-300 font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Product Canvas */}
        <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 md:p-10 shadow-xs mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Large Bottle Imagery with Zoom */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div
                onClick={() => setIsZoomed(!isZoomed)}
                className={`relative w-full h-[400px] md:h-[480px] bg-gradient-to-b from-neutral-50 via-neutral-100 to-neutral-50 rounded-2xl p-6 flex items-center justify-center border border-neutral-200/80 cursor-zoom-in overflow-hidden transition-all duration-300 ${
                  isZoomed ? 'ring-2 ring-amber-400' : ''
                }`}
              >
                <ImageWithFallback
                  src={product.imageUrl}
                  alt={product.name}
                  fallbackTitle={product.name}
                  className={`w-full h-full object-contain transition-transform duration-500 ${
                    isZoomed ? 'scale-125' : 'hover:scale-105'
                  }`}
                />

                {/* Floating Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                  {product.badges?.map((badge) => (
                    <span
                      key={badge}
                      className="px-2.5 py-1 text-[11px] font-mono uppercase font-bold tracking-wider rounded-lg bg-neutral-900 text-amber-300 shadow-sm border border-amber-500/30"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                <div className="absolute bottom-4 right-4 flex items-center gap-1 text-[11px] font-mono text-neutral-500 bg-white/90 px-2 py-1 rounded-lg border border-neutral-200 backdrop-blur-xs">
                  <Maximize2 className="w-3.5 h-3.5 text-neutral-600" />
                  <span>{isZoomed ? 'Click to reset' : 'Click to zoom'}</span>
                </div>
              </div>

              {/* Express delivery promise */}
              <div className="w-full mt-4 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between text-xs text-amber-900">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>
                    Express Delivery: <strong>28 Mins</strong> in Indiranagar
                  </span>
                </div>
                <span className="font-mono text-emerald-700 font-semibold">In Stock</span>
              </div>
            </div>

            {/* Right: Product Details & Controls */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                {/* Brand & Action Bar */}
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold tracking-widest text-amber-700 uppercase">
                      {product.brandName}
                    </span>
                    <span>•</span>
                    <span className="text-xs font-medium text-neutral-500">
                      {product.origin}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-2 rounded-xl border transition ${
                        wishlisted
                          ? 'border-red-300 bg-red-50 text-red-600'
                          : 'border-neutral-200 text-neutral-500 hover:text-red-500 hover:bg-neutral-50'
                      }`}
                      title="Save to Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(window.location.href);
                        alert('Product link copied to clipboard!');
                      }}
                      className="p-2 rounded-xl border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition"
                      title="Share Product"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight leading-snug">
                  {product.name}
                </h1>

                {/* Rating & ABV pill row */}
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs font-bold font-mono">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{product.rating}</span>
                    <span className="text-neutral-500 font-normal">({product.reviewCount} reviews)</span>
                  </div>

                  <div className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-700 text-xs font-mono font-medium border border-neutral-200">
                    {product.abv}% Alcohol by Volume (ABV)
                  </div>

                  <div className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-700 text-xs font-medium border border-neutral-200">
                    {product.subCategory}
                  </div>
                </div>

                {/* Dynamic Price Display */}
                <div className="mt-6 p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-baseline gap-3">
                  <span className="font-mono text-3xl font-extrabold text-neutral-900">
                    ₹{selectedSize.price.toLocaleString('en-IN')}
                  </span>
                  {selectedSize.originalPrice && (
                    <span className="font-mono text-base text-neutral-400 line-through">
                      ₹{selectedSize.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="text-xs text-neutral-500 ml-auto font-medium">
                    Inclusive of all state excise duties & taxes
                  </span>
                </div>

                {/* Bottle Size Selector Buttons */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                      Select Bottle Size / Volume:
                    </label>
                    <span className="text-xs text-neutral-500 font-mono">
                      Selected: <strong>{selectedSize.size}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {product.bottleSizes.map((sizeOpt, idx) => {
                      const isSelected = selectedSizeIndex === idx;
                      return (
                        <button
                          key={sizeOpt.size}
                          onClick={() => setSelectedSizeIndex(idx)}
                          className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                            isSelected
                              ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500 text-neutral-900'
                              : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-700'
                          }`}
                        >
                          <span className="font-semibold text-xs font-mono">
                            {sizeOpt.size}
                          </span>
                          <span className="text-xs font-bold font-mono text-amber-700 mt-1">
                            ₹{sizeOpt.price.toLocaleString('en-IN')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity Selector & Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-neutral-300 bg-white rounded-xl p-1 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2.5 hover:bg-neutral-100 rounded-lg text-neutral-700 transition"
                      title="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-mono text-sm font-bold text-neutral-900 px-4">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-2.5 hover:bg-neutral-100 rounded-lg text-neutral-700 transition"
                      title="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Bar Cart */}
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-sm ${
                      addedNotice
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-[0_4px_20px_rgba(212,175,55,0.3)]'
                    }`}
                  >
                    {addedNotice ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart ({quantity}x)</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Add to Bar Cart</span>
                      </>
                    )}
                  </button>

                  {/* Buy Now / Quick Checkout */}
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider bg-neutral-950 hover:bg-neutral-800 text-white transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Instant Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-neutral-100 grid grid-cols-2 gap-4 text-xs text-neutral-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Guaranteed authentic distillery seal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Curated multi-brand cellar cart</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tasting Notes & Detailed Specs Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Sommelier Tasting Notes */}
          <div className="lg:col-span-6 bg-white border border-neutral-200/90 rounded-3xl p-6 md:p-8 shadow-xs">
            <h3 className="font-serif text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
              <Wine className="w-5 h-5 text-amber-600" />
              <span>Sommelier Tasting Notes & Profile</span>
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed mb-4">
              {product.description}
            </p>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold block mb-1.5">
                  Flavor Profile Palette:
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.tastingNotes.map((note) => (
                    <span
                      key={note}
                      className="px-3 py-1 rounded-full text-xs bg-amber-50 text-amber-900 border border-amber-200/80 font-medium"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              {product.servingSuggestion && (
                <div className="pt-3 border-t border-neutral-100">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold block mb-1">
                    Serving Suggestion:
                  </span>
                  <p className="text-xs text-neutral-700 italic">
                    "{product.servingSuggestion}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Specifications Table */}
          <div className="lg:col-span-6 bg-white border border-neutral-200/90 rounded-3xl p-6 md:p-8 shadow-xs">
            <h3 className="font-serif text-lg font-bold text-neutral-900 mb-4">
              Product Specifications
            </h3>
            <div className="divide-y divide-neutral-100 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-neutral-500">Brand House</span>
                <span className="font-semibold text-neutral-900">{product.brandName}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-neutral-500">Spirit Category</span>
                <span className="font-semibold text-neutral-900">{product.categoryName}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-neutral-500">Style / Subcategory</span>
                <span className="font-semibold text-neutral-900">{product.subCategory}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-neutral-500">Country of Origin</span>
                <span className="font-semibold text-neutral-900">{product.origin}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-neutral-500">Alcohol by Volume (ABV)</span>
                <span className="font-semibold text-neutral-900">{product.abv}%</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-neutral-500">Stock Availability</span>
                <span className="font-semibold text-emerald-600">Available in Vault</span>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Spirits Recommendations */}
        {similarProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900">
                  You Might Also Like
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Hand-selected spirits with complementary taste profiles
                </p>
              </div>
              <Link
                to={`/catalog?category=${product.categoryId}`}
                className="text-xs font-semibold text-amber-700 hover:underline"
              >
                View all in {product.categoryName} →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
