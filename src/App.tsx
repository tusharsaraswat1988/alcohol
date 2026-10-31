import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AgeGateProvider } from './context/AgeGateContext';
import { AuthProvider } from './context/AuthContext';
import { AddressProvider } from './context/AddressContext';
import { CartProvider } from './context/CartContext';

import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { AgeGateModal } from './components/age-gate/AgeGateModal';

import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AccountPage } from './pages/AccountPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Scroll to top helper on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export function App() {
  return (
    <AgeGateProvider>
      <AuthProvider>
        <AddressProvider>
          <CartProvider>
            <Router>
              <ScrollToTop />
              <div className="min-h-screen flex flex-col bg-[#0C0D12] text-white selection:bg-amber-500 selection:text-neutral-950 font-sans">
                {/* Global Header */}
                <Header />

                {/* Main Content Area */}
                <div className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/catalog" element={<CatalogPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-tracking/:id" element={<OrderTrackingPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </div>

                {/* Global Footer */}
                <Footer />

                {/* Mobile Bottom Navigation */}
                <MobileNav />

                {/* Global Overlays & Modals */}
                <CartDrawer />
                <AuthModal />
                <AgeGateModal />
              </div>
            </Router>
          </CartProvider>
        </AddressProvider>
      </AuthProvider>
    </AgeGateProvider>
  );
}

export default App;
