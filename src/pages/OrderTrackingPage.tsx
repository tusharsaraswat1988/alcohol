import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  PackageCheck, 
  PhoneCall, 
  Printer, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { INITIAL_ORDERS } from '../data/mockUserData';
import { Order } from '../types';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Attempt to load from localStorage placed orders, or fallback to mock seed orders
  const [order, setOrder] = useState<Order>(() => {
    try {
      const placed = JSON.parse(localStorage.getItem('pour_placed_orders') || '[]');
      const found = placed.find((o: Order) => o.id === id);
      if (found) return found;
    } catch {
      // Ignore
    }
    return INITIAL_ORDERS[0];
  });

  // Confetti burst on component mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F3E5AB', '#10B981', '#3B82F6'],
      });
    } catch {
      // Ignore if unavailable
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Success Banner */}
        <div className="bg-gradient-to-b from-[#141624] to-[#0D0E15] text-white border border-amber-500/30 rounded-3xl p-6 md:p-8 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-amber-500/10 blur-2xl rounded-full pointer-events-none" />

          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
            Order Confirmed & Vault Sealed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white mt-1">
            Thank You for Your Order
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto mt-2 leading-relaxed">
            Your spirits are being prepared with temperature-controlled vault packaging for 28-min express delivery in Bengaluru.
          </p>

          <div className="mt-6 inline-flex items-center gap-3 bg-[#1A1C2A] border border-neutral-700 px-4 py-2 rounded-xl text-xs font-mono">
            <span className="text-neutral-400">Order ID:</span>
            <span className="text-amber-300 font-bold">{order.id}</span>
            <span className="text-neutral-600">|</span>
            <span className="text-emerald-400 font-medium">{order.status}</span>
          </div>
        </div>

        {/* Live Delivery Timeline */}
        <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <h2 className="font-serif font-bold text-lg text-neutral-900">
                Live Delivery Status & Timeline
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              ⚡ ETA: 24 Minutes
            </span>
          </div>

          {/* Stepper Timeline */}
          <div className="relative border-l-2 border-neutral-200 ml-4 space-y-6 pl-6 pb-2">
            <div className="relative">
              <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
              <div className="font-bold text-xs text-neutral-900">Order Placed & Verified</div>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Payment received via {order.paymentMethod}. Government licensing check passed.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-amber-500 ring-4 ring-amber-100 animate-pulse" />
              <div className="font-bold text-xs text-neutral-900">Vault Dispatch in Progress</div>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Bottles sealed in tamper-evident thermal vault packs at Indiranagar Hub.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-neutral-300 ring-4 ring-neutral-100" />
              <div className="font-bold text-xs text-neutral-500">Delivery Partner Assigned</div>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Rider assigned with GPS live tracking and contactless 21+ OTP verification.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-neutral-300 ring-4 ring-neutral-100" />
              <div className="font-bold text-xs text-neutral-500">Out for Delivery</div>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                On the way to {order.address.flatNumber}, {order.address.street}.
              </p>
            </div>
          </div>

          {/* Simulated Delivery Partner Pill */}
          <div className="mt-6 p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-neutral-950 font-bold flex items-center justify-center text-sm font-mono">
                SK
              </div>
              <div>
                <div className="font-bold text-xs text-neutral-900">Suresh Kumar (Verified Courier)</div>
                <div className="text-[11px] text-neutral-500">Trained in 21+ Legal Handover & Secure Transport</div>
              </div>
            </div>

            <button
              onClick={() => alert('Simulated call to courier: +91 98765 00122')}
              className="py-1.5 px-3 rounded-xl bg-white border border-neutral-200 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 flex items-center gap-1.5 transition self-end sm:self-auto"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>Call Courier</span>
            </button>
          </div>
        </div>

        {/* Printable Order Receipt */}
        <div id="printable-receipt" className="bg-white border border-neutral-200/90 rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
            <div>
              <span className="font-serif text-xl font-bold tracking-widest text-neutral-900">
                POUR
              </span>
              <p className="text-[11px] font-mono text-neutral-500">
                Tax Invoice & Delivery Manifest
              </p>
            </div>

            <button
              onClick={handlePrint}
              className="py-2 px-3.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
          </div>

          {/* Details header */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-neutral-100 text-xs">
            <div>
              <span className="text-neutral-500 text-[10px] font-mono uppercase font-bold block mb-1">
                Delivered To:
              </span>
              <div className="font-semibold text-neutral-900">{order.address.fullName}</div>
              <p className="text-neutral-600 leading-relaxed">
                {order.address.flatNumber}, {order.address.street}
                {order.address.landmark ? `, ${order.address.landmark}` : ''}
                <br />
                {order.address.city}, {order.address.state} - {order.address.pincode}
              </p>
              <div className="font-mono text-neutral-500 mt-1">{order.address.mobile}</div>
            </div>

            <div className="sm:text-right">
              <span className="text-neutral-500 text-[10px] font-mono uppercase font-bold block mb-1">
                Order Metadata:
              </span>
              <div className="font-mono text-neutral-800">Date: {order.date}</div>
              <div className="font-mono text-neutral-800">Method: {order.paymentMethod}</div>
              <div className="font-mono text-neutral-800">Slot: {order.deliverySlot}</div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="py-4 divide-y divide-neutral-100 text-xs">
            {order.items.map((item) => (
              <div key={item.cartItemId} className="py-2.5 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-neutral-900">{item.product.name}</span>
                  <div className="text-[11px] text-neutral-500 font-mono">
                    {item.product.brandName} • {item.selectedSize} × {item.quantity}
                  </div>
                </div>
                <div className="font-mono font-bold text-neutral-900">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="pt-4 border-t border-neutral-200 text-xs space-y-1.5">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span className="font-mono text-neutral-900">₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>State Excise & Taxes</span>
              <span className="font-mono text-neutral-900">₹{order.tax.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Packaging & Express Delivery</span>
              <span className="font-mono text-neutral-900">₹{order.packagingFee + order.deliveryFee}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount</span>
                <span className="font-mono">-₹{order.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline font-bold text-sm text-neutral-900">
              <span>Total Paid:</span>
              <span className="font-mono text-lg text-amber-700">₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Back to Home CTA */}
        <div className="text-center pt-2">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 py-3 px-8 rounded-xl font-bold text-xs uppercase tracking-wider bg-neutral-950 hover:bg-neutral-800 text-white transition shadow-sm"
          >
            <span>Explore More Bottles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
