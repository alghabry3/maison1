import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MOCK_PRODUCTS, CATEGORIES } from '../data';
import { ProductCard } from '../components/ProductCard';
import { Filter, SlidersHorizontal, ChevronDown, ArrowUpDown, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';

const categoryTranslations: Record<string, string> = {
  "الكل": "All Products",
  "شوكولاتة فاخرة": "Luxury Chocolate",
  "بوكسات هدايا": "Gift Boxes",
  "مناسبات": "Occasions",
  "صواني ضيافة": "Serving Trays",
  "هدايا شركات": "Corporate Gifts"
};

const sortTranslations: Record<string, Record<string, string>> = {
  default: {
    ar: 'الترتيب الافتراضي',
    en: 'Default Sorting'
  },
  popular: {
    ar: 'الأكثر شعبية',
    en: 'Most Popular'
  },
  price_asc: {
    ar: 'السعر: من الأقل للأعلى',
    en: 'Price: Low to High'
  },
  price_desc: {
    ar: 'السعر: من الأعلى للأقل',
    en: 'Price: High to Low'
  }
};

function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-black/5 flex flex-col h-full animate-pulse">
      <div className="aspect-[4/5] bg-brand-light-gray w-full relative"></div>
      <div className="p-4 md:p-6 flex flex-col flex-1">
        <div className="h-6 bg-brand-light-gray rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-brand-light-gray rounded w-1/4 mb-4"></div>
        
        <div className="mt-auto pt-4 border-t border-brand-black/5 flex items-center justify-between">
          <div className="h-3 bg-brand-light-gray rounded w-16"></div>
          <div className="h-4 bg-brand-light-gray rounded w-16"></div>
        </div>
      </div>
    </div>
  );
}

