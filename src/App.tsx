import React, { useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { HelmetProvider } from 'react-helmet-async';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { GiftCustomization } from './pages/GiftCustomization';
import { GiftCard } from './pages/GiftCard';
import { Checkout } from './pages/Checkout';
import { AdminDashboard } from './pages/AdminDashboard';
import { TrackOrder } from './pages/TrackOrder';
import { Wishlist } from './pages/Wishlist';
import { Profile } from './pages/Profile';
import { WrappingGuide } from './pages/WrappingGuide';
import { Help } from './pages/Help';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { CompareProvider } from './context/CompareContext';
import { CompareWidget } from './components/CompareWidget';
import { WhatsAppButton } from './components/WhatsAppButton';
import { QuickTrackProvider } from './context/QuickTrackContext';
import { QuickTrackModal } from './components/QuickTrackModal';

import { ThemeProvider } from './context/ThemeContext';

import { FloatingNav } from './components/FloatingNav';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useLayoutEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // Instantly reset scroll to top across all viewport levels
      window.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
      
      // Ensure smooth alignment transition after paint
      const performScroll = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
        document.body.scrollTo({ top: 0, behavior: 'smooth' });
      };

      performScroll();
      const t1 = setTimeout(performScroll, 50);
      const t2 = setTimeout(performScroll, 150);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [pathname, hash]);
  return null;
}

function AppContent() {
  const showCompare = localStorage.getItem('odoo-show-compare') !== 'false';
  const showWhatsapp = localStorage.getItem('odoo-show-whatsapp') !== 'false';
  const font = localStorage.getItem('odoo-font') || 'Tajawal';
  const location = useLocation();

  useLayoutEffect(() => {
    // Dynamic Font application
    const fontStyle = 
      font === 'Cairo' ? '"Cairo", sans-serif' : 
      font === 'Inter' ? '"Inter", sans-serif' : 
      '"Tajawal", sans-serif';
    document.body.style.fontFamily = fontStyle;
  }, [font]);

  return (
    <>
      <ScrollToTop />
      <Routes location={location}>
        <Route path="/admin" element={
          <motion.div
            key="admin"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="w-full flex-1 flex flex-col"
          >
            <AdminDashboard />
          </motion.div>
        } />
        <Route
          path="/*"
          element={
            <div className="flex flex-col min-h-screen bg-brand-black text-brand-ivory font-sans transition-colors duration-500">
              <Header />
              <main className="flex-1 pt-[104px] flex flex-col">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
                    className="w-full flex-1 flex flex-col"
                  >
                    <Routes location={location}>
                      <Route path="/" element={<Home />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/gift-customization" element={<GiftCustomization />} />
                      <Route path="/wrapping-guide" element={<WrappingGuide />} />
                      <Route path="/gift-card" element={<GiftCard />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/track-order" element={<TrackOrder />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/help" element={<Help />} />
                    </Routes>
                  </motion.div>
                </AnimatePresence>
              </main>
              {showCompare && <CompareWidget />}
              {showWhatsapp && <WhatsAppButton />}
              <FloatingNav />
              <Footer />
              <QuickTrackModal />
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <LanguageProvider>
          <CartProvider>
            <WishlistProvider>
              <CompareProvider>
                <QuickTrackProvider>
                  <Router>
                    <AppContent />
                  </Router>
                </QuickTrackProvider>
              </CompareProvider>
            </WishlistProvider>
          </CartProvider>
        </LanguageProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

