import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { MOCK_PRODUCTS } from '../data';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export function Wishlist() {
  const { wishlistIds } = useWishlist();
  const { language } = useLanguage();
  
  const wishlistProducts = MOCK_PRODUCTS.filter(product => 
    wishlistIds.includes(product.id)
  );

  return (
    <div className="bg-brand-ivory min-h-screen py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-brand-brown/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-brown">
            <Heart className="w-8 h-8 fill-brand-brown" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-brand-black font-bold mb-4">
            {language === 'ar' ? 'قائمة المفضلة' : 'My Wishlist'}
          </h1>
          <p className="text-brand-gray">
            {language === 'ar' 
              ? 'اكتشف الشوكولاتة الفاخرة التي أضفتها إلى مفضلتك' 
              : 'Discover the premium chocolates you have added to your wishlist'}
          </p>
        </div>

        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {wishlistProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 border border-black/5 rounded-sm shadow-sm text-center max-w-2xl mx-auto">
            <Heart className="w-12 h-12 text-brand-light-gray mx-auto mb-6" />
            <h2 className="text-xl font-bold text-brand-black mb-4">
              {language === 'ar' ? 'قائمتك فارغة' : 'Your wishlist is empty'}
            </h2>
            <p className="text-brand-gray mb-8">
              {language === 'ar' 
                ? 'لم تقم بإضافة أي منتجات إلى قائمة المفضلة بعد. تصفح متجرنا لاكتشاف أفخم أنواع الشوكولاتة.' 
                : 'You have not added any products to your wishlist yet. Browse our boutique to discover the finest chocolates.'}
            </p>
            <Link to="/shop">
              <Button size="lg" variant="primary" className="px-10">
                {language === 'ar' ? 'تصفح المتجر' : 'Browse Boutique'}
              </Button>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
