import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    changeItemSize,
    removeFromCart,
    clearCart,
    subtotal,
    tax,
    packagingFee,
    deliveryFee,
    discount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    total,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success?: boolean; message?: string }>({});
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const result = applyCoupon(couponInput);
    setCouponFeedback(result);
    if (result.success) setCouponInput('');
  };

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#111219] border-l border-neutral-800 text-white flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-[#151722]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="font-serif text-lg font-bold tracking-wide text-amber-100">
                Your Bar Cart
              </h2>
              <span className="text-xs bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded-full border border-amber-500/30">
                {items.reduce((acc, i) => acc + i.quantity, 0)} items
              </span>
            </div>
            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-neutral-400 hover:text-red-400 transition underline mr-2"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={closeCart}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Content */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4 text-amber-400/60">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-neutral-200 mb-1">
                Your cart is currently dry
              </h3>
              <p className="text-xs text-neutral-400 mb-6 max-w-xs">
                Explore rare single malts, crisp vodkas, artisanal gins, and vintage wines.
              </p>
              <button
                onClick={() => {
                  closeCart();
                  navigate('/catalog');
                }}
                className="py-2.5 px-6 rounded-xl text-sm font-medium bg-amber-500 hover:bg-amber-400 text-neutral-950 transition active:scale-95 shadow-[0_2px_15px_rgba(212,175,55,0.25)]"
              >
                Explore Spirits Catalog
              </button>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-neutral-800/60">
                {items.map((item) => (
                  <div key={item.cartItemId} className="pt-3 first:pt-0 flex gap-3.5">
                    {/* Bottle thumbnail */}
                    <div className="w-16 h-20 bg-neutral-900/90 rounded-xl p-1.5 border border-neutral-800 shrink-0 flex items-center justify-center">
                      <ImageWithFallback
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fallbackTitle={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <span className="text-[10px] font-mono tracking-wider text-amber-400/90 uppercase block">
                            {item.product.brandName}
                          </span>
                          <h4 className="text-sm font-medium text-white truncate max-w-[190px]">
                            {item.product.name}
                          </h4>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-neutral-500 hover:text-red-400 p-1 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Bottle Size Selector in Cart */}
                      <div className="mt-1 flex items-center gap-2">
                        <label className="text-[11px] text-neutral-400">Size:</label>
                        <select
                          value={item.selectedSize}
                          onChange={(e) => changeItemSize(item.cartItemId, e.target.value)}
                          className="bg-neutral-900 text-amber-200 border border-neutral-700 rounded px-1.5 py-0.5 text-xs focus:outline-none focus:border-amber-400"
                        >
                          {item.product.bottleSizes.map((opt) => (
                            <option key={opt.size} value={opt.size}>
                              {opt.size} (₹{opt.price.toLocaleString('en-IN')})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity & Item Total */}
                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex items-center border border-neutral-700 bg-neutral-900 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, -1)}
                            className="p-1 px-2 text-neutral-400 hover:text-white transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-mono font-medium text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, 1)}
                            className="p-1 px-2 text-neutral-400 hover:text-white transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-sm font-semibold font-mono text-amber-300">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Bar */}
              <div className="p-3 bg-[#151722] border-t border-neutral-800">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-700/50 p-2 rounded-xl text-xs text-emerald-300">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Code <strong>{appliedCoupon}</strong> active</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[11px] text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-neutral-400" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Coupon (e.g. POURFIRST)"
                        className="w-full bg-[#1A1C28] border border-neutral-700 rounded-lg pl-8 pr-2 py-1.5 text-xs text-white uppercase placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-medium rounded-lg text-amber-300 transition"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponFeedback.message && (
                  <p
                    className={`text-[11px] mt-1 ${
                      couponFeedback.success ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {couponFeedback.message}
                  </p>
                )}
              </div>

              {/* Price Breakdown Footer */}
              <div className="p-4 bg-[#0E0F16] border-t border-neutral-800 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                  <span className="font-mono text-neutral-200">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>State Excise & GST (5%)</span>
                  <span className="font-mono text-neutral-200">₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Tamper-proof Vault Packaging</span>
                  <span className="font-mono text-neutral-200">₹{packagingFee}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Express Delivery (Indiranagar)</span>
                  <span className="font-mono text-neutral-200">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-400 font-semibold">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Coupon Savings</span>
                    <span className="font-mono">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-neutral-800 flex justify-between items-center text-sm">
                  <span className="font-serif font-bold text-amber-100">Total Payable:</span>
                  <span className="font-mono font-bold text-base text-amber-300">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 px-4 rounded-xl font-medium tracking-wide bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-neutral-950 hover:brightness-110 active:scale-[0.99] transition shadow-[0_4px_20px_rgba(212,175,55,0.25)] flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-500 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span>Licensed state distributors • Contactless 21+ verification</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