export function Shop() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'الكل';
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState('default');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [priceRanges, setPriceRanges] = useState<string[]>([]);
  const [showOnlyBestSellers, setShowOnlyBestSellers] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [activeCategory, sortOption, priceRanges, showOnlyBestSellers]);

  // 1. Filter by category
  let filteredProducts = activeCategory === 'الكل' 
    ? [...MOCK_PRODUCTS] 
    : MOCK_PRODUCTS.filter(p => p.category.includes(activeCategory));

  // 2. Filter by price ranges
  if (priceRanges.length > 0) {
    filteredProducts = filteredProducts.filter(p => {
      return priceRanges.some(range => {
        if (range === 'under200') return p.price < 200;
        if (range === '200to500') return p.price >= 200 && p.price <= 500;
        if (range === 'over500') return p.price > 500;
        return true;
      });
    });
  }

  // 3. Filter by popularity (Best Seller status)
  if (showOnlyBestSellers) {
    filteredProducts = filteredProducts.filter(p => p.isBestSeller);
  }

  // 4. Sort products
  if (sortOption === 'price_asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'price_desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortOption === 'popular') {
    filteredProducts.sort((a, b) => {
      if (a.isBestSeller && !b.isBestSeller) return -1;
      if (!a.isBestSeller && b.isBestSeller) return 1;
      return 0;
    });
  }

  const hasActiveFilters = activeCategory !== 'الكل' || priceRanges.length > 0 || showOnlyBestSellers || sortOption !== 'default';
  
  const resetAllFilters = () => {
    setActiveCategory('الكل');
    setSearchParams({});
    setPriceRanges([]);
    setShowOnlyBestSellers(false);
    setSortOption('default');
  };

  const handlePriceRangeChange = (range: string) => {
    setPriceRanges(prev => 
      prev.includes(range) 
        ? prev.filter(r => r !== range) 
        : [...prev, range]
    );
  };

  const shopTitle = language === 'ar'
    ? `${categoryTranslations[activeCategory] || 'المتجر'} | ميزون إتش`
    : `${categoryTranslations[activeCategory] || 'Boutique'} | Maison H`;
  const shopDesc = language === 'ar'
    ? `تصفح تشكيلة ميزون إتش الفاخرة من الشوكولاتة البلجيكية والسويسرية، بوكسات الهدايا، والمناسبات، وصواني الضيافة في الرياض.`
    : `Browse Maison H's premium selection of Belgian and Swiss chocolates, gift boxes, occasions, and serving trays in Riyadh.`;
  const shopUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="bg-brand-ivory min-h-screen pb-24">
      <Helmet>
        <title>{shopTitle}</title>
        <meta name="description" content={shopDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={shopTitle} />
        <meta property="og:description" content={shopDesc} />
        <meta property="og:url" content={shopUrl} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={shopTitle} />
        <meta name="twitter:description" content={shopDesc} />
        <meta name="keywords" content={language === 'ar'
          ? `شوكولاتة, حلويات, هدايا, بلجيكية, فاخرة, مناسبات, صواني ضيافة, ${activeCategory}`
          : `chocolate, premium, belgian, gifts, luxury, sweet, boutique, shop, ${activeCategory}`} 
        />
      </Helmet>
      {/* Page Header */}
      <div className="bg-brand-dark text-center py-24 px-4 relative overflow-hidden border-b border-brand-gold/20">
        <div className="absolute inset-0 z-0 opacity-20" style={{ background: 'radial-gradient(circle at 50% 0%, #8A5A3B 0%, transparent 70%)' }}></div>
        <div className="relative z-10">
          <h1 className="font-serif text-4xl md:text-5xl text-brand-ivory font-light mb-4 animate-slide-up">
            {language === 'ar' ? 'المتجر' : 'Boutique'}
          </h1>
          <p className="text-brand-gray max-w-2xl mx-auto font-light animate-slide-up">
            {language === 'ar' 
              ? 'تشكيلة واسعة من الشوكولاتة الفاخرة، والبوكسات المصممة لتلبي ذائقتكم.' 
              : 'A wide selection of luxury chocolates and exquisitely designed gift boxes to satisfy your taste.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Category Filter Pills & Premium Sorting Bar */}
        <div className="bg-white border border-brand-gold/15 rounded-md p-4 mb-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Pills */}
          <div className="flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth flex items-center gap-2.5 py-1">
            {CATEGORIES.map(category => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setSearchParams(category === 'الكل' ? {} : { category });
                    const el = document.getElementById('product-grid');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className={cn(
                    "whitespace-nowrap px-4 py-2.5 text-xs font-bold rounded-full border transition-all duration-300 cursor-pointer flex items-center gap-1.5",
                    isActive 
                      ? "bg-brand-brown text-white border-brand-brown shadow-sm scale-102" 
                      : "bg-brand-ivory/50 text-brand-gray border-brand-brown/10 hover:border-brand-gold hover:text-brand-brown hover:bg-white"
                  )}
                >
                  <span>{language === 'ar' ? category : categoryTranslations[category] || category}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-ping"></span>}
                </button>
              );
            })}
          </div>

          {/* Custom Sorting Dropdown */}
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="w-full md:w-56 bg-brand-ivory/40 hover:bg-white border border-brand-brown/15 rounded-md px-4 py-2.5 text-xs font-bold text-brand-black flex items-center justify-between gap-3 cursor-pointer transition-all duration-300 hover:border-brand-gold/60 active:scale-98"
            >
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-brand-gold" />
                <span>
                  {language === 'ar' 
                    ? sortTranslations[sortOption]?.ar 
                    : sortTranslations[sortOption]?.en}
                </span>
              </div>
              <ChevronDown className={cn("w-3.5 h-3.5 text-brand-gold transition-transform duration-300", isSortOpen && "rotate-180")} />
            </button>

            {isSortOpen && (
              <div className={cn(
                "absolute mt-2 w-56 bg-white border border-brand-gold/20 shadow-xl rounded-md z-40 py-1 font-sans text-xs divide-y divide-brand-brown/5 animate-fade-in",
                language === 'ar' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'
              )}>
                {Object.entries(sortTranslations).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSortOption(key);
                      setIsSortOpen(false);
                    }}
                    className={cn(
                      "w-full px-4 py-3 transition-all flex items-center justify-between cursor-pointer hover:bg-brand-ivory/30",
                      language === 'ar' ? "text-right flex-row-reverse" : "text-left",
                      sortOption === key ? "text-brand-brown bg-brand-gold/10 font-bold" : "text-brand-gray"
                    )}
                  >
                    <span className="font-medium">{language === 'ar' ? value.ar : value.en}</span>
                    {sortOption === key && <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-brand-ivory/50 border border-brand-brown/15 rounded-md py-3 text-xs font-bold text-brand-black transition-all cursor-pointer active:scale-98 shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-gold" />
            <span>{language === 'ar' ? 'خيارات الفرز والتصفية' : 'Filter & Sort Options'}</span>
            {(priceRanges.length > 0 || showOnlyBestSellers || activeCategory !== 'الكل') && (
              <span className="bg-brand-gold text-brand-black text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {(priceRanges.length > 0 ? 1 : 0) + (showOnlyBestSellers ? 1 : 0) + (activeCategory !== 'الكل' ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar / Filters */}
          <aside className={cn(
            "w-full lg:w-64 flex-shrink-0 space-y-8 bg-white lg:bg-transparent p-6 lg:p-0 rounded-md border border-brand-gold/10 lg:border-none shadow-xs lg:shadow-none transition-all duration-300",
            !isMobileFiltersOpen && "hidden lg:block"
          )}>
            
            {/* Sidebar Header with Clear All */}
            <div className="flex items-center justify-between pb-3 border-b border-brand-brown/15">
              <h2 className="font-serif text-lg font-semibold text-brand-black flex items-center gap-2">
                <Filter className="w-4 h-4 text-brand-gold" />
                <span>{language === 'ar' ? 'تصفية المنتجات' : 'Filter Products'}</span>
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="text-xs font-bold text-brand-gold hover:text-brand-brown hover:underline cursor-pointer"
                >
                  {language === 'ar' ? 'مسح الكل ×' : 'Clear All ×'}
                </button>
              )}
            </div>

            {/* Categories Selection */}
            <div>
              <div className="flex items-center gap-2 mb-3 font-serif text-base border-b border-brand-brown/5 pb-1.5">
                <SlidersHorizontal className="w-4 h-4 text-brand-gold" />
                <h3>{language === 'ar' ? 'التصنيفات' : 'Categories'}</h3>
              </div>
              <ul className="space-y-2.5">
                {CATEGORIES.map(category => {
                  const isSelected = activeCategory === category;
                  return (
                    <li key={category}>
                      <button
                        onClick={() => {
                          setActiveCategory(category);
                          setSearchParams(category === 'الكل' ? {} : { category });
                          const el = document.getElementById('product-grid');
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                          // Close drawer on mobile after selection
                          setIsMobileFiltersOpen(false);
                        }}
                        className={cn(
                          "text-xs font-semibold transition-all duration-300 hover:text-brand-brown w-full flex items-center justify-between py-0.5",
                          language === 'ar' ? "text-right" : "text-left",
                          isSelected ? "text-brand-brown font-bold pl-1" : "text-brand-gray"
                        )}
                      >
                        <span>{language === 'ar' ? category : categoryTranslations[category] || category}</span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Price Filter */}
            <div>
              <div className="flex items-center gap-2 mb-3 font-serif text-base border-b border-brand-brown/5 pb-1.5">
                <Filter className="w-4 h-4 text-brand-gold" />
                <h3>{language === 'ar' ? 'السعر' : 'Price'}</h3>
              </div>
              <div className="space-y-3.5 text-xs text-brand-gray">
                {[
                  { id: 'under200', ar: 'أقل من 200 ر.س', en: 'Less than 200 SAR' },
                  { id: '200to500', ar: '200 - 500 ر.س', en: '200 - 500 SAR' },
                  { id: 'over500', ar: 'أكثر من 500 ر.س', en: 'More than 500 SAR' }
                ].map(item => {
                  const isChecked = priceRanges.includes(item.id);
                  return (
                    <label key={item.id} className="flex items-center gap-3 cursor-pointer hover:text-brand-black transition-colors select-none">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handlePriceRangeChange(item.id)}
                          className="sr-only"
                        />
                        <div className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center transition-all duration-200",
                          isChecked ? "bg-brand-brown border-brand-brown text-white" : "border-brand-brown/30 bg-white"
                        )}>
                          {isChecked && <Check className="w-2.5 h-2.5 stroke-[3px]" />}
                        </div>
                      </div>
                      <span className={cn("font-medium", isChecked && "text-brand-brown font-semibold")}>
                        {language === 'ar' ? item.ar : item.en}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Popularity / Badges Filter */}
            <div>
              <div className="flex items-center gap-2 mb-3 font-serif text-base border-b border-brand-brown/5 pb-1.5">
                <span className="text-brand-gold text-lg leading-none">★</span>
                <h3>{language === 'ar' ? 'شعبية المنتج' : 'Popularity'}</h3>
              </div>
              <div className="space-y-3.5 text-xs text-brand-gray">
                <label className="flex items-center gap-3 cursor-pointer hover:text-brand-black transition-colors select-none">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={showOnlyBestSellers}
                      onChange={() => setShowOnlyBestSellers(!showOnlyBestSellers)}
                      className="sr-only"
                    />
                    <div className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center transition-all duration-200",
                      showOnlyBestSellers ? "bg-brand-brown border-brand-brown text-white" : "border-brand-brown/30 bg-white"
                    )}>
                      {showOnlyBestSellers && <Check className="w-2.5 h-2.5 stroke-[3px]" />}
                    </div>
                  </div>
                  <span className={cn("font-medium", showOnlyBestSellers && "text-brand-brown font-semibold")}>
                    {language === 'ar' ? 'الأكثر مبيعاً فقط' : 'Best Sellers Only'}
                  </span>
                </label>
              </div>
            </div>

            {/* Interactive Sort Options block inside Sidebar */}
            <div>
              <div className="flex items-center gap-2 mb-3 font-serif text-base border-b border-brand-brown/5 pb-1.5">
                <ArrowUpDown className="w-4 h-4 text-brand-gold" />
                <h3>{language === 'ar' ? 'ترتيب حسب' : 'Sort By'}</h3>
              </div>
              <div className="space-y-3 text-xs text-brand-gray">
                {Object.entries(sortTranslations).map(([key, value]) => {
                  const isSelected = sortOption === key;
                  return (
                    <label key={key} className="flex items-center gap-3 cursor-pointer hover:text-brand-black transition-colors select-none">
                      <div className="relative flex items-center">
                        <input
                          type="radio"
                          name="sidebar-sort-options"
                          checked={isSelected}
                          onChange={() => setSortOption(key)}
                          className="sr-only"
                        />
                        <div className={cn(
                          "w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200",
                          isSelected ? "border-brand-brown" : "border-brand-brown/30 bg-white"
                        )}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-brand-brown animate-fade-in" />}
                        </div>
                      </div>
                      <span className={cn("font-medium", isSelected && "text-brand-brown font-bold")}>
                        {language === 'ar' ? value.ar : value.en}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

          </aside>

          {/* Product Grid */}
          <div className="flex-1" id="product-grid">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-brand-brown/10">
              <p className="text-sm font-semibold text-brand-gray">
                {language === 'ar' 
                  ? `تم العثور على ${filteredProducts.length} منتج` 
                  : `Found ${filteredProducts.length} premium products`}
              </p>
              
              {/* Reset all filters helper link */}
              {hasActiveFilters && (
                <button 
                  onClick={resetAllFilters}
                  className="text-xs font-bold text-brand-gold hover:text-brand-brown hover:underline cursor-pointer flex items-center gap-1 bg-brand-gold/10 px-2.5 py-1 rounded-md"
                >
                  <span>{language === 'ar' ? 'إعادة تعيين الفلاتر ×' : 'Reset All Filters ×'}</span>
                </button>
              )}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {isLoading
                ? Array.from({ length: 6 }).map((_, idx) => (
                    <ProductCardSkeleton key={idx} />
                  ))
                : filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
            </div>

            {!isLoading && filteredProducts.length === 0 && (
              <div className="text-center py-20 text-brand-gray">
                <p>{language === 'ar' ? 'عفواً، لا توجد منتجات تطابق بحثك.' : 'Sorry, no products match your search.'}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
