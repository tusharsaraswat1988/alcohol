import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Wine, Sparkles, Award, Heart, CheckCircle2 } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { BRANDS } from '../../data/brands';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#08090C] border-t border-amber-500/20 text-neutral-400 text-xs pb-20 md:pb-8">
      {/* Upper Features Strip */}
      <div className="border-b border-neutral-800/80 bg-[#0E0F15]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">100% Authentic Vault</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">Sourced directly from licensed distillers</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">28 Mins Express</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">Temperature-sealed express delivery</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Wine className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Multi-Brand Cart</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">Scotch, vodka, tequila in a single order</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">21+ Legal Compliance</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">Strict age and ID verification</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-300 p-[1px]">
                <div className="w-full h-full bg-[#08090C] rounded-[7px] flex items-center justify-center">
                  <span className="font-serif font-black text-amber-400 text-base">P</span>
                </div>
              </div>
              <span className="font-serif text-2xl font-bold tracking-widest text-white">
                POUR
              </span>
            </Link>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              POUR is India’s foremost multi-brand spirits marketplace prototype, redefining luxury home cellar curation, discovery, and instant delivery.
            </p>
            <div className="p-3 bg-[#13141E] border border-amber-500/20 rounded-xl max-w-sm">
              <span className="text-amber-300 font-mono text-[11px] font-semibold block mb-1">
                ⚠️ Legal Notice & Prototype Disclaimer:
              </span>
              <p className="text-[10px] text-neutral-400 leading-normal">
                This website is strictly a UI/UX demonstration prototype. Products, brands, and transactions are simulated. Do not consume alcohol below the legal age limit.
              </p>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h5 className="font-serif font-semibold text-white text-sm mb-3 text-amber-200">
              Explore Spirits
            </h5>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/catalog?category=${cat.id}`}
                    className="hover:text-amber-300 transition"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/catalog" className="text-amber-400 hover:underline font-medium">
                  View Full Catalog →
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Brands */}
          <div>
            <h5 className="font-serif font-semibold text-white text-sm mb-3 text-amber-200">
              Iconic Houses
            </h5>
            <ul className="space-y-2">
              {BRANDS.slice(0, 6).map((b) => (
                <li key={b.id}>
                  <Link
                    to={`/catalog?brand=${b.id}`}
                    className="hover:text-amber-300 transition"
                  >
                    {b.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Journey */}
          <div>
            <h5 className="font-serif font-semibold text-white text-sm mb-3 text-amber-200">
              Prototype Journey
            </h5>
            <ul className="space-y-2">
              <li>
                <Link to="/catalog" className="hover:text-white transition">
                  Dynamic Filters
                </Link>
              </li>
              <li>
                <Link to="/checkout" className="hover:text-white transition">
                  Multi-Step Checkout
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-white transition">
                  VIP Account & Addresses
                </Link>
              </li>
              <li>
                <Link to="/order-tracking/POUR-892104" className="hover:text-white transition">
                  Live Delivery Tracker
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Responsible Drinking Banner */}
        <div className="mt-12 pt-6 border-t border-neutral-800 text-center text-xs text-neutral-500">
          <p className="font-mono tracking-widest uppercase text-amber-400/70 text-[11px] mb-1">
            BE RESPONSIBLE. DON’T DRINK AND DRIVE.
          </p>
          <p className="text-[10px]">
            Alcohol consumption is injurious to health. Sales prohibited to individuals under legal drinking age.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-6 text-[11px] text-neutral-500">
            <span>© 2026 POUR Spirits Inc.</span>
            <span>•</span>
            <span>UI/UX Demonstration Prototype</span>
            <span>•</span>
            <span>Terms of Demo</span>
            <span>•</span>
            <span>Privacy Simulation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
