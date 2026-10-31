import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Wine, 
  Award, 
  ChevronRight,
  TrendingUp,
  Flame,
  Crown
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { BRANDS } from '../data/brands';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/catalog/ProductCard';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Curated product slices
  const trendingProducts = PRODUCTS.filter((p) => p.popular || p.badges?.includes('Trending')).slice(0, 8);
  const bestsellers = PRODUCTS.filter((p) => p.badges?.includes('Bestseller')).slice(0, 8);
  const rareReserves = PRODUCTS.filter((p) => p.badges?.includes('Rare Reserve') || p.badges?.includes('Staff Pick')).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#0C0D12] text-white">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#141622] via-[#0E0F17] to-[#0C0D12] pt-8 pb-16 md:py-20 border-b border-amber-500/20">
        {/* Ambient glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-purple-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono tracking-wider uppercase">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Premier Multi-Brand Spirits Marketplace</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Curate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">Private Cellar</span> in Minutes.
              </h1>

              <p className="text-neutral-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Explore rare Scotch malts, vintage wines, craft gins, and iconic vodkas. Combine multiple premium brands into a single order with guaranteed 28-minute express delivery.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => navigate('/catalog')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-neutral-950 hover:brightness-110 active:scale-95 transition shadow-[0_4px_25px_rgba(212,175,55,0.35)] flex items-center justify-center gap-2 text-sm tracking-wide"
                >
                  <span>Explore Full Spirits Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('/catalog?category=whisky')}
                  className="w-full sm:w-auto px-6 py-4 rounded-xl font-medium bg-[#1A1C2A] hover:bg-[#232638] text-amber-200 border border-neutral-700/80 transition text-sm flex items-center justify-center gap-2"
                >
                  <Wine className="w-4 h-4 text-amber-400" />
                  <span>Single Malt Reserves</span>
                </button>
              </div>

              {/* Delivery & Trust Metrics */}
              <div className="pt-6 border-t border-neutral-800/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <div className="font-mono text-xl sm:text-2xl font-bold text-amber-300">28 Mins</div>
                  <div className="text-[11px] text-neutral-400">Chilled Express Delivery</div>
                </div>
                <div>
                  <div className="font-mono text-xl sm:text-2xl font-bold text-amber-300">50+ Brands</div>
                  <div className="text-[11px] text-neutral-400">Single Unified Bar Cart</div>
                </div>
                <div>
                  <div className="font-mono text-xl sm:text-2xl font-bold text-amber-300">100%</div>
                  <div className="text-[11px] text-neutral-400">Distillery Authentic</div>
                </div>
              </div>
            </div>

            {/* Right Hero Showcase Cards */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-gradient-to-b from-[#1B1D2B] to-[#11121A] border border-amber-500/30 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono text-emerald-400 font-medium">LIVE SOMMELIER VAULT</span>
                  </div>
                  <span className="text-xs text-neutral-400 font-mono">Bengaluru Hub</span>
                </div>

                {/* Featured Bottle Card Preview */}
                <div className="py-6 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-amber-500/10 blur-2xl rounded-full" />
                  <img
                    src="https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=600&q=80"
                    alt="Johnnie Walker Blue Label"
                    className="h-64 object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.8)] relative z-10 hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-semibold">
                      Featured Reserve
                    </span>
                    <span className="text-xs font-mono bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                      Rare Cask
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white">
                    Johnnie Walker Blue Label
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    1 in 10,000 casks hand-selected for extraordinary depth and velvety smoke.
                  </p>

                  <div className="pt-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-500 block">750 ML Bottle</span>
                      <span className="font-mono text-lg font-bold text-amber-300">₹21,500</span>
                    </div>
                    <button
                      onClick={() => navigate('/product/jw-blue-label')}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY */}
      <section className="py-14 bg-[#0F1017] border-b border-neutral-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cellar Collections</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Shop By Category
              </h2>
            </div>
            <Link
              to="/catalog"
              className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1 group transition"
            >
              <span>View All 10 Categories</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/catalog?category=${cat.id}`}
                className="group relative h-40 sm:h-48 rounded-2xl overflow-hidden border border-neutral-800 hover:border-amber-500/60 transition-all duration-300 shadow-lg flex flex-col justify-end p-4 bg-neutral-900"
              >
                {/* Background photo */}
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-75"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                <div className="relative z-10">
                  <h3 className="font-serif font-bold text-white text-base group-hover:text-amber-300 transition">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5 group-hover:text-neutral-200">
                    <span>Explore</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. POPULAR BRANDS */}
      <section className="py-12 bg-[#0C0D12] border-b border-neutral-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-mono tracking-widest uppercase text-amber-400">
              Distinguished Houses
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
              Popular Global Brands
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Select any house to explore their signature bottles and limited reserves.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {BRANDS.slice(0, 12).map((brand) => (
              <Link
                key={brand.id}
                to={`/catalog?brand=${brand.id}`}
                className="p-4 rounded-xl bg-[#131520] border border-neutral-800/90 hover:border-amber-500/50 hover:bg-[#1A1C2C] transition-all text-center group flex flex-col items-center justify-center min-h-[90px]"
              >
                <span className="font-serif font-bold text-sm text-neutral-200 group-hover:text-amber-300 transition leading-snug">
                  {brand.name}
                </span>
                <span className="text-[10px] font-mono text-neutral-500 mt-1">
                  {brand.origin}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. LIGHT BACKGROUND PRODUCT BROWSING: TRENDING SPIRITS */}
      <section className="py-14 bg-[#F8F9FB] text-neutral-900 border-b border-neutral-300/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-amber-700 mb-1">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>Connoisseur Picks</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
                Trending Spirits Right Now
              </h2>
              <p className="text-xs text-neutral-600 mt-1">
                Top rated and most purchased bottles across single malts, gins, and rums this week.
              </p>
            </div>
            <Link
              to="/catalog"
              className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1 group"
            >
              <span>Explore All Spirits</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. PROMOTIONAL CURATED COLLECTIONS BANNER */}
      <section className="py-16 bg-[#11121A] relative overflow-hidden border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1E202F] to-[#141520] border border-amber-500/30 flex flex-col justify-between min-h-[220px]">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-semibold">
                  Scotch Reserve
                </span>
                <h3 className="font-serif text-xl font-bold text-white mt-1">
                  Single Malt Horizons
                </h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  Glenfiddich, Macallan, and rare vintage scotches matured in sherry casks.
                </p>
              </div>
              <Link
                to="/catalog?category=whisky&sub=Single+Malt"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 mt-4"
              >
                <span>Browse Single Malts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1E202F] to-[#141520] border border-amber-500/30 flex flex-col justify-between min-h-[220px]">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-semibold">
                  Artisanal Botanicals
                </span>
                <h3 className="font-serif text-xl font-bold text-white mt-1">
                  Gin & Tonic Club
                </h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  Hendrick’s cucumber infusions, Bombay vapor infusions, and craft tonics.
                </p>
              </div>
              <Link
                to="/catalog?category=gin"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 mt-4"
              >
                <span>Discover Gins</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1E202F] to-[#141520] border border-amber-500/30 flex flex-col justify-between min-h-[220px]">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-semibold">
                  Celebrations
                </span>
                <h3 className="font-serif text-xl font-bold text-white mt-1">
                  Champagnes & Bruts
                </h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  Moët & Chandon Impérial, sparkling magnums, and French cuvées.
                </p>
              </div>
              <Link
                to="/catalog?category=champagne"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 mt-4"
              >
                <span>Explore Bubbles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BESTSELLERS (LIGHT BACKGROUND) */}
      <section className="py-14 bg-[#F8F9FB] text-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-amber-700 mb-1">
                <Crown className="w-4 h-4 text-amber-600" />
                <span>Customer Favorites</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
                All-Time Bestsellers
              </h2>
              <p className="text-xs text-neutral-600 mt-1">
                The most beloved bottles in India: Johnnie Walker, Absolut, Old Monk, and Corona.
              </p>
            </div>
            <Link
              to="/catalog"
              className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1 group"
            >
              <span>View Entire Cellar</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
