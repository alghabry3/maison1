import { Link } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, Heart, Palette, Truck } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useEffect, useRef } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useQuickTrack } from '../context/QuickTrackContext';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const { wishlistIds } = useWishlist();
  const { cartCount, cartTotal } = useCart();
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { openQuickTrack } = useQuickTrack();
  const [headerOrderId, setHeaderOrderId] = useState('');
  
  const themeMenuRef = useRef<HTMLDivElement>(null);

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
              <div className="absolute top-full mt-2 right-0 bg-brand-black border border-brand-gold/30 rounded shadow-xl py-2 w-32 z-50">
                <button onClick={() => { setTheme('default'); setShowThemeMenu(false); }} className={cn("w-full text-left px-4 py-1.5 hover:bg-brand-gold/20 transition-colors", theme === 'default' && 'text-white font-bold')}>{language === 'ar' ? 'الكلاسيكي' : 'Classic'}</button>
                <button onClick={() => { setTheme('winter'); setShowThemeMenu(false); }} className={cn("w-full text-left px-4 py-1.5 hover:bg-brand-gold/20 transition-colors", theme === 'winter' && 'text-white font-bold')}>{language === 'ar' ? 'الشتاء' : 'Winter'}</button>
                <button onClick={() => { setTheme('spring'); setShowThemeMenu(false); }} className={cn("w-full text-left px-4 py-1.5 hover:bg-brand-gold/20 transition-colors", theme === 'spring' && 'text-white font-bold')}>{language === 'ar' ? 'الربيع' : 'Spring'}</button>
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
        "transition-all duration-300 border-b",
        isScrolled ? "bg-brand-black/95 backdrop-blur-md border-brand-gold/30 shadow-sm py-3" : "bg-brand-black border-brand-gold/30 py-5"
      )}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
          
          {/* Mobile Menu & Right Nav Links */}
          <div className="flex items-center gap-4 lg:w-1/3">
            <button className="lg:hidden text-brand-ivory p-2 -ml-2">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden lg:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium text-brand-ivory hover:text-brand-gold transition-colors">{t('nav.home')}</Link>
              <Link to="/shop" className="text-sm font-medium text-brand-ivory hover:text-brand-gold transition-colors">{t('nav.shop')}</Link>
              {showWrapping && (
                <Link to="/wrapping-guide" className="text-sm font-medium text-brand-ivory hover:text-brand-gold transition-colors">{language === 'ar' ? 'دليل التغليف الفاخر' : 'Wrapping Guide'}</Link>
              )}
              <Link to="/gift-customization" className="text-sm font-medium text-brand-ivory hover:text-brand-gold transition-colors">{t('nav.gift')}</Link>
              <Link to="/gift-card" className="text-sm font-medium text-brand-ivory hover:text-brand-gold transition-colors">{language === 'ar' ? 'بطاقات إهداء' : 'Gift Cards'}</Link>
            </div>
          </div>

          {/* Logo */}
          <div className="flex-1 lg:w-1/3 flex justify-center text-center">
            <Link to="/" className="flex flex-col items-center group">
              <span className="font-serif text-xl md:text-2xl font-bold tracking-[0.1em] text-brand-gold group-hover:text-white transition-colors uppercase leading-none">
                {language === 'ar' ? storeNameAr : storeNameEn}
              </span>
              <span className="text-[7px] md:text-[9px] tracking-[0.2em] uppercase text-brand-ivory/60 mt-1 font-sans">
                {language === 'ar' ? 'شوكولاتة بلجيكية فاخرة' : 'Premium Belgian Chocolates'}
              </span>
            </Link>
          </div>

          {/* Actions & Left Nav Links */}
          <div className="flex items-center justify-end gap-6 lg:w-1/3 text-sm">
            <div className="hidden lg:flex items-center gap-6">
              <Link to="/shop?category=هدايا شركات" className="font-medium text-brand-ivory hover:text-brand-gold transition-colors">{language === 'ar' ? 'هدايا الشركات' : 'Corporate Gifts'}</Link>
              <Link to="/about" className="font-medium text-brand-ivory hover:text-brand-gold transition-colors">{language === 'ar' ? 'من نحن' : 'About Us'}</Link>
            </div>
            
            <div className={cn("relative flex items-center gap-2 lg:border-brand-gold/30", language === 'ar' ? 'pr-4 lg:border-r' : 'pl-4 lg:border-l')}>
              <span className="text-brand-gold hidden sm:block">{cartTotal.toFixed(2)} {language === 'ar' ? 'ر.س' : 'SAR'}</span>
              <button 
                id="header-quick-track-btn"
                onClick={() => openQuickTrack('')} 
                title={language === 'ar' ? 'تتبع سريع للطلب' : 'Quick Track Order'}
                className="w-10 h-10 border border-brand-gold/30 flex items-center justify-center rounded-full text-brand-gold hover:bg-brand-gold/10 transition-all duration-200 hover:scale-105"
              >
                <Truck className="w-5 h-5" />
              </button>
              <Link to="/profile" className="w-10 h-10 border border-brand-gold/30 flex items-center justify-center rounded-full text-brand-gold hover:bg-brand-gold/10 transition-colors">
                <User className="w-5 h-5" />
              </Link>
              <Link to="/wishlist" className="w-10 h-10 border border-brand-gold/30 flex items-center justify-center rounded-full text-brand-gold hover:bg-brand-gold/10 transition-colors relative">
                <Heart className="w-5 h-5" />
                {wishlistIds.length > 0 && (
                  <div className="absolute -top-1 -right-1 bg-brand-gold text-brand-black text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {wishlistIds.length}
                  </div>
                )}
              </Link>
              <Link to="/checkout" className="w-10 h-10 border border-brand-gold/30 flex items-center justify-center rounded-full text-brand-gold hover:bg-brand-gold/10 transition-colors relative">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-brand-brown text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </div>
                )}
              </Link>
            </div>
          </div>

        </div>
      </nav>
    </header>
  );
}
