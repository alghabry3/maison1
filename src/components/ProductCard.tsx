import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Check, ArrowRightLeft } from 'lucide-react';
import { Product } from '../data';
import { Button } from './Button';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useCompare } from '../context/CompareContext';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  key?: string | number;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToCompare, removeFromCompare, isCompared, compareItems } = useCompare();
  const { language } = useLanguage();
  const [isAdded, setIsAdded] = useState(false);
  const [wishlistAlert, setWishlistAlert] = useState(false);
  const isWishlisted = isInWishlist(product.id);
  const isProductCompared = isCompared(product.id);

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    setWishlistAlert(true);
    setTimeout(() => setWishlistAlert(false), 1500);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isProductCompared) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  return (
    <div className="group relative flex flex-col bg-white border border-black/5 hover:border-brand-gold/50 transition-colors duration-300">
      
      {/* Badges */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        {product.isNew && (
          <span className="bg-brand-gold text-brand-black text-[10px] font-bold px-2 py-1 uppercase tracking-wider">جديد</span>
        )}
        {product.isBestSeller && (
          <span className="bg-brand-black text-brand-ivory text-[10px] font-bold px-2 py-1 uppercase tracking-wider">الأكثر مبيعاً</span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {/* Wishlist Button with popup feedback */}
        <div className="relative">
          <button 
            onClick={handleWishlistToggle}
            className={cn(
              "p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-sm transition-all duration-300 hover:scale-115 active:scale-95",
              isWishlisted ? "text-brand-brown bg-white shadow-brand-brown/10" : "text-brand-gray hover:text-brand-brown hover:bg-white"
            )}
            title={isWishlisted 
              ? (language === 'ar' ? 'إزالة من المفضلة' : 'Remove from Wishlist')
              : (language === 'ar' ? 'أضف للمفضلة' : 'Add to Wishlist')
            }
          >
            <Heart className={cn("w-4 h-4 transition-transform duration-300", isWishlisted && "fill-brand-brown text-brand-brown")} />
          </button>
          
          {wishlistAlert && (
            <div className={cn(
              "absolute top-1/2 -translate-y-1/2 bg-brand-black/90 text-brand-gold text-[9px] px-2 py-1 rounded shadow-lg border border-brand-gold/20 whitespace-nowrap z-30 pointer-events-none animate-fadeIn",
              language === 'ar' ? 'right-full mr-2' : 'left-full ml-2'
            )}>
              {isWishlisted 
                ? (language === 'ar' ? 'تمت الإضافة للمفضلة!' : 'Added to Wishlist!') 
                : (language === 'ar' ? 'تمت الإزالة!' : 'Removed!')}
            </div>
          )}
        </div>
        
        {/* Compare Button */}
        <button 
          onClick={handleCompare}
          className={cn(
            "p-2 bg-white/80 backdrop-blur-sm rounded-full transition-colors",
            isProductCompared ? "text-brand-gold" : "text-brand-gray hover:text-brand-gold hover:bg-white",
            compareItems.length >= 3 && !isProductCompared && "opacity-50 cursor-not-allowed"
          )}
          title={isProductCompared ? "إزالة من المقارنة" : "أضف للمقارنة"}
        >
          <ArrowRightLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-brand-light-gray mb-4">
        <img 
          src={product.image} 
          alt={product.name}
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <Button 
            onClick={handleQuickBuy}
            variant="primary" 
            className="w-full rounded-none shadow-lg flex items-center justify-center gap-2"
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                تمت الإضافة
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                أضف للسلة
              </>
            )}
          </Button>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 pt-0">
        <div className="flex justify-between items-start gap-2 mb-2">
          <Link to={`/product/${product.id}`} className="block flex-1">
            <h3 className="font-sans font-bold text-brand-black hover:text-brand-brown transition-colors">
              {product.name}
            </h3>
          </Link>
          <span className="text-brand-brown font-bold whitespace-nowrap">{product.price} ر.س</span>
        </div>
        <p className="text-brand-gray text-xs mb-4 line-clamp-2">{product.description}</p>
        
        <div className="mt-auto pt-4 border-t border-brand-black/5 flex items-center justify-between">
          <span className="text-[10px] text-brand-gray uppercase">{product.category}</span>
          <button 
            onClick={handleQuickBuy}
            className={cn(
              "text-xs transition-colors flex items-center gap-1",
              isAdded ? "text-green-600 border-b-0" : "text-brand-gold border-b border-brand-gold/30 hover:text-brand-brown hover:border-brand-brown"
            )}
          >
            {isAdded ? (
              <>
                <Check className="w-3 h-3" /> تم
              </>
            ) : (
              'أضف للسلة'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
