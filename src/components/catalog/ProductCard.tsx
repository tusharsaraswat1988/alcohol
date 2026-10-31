import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Plus, Minus, Star, Sparkles, Check } from 'lucide-react';
import { Product } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { items, addToCart, updateQuantity } = useCart();
  const { toggleWishlist, isWishlisted } = useAuth();

  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const selectedSize = product.bottleSizes[selectedSizeIndex] || product.bottleSizes[0];
  const cartItemId = `${product.id}_${selectedSize.size}`;
  const existingCartItem = items.find((i) => i.cartItemId === cartItemId);
  const wishlisted = isWishlisted(product.id);

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedSize.size, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const idx = Number(e.target.value);
    setSelectedSizeIndex(idx);
  };

  const primaryBadge = product.badges && product.badges.length > 0 ? product.badges[0] : null;

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white border border-neutral-200/80 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-400/80 hover:shadow-[0_12px_30px_rgba(212,175,55,0.12)] transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Top Bar: Badge & Wishlist */}
      <div className="flex items-center justify-between gap-1 z-10 mb-2">
        {primaryBadge ? (
          <span
            className={`text-[10px] font-mono tracking-wider uppercase font-semibold px-2 py-0.5 rounded-full border shadow-xs ${
              primaryBadge === 'Bestseller'
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : primaryBadge === 'Rare Reserve'
                ? 'bg-neutral-900 text-amber-300 border-amber-500/50'
                : primaryBadge === 'Award Winner'
                ? 'bg-purple-100 text-purple-900 border-purple-300'
                : 'bg-emerald-100 text-emerald-900 border-emerald-300'
            }`}
          >
            {primaryBadge}
          </span>
        ) : (
          <span className="text-[10px] text-neutral-600 font-mono tracking-wider uppercase">
            {product.origin}
          </span>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`p-1.5 rounded-full transition ${
            wishlisted
              ? 'text-red-500 bg-red-50'
              : 'text-neutral-400 hover:text-red-500 hover:bg-neutral-100'
          }`}
          title="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Bottle Image Canvas */}
      <div className="relative w-full h-48 sm:h-52 my-1 flex items-center justify-center p-2 rounded-xl bg-gradient-to-b from-neutral-50/60 to-neutral-100/60 group-hover:from-amber-50/30 group-hover:to-amber-100/20 transition duration-300 overflow-hidden">
        <ImageWithFallback
          src={product.imageUrl}
          alt={product.name}
          fallbackTitle={product.name}
          badgeText={product.subCategory}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />

        {/* Floating ABV pill */}
        <span className="absolute bottom-2 left-2 px-1.5 py-0.5 text-[10px] font-mono font-medium bg-neutral-900/80 text-white rounded backdrop-blur-xs">
          {product.abv}% ABV
        </span>

        {/* Rating */}
        <div className="absolute bottom-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/90 text-neutral-800 text-[10px] font-semibold shadow-xs">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span>{product.rating}</span>
        </div>
      </div>

      {/* Brand & Title */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] text-neutral-600 mb-0.5 font-medium">
          <span className="uppercase font-mono tracking-wider text-amber-700">
            {product.brandName}
          </span>
          <span className="text-neutral-600 text-[10px]">
            {product.subCategory}
          </span>
        </div>

        <h3 className="text-sm font-semibold text-neutral-900 leading-snug line-clamp-2 group-hover:text-amber-700 transition min-h-[2.5rem]">
          {product.name}
        </h3>
      </div>

      {/* Size Selector & Price */}
      <div className="mt-3 pt-2.5 border-t border-neutral-100">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          {/* Dynamic Bottle Size Dropdown */}
          <select
            value={selectedSizeIndex}
            onChange={handleSizeChange}
            onClick={(e) => e.stopPropagation()}
            className="text-xs bg-neutral-100 hover:bg-neutral-200/80 text-neutral-800 font-medium py-1 px-2 rounded-lg border border-neutral-300/80 focus:outline-none focus:border-amber-500 transition cursor-pointer"
          >
            {product.bottleSizes.map((sizeOpt, idx) => (
              <option key={sizeOpt.size} value={idx}>
                {sizeOpt.size}
              </option>
            ))}
          </select>

          {/* Pricing with original discount strike */}
          <div className="text-right">
            <div className="text-base font-bold font-mono text-neutral-900">
              ₹{selectedSize.price.toLocaleString('en-IN')}
            </div>
            {selectedSize.originalPrice && (
              <div className="text-[10px] font-mono text-neutral-600 line-through -mt-0.5">
                ₹{selectedSize.originalPrice.toLocaleString('en-IN')}
              </div>
            )}
          </div>
        </div>

        {/* Add to Cart Stepper */}
        {existingCartItem ? (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-between bg-neutral-900 text-white rounded-xl p-1"
          >
            <button
              onClick={() => updateQuantity(cartItemId, -1)}
              className="p-1 px-3 hover:bg-neutral-800 rounded-lg text-amber-400 transition"
              title="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs font-bold text-white px-2">
              {existingCartItem.quantity} in cart
            </span>
            <button
              onClick={() => updateQuantity(cartItemId, 1)}
              className="p-1 px-3 hover:bg-neutral-800 rounded-lg text-amber-400 transition"
              title="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className={`w-full py-2 px-3 rounded-xl text-xs font-semibold tracking-wide transition flex items-center justify-center gap-1.5 shadow-xs ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-neutral-950 hover:bg-amber-600 text-white group-hover:bg-amber-500 group-hover:text-neutral-950'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bar Cart</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
