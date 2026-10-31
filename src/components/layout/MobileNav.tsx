import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, Search, Heart, User, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { SearchModal } from '../search/SearchModal';

export const MobileNav: React.FC = () => {
  const { totalItemCount, total, openCart } = useCart();
  const { isLoggedIn, openAuthModal } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      {/* Floating Quick Cart Floating Pill on Mobile */}
      {totalItemCount > 0 && (
        <div className="fixed bottom-18 left-4 right-4 z-40 md:hidden animate-in slide-in-from-bottom-4 duration-200">
          <button
            onClick={openCart}
            className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-neutral-950 py-3 px-4 rounded-2xl shadow-[0_4px_25px_rgba(212,175,55,0.4)] flex items-center justify-between font-medium active:scale-[0.99] transition"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-neutral-950 text-amber-300 flex items-center justify-center text-xs font-mono font-bold">
                {totalItemCount}
              </div>
              <div className="text-left leading-tight">
                <div className="text-xs font-bold uppercase tracking-wider">
                  View Bar Cart
                </div>
                <div className="text-[10px] text-neutral-800 font-mono">
                  {totalItemCount} {totalItemCount === 1 ? 'bottle' : 'bottles'} selected
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 font-mono font-bold text-sm">
              <span>₹{total.toLocaleString('en-IN')}</span>
              <ShoppingBag className="w-4 h-4 ml-1" />
            </div>
          </button>
        </div>
      )}

      {/* Fixed Bottom Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#0C0D12]/95 backdrop-blur-lg border-t border-neutral-800 md:hidden pb-safe">
        <div className="flex items-center justify-around h-16 px-2 text-[10px] text-neutral-400 font-medium">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-1 transition ${
                isActive ? 'text-amber-400' : 'hover:text-neutral-200'
              }`
            }
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/catalog"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-1 transition ${
                isActive ? 'text-amber-400' : 'hover:text-neutral-200'
              }`
            }
          >
            <Grid className="w-5 h-5" />
            <span>Catalog</span>
          </NavLink>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-col items-center gap-1 p-1 hover:text-neutral-200 transition"
          >
            <Search className="w-5 h-5" />
            <span>Search</span>
          </button>

          <NavLink
            to="/account?tab=wishlist"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-1 transition ${
                isActive ? 'text-amber-400' : 'hover:text-neutral-200'
              }`
            }
          >
            <Heart className="w-5 h-5" />
            <span>Wishlist</span>
          </NavLink>

          {isLoggedIn ? (
            <NavLink
              to="/account"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 p-1 transition ${
                  isActive ? 'text-amber-400' : 'hover:text-neutral-200'
                }`
              }
            >
              <User className="w-5 h-5" />
              <span>Account</span>
            </NavLink>
          ) : (
            <button
              onClick={openAuthModal}
              className="flex flex-col items-center gap-1 p-1 text-amber-400/90 hover:text-amber-300 transition"
            >
              <User className="w-5 h-5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </nav>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
