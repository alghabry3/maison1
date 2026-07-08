import { useParams, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { MOCK_PRODUCTS } from '../data';
import { Button } from '../components/Button';
import { Heart, Share2, ShieldCheck, Truck, Check, Star, Instagram, Twitter, MessageCircle, Sparkles, Search, ThumbsUp, CheckCircle, MessageSquare } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';
import { getUoms, getPriceInUom } from '../utils/uom';

const categoryTranslations: Record<string, string> = {
  "شوكولاتة فاخرة": "Luxury Chocolate",
  "بوكسات هدايا": "Gift Boxes",
  "مناسبات": "Occasions",
  "صواني ضيافة": "Serving Trays",
  "هدايا شركات": "Corporate Gifts"
};

interface ReviewItem {
  id: string;
  name: string;
  nameEn?: string;
  rating: number;
  comment: string;
  commentEn?: string;
  date: string;
  dateEn?: string;
}

const DEFAULT_REVIEWS: Record<string, ReviewItem[]> = {
  p1: [
    { 
      id: '1697328000000',
      name: 'سارة', 
      nameEn: 'Sara',
      rating: 5, 
      comment: 'شوكولاتة ممتازة، الطعم خيالي والتغليف راقي جداً والعلبة مذهلة كهدية!', 
      commentEn: 'Excellent chocolate, fantastic taste, and extremely elegant packaging, the box is amazing as a gift!',
      date: '١٥ / ١٠ / ٢٠٢٣',
      dateEn: '10/15/2023'
    },
    { 
      id: '1698883200000',
      name: 'أحمد', 
      nameEn: 'Ahmed',
      rating: 4, 
      comment: 'الطعم ممتاز وغني جداً، لكن التوصيل تأخر حوالي نصف ساعة عن الموعد في الرياض.', 
      commentEn: 'The taste is excellent and very rich, but delivery was delayed by about half an hour in Riyadh.',
      date: '٠٢ / ١١ / ٢٠٢٣',
      dateEn: '11/02/2023'
    },
    { 
      id: '1701388800000',
      name: 'ياسر', 
      nameEn: 'Yasser',
      rating: 5, 
      comment: 'جودة الكاكاو ممتازة وأصناف البوكس متنوعة ومثيرة للإعجاب للضيافة والأعياد.', 
      commentEn: 'The quality of cocoa is excellent and the box assortments are diverse and impressive for hospitality.',
      date: '٠١ / ١٢ / ٢٠٢٣',
      dateEn: '12/01/2023'
    }
  ],
  p2: [
    { 
      id: '1702339200000',
      name: 'منى', 
      nameEn: 'Mona',
      rating: 5, 
      comment: 'الترافل مذهل ويذوب في الفم! الجودة السويسرية والكاكاو الغني رائع جداً والتغليف فاخر.', 
      commentEn: 'The truffles are stunning and melt in your mouth! Outstanding Swiss quality and rich cocoa with luxury wrapping.',
      date: '١٢ / ١٢ / ٢٠٢٣',
      dateEn: '12/12/2023'
    },
    { 
      id: '1703030400000',
      name: 'سلطان', 
      nameEn: 'Sultan',
      rating: 5, 
      comment: 'أفضل ترافل كاكاو داكن جربته بالمملكة. توازن رائع بين مرارة الشوكولاتة وحلاوة الحشو الداخلي.', 
      commentEn: 'The best dark cocoa truffles I have ever tasted in the Kingdom. Highly balanced bitterness and sweet filling.',
      date: '٢٠ / ١٢ / ٢٠٢٣',
      dateEn: '12/20/2023'
    }
  ],
  p3: [
    { 
      id: '1704412800000',
      name: 'فهد', 
      nameEn: 'Fahad',
      rating: 5, 
      comment: 'بوكس أبيض وذهبي رائع جداً للمناسبات الكبيرة والزواجات، يبيض الوجه والضيافة راقية.', 
      commentEn: 'A truly magnificent white and gold box for large events and weddings. It is extremely prestigious.',
      date: '٠٥ / ٠١ / ٢٠٢٤',
      dateEn: '01/05/2024'
    },
    { 
      id: '1705536000000',
      name: 'خلود', 
      nameEn: 'Kholoud',
      rating: 4, 
      comment: 'الشوكولاتة ممتازة ومتنوعة والعلبة غاية في الفخامة، لكن السعر مرتفع قليلاً مقارنة بغيره.', 
      commentEn: 'The chocolate is excellent and varied, and the box is extremely luxurious, but the price is slightly high.',
      date: '١٨ / ٠١ / ٢٠٢٤',
      dateEn: '01/18/2024'
    }
  ],
  default: [
    { 
      id: '1708646400000',
      name: 'خالد', 
      nameEn: 'Khaled',
      rating: 5, 
      comment: 'شوكولاتة لذيذة جداً وجودتها عالية، الشحن كان سريعاً ومبرداً ومحافظاً على القوام والبرودة.', 
      commentEn: 'Very delicious chocolate with superb quality. The shipping was fast and temperature-controlled.',
      date: '٢٣ / ٠٢ / ٢٠٢٤',
      dateEn: '02/23/2024'
    },
    { 
      id: '1710374400000',
      name: 'ريما', 
      nameEn: 'Rema',
      rating: 4, 
      comment: 'تجربة رائعة والشوكولاتة طازجة ومقرمشة، حشوة الكراميل مذهلة ولذيذة جداً سأكرر الطلب.', 
      commentEn: 'A wonderful experience! The chocolate is fresh and crispy, the caramel filling is incredible and very delicious.',
      date: '١٤ / ٣ / ٢٠٢٤',
      dateEn: '03/14/2024'
    }
  ]
};

export function ProductDetail() {
  const { language } = useLanguage();
  const { id } = useParams();
  const product = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];
  const [quantity, setQuantity] = useState(1);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(product.image);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  
  const uomsList = getUoms();
  const compatibleUoms = uomsList.filter(u => u.category === product.uomCategory);
  const [selectedUomId, setSelectedUomId] = useState(product.defaultUom || 'uom_piece');
  
  useEffect(() => {
    setSelectedUomId(product.defaultUom || 'uom_piece');
    setActiveImage(product.image);
  }, [product]);

  const selectedUomObj = uomsList.find(u => u.id === selectedUomId);
  const currentPrice = getPriceInUom(product.price, product.defaultUom || 'uom_piece', selectedUomId);
  
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  useEffect(() => {
    const key = `product_reviews_${product.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setReviews(JSON.parse(saved));
      } catch (e) {
        const initial = DEFAULT_REVIEWS[product.id] || DEFAULT_REVIEWS['default'];
        setReviews(initial);
      }
    } else {
      const initial = DEFAULT_REVIEWS[product.id] || DEFAULT_REVIEWS['default'];
      setReviews(initial);
      localStorage.setItem(key, JSON.stringify(initial));
    }
    setFilterRating('all');
    setSortBy('newest');
    setSearchTerm('');
    setIsReviewSubmitted(false);
  }, [product.id]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;
    
    const arDate = new Date().toLocaleDateString('ar-SA');
    const enDate = new Date().toLocaleDateString('en-US');
    
    const newReview: ReviewItem = {
      id: Date.now().toString(),
      name: newReviewName,
      nameEn: newReviewName,
      rating: newReviewRating,
      comment: newReviewComment,
      commentEn: newReviewComment,
      date: arDate,
      dateEn: enDate
    };
    
    const updated = [newReview, ...reviews];
    setReviews(updated);
    
    const key = `product_reviews_${product.id}`;
    localStorage.setItem(key, JSON.stringify(updated));
    
    setNewReviewName('');
    setNewReviewComment('');
    setNewReviewRating(5);
    setIsReviewSubmitted(true);
    setTimeout(() => setIsReviewSubmitted(false), 5000);
  };

  // Derived statistics
  const totalReviewsCount = reviews.length;
  const averageRating = totalReviewsCount > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewsCount 
    : 5.0;

  // Star breakdown counts (index 0 is 5 star, index 4 is 1 star)
  const starCounts = [0, 0, 0, 0, 0];
  reviews.forEach(r => {
    const ratingIdx = 5 - r.rating;
    if (ratingIdx >= 0 && ratingIdx < 5) {
      starCounts[ratingIdx]++;
    }
  });

  const filteredAndSortedReviews = reviews
    .filter(review => {
      // Rating filter
      if (filterRating !== 'all' && review.rating !== filterRating) {
        return false;
      }
      // Search term filter
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        const commentToSearch = (language === 'ar' ? review.comment : (review.commentEn || review.comment)).toLowerCase();
        const nameToSearch = (language === 'ar' ? review.name : (review.nameEn || review.name)).toLowerCase();
        return commentToSearch.includes(term) || nameToSearch.includes(term);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'highest') {
        return b.rating - a.rating;
      }
      if (sortBy === 'lowest') {
        return a.rating - b.rating;
      }
      // Default to newest first
      const numA = Number(a.id);
      const numB = Number(b.id);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numB - numA;
      }
      return b.id.localeCompare(a.id);
    });

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [id]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const xPercent = (x / width) * 100;
    const yPercent = (y / height) * 100;
    
    setLensPosition({ x, y });
    setZoomStyle({ backgroundPosition: `${xPercent}% ${yPercent}%` });
  };
  
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedUomId);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="bg-brand-ivory min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-4 bg-brand-light-gray rounded w-1/4 mb-8"></div>
          
          <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
            {/* Images Skeleton */}
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <div className="aspect-[4/5] bg-brand-light-gray rounded-sm w-full"></div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                <div className="w-24 h-24 rounded-sm bg-brand-light-gray flex-shrink-0"></div>
                <div className="w-24 h-24 rounded-sm bg-brand-light-gray flex-shrink-0"></div>
                <div className="w-24 h-24 rounded-sm bg-brand-light-gray flex-shrink-0"></div>
              </div>
            </div>

            {/* Details Skeleton */}
            <div className="w-full md:w-1/2 flex flex-col">
              <div className="border-b border-brand-brown/10 pb-6 mb-6">
                <div className="h-4 bg-brand-light-gray rounded w-20 mb-4"></div>
                <div className="h-10 bg-brand-light-gray rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-brand-light-gray rounded w-1/4 mb-4"></div>
                <div className="h-14 bg-brand-light-gray rounded w-full"></div>
              </div>

              <div className="h-20 bg-brand-light-gray rounded w-full mb-8"></div>
              <div className="h-24 bg-brand-light-gray rounded w-full mb-8"></div>

              <div className="flex items-center gap-4 mb-8">
                <div className="h-14 bg-brand-light-gray rounded w-32"></div>
                <div className="h-14 bg-brand-light-gray rounded flex-1"></div>
                <div className="h-14 bg-brand-light-gray rounded w-14 shrink-0"></div>
              </div>
              <div className="h-14 bg-brand-light-gray rounded w-full mb-8"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-ivory min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex text-sm text-brand-gray mb-8">
          <Link to="/" className="hover:text-brand-brown transition-colors">{language === 'ar' ? 'الرئيسية' : 'Home'}</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-brand-brown transition-colors">{language === 'ar' ? 'المتجر' : 'Boutique'}</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-black truncate">{language === 'ar' ? product.name : product.nameEn || product.name}</span>
        </nav>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          
          {/* Images */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div 
              className="aspect-[4/5] bg-brand-light-gray rounded-sm overflow-hidden border border-brand-black/5 relative cursor-none group"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <img 
                src={activeImage} 
                alt={language === 'ar' ? product.name : product.nameEn || product.name} 
                className="w-full h-full object-cover select-none animate-fadeIn"
              />
              {product.isNew && (
                <span className="absolute top-4 right-4 bg-brand-gold text-brand-black text-[10px] font-bold px-2.5 py-1.5 rounded-sm uppercase tracking-wider pointer-events-none z-10">
                  {language === 'ar' ? 'جديد' : 'New'}
                </span>
              )}
              
              {/* Dynamic instruction badge that hides on hover */}
              <div className="absolute bottom-4 left-4 right-4 bg-brand-black/85 backdrop-blur-xs text-brand-ivory text-[11px] py-2 px-4 rounded border border-brand-gold/30 text-center opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none flex items-center justify-center gap-1.5 font-sans z-10">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
                <span>
                  {language === 'ar' 
                    ? 'مرر الماوس لاستكشاف تفاصيل الشوكولاتة الفاخرة بعدسة مكبرة' 
                    : 'Hover cursor to inspect luxury chocolate textures with our magnifier lens'}
                </span>
              </div>

              {/* Magnifying Glass Lens */}
              {isZoomed && (
                <div 
                  className="absolute pointer-events-none rounded-full border-2 border-brand-gold bg-no-repeat transition-opacity duration-150 ease-out z-20"
                  style={{
                    width: '180px',
                    height: '180px',
                    left: `${lensPosition.x}px`,
                    top: `${lensPosition.y}px`,
                    transform: 'translate(-50%, -50%)',
                    backgroundImage: `url(${activeImage})`,
                    backgroundSize: '350%',
                    backgroundPosition: zoomStyle.backgroundPosition || '50% 50%',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), inset 0 0 24px rgba(0,0,0,0.35), 0 0 0 4px rgba(200, 164, 106, 0.2)'
                  }}
                >
                  {/* Gloss reflection overlay inside lens */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none" />
                  
                  {/* Reticle / target dot */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/30"></div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery with high resolution luxury chocolate textures */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[
                product.image,
                "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80", // Melted luxury chocolate glaze
                "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=800&q=80"  // Cocoa powder dusting texture
              ].map((imgUrl, idx) => {
                const isActive = imgUrl === activeImage;
                let label = '';
                if (idx === 0) {
                  label = language === 'ar' ? 'المنتج' : 'Product';
                } else if (idx === 1) {
                  label = language === 'ar' ? 'ملمس القوام' : 'Glaze Close-up';
                } else {
                  label = language === 'ar' ? 'مسحوق الكاكاو' : 'Cocoa Texture';
                }
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={cn(
                      "w-24 h-24 rounded-sm bg-brand-light-gray flex-shrink-0 overflow-hidden cursor-pointer relative transition-all duration-300",
                      isActive 
                        ? "border-2 border-brand-gold shadow-md scale-105" 
                        : "border border-brand-black/10 opacity-70 hover:opacity-100 hover:border-brand-gold/50"
                    )}
                  >
                    <img src={imgUrl} className="w-full h-full object-cover select-none" alt="" />
                    <span className="absolute bottom-1 left-1 right-1 bg-brand-black/75 backdrop-blur-xs text-[9px] text-brand-ivory rounded px-1 text-center py-0.5 truncate pointer-events-none font-sans">
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="border-b border-brand-brown/10 pb-6 mb-6">
              <p className="text-brand-gold font-medium mb-2">
                {language === 'ar' ? product.category : categoryTranslations[product.category] || product.category}
              </p>
              <h1 className="font-serif text-3xl md:text-4xl text-brand-black font-bold mb-2">
                {language === 'ar' ? product.name : product.nameEn || product.name}
              </h1>

              {/* Product Rating Summary Badge */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= Math.round(averageRating);
                    return (
                      <Star 
                        key={star} 
                        className={cn("w-4 h-4", isFilled ? "fill-brand-gold text-brand-gold" : "text-brand-gray/20")} 
                      />
                    );
                  })}
                </div>
                <span className="text-sm font-bold text-brand-black font-sans">{averageRating.toFixed(1)}</span>
                <span className="text-xs text-brand-gray">
                  ({totalReviewsCount} {language === 'ar' ? 'تقييمات' : 'reviews'})
                </span>
                <span className="text-brand-gray/30">|</span>
                <button 
                  onClick={() => {
                    const el = document.getElementById('customer-reviews-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-xs text-brand-brown hover:text-brand-gold underline font-medium transition-colors"
                >
                  {language === 'ar' ? 'عرض التقييمات' : 'View reviews'}
                </button>
              </div>
              <div className="text-2xl font-semibold text-brand-black mb-4">
                {currentPrice.toFixed(2)} <span className="text-lg font-normal">{language === 'ar' ? 'ر.س' : 'SAR'}</span>
                {selectedUomObj && (
                  <span className="text-sm font-medium text-brand-gold ml-2 mr-2 bg-brand-brown/5 px-2.5 py-1 rounded-full border border-brand-gold/10 inline-block">
                    {language === 'ar' ? `لكل ${selectedUomObj.nameAr}` : `per ${selectedUomObj.nameEn}`}
                  </span>
                )}
                {product.defaultUom && selectedUomId !== product.defaultUom && (
                  <span className="block text-xs font-normal text-brand-gray mt-1.5">
                    ({language === 'ar' ? 'السعر الأساسي للمنتج: ' : 'Base product price: '} {product.price.toFixed(2)} {language === 'ar' ? 'ر.س' : 'SAR'} / {language === 'ar' ? (uomsList.find(u => u.id === product.defaultUom)?.nameAr) : (uomsList.find(u => u.id === product.defaultUom)?.nameEn)})
                  </span>
                )}
                <span className="block text-sm font-normal text-brand-gray mt-1">{language === 'ar' ? 'شامل ضريبة القيمة المضافة' : 'Includes VAT'}</span>
              </div>
              
              <div className="bg-brand-light-gray/50 rounded-lg p-4 flex items-center justify-between">
                <span className="text-sm font-medium">
                  {language === 'ar' 
                    ? `قسمها على 4 دفعات ميسرة بقيمة ${(currentPrice / 4).toFixed(2)} ر.س` 
                    : `Split into 4 easy interest-free payments of ${(currentPrice / 4).toFixed(2)} SAR`}
                </span>
                <div className="flex gap-2 font-bold text-lg">
                  <span className="text-black">tabby</span>
                  <span className="text-[#F18D7E]">tamara</span>
                </div>
              </div>
            </div>

            <p className="text-brand-gray leading-relaxed mb-8">
              {language === 'ar' ? product.description : product.descriptionEn || product.description}
            </p>

            {/* Elegant Luxury Specifications Grid */}
            <div className="border border-brand-gold/20 bg-brand-brown/5 p-6 rounded-md mb-8 animate-fade-in">
              <h3 className="font-serif text-base font-bold text-brand-black mb-4 pb-2 border-b border-brand-brown/10 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-gold animate-pulse" />
                {language === 'ar' ? 'التفاصيل والمواصفات الفاخرة' : 'Luxury Specifications & Details'}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {product.origin && (
                  <div className="flex items-start gap-3 bg-white p-3 rounded border border-brand-brown/10 shadow-2xs">
                    <span className="text-lg">🌍</span>
                    <div>
                      <span className="block text-[11px] text-brand-gray">{language === 'ar' ? 'بلد المنشأ' : 'Country of Origin'}</span>
                      <span className="font-bold text-brand-black">{product.origin}</span>
                    </div>
                  </div>
                )}

                {product.cocoaPercent && (
                  <div className="flex items-start gap-3 bg-white p-3 rounded border border-brand-brown/10 shadow-2xs">
                    <span className="text-lg">🍫</span>
                    <div>
                      <span className="block text-[11px] text-brand-gray">{language === 'ar' ? 'نسبة الكاكاو الفاخر' : 'Premium Cocoa %'}</span>
                      <span className="font-bold text-brand-black">{product.cocoaPercent}%</span>
                    </div>
                  </div>
                )}

                {product.size && (
                  <div className="flex items-start gap-3 bg-white p-3 rounded border border-brand-brown/10 shadow-2xs">
                    <span className="text-lg">⚖️</span>
                    <div>
                      <span className="block text-[11px] text-brand-gray">{language === 'ar' ? 'الحجم والوزن' : 'Size & Weight'}</span>
                      <span className="font-bold text-brand-black">{product.size}</span>
                    </div>
                  </div>
                )}

                {product.shelfLife && (
                  <div className="flex items-start gap-3 bg-white p-3 rounded border border-brand-brown/10 shadow-2xs">
                    <span className="text-lg">📅</span>
                    <div>
                      <span className="block text-[11px] text-brand-gray">{language === 'ar' ? 'فترة الصلاحية' : 'Shelf Life'}</span>
                      <span className="font-bold text-brand-black">{product.shelfLife}</span>
                    </div>
                  </div>
                )}

                {product.pairing && (
                  <div className="flex items-start gap-3 bg-white p-3 rounded border border-brand-brown/10 shadow-2xs col-span-1 sm:col-span-2">
                    <span className="text-lg">☕</span>
                    <div>
                      <span className="block text-[11px] text-brand-gray">{language === 'ar' ? 'التناغم والمشروب المثالي' : 'Perfect Pairing'}</span>
                      <span className="font-bold text-brand-brown">{product.pairing}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Ingredients */}
              {product.ingredients && (
                <div className="mt-5 pt-4 border-t border-brand-brown/10">
                  <h4 className="text-xs font-bold text-brand-black mb-2.5">{language === 'ar' ? 'المكونات الطبيعية' : 'Natural Ingredients'}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {product.ingredients.split('،').map((ingredient, idx) => (
                      <span key={idx} className="bg-brand-brown/10 text-brand-brown border border-brand-brown/10 px-2.5 py-1 rounded text-xs font-medium">
                        {ingredient.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Nutritional Values */}
              {product.nutritionalValues && (
                <div className="mt-5 pt-4 border-t border-brand-brown/10">
                  <h4 className="text-xs font-bold text-brand-black mb-3 flex items-center gap-1.5">
                    <span>📊</span>
                    {language === 'ar' ? 'القيم الغذائية (لكل حصة)' : 'Nutritional Information (Per serving)'}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                    <div className="bg-white p-2.5 rounded border border-brand-brown/10">
                      <span className="block text-[10px] text-brand-gray mb-0.5">{language === 'ar' ? 'السعرات' : 'Calories'}</span>
                      <span className="font-bold text-brand-black text-xs">{product.nutritionalValues.calories}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded border border-brand-brown/10">
                      <span className="block text-[10px] text-brand-gray mb-0.5">{language === 'ar' ? 'الدهون' : 'Fat'}</span>
                      <span className="font-bold text-brand-black text-xs">{product.nutritionalValues.fat}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded border border-brand-brown/10">
                      <span className="block text-[10px] text-brand-gray mb-0.5">{language === 'ar' ? 'الكربوهيدرات' : 'Carbs'}</span>
                      <span className="font-bold text-brand-black text-xs">{product.nutritionalValues.carbs}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded border border-brand-brown/10">
                      <span className="block text-[10px] text-brand-gray mb-0.5">{language === 'ar' ? 'البروتين' : 'Protein'}</span>
                      <span className="font-bold text-brand-black text-xs">{product.nutritionalValues.protein}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Allergens Warn */}
              {product.allergens && product.allergens.length > 0 && (
                <div className="mt-5 pt-4 border-t border-brand-brown/10 flex items-start gap-2.5 bg-red-50 p-3 rounded border border-red-100">
                  <span className="text-red-500 font-bold text-sm">⚠️</span>
                  <div>
                    <span className="block text-xs font-bold text-red-800">{language === 'ar' ? 'مسببات الحساسية' : 'Allergen Alert'}</span>
                    <p className="text-xs text-red-700 mt-1 leading-relaxed">
                      {language === 'ar' ? 'قد يحتوي هذا المنتج الفاخر على: ' : 'This luxury product may contain: '}
                      <span className="font-bold">{product.allergens.join('، ')}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>

             {/* Odoo Units of Measure Selector */}
             {compatibleUoms.length > 0 && (
              <div className="bg-white p-5 border border-brand-gold/20 rounded-md shadow-sm mb-6 animate-fade-in">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-brand-brown/10">
                  <span className="font-serif text-sm font-bold text-brand-black flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-gold animate-pulse"></span>
                    {language === 'ar' ? 'وحدات القياس المتعددة (Odoo ERP)' : 'Multi-Units of Measure (Odoo ERP)'}
                  </span>
                  <span className="text-[10px] bg-brand-gold/10 text-brand-brown font-mono font-bold px-2 py-0.5 rounded-full border border-brand-gold/20">
                    Odoo UoM Policy ✅
                  </span>
                </div>
                
                <p className="text-xs text-brand-gray mb-3 leading-relaxed">
                  {language === 'ar' 
                    ? 'اختر وحدة القياس المفضلة للشراء. سيتم حساب السعر وتحويل الكمية تلقائياً بناءً على سياسات أودو للمخازن.' 
                    : 'Select your preferred unit. Pricing and inventory conversion rules are applied dynamically based on Odoo warehouse policies.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {compatibleUoms.map(uomItem => {
                    const isSelected = uomItem.id === selectedUomId;
                    const isRef = uomItem.uomType === 'reference';
                    
                    return (
                      <button
                        key={uomItem.id}
                        onClick={() => setSelectedUomId(uomItem.id)}
                        className={cn(
                          "flex flex-col text-right p-3 rounded border transition-all text-sm",
                          isSelected 
                            ? "border-brand-gold bg-brand-gold/5 font-bold shadow-sm" 
                            : "border-brand-brown/10 hover:border-brand-gold/50 hover:bg-brand-light-gray/20"
                        )}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium text-brand-black">
                            {language === 'ar' ? uomItem.nameAr : uomItem.nameEn}
                          </span>
                          {isRef && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-sans">
                              {language === 'ar' ? 'الوحدة المرجعية' : 'Reference'}
                            </span>
                          )}
                        </div>
                        
                        <span className="text-[11px] text-brand-gray mt-1.5">
                          {uomItem.uomType === 'smaller' && `1 حبة مرجعية = ${uomItem.ratio} ${language === 'ar' ? uomItem.nameAr : uomItem.nameEn}`}
                          {uomItem.uomType === 'bigger' && `1 ${language === 'ar' ? uomItem.nameAr : uomItem.nameEn} = ${uomItem.ratio} حبة مرجعية`}
                          {uomItem.uomType === 'reference' && `وحدة القياس القياسية`}
                        </span>
                      </button>
                    );
                  })}
                </div>
                
                {/* Rule Warning/Acknowledge */}
                <div className="mt-3.5 bg-brand-light-gray/40 p-2.5 rounded text-[11px] text-brand-gray flex items-start gap-1.5">
                  <span className="text-brand-gold">ℹ️</span>
                  <span>
                    {language === 'ar' 
                      ? 'قاعدة أودو: يقتصر التحويل على الوحدات داخل نفس الفئة فقط لمنع الأخطاء المحاسبية.' 
                      : 'Odoo Rule: UoM conversion is strictly restricted within the same category to prevent accounting discrepancies.'}
                  </span>
                </div>
              </div>
            )}

            {/* Customization Options */}
            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">
                  {language === 'ar' ? 'إضافة بطاقة إهداء؟' : 'Add a gift card?'}
                </label>
                <select className="w-full bg-transparent border border-brand-brown/30 rounded-md py-3 px-4 focus:outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown transition-shadow">
                  <option>{language === 'ar' ? 'لا شكراً' : 'No, thank you'}</option>
                  <option>{language === 'ar' ? 'نعم، بطاقة فارغة (+10 ر.س)' : 'Yes, empty card (+10 SAR)'}</option>
                  <option>{language === 'ar' ? 'نعم، مع كتابة رسالة (+15 ر.س)' : 'Yes, with custom message (+15 SAR)'}</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-brand-brown/30 rounded-md bg-white">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-brand-gray hover:text-brand-black transition-colors">-</button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 text-brand-gray hover:text-brand-black transition-colors">+</button>
              </div>
              <Button 
                onClick={handleAddToCart}
                size="lg" 
                className={cn("flex-1 text-lg flex items-center justify-center gap-2", isAdded && "bg-green-600 hover:bg-green-700")}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5" />
                    {language === 'ar' ? 'تمت الإضافة' : 'Added to Cart'}
                  </>
                ) : (
                  language === 'ar' ? 'إضافة للسلة' : 'Add to Cart'
                )}
              </Button>
              <Button 
                onClick={() => toggleWishlist(product.id)}
                variant="outline" 
                size="icon" 
                className={cn(
                  "h-14 w-14 shrink-0 rounded-md border-brand-brown/30",
                  isWishlisted ? "text-brand-brown" : "text-brand-gray hover:text-brand-brown"
                )}
              >
                <Heart className={cn("w-6 h-6", isWishlisted && "fill-brand-brown")} />
              </Button>
            </div>

            <Button variant="gold" size="lg" className="w-full mb-8">
              {language === 'ar' ? 'شراء الآن (إتمام الدفع السريع)' : 'Buy Now (Express Checkout)'}
            </Button>

            {/* Share */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm font-bold text-brand-black">
                {language === 'ar' ? 'شارك المنتج:' : 'Share Product:'}
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => window.open('https://instagram.com', '_blank')}
                  className="w-10 h-10 rounded-full border border-brand-brown/20 flex items-center justify-center text-brand-gray hover:text-brand-brown hover:border-brand-brown transition-colors"
                  aria-label="Share on Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => window.open('https://wa.me/?text=تفقد هذا المنتج الرائع', '_blank')}
                  className="w-10 h-10 rounded-full border border-brand-brown/20 flex items-center justify-center text-brand-gray hover:text-green-600 hover:border-green-600 transition-colors"
                  aria-label="Share on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => window.open('https://twitter.com/intent/tweet?text=تفقد هذا المنتج الرائع', '_blank')}
                  className="w-10 h-10 rounded-full border border-brand-brown/20 flex items-center justify-center text-brand-gray hover:text-blue-400 hover:border-blue-400 transition-colors"
                  aria-label="Share on X"
                >
                  <Twitter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 border-t border-brand-brown/10 pt-8">
              <div className="flex items-center gap-3">
                <div className="bg-brand-brown/10 p-2 rounded-full text-brand-brown">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">{language === 'ar' ? 'توصيل سريع' : 'Fast Delivery'}</h4>
                  <p className="text-xs text-brand-gray">{language === 'ar' ? 'داخل الرياض' : 'Inside Riyadh'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-brand-brown/10 p-2 rounded-full text-brand-brown">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">{language === 'ar' ? 'دفع آمن' : 'Secure Payment'}</h4>
                  <p className="text-xs text-brand-gray">{language === 'ar' ? '١٠٠٪ موثوق' : '100% Certified'}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Frequently Bought Together */}
        <div className="mt-20 border-t border-brand-brown/10 pt-16">
          <h2 className="font-serif text-2xl font-bold text-brand-black mb-8">{language === 'ar' ? 'قد يعجبك أيضاً' : 'Frequently Bought Together'}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {MOCK_PRODUCTS.filter(p => p.id !== product.id).slice(0, 4).map(relatedProduct => (
              <Link key={relatedProduct.id} to={`/product/${relatedProduct.id}`} className="group block">
                <div className="aspect-square bg-brand-light-gray mb-4 overflow-hidden rounded-sm relative border border-brand-black/5">
                  <img 
                    src={relatedProduct.image} 
                    alt={relatedProduct.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-brand-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-brand-black px-4 py-2 rounded-sm text-sm font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform">{language === 'ar' ? 'عرض التفاصيل' : 'View Details'}</span>
                  </div>
                </div>
                <h3 className="font-bold text-brand-black text-sm mb-1 truncate">{relatedProduct.name}</h3>
                <p className="text-brand-gold font-bold text-sm">{relatedProduct.price} {language === 'ar' ? 'ر.س' : 'SAR'}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div id="customer-reviews-section" className="mt-20 max-w-5xl mx-auto border-t border-brand-brown/10 pt-16">
          <h2 className="font-serif text-3xl font-bold text-brand-black mb-8 text-center">
            {language === 'ar' ? 'تقييمات وآراء العملاء' : 'Customer Ratings & Reviews'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-1 space-y-6">
              {/* Statistics Panel */}
              <div className="bg-white p-6 rounded-sm border border-brand-brown/10 space-y-6">
                <div className="text-center pb-4 border-b border-brand-brown/10">
                  <div className="text-5xl font-serif font-extrabold text-brand-black mb-2">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="flex justify-center gap-1 mb-1.5">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = star <= Math.round(averageRating);
                      return (
                        <Star 
                          key={star} 
                          className={cn("w-5 h-5", isFilled ? "fill-brand-gold text-brand-gold" : "text-brand-gray/20")} 
                        />
                      );
                    })}
                  </div>
                  <p className="text-xs text-brand-gray">
                    {language === 'ar' 
                      ? `بناءً على ${totalReviewsCount} تقييم` 
                      : `Based on ${totalReviewsCount} reviews`}
                  </p>
                </div>

                {/* Rating bars distribution */}
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = reviews.filter(r => r.rating === stars).length;
                    const percent = totalReviewsCount > 0 ? (count / totalReviewsCount) * 100 : 0;
                    return (
                      <button
                        key={stars}
                        onClick={() => setFilterRating(filterRating === stars ? 'all' : stars)}
                        className={cn(
                          "flex items-center gap-2 text-xs w-full text-right font-sans hover:bg-brand-brown/5 p-1 rounded transition-colors group",
                          filterRating === stars && "bg-brand-brown/5 font-bold"
                        )}
                        title={language === 'ar' ? `تصفية حسب ${stars} نجوم` : `Filter by ${stars} stars`}
                      >
                        <span className="w-10 text-brand-black flex items-center gap-1 font-bold">
                          {stars} <Star className="w-3 h-3 fill-brand-gold text-brand-gold inline" />
                        </span>
                        <div className="flex-1 h-2.5 bg-brand-light-gray rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-brand-gold rounded-full transition-all duration-500" 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-brand-gray group-hover:text-brand-black font-semibold">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Card */}
              <div className="bg-white p-6 rounded-sm border border-brand-brown/10 sticky top-32 space-y-4">
                <h3 className="font-serif text-xl font-bold text-brand-black border-b border-brand-brown/10 pb-3">
                  {language === 'ar' ? 'كتابة تقييم جديد' : 'Write a Review'}
                </h3>
                
                {isReviewSubmitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-sm text-center animate-fade-in">
                    <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <h4 className="font-bold text-sm mb-1">
                      {language === 'ar' ? 'تم إرسال تقييمك!' : 'Review Submitted!'}
                    </h4>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      {language === 'ar' 
                        ? 'شكرًا لك! تم إرسال تقييمك بنجاح ونشره مباشرة.' 
                        : 'Thank you! Your review was successfully submitted and published.'}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4 font-sans">
                    <div>
                      <label className="block text-xs font-bold text-brand-black mb-2 uppercase tracking-wider">
                        {language === 'ar' ? 'التقييم العام' : 'Overall Rating'}
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1" onMouseLeave={() => setHoverRating(null)}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewReviewRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              className="focus:outline-none transition-transform hover:scale-110"
                              aria-label={`Rate ${star} stars`}
                            >
                              <Star 
                                className={cn(
                                  "w-7 h-7 transition-all duration-150", 
                                  star <= (hoverRating !== null ? hoverRating : newReviewRating)
                                    ? "fill-brand-gold text-brand-gold drop-shadow-sm" 
                                    : "text-brand-gray/30"
                                )} 
                              />
                            </button>
                          ))}
                        </div>
                        {((hoverRating !== null ? hoverRating : newReviewRating) !== null) && (
                          <span className="text-xs font-bold text-brand-gold px-2 py-0.5 bg-brand-gold/10 rounded border border-brand-gold/15 shrink-0">
                            {[
                              { rating: 5, labelAr: 'ممتاز جداً', labelEn: 'Excellent' },
                              { rating: 4, labelAr: 'جيد جداً', labelEn: 'Very Good' },
                              { rating: 3, labelAr: 'جيد', labelEn: 'Good' },
                              { rating: 2, labelAr: 'مقبول', labelEn: 'Fair' },
                              { rating: 1, labelAr: 'سيء', labelEn: 'Poor' }
                            ].find(item => item.rating === (hoverRating !== null ? hoverRating : newReviewRating))?.[language === 'ar' ? 'labelAr' : 'labelEn']}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-black mb-1.5 uppercase tracking-wider">
                        {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                      </label>
                      <input 
                        type="text" 
                        value={newReviewName}
                        onChange={(e) => setNewReviewName(e.target.value)}
                        placeholder={language === 'ar' ? 'مثال: نورة العتيبي' : 'e.g. Sara Al-Otaibi'}
                        className="w-full border border-brand-brown/20 bg-brand-ivory/20 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-brand-black mb-1.5 uppercase tracking-wider">
                        {language === 'ar' ? 'تفاصيل التقييم والتعليق' : 'Review Details & Comments'}
                      </label>
                      <textarea 
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        placeholder={language === 'ar' ? 'شاركونا رأيكم بالمنتج، جودة التغليف، وتجربة المذاق...' : 'Share your thoughts on the taste, packaging, and delivery experience...'}
                        className="w-full border border-brand-brown/20 bg-brand-ivory/20 rounded-sm px-3 py-2.5 text-sm h-28 resize-none focus:outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown transition-all"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full py-3 text-sm font-bold tracking-wider uppercase transition-all duration-200">
                      {language === 'ar' ? 'إرسال التقييم الآن' : 'Submit Review Now'}
                    </Button>
                  </form>
                )}
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              {/* Controls bar: search, filter, sort */}
              <div className="bg-white p-4 rounded-sm border border-brand-brown/10 flex flex-col gap-4">
                {/* Search and Sort row */}
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-brand-gray/60">
                      <Search className="w-4 h-4" />
                    </span>
                    <input 
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={language === 'ar' ? 'ابحث في محتوى التقييمات...' : 'Search reviews...'}
                      className="w-full border border-brand-brown/20 bg-brand-ivory/20 rounded-sm py-2 pr-9 pl-3 text-xs focus:outline-none focus:border-brand-brown transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-brand-gray shrink-0">
                      {language === 'ar' ? 'ترتيب حسب:' : 'Sort by:'}
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="border border-brand-brown/20 bg-white rounded-sm py-2 px-3 text-xs focus:outline-none focus:border-brand-brown"
                    >
                      <option value="newest">{language === 'ar' ? 'الأحدث أولاً' : 'Newest First'}</option>
                      <option value="highest">{language === 'ar' ? 'الأعلى تقييماً' : 'Highest Rated'}</option>
                      <option value="lowest">{language === 'ar' ? 'الأقل تقييماً' : 'Lowest Rated'}</option>
                    </select>
                  </div>
                </div>

                {/* Filter pills and summary count */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-brand-brown/5">
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setFilterRating('all')}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150",
                        filterRating === 'all'
                          ? "bg-brand-brown text-white border-brand-brown"
                          : "bg-brand-ivory/30 text-brand-gray border-brand-brown/10 hover:border-brand-brown/40"
                      )}
                    >
                      {language === 'ar' ? 'الكل' : 'All'} ({reviews.length})
                    </button>
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = reviews.filter(r => r.rating === stars).length;
                      return (
                        <button
                          key={stars}
                          onClick={() => setFilterRating(stars)}
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 transition-all duration-150",
                            filterRating === stars
                              ? "bg-brand-brown text-white border-brand-brown"
                              : "bg-brand-ivory/30 text-brand-gray border-brand-brown/10 hover:border-brand-brown/40"
                          )}
                        >
                          <span>{stars}</span>
                          <Star className="w-3 h-3 fill-brand-gold text-brand-gold" />
                          <span>({count})</span>
                        </button>
                      );
                    })}
                  </div>

                  <span className="text-xs text-brand-gray font-medium">
                    {language === 'ar'
                      ? `عرض ${filteredAndSortedReviews.length} من ${totalReviewsCount}`
                      : `Showing ${filteredAndSortedReviews.length} of ${totalReviewsCount}`}
                  </span>
                </div>
              </div>

              {/* Reviews Cards List */}
              <div className="space-y-4">
                {filteredAndSortedReviews.length > 0 ? (
                  filteredAndSortedReviews.map((review) => (
                    <div key={review.id} className="bg-white p-6 rounded-sm border border-brand-brown/5 shadow-2xs hover:shadow-xs transition-shadow duration-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-brand-black mb-1 text-sm">
                            {language === 'ar' ? review.name : (review.nameEn || review.name)}
                          </h4>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={cn("w-3.5 h-3.5", i < review.rating ? "fill-brand-gold text-brand-gold" : "text-brand-gray/20")} 
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-brand-gray bg-brand-light-gray/40 px-2.5 py-0.5 rounded-full font-sans">
                            {language === 'ar' ? review.date : (review.dateEn || review.date)}
                          </span>
                        </div>
                      </div>
                      <p className="text-brand-black text-sm leading-relaxed whitespace-pre-line font-sans">
                        {language === 'ar' ? review.comment : (review.commentEn || review.comment)}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-brand-gray bg-white rounded-sm border border-brand-brown/5">
                    <MessageSquare className="w-10 h-10 mx-auto mb-3 text-brand-brown/30" />
                    <p className="text-sm font-medium">
                      {searchTerm.trim() !== '' || filterRating !== 'all'
                        ? (language === 'ar' ? 'لا توجد تقييمات تطابق خيارات التصفية حالياً.' : 'No reviews match your filter criteria.')
                        : (language === 'ar' ? 'لا توجد تقييمات بعد. كن أول من يقيّم هذا المنتج!' : 'No reviews yet. Be the first to review this product!')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
