import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MOCK_PRODUCTS, CATEGORIES } from '../data';
import { ProductCard } from '../components/ProductCard';
import { Filter, SlidersHorizontal, ChevronDown, ArrowUpDown } from 'lucide-react';
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
    }, 800);
    return () => clearTimeout(timer);
  }, [activeCategory, sortOption]);

  let filteredProducts = activeCategory === 'الكل' 
    ? [...MOCK_PRODUCTS] 
    : MOCK_PRODUCTS.filter(p => p.category.includes(activeCategory));

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

  return (
    <div className="bg-brand-ivory min-h-screen pb-24">
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
                      "w-full px-4 py-3 transition-all flex items-center justify-between cursor-pointer hover:bg-brand-ivory/30 text-left",
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

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar / Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4 font-serif text-xl border-b border-brand-brown/10 pb-2">
                <SlidersHorizontal className="w-5 h-5 text-brand-gold" />
                <h2>{language === 'ar' ? 'التصنيفات' : 'Categories'}</h2>
              </div>
              <ul className="space-y-3">
                {CATEGORIES.map(category => (
                  <li key={category}>
                    <button
                      onClick={() => {
                        setActiveCategory(category);
                        setSearchParams(category === 'الكل' ? {} : { category });
                        const el = document.getElementById('product-grid');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-brand-brown w-full flex items-center justify-between",
                        language === 'ar' ? "text-right" : "text-left",
                        activeCategory === category ? "text-brand-brown font-bold" : "text-brand-gray"
                      )}
                    >
                      <span>{language === 'ar' ? category : categoryTranslations[category] || category}</span>
                      {activeCategory === category && <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Other filters can go here (Price, occasion, etc.) */}
            <div>
              <div className="flex items-center gap-2 mb-4 font-serif text-xl border-b border-brand-brown/10 pb-2">
                <Filter className="w-5 h-5 text-brand-gold" />
                <h2>{language === 'ar' ? 'السعر' : 'Price'}</h2>
              </div>
              <div className="space-y-3 text-sm text-brand-gray">
                <label className="flex items-center gap-2 cursor-pointer hover:text-brand-black transition-colors">
                  <input type="checkbox" className="accent-brand-brown w-4 h-4 rounded border-brand-brown/30" />
                  {language === 'ar' ? 'أقل من 200 ر.س' : 'Less than 200 SAR'}
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-brand-black transition-colors">
                  <input type="checkbox" className="accent-brand-brown w-4 h-4 rounded border-brand-brown/30" />
                  {language === 'ar' ? '200 - 500 ر.س' : '200 - 500 SAR'}
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-brand-black transition-colors">
                  <input type="checkbox" className="accent-brand-brown w-4 h-4 rounded border-brand-brown/30" />
                  {language === 'ar' ? 'أكثر من 500 ر.س' : 'More than 500 SAR'}
                </label>
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
              
              {/* Reset category helper link */}
              {activeCategory !== 'الكل' && (
                <button 
                  onClick={() => {
                    setActiveCategory('الكل');
                    setSearchParams({});
                  }}
                  className="text-xs font-bold text-brand-gold hover:text-brand-brown hover:underline cursor-pointer"
                >
                  {language === 'ar' ? 'إعادة تعيين الفلتر ×' : 'Reset Category ×'}
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
