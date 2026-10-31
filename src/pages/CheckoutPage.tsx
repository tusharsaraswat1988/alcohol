import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, 
  ShoppingBag, 
  Clock, 
  CreditCard, 
  Check, 
  Plus, 
  Edit3, 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAddress } from '../context/AddressContext';
import { useAuth } from '../context/AuthContext';
import { Address, AddressType } from '../types';
import { PaymentGatewayModal } from '../components/payment/PaymentGatewayModal';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

const DELIVERY_SLOTS = [
  { id: 'express', label: '⚡ Express Delivery (Within 28 Mins)', time: 'Arriving by 7:15 PM today', fee: 'Free above ₹2000' },
  { id: 'evening', label: '🌙 Evening Twilight Slot (7:00 PM – 9:00 PM)', time: 'Scheduled for this evening', fee: 'Standard' },
  { id: 'tomorrow', label: '☀️ Tomorrow Afternoon (12:00 PM – 3:00 PM)', time: 'Scheduled for tomorrow', fee: 'Standard' },
];

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, tax, packagingFee, deliveryFee, discount, total, clearCart } = useCart();
  const { addresses, selectedAddress, selectAddress, addAddress, updateAddress } = useAddress();
  const { user, isLoggedIn, openAuthModal } = useAuth();

  // Checkout Steps: 1 Address -> 2 Summary -> 3 Delivery Slot -> 4 Payment
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedSlotId, setSelectedSlotId] = useState('express');
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);

  // Add / Edit address form state
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: user?.name || 'Arjun Sharma',
    mobile: user?.mobile || '+91 98765 43210',
    flatNumber: '',
    street: '',
    landmark: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    addressType: 'Home' as AddressType,
    isDefault: false,
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 py-20 px-4 flex items-center justify-center">
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 text-center max-w-md w-full shadow-xs">
          <ShoppingBag className="w-12 h-12 text-amber-600 mx-auto mb-3" />
          <h2 className="text-xl font-serif font-bold text-neutral-900 mb-1">Your cart is empty</h2>
          <p className="text-xs text-neutral-500 mb-6">Please add spirits before proceeding to checkout.</p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-950 text-white text-xs font-semibold"
          >
            Browse Spirits
          </Link>
        </div>
      </div>
    );
  }

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setFormData({
      fullName: user?.name || 'Arjun Sharma',
      mobile: user?.mobile || '+91 98765 43210',
      flatNumber: '',
      street: '',
      landmark: '',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      addressType: 'Home',
      isDefault: false,
    });
    setIsAddressFormOpen(true);
  };

  const handleEditAddress = (addr: Address) => {
    setEditingAddressId(addr.id);
    setFormData({
      fullName: addr.fullName,
      mobile: addr.mobile,
      flatNumber: addr.flatNumber,
      street: addr.street,
      landmark: addr.landmark || '',
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      addressType: addr.addressType,
      isDefault: addr.isDefault,
    });
    setIsAddressFormOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddressId) {
      updateAddress(editingAddressId, formData);
    } else {
      const created = addAddress(formData);
      selectAddress(created.id);
    }
    setIsAddressFormOpen(false);
  };

  const handlePaymentSuccess = (paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'COD', txnId: string) => {
    setIsGatewayOpen(false);

    // Generate dummy order ID
    const newOrderId = `POUR-${Math.floor(100000 + Math.random() * 900000)}`;

    const selectedSlotObj = DELIVERY_SLOTS.find((s) => s.id === selectedSlotId) || DELIVERY_SLOTS[0];

    const orderRecord = {
      id: newOrderId,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      items: [...items],
      subtotal,
      tax,
      packagingFee,
      deliveryFee,
      discount,
      total,
      address: selectedAddress || addresses[0],
      deliverySlot: selectedSlotObj.label,
      paymentMethod,
      status: 'Confirmed' as const,
      estimatedDelivery: 'Arriving in 28 minutes',
      timeline: [
        { status: 'Confirmed' as const, timestamp: 'Just now', completed: true, description: `Payment approved via ${paymentMethod} (${txnId})` },
        { status: 'Packing' as const, timestamp: 'In progress', completed: false, description: 'Vault packaging with thermal tamper-evident seal' },
        { status: 'Agent Assigned' as const, timestamp: 'Pending', completed: false, description: 'Verified delivery partner assigned' },
        { status: 'Out for Delivery' as const, timestamp: 'Pending', completed: false, description: 'On the way to your address' },
        { status: 'Delivered' as const, timestamp: 'Pending', completed: false, description: 'Contactless OTP handover' },
      ],
    };

    // Save order into localStorage for history tracking
    try {
      const existingOrders = JSON.parse(localStorage.getItem('pour_placed_orders') || '[]');
      localStorage.setItem('pour_placed_orders', JSON.stringify([orderRecord, ...existingOrders]));
    } catch {
      // Ignore
    }

    // Clear cart
    clearCart();

    // Navigate to order tracking
    navigate(`/order-tracking/${newOrderId}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-widest mb-1">
            <Link to="/cart" className="hover:text-amber-700">
              Cart
            </Link>
            <span>/</span>
            <span className="text-amber-800 font-semibold">Checkout</span>
          </div>
          <h1 className="font-serif text-3xl font-extrabold text-neutral-900">
            Secure Spirits Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Interactive Steps Accordion */}
          <div className="lg:col-span-8 space-y-6">
            {/* STEP 1: DELIVERY ADDRESS */}
            <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    activeStep > 1 ? 'bg-emerald-600 text-white' : 'bg-neutral-900 text-white'
                  }`}>
                    {activeStep > 1 ? <Check className="w-4 h-4" /> : '1'}
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-base text-neutral-900">
                      Step 1: Delivery Address
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Select or add where your spirits should be delivered
                    </p>
                  </div>
                </div>

                {activeStep > 1 && (
                  <button
                    onClick={() => setActiveStep(1)}
                    className="text-xs font-semibold text-amber-700 hover:underline"
                  >
                    Change Address
                  </button>
                )}
              </div>

              {activeStep === 1 && (
                <div className="pt-5 space-y-4">
                  {/* Address List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {addresses.map((addr) => {
                      const isSelected = selectedAddress?.id === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => selectAddress(addr.id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition relative flex flex-col justify-between ${
                            isSelected
                              ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500'
                              : 'border-neutral-200 hover:border-neutral-300 bg-white'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-800">
                                {addr.addressType}
                              </span>
                              {addr.isDefault && (
                                <span className="text-[10px] text-emerald-700 font-semibold font-mono">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="font-semibold text-sm text-neutral-900">
                              {addr.fullName}
                            </div>
                            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                              {addr.flatNumber}, {addr.street}
                              {addr.landmark ? `, ${addr.landmark}` : ''}
                              <br />
                              {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                            <div className="text-xs font-mono text-neutral-500 mt-2">
                              {addr.mobile}
                            </div>
                          </div>

                          <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditAddress(addr);
                              }}
                              className="text-neutral-500 hover:text-amber-800 flex items-center gap-1 font-medium"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            {isSelected && (
                              <span className="text-amber-800 font-bold flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" />
                                <span>Delivering Here</span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Add New Address Card Button */}
                    <button
                      type="button"
                      onClick={handleOpenAddAddress}
                      className="p-6 rounded-2xl border-2 border-dashed border-neutral-300 hover:border-amber-500 hover:bg-amber-50/30 transition flex flex-col items-center justify-center text-center text-neutral-600 min-h-[160px]"
                    >
                      <Plus className="w-6 h-6 text-amber-600 mb-1" />
                      <span className="text-xs font-bold text-neutral-800">
                        Add New Delivery Address
                      </span>
                      <span className="text-[11px] text-neutral-500 mt-0.5">
                        Apartment, office, or private venue
                      </span>
                    </button>
                  </div>

                  {/* Add / Edit Address Modal Form */}
                  {isAddressFormOpen && (
                    <form
                      onSubmit={handleSaveAddress}
                      className="mt-4 p-5 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-3"
                    >
                      <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-800">
                        {editingAddressId ? 'Edit Address' : 'New Address Details'}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full text-xs bg-white border border-neutral-300 rounded-lg p-2"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                            Mobile Number
                          </label>
                          <input
                            type="tel"
                            required
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            className="w-full text-xs bg-white border border-neutral-300 rounded-lg p-2 font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                            Flat / House / Building Number
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.flatNumber}
                            onChange={(e) => setFormData({ ...formData, flatNumber: e.target.value })}
                            placeholder="e.g. Penthouse 801, Prestige Palms"
                            className="w-full text-xs bg-white border border-neutral-300 rounded-lg p-2"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                            Street / Locality
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.street}
                            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                            placeholder="e.g. 100ft Road, Indiranagar"
                            className="w-full text-xs bg-white border border-neutral-300 rounded-lg p-2"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full text-xs bg-white border border-neutral-300 rounded-lg p-2"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                            State
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            className="w-full text-xs bg-white border border-neutral-300 rounded-lg p-2"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                            PIN Code
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.pincode}
                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                            className="w-full text-xs bg-white border border-neutral-300 rounded-lg p-2 font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="submit"
                          className="py-2 px-4 rounded-xl text-xs font-bold bg-neutral-900 text-white hover:bg-neutral-800 transition"
                        >
                          Save Address
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddressFormOpen(false)}
                          className="py-2 px-4 rounded-xl text-xs text-neutral-600 hover:text-neutral-900"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className="py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-neutral-950 transition flex items-center gap-2"
                    >
                      <span>Continue to Order Review</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 2: ORDER SUMMARY (MULTI-BRAND BREAKDOWN) */}
            <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    activeStep > 2 ? 'bg-emerald-600 text-white' : activeStep === 2 ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-600'
                  }`}>
                    {activeStep > 2 ? <Check className="w-4 h-4" /> : '2'}
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-base text-neutral-900">
                      Step 2: Multi-Brand Order Summary
                    </h2>
                    <p className="text-xs text-neutral-500">
                      {items.length} unique spirit selections from different brand houses
                    </p>
                  </div>
                </div>

                {activeStep > 2 && (
                  <button
                    onClick={() => setActiveStep(2)}
                    className="text-xs font-semibold text-amber-700 hover:underline"
                  >
                    Review Items
                  </button>
                )}
              </div>

              {activeStep === 2 && (
                <div className="pt-4 space-y-3">
                  <div className="divide-y divide-neutral-100">
                    {items.map((item) => (
                      <div key={item.cartItemId} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-14 bg-neutral-50 rounded-lg p-1 border border-neutral-200 flex items-center justify-center shrink-0">
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
                            <div className="text-xs font-semibold text-neutral-900">
                              {item.product.name}
                            </div>
                            <div className="text-[11px] text-neutral-500 font-mono">
                              Size: {item.selectedSize} • Qty: {item.quantity}
                            </div>
                          </div>
                        </div>

                        <span className="font-mono font-bold text-sm text-neutral-900">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-between items-center border-t border-neutral-100">
                    <button
                      onClick={() => setActiveStep(1)}
                      className="text-xs font-semibold text-neutral-600 hover:text-neutral-900"
                    >
                      ← Back to Address
                    </button>
                    <button
                      onClick={() => setActiveStep(3)}
                      className="py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-neutral-950 transition flex items-center gap-2"
                    >
                      <span>Choose Delivery Slot</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 3: DELIVERY PREFERENCES & SLOTS */}
            <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    activeStep > 3 ? 'bg-emerald-600 text-white' : activeStep === 3 ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-600'
                  }`}>
                    {activeStep > 3 ? <Check className="w-4 h-4" /> : '3'}
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-base text-neutral-900">
                      Step 3: Delivery Preferences & Schedule
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Choose instant 28-min express or schedule a twilight slot
                    </p>
                  </div>
                </div>

                {activeStep > 3 && (
                  <button
                    onClick={() => setActiveStep(3)}
                    className="text-xs font-semibold text-amber-700 hover:underline"
                  >
                    Change Slot
                  </button>
                )}
              </div>

              {activeStep === 3 && (
                <div className="pt-5 space-y-4">
                  <div className="space-y-3">
                    {DELIVERY_SLOTS.map((slot) => {
                      const isSelected = selectedSlotId === slot.id;
                      return (
                        <label
                          key={slot.id}
                          className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                            isSelected
                              ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-500'
                              : 'border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="delivery-slot"
                              checked={isSelected}
                              onChange={() => setSelectedSlotId(slot.id)}
                              className="text-amber-600 focus:ring-amber-500 w-4 h-4"
                            />
                            <div>
                              <div className="text-xs font-bold text-neutral-900">
                                {slot.label}
                              </div>
                              <div className="text-[11px] text-neutral-500 mt-0.5">
                                {slot.time}
                              </div>
                            </div>
                          </div>
                          <span className="text-[11px] font-mono font-medium text-emerald-700">
                            {slot.fee}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  <div className="pt-4 flex justify-between items-center border-t border-neutral-100">
                    <button
                      onClick={() => setActiveStep(2)}
                      className="text-xs font-semibold text-neutral-600 hover:text-neutral-900"
                    >
                      ← Back to Order Summary
                    </button>
                    <button
                      onClick={() => setActiveStep(4)}
                      className="py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-neutral-950 transition flex items-center gap-2"
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 4: SIMULATED PAYMENT SELECTION */}
            <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center gap-3 pb-4 border-b border-neutral-100">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  activeStep === 4 ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-600'
                }`}>
                  4
                </div>
                <div>
                  <h2 className="font-serif font-bold text-base text-neutral-900">
                    Step 4: Simulated Payment Interface
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Test the Razorpay / UPI sandbox simulator with success and failure edge cases
                  </p>
                </div>
              </div>

              {activeStep === 4 && (
                <div className="pt-5 space-y-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">Interactive Prototype Testing Active:</div>
                      <p className="mt-0.5 leading-relaxed">
                        Clicking the button below launches our simulated payment modal. You can inspect UPI, Card, Net Banking, and COD layouts, and trigger either <strong>Simulate Success</strong> or <strong>Simulate Failure</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setIsGatewayOpen(true)}
                      className="w-full py-4 px-6 rounded-2xl font-bold text-sm tracking-wide bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white hover:brightness-105 active:scale-95 transition shadow-[0_4px_25px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>Open Payment Simulator (₹{total.toLocaleString('en-IN')})</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Bill Breakdown Card */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 shadow-xs sticky top-24 space-y-4">
              <h3 className="font-serif text-lg font-bold text-neutral-900 pb-2 border-b border-neutral-100">
                Total Order Value
              </h3>

              <div className="space-y-2 text-xs divide-y divide-neutral-100">
                <div className="flex justify-between py-1 text-neutral-600">
                  <span>Subtotal ({items.reduce((a, b) => a + b.quantity, 0)} bottles)</span>
                  <span className="font-mono text-neutral-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 text-neutral-600">
                  <span>State Excise & GST (5%)</span>
                  <span className="font-mono text-neutral-900">₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 text-neutral-600">
                  <span>Tamper-proof Packaging</span>
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
                    <span>Discount Savings</span>
                    <span className="font-mono">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                <span className="font-serif font-bold text-base text-neutral-900">Grand Total:</span>
                <span className="font-mono font-bold text-2xl text-amber-700">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>

              {selectedAddress && (
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-neutral-500 font-mono text-[10px] uppercase font-bold">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>Delivering To:</span>
                  </div>
                  <div className="font-semibold text-neutral-900 truncate">
                    {selectedAddress.fullName}
                  </div>
                  <div className="text-neutral-600 text-[11px] truncate">
                    {selectedAddress.flatNumber}, {selectedAddress.street}
                  </div>
                </div>
              )}

              <div className="text-[10px] text-neutral-500 text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Simulated Secure Checkout • 21+ Age Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Payment Gateway Simulator Modal */}
      <PaymentGatewayModal
        isOpen={isGatewayOpen}
        onClose={() => setIsGatewayOpen(false)}
        orderTotal={total}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};
