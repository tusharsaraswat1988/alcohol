import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  User as UserIcon, 
  MapPin, 
  Package, 
  Heart, 
  Settings, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAddress } from '../context/AddressContext';
import { useCart } from '../context/CartContext';
import { INITIAL_ORDERS } from '../data/mockUserData';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/catalog/ProductCard';
import { Order, Address, AddressType } from '../types';

export const AccountPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const { user, isLoggedIn, logout, updateProfile, openAuthModal } = useAuth();
  const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddress();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Load orders from localStorage or fallback
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const placed = JSON.parse(localStorage.getItem('pour_placed_orders') || '[]');
      if (placed.length > 0) return [...placed, ...INITIAL_ORDERS];
      return INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Profile edit form state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || 'Arjun Sharma');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'arjun.sharma@example.com');
  const [profileMobile, setProfileMobile] = useState(user?.mobile || '+91 98765 43210');

  // Address modal form state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddrId, setEditingAddrId] = useState<string | null>(null);
  const [addrForm, setAddrForm] = useState({
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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileName,
      email: profileEmail,
      mobile: profileMobile,
    });
    setIsEditingProfile(false);
  };

  const handleOpenAddAddress = () => {
    setEditingAddrId(null);
    setAddrForm({
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
    setIsAddressModalOpen(true);
  };

  const handleEditAddr = (addr: Address) => {
    setEditingAddrId(addr.id);
    setAddrForm({
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
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddrId) {
      updateAddress(editingAddrId, addrForm);
    } else {
      addAddress(addrForm);
    }
    setIsAddressModalOpen(false);
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart(item.product, item.selectedSize, item.quantity);
    });
    navigate('/cart');
  };

  // Wishlist products
  const wishlistedProducts = PRODUCTS.filter((p) => user?.wishlistIds.includes(p.id));

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 py-16 px-4 flex items-center justify-center">
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 text-center max-w-md w-full shadow-xs">
          <UserIcon className="w-12 h-12 text-amber-600 mx-auto mb-3" />
          <h2 className="text-xl font-serif font-bold text-neutral-900 mb-1">Sign In to Your Account</h2>
          <p className="text-xs text-neutral-500 mb-6">
            View past orders, track live deliveries, and manage multiple delivery addresses.
          </p>
          <button
            onClick={openAuthModal}
            className="w-full py-3 px-6 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs uppercase tracking-wider"
          >
            Sign In with OTP
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* User Card Banner */}
        <div className="bg-[#111219] text-white rounded-3xl p-6 md:p-8 border border-neutral-800 shadow-xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-300 text-neutral-950 font-serif font-extrabold text-2xl flex items-center justify-center shadow-lg">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-white">{user.name}</h1>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded border border-amber-500/30">
                  VIP CONNOISSEUR
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">{user.mobile} • {user.email || 'No email attached'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-400 font-mono hidden md:inline">
              Member since 2026
            </span>
            <button
              onClick={logout}
              className="py-2 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-red-400 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tabs & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-3">
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-2 shadow-xs space-y-1">
              <button
                onClick={() => handleTabChange('profile')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'profile'
                    ? 'bg-neutral-950 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <UserIcon className="w-4 h-4 text-amber-500" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => handleTabChange('addresses')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'addresses'
                    ? 'bg-neutral-950 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>My Addresses ({addresses.length})</span>
              </button>

              <button
                onClick={() => handleTabChange('orders')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'orders'
                    ? 'bg-neutral-950 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <Package className="w-4 h-4 text-amber-500" />
                <span>My Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => handleTabChange('wishlist')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'wishlist'
                    ? 'bg-neutral-950 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <Heart className="w-4 h-4 text-amber-500" />
                <span>Saved Wishlist ({user.wishlistIds.length})</span>
              </button>
            </div>
          </aside>

          {/* Tab Content Panel */}
          <main className="lg:col-span-9">
            {/* 1. PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 md:p-8 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
                  <h2 className="font-serif font-bold text-lg text-neutral-900">
                    Personal Information
                  </h2>
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="text-xs font-semibold text-amber-700 hover:underline"
                  >
                    {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        value={profileMobile}
                        onChange={(e) => setProfileMobile(e.target.value)}
                        className="w-full text-xs p-2.5 border border-neutral-300 rounded-xl font-mono"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="py-2.5 px-6 rounded-xl bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider"
                    >
                      Save Changes
                    </button>
                  </form>
                ) : (
                  <div className="divide-y divide-neutral-100 text-xs">
                    <div className="py-3 flex justify-between">
                      <span className="text-neutral-500">Legal Full Name</span>
                      <span className="font-semibold text-neutral-900">{user.name}</span>
                    </div>
                    <div className="py-3 flex justify-between">
                      <span className="text-neutral-500">Primary Mobile</span>
                      <span className="font-mono text-neutral-900">{user.mobile}</span>
                    </div>
                    <div className="py-3 flex justify-between">
                      <span className="text-neutral-500">Email Address</span>
                      <span className="text-neutral-900">{user.email || 'Not provided'}</span>
                    </div>
                    <div className="py-3 flex justify-between">
                      <span className="text-neutral-500">Age Verification Status</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1 font-mono">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>21+ Verified</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 md:p-8 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
                  <div>
                    <h2 className="font-serif font-bold text-lg text-neutral-900">
                      Saved Delivery Addresses
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Manage locations for instant 28-min express courier routing
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddAddress}
                    className="py-2 px-3.5 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-200 text-neutral-800">
                            {addr.addressType}
                          </span>
                          {addr.isDefault ? (
                            <span className="text-[10px] text-emerald-700 font-bold font-mono">
                              ★ Default
                            </span>
                          ) : (
                            <button
                              onClick={() => setDefaultAddress(addr.id)}
                              className="text-[11px] text-neutral-400 hover:text-neutral-800 underline"
                            >
                              Set as default
                            </button>
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

                      <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between text-xs">
                        <button
                          onClick={() => handleEditAddr(addr)}
                          className="text-neutral-600 hover:text-neutral-900 font-medium flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        {addresses.length > 1 && (
                          <button
                            onClick={() => deleteAddress(addr.id)}
                            className="text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add / Edit Address Form Modal */}
                {isAddressModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <form
                      onSubmit={handleSaveAddress}
                      className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-neutral-200 space-y-3"
                    >
                      <h3 className="font-serif font-bold text-base text-neutral-900">
                        {editingAddrId ? 'Edit Address' : 'Add New Address'}
                      </h3>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={addrForm.fullName}
                          onChange={(e) => setAddrForm({ ...addrForm, fullName: e.target.value })}
                          className="w-full text-xs p-2 border border-neutral-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                          Mobile
                        </label>
                        <input
                          type="tel"
                          required
                          value={addrForm.mobile}
                          onChange={(e) => setAddrForm({ ...addrForm, mobile: e.target.value })}
                          className="w-full text-xs p-2 border border-neutral-300 rounded-lg font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                          Flat / House / Building
                        </label>
                        <input
                          type="text"
                          required
                          value={addrForm.flatNumber}
                          onChange={(e) => setAddrForm({ ...addrForm, flatNumber: e.target.value })}
                          className="w-full text-xs p-2 border border-neutral-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                          Street / Locality
                        </label>
                        <input
                          type="text"
                          required
                          value={addrForm.street}
                          onChange={(e) => setAddrForm({ ...addrForm, street: e.target.value })}
                          className="w-full text-xs p-2 border border-neutral-300 rounded-lg"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            required
                            value={addrForm.city}
                            onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                            className="w-full text-xs p-2 border border-neutral-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            PIN Code
                          </label>
                          <input
                            type="text"
                            required
                            value={addrForm.pincode}
                            onChange={(e) => setAddrForm({ ...addrForm, pincode: e.target.value })}
                            className="w-full text-xs p-2 border border-neutral-300 rounded-lg font-mono"
                          />
                        </div>
                      </div>

                      <div className="pt-3 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddressModalOpen(false)}
                          className="py-2 px-4 rounded-xl text-xs text-neutral-600"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="py-2 px-4 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs uppercase tracking-wider"
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* 3. ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
                <div className="pb-4 border-b border-neutral-100">
                  <h2 className="font-serif font-bold text-lg text-neutral-900">
                    Order History & Invoices
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Track shipments, view itemized tax receipts, or reorder favorite bottles
                  </p>
                </div>

                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-5 rounded-2xl border border-neutral-200 bg-white hover:border-amber-400/80 transition shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-100 gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-neutral-900">
                              {order.id}
                            </span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-900 font-mono px-2 py-0.5 rounded-full font-bold">
                              {order.status}
                            </span>
                          </div>
                          <span className="text-[11px] text-neutral-500 font-mono">
                            {order.date} • Paid via {order.paymentMethod}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <Link
                            to={`/order-tracking/${order.id}`}
                            className="py-1.5 px-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center gap-1 transition"
                          >
                            <span>Live Tracking</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>

                          <button
                            onClick={() => handleReorder(order)}
                            className="py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition"
                          >
                            Reorder
                          </button>
                        </div>
                      </div>

                      {/* Items row */}
                      <div className="py-3 space-y-2">
                        {order.items.map((item) => (
                          <div key={item.cartItemId} className="flex justify-between text-xs">
                            <span className="text-neutral-800">
                              {item.product.name} ({item.selectedSize}) × {item.quantity}
                            </span>
                            <span className="font-mono font-semibold text-neutral-900">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-neutral-100 flex justify-between items-center text-xs">
                        <span className="text-neutral-500">Delivered to: {order.address.street}</span>
                        <div className="font-mono font-bold text-sm text-neutral-900">
                          Total: ₹{order.total.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 md:p-8 shadow-xs">
                <div className="pb-4 border-b border-neutral-100 mb-6">
                  <h2 className="font-serif font-bold text-lg text-neutral-900">
                    Saved Spirits Wishlist
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Bottles you have bookmarked for your private cellar
                  </p>
                </div>

                {wishlistedProducts.length === 0 ? (
                  <div className="text-center py-12 text-neutral-500">
                    <Heart className="w-10 h-10 mx-auto text-neutral-300 mb-2" />
                    <p className="text-sm">No spirits saved to wishlist yet</p>
                    <Link
                      to="/catalog"
                      className="text-xs text-amber-700 font-semibold underline mt-2 inline-block"
                    >
                      Explore Catalog
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {wishlistedProducts.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
