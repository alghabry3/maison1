import { Link, useLocation } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, Heart, Palette, Truck, X, Globe, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useEffect, useRef } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useQuickTrack } from '../context/QuickTrackContext';

export function Header() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileThemeOpen, setMobileThemeOpen] = useState(false);
  const { wishlistIds } = useWishlist();
  const { cartCount, cartTotal } = useCart();
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { openQuickTrack } = useQuickTrack();
  const [headerOrderId, setHeaderOrderId] = useState('');
  const [isCartShaking, setIsCartShaking] = useState(false);
  const prevCartCountRef = useRef(cartCount);
  
  const themeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cartCount > prevCartCountRef.current) {
      setIsCartShaking(true);
      const timer = setTimeout(() => {
        setIsCartShaking(false);
      }, 600);
      return () => clearTimeout(timer);
    }
    prevCartCountRef.current = cartCount;
  }, [cartCount]);

  // Odoo Configs
  const showWrapping = localStorage.getItem('odoo-show-wrapping') !== 'false';
  const storeNameAr = localStorage.getItem('odoo-store-name-ar') || 'ميزون إتش (Maison H)';
  const storeNameEn = localStorage.getItem('odoo-store-name-en') || 'Maison H Chocolatier';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      {/* Top Banner */}
      <div className="h-12 bg-brand-dark border-b border-brand-gold/30 flex items-center justify-between px-4 md:px-8 text-[11px] tracking-wide relative">
        <div className="flex items-center space-x-6 space-x-reverse max-md:hidden">
          <Link to="/admin" className="bg-[#71639e] text-white px-2.5 py-1 rounded text-[10px] font-bold hover:bg-[#5E5186] transition-all flex items-center gap-1 shrink-0 shadow-sm mr-2 ml-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            <span>{language === 'ar' ? 'لوحة تحكم أودو ERP ⚙️' : 'Odoo ERP Dashboard ⚙️'}</span>
          </Link>
          <span>{language === 'ar' ? 'توصيل الرياض في نفس اليوم للطلبات قبل ٤ مساءً' : 'Same day Riyadh delivery for orders before 4 PM'}</span>
          <span className="opacity-50 text-[9px]">|</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>{language === 'ar' ? 'المتجر متاح الآن' : 'Store is open now'}</span>
          </div>
        </div>
        <div className="md:hidden flex-1 flex justify-between items-center px-1">
          <span className="text-[10px] text-brand-ivory/80">{language === 'ar' ? 'توصيل الرياض نفس اليوم' : 'Riyadh Same-day'}</span>
          <Link to="/admin" className="bg-[#71639e] text-white px-2.5 py-0.5 rounded text-[9px] font-bold shadow-xs flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-green-400"></span>
            <span>{language === 'ar' ? 'أودو ⚙️' : 'Odoo ⚙️'}</span>
          </Link>
        </div>
        <div className="flex items-center gap-4 text-brand-gold max-md:hidden">
          {/* Quick Track Input */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (headerOrderId.trim()) {
                openQuickTrack(headerOrderId);
                setHeaderOrderId('');
              }
            }}
            className="flex items-center gap-1.5 bg-brand-black/40 border border-brand-gold/30 px-2 py-0.5 rounded focus-within:border-brand-gold/75 transition-all text-[11px]"
          >
            <Truck className="w-3.5 h-3.5 text-brand-gold animate-bounce shrink-0" />
            <input 
              type="text"
              value={headerOrderId}
              onChange={(e) => setHeaderOrderId(e.target.value)}
              placeholder={language === 'ar' ? 'تتبع سريع...' : 'Quick Track...'}
              className="bg-transparent text-white placeholder-brand-gold/45 w-24 text-[10px] focus:outline-none uppercase font-bold text-center"
            />
          </form>
          <span>|</span>
          <div className="relative" ref={themeMenuRef}>
            <button 
              onClick={() => setShowThemeMenu(!showThemeMenu)} 
              className="flex items-center gap-1 hover:text-white transition-colors"
              aria-label="Toggle Theme"
            >
              <Palette className="w-3 h-3" />
              <span>{language === 'ar' ? 'المظهر' : 'Theme'}</span>
            </button>
            {showThemeMenu && (
              <div className="absolute top-full mt-2 right-0 bg-brand-black border border-brand-gold/30 rounded shadow-xl py-2 w-36 z-50">
                <button onClick={() => { setTheme('default'); setShowThemeMenu(false); }} className={cn("w-full text-left px-4 py-1.5 hover:bg-brand-gold/20 transition-colors text-xs", theme === 'default' && 'text-white font-bold')}>{language === 'ar' ? 'الكلاسيكي' : 'Classic'}</button>
                <button onClick={() => { setTheme('winter'); setShowThemeMenu(false); }} className={cn("w-full text-left px-4 py-1.5 hover:bg-brand-gold/20 transition-colors text-xs", theme === 'winter' && 'text-white font-bold')}>{language === 'ar' ? 'الشتاء' : 'Winter'}</button>
                <button onClick={() => { setTheme('spring'); setShowThemeMenu(false); }} className={cn("w-full text-left px-4 py-1.5 hover:bg-brand-gold/20 transition-colors text-xs", theme === 'spring' && 'text-white font-bold')}>{language === 'ar' ? 'الربيع' : 'Spring'}</button>
                <button onClick={() => { setTheme('eid'); setShowThemeMenu(false); }} className={cn("w-full text-left px-4 py-1.5 hover:bg-brand-gold/20 transition-colors text-xs", theme === 'eid' && 'text-white font-bold')}>{language === 'ar' ? 'العيد الفاخر' : 'Royal Eid'}</button>
                <button onClick={() => { setTheme('valentine'); setShowThemeMenu(false); }} className={cn("w-full text-left px-4 py-1.5 hover:bg-brand-gold/20 transition-colors text-xs", theme === 'valentine' && 'text-white font-bold')}>{language === 'ar' ? 'المخملي' : 'Velvet Valentine'}</button>
                <button onClick={() => { setTheme('corporate'); setShowThemeMenu(false); }} className={cn("w-full text-left px-4 py-1.5 hover:bg-brand-gold/20 transition-colors text-xs", theme === 'corporate' && 'text-white font-bold')}>{language === 'ar' ? 'الشركات الأنيق' : 'Sleek Corporate'}</button>
              </div>
            )}
          </div>
          <span>|</span>
          <button onClick={toggleLanguage} className="hover:text-white transition-colors">
            {language === 'ar' ? 'English' : 'العربية'}
          </button>
          <span>|</span>
          <Link to="/profile" className="hover:text-white transition-colors">
            {language === 'ar' ? 'حسابي' : 'My Account'}
          </Link>
        </div>
      </div>
      
      {/* Main Nav */}
      <nav className={cn(
        "transition-all duration-500 border-b",
        isScrolled 
          ? "bg-brand-black/98 backdrop-blur-lg border-brand-gold/30 shadow-2xl py-2" 
          : "bg-brand-black/95 border-brand-gold/20 py-4"
      )}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
          
          {/* Left Nav Links & Mobile Toggle button */}
          <div className="flex items-center gap-4 lg:w-1/3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-brand-ivory p-2 -ml-2 hover:text-brand-gold transition-colors"
              aria-label="Open Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Elegant Left Nav Links */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {[
                { path: '/', label: t('nav.home') },
                { path: '/shop', label: t('nav.shop') },
                ...(showWrapping ? [{ path: '/wrapping-guide', label: language === 'ar' ? 'دليل التغليف' : 'Wrapping Guide' }] : []),
                { path: '/gift-customization', label: t('nav.gift') },
                { path: '/gift-card', label: language === 'ar' ? 'بطاقات الإهداء' : 'Gift Cards' }
              ].map((link) => {
                const active = isActive(link.path);
                return (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    className={cn(
                      "text-[11px] xl:text-xs uppercase tracking-[0.18em] font-bold py-2 relative group transition-colors duration-300",
                      active ? "text-brand-gold" : "text-brand-ivory/85 hover:text-brand-gold"
                    )}
                  >
                    <span>{link.label}</span>
                    {/* Premium Sliding Underline */}
                    <span className={cn(
                      "absolute bottom-0 left-0 h-[1.5px] bg-brand-gold transition-all duration-300 origin-center",
                      active ? "w-full scale-x-100" : "w-full scale-x-0 group-hover:scale-x-100"
                    )} />
                    {/* Elegant Active Glow Point */}
                    {active && (
                      <span className="absolute -bottom-[2.5px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-gold shadow-[0_0_8px_#C8A46A] animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Logo Group - Luxury Crest & Typography */}
          <div className="flex-1 lg:w-1/3 flex justify-center text-center">
            <Link to="/" className="flex flex-col items-center group relative py-1">
              {/* Brand Crest */}
              <div className="relative flex items-center justify-center mb-1.5 transition-all duration-500 group-hover:scale-105">
                {/* Thin golden background radial glow */}
                <div className="absolute w-12 h-12 bg-brand-gold/5 rounded-full filter blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Double circular frames */}
                <div className="absolute w-9 h-9 rounded-full border border-brand-gold/30 group-hover:border-brand-gold/60 transition-colors duration-500" />
                <div className="absolute w-[30px] h-[30px] rounded-full border border-dashed border-brand-gold/40 animate-[spin_50s_linear_infinite]" />
                
                {/* Core monogram block */}
                <div className="w-6 h-6 rounded-full bg-brand-dark/95 border border-brand-gold flex items-center justify-center shadow-lg relative z-10">
                  <span className="font-serif text-[11px] font-black text-brand-gold tracking-normal">H</span>
                </div>

                {/* Star jewel pin decoration */}
                <div className="absolute -top-1 w-1 h-1 bg-brand-gold/85 rotate-45" />
                <div className="absolute -bottom-1 w-1 h-1 bg-brand-gold/85 rotate-45" />
              </div>

              {/* Brand Letters */}
              <div className="flex flex-col items-center">
                <span className="font-serif text-lg md:text-xl font-bold tracking-[0.2em] text-brand-gold group-hover:text-brand-ivory transition-colors duration-500 uppercase leading-none">
                  {language === 'ar' ? 'ميزون إتش' : 'MAISON H'}
                </span>
                <span className="text-[6.5px] md:text-[8px] tracking-[0.25em] uppercase text-brand-ivory/50 group-hover:text-brand-gold/85 transition-colors duration-500 mt-1.5 font-sans font-black">
                  {language === 'ar' ? 'شوكولاتة بلجيكية فاخرة' : 'PREMIUM BELGIAN CHOCOLATIER'}
                </span>
              </div>
            </Link>
          </div>

          {/* Right Nav Links & Actions */}
          <div className="flex items-center justify-end gap-6 lg:w-1/3 text-sm">
            
            {/* Elegant Right Nav Links */}
            <div className="hidden lg:flex items-center gap-6">
              {[
                { path: '/shop?category=هدايا شركات', label: language === 'ar' ? 'هدايا الشركات' : 'Corporate', isSpecial: true },
                { path: '/about', label: language === 'ar' ? 'من نحن' : 'About Us' }
              ].map((link) => {
                const active = isActive(link.path);
                return (
                  <Link 
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "text-[11px] uppercase tracking-[0.18em] font-bold py-2 relative group transition-colors duration-300 flex items-center gap-1",
                      active ? "text-brand-gold" : "text-brand-ivory/85 hover:text-brand-gold"
                    )}
                  >
                    {link.isSpecial && <Star className="w-2.5 h-2.5 text-brand-gold fill-brand-gold/20 mr-0.5 ml-0.5 animate-pulse" />}
                    <span>{link.label}</span>
                    <span className={cn(
                      "absolute bottom-0 left-0 h-[1.5px] bg-brand-gold transition-all duration-300 origin-center",
                      active ? "w-full scale-x-100" : "w-full scale-x-0 group-hover:scale-x-100"
                    )} />
                  </Link>
                );
              })}
            </div>
            
            {/* Action Buttons Group */}
            <div className={cn(
              "relative flex items-center gap-2.5 lg:border-brand-gold/20", 
              language === 'ar' ? 'pr-4 lg:border-r' : 'pl-4 lg:border-l'
            )}>
              <span className="text-brand-gold hidden sm:block font-serif text-xs font-bold tracking-wider">
                {cartTotal.toFixed(2)} {language === 'ar' ? 'ر.س' : 'SAR'}
              </span>
              
              {/* Track Order button */}
              <button 
                id="header-quick-track-btn"
                onClick={() => openQuickTrack('')} 
                title={language === 'ar' ? 'تتبع سريع للطلب' : 'Quick Track Order'}
                className="w-9 h-9 border border-brand-gold/25 hover:border-brand-gold/60 bg-brand-black/20 hover:bg-brand-gold/10 flex items-center justify-center rounded-full text-brand-gold hover:text-brand-ivory transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Truck className="w-4 h-4" />
              </button>

              {/* Profile button */}
              <Link 
                to="/profile" 
                title={language === 'ar' ? 'الملف الشخصي' : 'Profile'}
                className="w-9 h-9 border border-brand-gold/25 hover:border-brand-gold/60 bg-brand-black/20 hover:bg-brand-gold/10 flex items-center justify-center rounded-full text-brand-gold hover:text-brand-ivory transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <User className="w-4 h-4" />
              </Link>

              {/* Wishlist button */}
              <Link 
                to="/wishlist" 
                title={language === 'ar' ? 'المفضلة' : 'Wishlist'}
                className="w-9 h-9 border border-brand-gold/25 hover:border-brand-gold/60 bg-brand-black/20 hover:bg-brand-gold/10 flex items-center justify-center rounded-full text-brand-gold hover:text-brand-ivory transition-all duration-300 hover:scale-105 active:scale-95 relative"
              >
                <Heart className="w-4 h-4" />
                {wishlistIds.length > 0 && (
                  <div className="absolute -top-1 -right-1 bg-brand-gold text-brand-black text-[9px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-bold shadow-[0_0_6px_rgba(200,164,106,0.6)]">
                    {wishlistIds.length}
                  </div>
                )}
              </Link>

              {/* Checkout/Cart button */}
              <Link 
                to="/checkout" 
                title={language === 'ar' ? 'عربة التسوق' : 'Shopping Cart'}
                className={cn(
                  "w-9 h-9 border border-brand-gold/25 hover:border-brand-gold/60 bg-brand-black/20 flex items-center justify-center rounded-full text-brand-gold hover:text-brand-ivory transition-all duration-300 hover:scale-105 active:scale-95 relative",
                  isCartShaking && "animate-shake border-brand-gold bg-brand-gold/25 text-white shadow-[0_0_15px_rgba(200,164,106,0.6)]"
                )}
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <div className={cn(
                    "absolute -top-1 -right-1 bg-brand-brown text-white text-[9px] w-4.5 h-4.5 flex items-center justify-center rounded-full transition-all duration-300",
                    isCartShaking && "scale-120 bg-brand-gold text-brand-black font-bold"
                  )}>
                    {cartCount}
                  </div>
                )}
              </Link>
            </div>
          </div>

        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-brand-black/85 backdrop-blur-md transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Drawer Content */}
          <div className={cn(
            "relative w-80 max-w-[80vw] h-full bg-brand-black border-brand-gold/20 flex flex-col shadow-2xl z-10 transition-all duration-300 overflow-y-auto p-6 text-brand-ivory",
            language === 'ar' ? 'mr-auto border-l' : 'ml-auto border-r'
          )}>
            {/* Header with Brand Crest */}
            <div className="flex items-center justify-between border-b border-brand-gold/10 pb-5 mb-6">
              <div className="flex items-center gap-3">
                {/* Mini Crest Emblem */}
                <div className="relative flex items-center justify-center w-8 h-8 shrink-0">
                  <div className="absolute w-8 h-8 rounded-full border border-brand-gold/30" />
                  <div className="absolute w-6.5 h-6.5 rounded-full border border-dashed border-brand-gold/25" />
                  <div className="w-5 h-5 rounded-full bg-brand-dark border border-brand-gold/80 flex items-center justify-center text-[10px] font-serif font-black text-brand-gold">
                    H
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <span className="font-serif text-base font-bold tracking-[0.12em] text-brand-gold uppercase leading-tight">
                    {language === 'ar' ? 'ميزون إتش' : 'MAISON H'}
                  </span>
                  <span className="text-[7px] tracking-[0.2em] uppercase text-brand-ivory/50 mt-0.5 font-bold">
                    {language === 'ar' ? 'شوكولاتة بلجيكية فاخرة' : 'BELGIAN CHOCOLATIER'}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full border border-brand-gold/20 flex items-center justify-center text-brand-gold hover:bg-brand-gold/10 hover:text-brand-ivory transition-all cursor-pointer"
                aria-label="Close Menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Track Input */}
            <div className="mb-6">
              <span className="text-[10px] uppercase tracking-wider text-brand-gold/60 block mb-2 font-bold">
                {language === 'ar' ? 'التتبع السريع للطلب' : 'Quick Track Order'}
              </span>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (headerOrderId.trim()) {
                    openQuickTrack(headerOrderId);
                    setHeaderOrderId('');
                    setIsMobileMenuOpen(false);
                  }
                }}
                className="flex items-center gap-2 bg-brand-dark/90 border border-brand-gold/20 px-3 py-2 rounded focus-within:border-brand-gold/60 transition-all shadow-inner"
              >
                <Truck className="w-3.5 h-3.5 text-brand-gold shrink-0 animate-pulse" />
                <input 
                  type="text"
                  value={headerOrderId}
                  onChange={(e) => setHeaderOrderId(e.target.value)}
                  placeholder={language === 'ar' ? 'رقم الطلب (ORD-XXXX)...' : 'Order ID (ORD-XXXX)...'}
                  className="bg-transparent text-white placeholder-brand-gold/30 text-xs focus:outline-none uppercase font-bold w-full"
                />
              </form>
            </div>

            {/* Main Navigation Links */}
            <div className="flex flex-col gap-2.5 border-b border-brand-gold/10 pb-6 mb-6">
              <span className="text-[10px] uppercase tracking-wider text-brand-gold/60 font-bold mb-1.5 block">
                {language === 'ar' ? 'تصفح الأقسام' : 'Explore Collections'}
              </span>
              
              {[
                { path: '/', label: t('nav.home'), icon: '✨' },
                { path: '/shop', label: t('nav.shop'), icon: '🍫' },
                ...(showWrapping ? [{ path: '/wrapping-guide', label: language === 'ar' ? 'دليل التغليف الفاخر' : 'Wrapping Guide', icon: '🎁' }] : []),
                { path: '/gift-customization', label: t('nav.gift'), icon: '🎨' },
                { path: '/gift-card', label: language === 'ar' ? 'بطاقات إهداء' : 'Gift Cards', icon: '✉️' },
                { path: '/shop?category=هدايا شركات', label: language === 'ar' ? 'هدايا الشركات' : 'Corporate Gifts', icon: '🏢' },
                { path: '/about', label: language === 'ar' ? 'من نحن' : 'About Us', icon: '⚜️' }
              ].map((link) => {
                const active = isActive(link.path);
                return (
                  <Link 
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "text-xs font-bold transition-all duration-300 py-3 px-4 rounded-lg flex items-center justify-between border",
                      active 
                        ? "bg-brand-gold/10 text-brand-gold border-brand-gold/40 shadow-sm" 
                        : "bg-brand-dark/20 text-brand-ivory/90 border-brand-gold/5 hover:border-brand-gold/20 hover:bg-brand-dark/40"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm opacity-90">{link.icon}</span>
                      <span className="tracking-wide">{link.label}</span>
                    </div>
                    {active ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shadow-[0_0_8px_#C8A46A]" />
                    ) : (
                      <span className="text-brand-gold/40 text-[10px] group-hover:translate-x-1 transition-transform">→</span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Account / Support Quick Actions */}
            <div className="flex flex-col gap-4 border-b border-brand-gold/10 pb-6 mb-6">
              <span className="text-[10px] uppercase tracking-wider text-brand-gold/60 font-semibold mb-1">
                {language === 'ar' ? 'حسابك ومساعدتك' : 'Your Account & Help'}
              </span>
              <Link 
                to="/profile" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm text-brand-ivory/90 hover:text-brand-gold transition-colors flex items-center gap-2"
              >
                <User className="w-4 h-4 text-brand-gold" />
                <span>{language === 'ar' ? 'حسابي الشخصي' : 'My Account'}</span>
              </Link>
              <Link 
                to="/wishlist" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm text-brand-ivory/90 hover:text-brand-gold transition-colors flex items-center gap-2"
              >
                <Heart className="w-4 h-4 text-brand-gold" />
                <span>{language === 'ar' ? 'قائمة المفضلة' : 'Wishlist'} ({wishlistIds.length})</span>
              </Link>
              <Link 
                to="/checkout" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm text-brand-ivory/90 hover:text-brand-gold transition-colors flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-brand-gold" />
                <span>{language === 'ar' ? 'السلة والمتابعة للشراء' : 'Cart & Checkout'} ({cartCount})</span>
              </Link>
            </div>

            {/* Theme and Language Switchers inside mobile menu */}
            <div className="flex flex-col gap-4">
              <span className="text-[10px] uppercase tracking-wider text-brand-gold/60 font-semibold mb-1">
                {language === 'ar' ? 'الإعدادات والمظهر' : 'Settings & Aesthetics'}
              </span>
              
              {/* Language toggle */}
              <button 
                onClick={() => {
                  toggleLanguage();
                  setIsMobileMenuOpen(false);
                }} 
                className="flex items-center gap-2 text-sm text-brand-ivory/90 hover:text-brand-gold transition-colors text-left"
              >
                <Globe className="w-4 h-4 text-brand-gold" />
                <span>{language === 'ar' ? 'English (تغيير اللغة)' : 'العربية (Change Language)'}</span>
              </button>

              {/* Theme customizer in drawer */}
              <div className="flex flex-col gap-2 mt-2">
                <button 
                  onClick={() => setMobileThemeOpen(!mobileThemeOpen)}
                  className="flex items-center justify-between text-sm text-brand-ivory/90 hover:text-brand-gold transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-brand-gold" />
                    <span>{language === 'ar' ? 'تغيير المظهر الموسمي' : 'Seasonal Theme'}</span>
                  </div>
                  <span className="text-[10px] text-brand-gold uppercase font-bold bg-brand-gold/10 px-2 py-0.5 rounded">
                    {theme === 'default' ? (language === 'ar' ? 'الكلاسيكي' : 'Classic') : theme}
                  </span>
                </button>
                
                {mobileThemeOpen && (
                  <div className="grid grid-cols-2 gap-2 mt-1 bg-brand-dark/50 p-2.5 rounded border border-brand-gold/10">
                    {[
                      { id: 'default', ar: 'الكلاسيكي', en: 'Classic' },
                      { id: 'winter', ar: 'الشتاء', en: 'Winter' },
                      { id: 'spring', ar: 'الربيع', en: 'Spring' },
                      { id: 'eid', ar: 'العيد الملكي', en: 'Royal Eid' },
                      { id: 'valentine', ar: 'المخملي', en: 'Velvet Valentine' },
                      { id: 'corporate', ar: 'الشركات الأنيق', en: 'Sleek Corporate' }
                    ].map((tItem) => (
                      <button
                        key={tItem.id}
                        onClick={() => {
                          setTheme(tItem.id as any);
                          setIsMobileMenuOpen(false);
                        }}
                        className={cn(
                          "px-2 py-1.5 rounded text-[11px] text-center transition-all border",
                          theme === tItem.id 
                            ? "bg-brand-gold text-brand-black font-bold border-brand-gold" 
                            : "bg-brand-black/30 text-brand-ivory/85 border-brand-gold/15 hover:border-brand-gold/40"
                        )}
                      >
                        {language === 'ar' ? tItem.ar : tItem.en}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Credit */}
            <div className="mt-auto pt-8 text-center text-[10px] text-brand-ivory/40 border-t border-brand-gold/5">
              <span>© {new Date().getFullYear()} {language === 'ar' ? storeNameAr : storeNameEn}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
