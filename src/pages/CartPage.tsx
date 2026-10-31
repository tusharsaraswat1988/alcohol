import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  Tag, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const CartPage: React.FC = () => {
  const {
    items,
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

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const result = applyCoupon(couponInput);
    setCouponFeedback(result);
    if (result.success) setCouponInput('');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 py-16 px-4 flex items-center justify-center">
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 md:p-12 text-center max-w-md w-full shadow-xs">
          <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-2">
            Your Bar Cart is Empty
          </h2>
          <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
            Discover rare single malts, crisp vodkas, artisanal gins, and chilled beers. Add items from multiple brands in one single order.
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold bg-neutral-950 hover:bg-amber-600 text-white transition text-xs uppercase tracking-wider"
          >
            <span>Explore Spirits Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-extrabold text-neutral-900">
              Shopping Bar Cart
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Multi-brand unified order • {items.reduce((a, b) => a + b.quantity, 0)} bottles selected
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-red-600 hover:underline font-medium"
          >
            Clear Entire Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Items Table */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 shadow-xs divide-y divide-neutral-100">
              {items.map((item) => (
                <div key={item.cartItemId} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-24 bg-neutral-50 rounded-xl p-2 border border-neutral-200 shrink-0 flex items-center justify-center">
                      <ImageWithFallback
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fallbackTitle={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono tracking-wider uppercase text-amber-700 font-bold block">
                        {item.product.brandName}
                      </span>
                      <h3 className="font-medium text-sm text-neutral-900">
                        {item.product.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-neutral-500">Bottle Size:</span>
                        <select
                          value={item.selectedSize}
                          onChange={(e) => changeItemSize(item.cartItemId, e.target.value)}
                          className="bg-neutral-100 text-neutral-800 text-xs font-semibold py-0.5 px-2 rounded-lg border border-neutral-200 focus:outline-none focus:border-amber-500"
                        >
                          {item.product.bottleSizes.map((opt) => (
                            <option key={opt.size} value={opt.size}>
                              {opt.size} (₹{opt.price.toLocaleString('en-IN')})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:self-center">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-neutral-200 bg-neutral-50 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, -1)}
                        className="p-1.5 hover:bg-white rounded-lg text-neutral-600 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-xs font-bold px-3">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, 1)}
                        className="p-1.5 hover:bg-white rounded-lg text-neutral-600 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="font-mono font-bold text-base text-neutral-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        ₹{item.price} each
                      </span>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-neutral-400 hover:text-red-600 p-1 transition"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-700 hover:text-neutral-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Adding More Bottles</span>
              </Link>
            </div>
          </div>

          {/* Right Summary Panel */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="font-serif text-lg font-bold text-neutral-900 pb-2 border-b border-neutral-100">
                Order Bill Summary
              </h3>

              {/* Promo Coupon */}
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-2xl">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between text-xs text-emerald-800">
                    <span className="font-semibold">Code {appliedCoupon} Applied</span>
                    <button
                      onClick={removeCoupon}
                      className="text-red-600 underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coupon (e.g. POURFIRST)"
                      className="flex-1 bg-white border border-neutral-200 rounded-xl px-3 py-1.5 text-xs uppercase placeholder-neutral-400 focus:outline-none focus:border-amber-500 font-mono"
                    />
                    <button
                      type="submit"
                      className="py-1.5 px-3 rounded-xl bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponFeedback.message && (
                  <p className="text-[11px] text-amber-700 mt-1">
                    {couponFeedback.message}
                  </p>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs divide-y divide-neutral-100 pt-1">
                <div className="flex justify-between py-1 text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-mono text-neutral-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 text-neutral-600">
                  <span>State Excise & GST (5%)</span>
                  <span className="font-mono text-neutral-900">₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 text-neutral-600">
                  <span>Tamper-Proof Seal Box</span>
                  <span className="font-mono text-neutral-900">₹{packagingFee}</span>
                </div>
                <div className="flex justify-between py-1 text-neutral-600">
                  <span>Express Delivery</span>
                  <span className="font-mono text-neutral-900">
                    {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${deliveryFee}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between py-1 text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span className="font-mono">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                <span className="font-serif font-bold text-base text-neutral-900">Total Payable:</span>
                <span className="font-mono font-bold text-2xl text-amber-700">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[10px] text-neutral-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>21+ Mandatory verification upon delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
