import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MOCK_PRODUCTS, CATEGORIES } from '../data';
import { ProductCard } from '../components/ProductCard';
import { Filter, SlidersHorizontal } from 'lucide-react';
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
          <h1 className="font-serif text-4xl md:text-5xl text-brand-ivory font-light mb-4">
            {language === 'ar' ? 'المتجر' : 'Boutique'}
          </h1>
          <p className="text-brand-gray max-w-2xl mx-auto font-light">
            {language === 'ar' 
              ? 'تشكيلة واسعة من الشوكولاتة الفاخرة، والبوكسات المصممة لتلبي ذائقتكم.' 
              : 'A wide selection of luxury chocolates and exquisitely designed gift boxes to satisfy your taste.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
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
              <p className="text-sm text-brand-gray">
                {language === 'ar' 
                  ? `عرض ${filteredProducts.length} منتج` 
                  : `Showing ${filteredProducts.length} products`}
              </p>
              <select 
                className="bg-transparent border border-brand-brown/20 rounded-md py-1.5 px-3 text-sm focus:outline-none focus:border-brand-brown"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="default">{language === 'ar' ? 'الترتيب الافتراضي' : 'Default Sorting'}</option>
                <option value="popular">{language === 'ar' ? 'الأكثر شعبية' : 'Most Popular'}</option>
                <option value="price_asc">{language === 'ar' ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
                <option value="price_desc">{language === 'ar' ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
              </select>
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
