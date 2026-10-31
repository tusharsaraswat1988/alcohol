import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingBag, 
  User as UserIcon, 
  MapPin, 
  Heart, 
  Sparkles, 
  LogOut, 
  ChevronDown, 
  ShieldAlert,
  SlidersHorizontal
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useAgeGate } from '../../context/AgeGateContext';
import { SearchModal } from '../search/SearchModal';

export const Header: React.FC = () => {
  const { totalItemCount, total, openCart } = useCart();
  const { user, isLoggedIn, openAuthModal, logout } = useAuth();
  const { selectedState, resetAgeVerification } = useAgeGate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0C0D12]/95 backdrop-blur-md border-b border-amber-500/20 text-white transition-all">
        {/* Top Compliance Ribbon */}
        <div className="bg-gradient-to-r from-[#171824] via-[#1F2130] to-[#171824] border-b border-neutral-800/80 py-1 px-4 text-center text-[11px] text-neutral-400 flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-1.5 text-amber-400/90 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>POUR Premier Reserve: Express Delivery in Bengaluru</span>
          </div>

          <div className="mx-auto sm:mx-0 flex items-center gap-4">
            <span className="text-amber-200/80">
              Region: <strong>{selectedState} (21+ Permitted)</strong>
            </span>
            <button
              onClick={resetAgeVerification}
              className="text-neutral-500 hover:text-amber-300 underline text-[10px]"
              title="Reset Age Verification Check"
            >
              Reset Age Gate
            </button>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-2 md:gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 p-[1px] shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                <div className="w-full h-full bg-[#0C0D12] rounded-[11px] flex items-center justify-center group-hover:bg-[#151722] transition">
                  <span className="font-serif font-black text-amber-400 text-lg md:text-xl">
                    P
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl md:text-2xl font-bold tracking-widest text-white group-hover:text-amber-200 transition">
                  POUR
                </span>
                <span className="text-[9px] font-mono tracking-widest uppercase text-amber-400/80 -mt-1 hidden sm:block">
                  Spirits & Cellar
                </span>
              </div>
            </Link>

            {/* Delivery Location Selector (Blinkit style badge) */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#161723] border border-neutral-800 text-xs text-neutral-300 hover:border-amber-500/40 transition cursor-pointer">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="text-left leading-tight">
                <div className="text-[10px] text-neutral-400 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>⚡ 28 Mins Express</span>
                </div>
                <div className="font-medium text-white truncate max-w-[130px]">
                  Indiranagar, BLR
                </div>
              </div>
            </div>

            {/* Search Input Trigger */}
            <div className="flex-1 max-w-xl mx-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center justify-between px-4 py-2 md:py-2.5 rounded-xl bg-[#161724] border border-neutral-800 hover:border-amber-500/40 text-neutral-400 text-xs md:text-sm shadow-inner transition group"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Search className="w-4 h-4 text-neutral-400 group-hover:text-amber-400 transition shrink-0" />
                  <span className="truncate">Search Scotch, Vodka, Gin, Wine, Beer...</span>
                </div>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 bg-neutral-800 rounded border border-neutral-700">
                  Ctrl K
                </kbd>
              </button>
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Catalog Link */}
              <Link
                to="/catalog"
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/60 transition"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                <span>Catalog</span>
              </Link>

              {/* Wishlist Icon */}
              <Link
                to="/account?tab=wishlist"
                className="relative p-2.5 rounded-xl text-neutral-300 hover:text-amber-300 hover:bg-neutral-800/60 transition hidden sm:flex"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {user && user.wishlistIds.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-500 text-neutral-950 font-bold text-[10px] flex items-center justify-center">
                    {user.wishlistIds.length}
                  </span>
                )}
              </Link>

              {/* User Account / Login */}
              {isLoggedIn && user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#161724] border border-neutral-800 hover:border-amber-500/30 text-xs text-neutral-200 transition"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 text-neutral-950 font-bold flex items-center justify-center text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <span className="font-medium hidden md:inline truncate max-w-[90px]">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3 h-3 text-neutral-400 hidden sm:block" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-[#151722] border border-neutral-800 rounded-xl shadow-2xl py-2 z-50 text-xs"
                      onMouseLeave={() => setIsUserMenuOpen(false)}
                    >
                      <div className="px-3 py-2 border-b border-neutral-800">
                        <div className="font-semibold text-white truncate">{user.name}</div>
                        <div className="text-[11px] text-neutral-400 font-mono truncate">
                          {user.mobile}
                        </div>
                      </div>
                      <Link
                        to="/account"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-3 py-2 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                      >
                        Account Dashboard
                      </Link>
                      <Link
                        to="/account?tab=orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-3 py-2 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                      >
                        My Orders
                      </Link>
                      <Link
                        to="/account?tab=addresses"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-3 py-2 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                      >
                        Saved Addresses
                      </Link>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 text-red-400 hover:bg-neutral-800/60 flex items-center gap-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={openAuthModal}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-[#1A1C28] border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 transition"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Shopping Cart Pill Button */}
              <button
                onClick={openCart}
                className="flex items-center gap-2 py-2 px-3 sm:px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 hover:brightness-110 active:scale-95 transition shadow-[0_2px_15px_rgba(212,175,55,0.3)] font-medium text-xs sm:text-sm"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  {totalItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-neutral-950 text-amber-300 text-[10px] font-bold font-mono px-1 rounded-full border border-amber-400">
                      {totalItemCount}
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col items-start leading-none text-[11px]">
                  <span>Cart</span>
                  {totalItemCount > 0 && (
                    <span className="font-mono font-bold text-[10px] -mt-0.5">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Overlay Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
