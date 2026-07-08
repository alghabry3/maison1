import { useState, useMemo, useEffect, useRef } from 'react';
import { Button } from '../components/Button';
import { ChevronLeft, ChevronRight, Gift, Package, CalendarDays, Edit3, CheckCircle2, Rotate3D, Plus, Minus, X, Info, Sparkles, CreditCard, Truck } from 'lucide-react';
import { cn } from '../lib/utils';
import { MOCK_PRODUCTS } from '../data';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Preview3DModal } from '../components/Preview3DModal';

const STEPS = [
  { id: 1, titleAr: 'الوعاء', titleEn: 'Container', icon: Package },
  { id: 2, titleAr: 'التشكيلة', titleEn: 'Assortment', icon: Gift },
  { id: 3, titleAr: 'التغليف والرسالة', titleEn: 'Wrapping & Message', icon: Edit3 },
  { id: 4, titleAr: 'المراجعة النهائية', titleEn: 'Final Review', icon: CheckCircle2 },
];

const WRAPPING_COLORS = [
  { id: 'w1', nameAr: 'أبيض عاجي', nameEn: 'Ivory White', color: '#F8F5EF' },
  { id: 'w2', nameAr: 'أسود فاخر', nameEn: 'Luxury Black', color: '#1A1A1A' },
  { id: 'w3', nameAr: 'بني شوكولاتة', nameEn: 'Chocolate Brown', color: '#4A3525' },
  { id: 'w4', nameAr: 'أحمر قاني', nameEn: 'Crimson Red', color: '#5A1818' },
  { id: 'w5', nameAr: 'أخضر ملكي', nameEn: 'Royal Green', color: '#1a3b2b' },
];

const RIBBON_COLORS = [
  { id: 'r1', nameAr: 'ذهبي', nameEn: 'Gold', color: '#C8A46A' },
  { id: 'r2', nameAr: 'فضي', nameEn: 'Silver', color: '#E0E0E0' },
  { id: 'r3', nameAr: 'كحلي', nameEn: 'Navy Blue', color: '#1B263B' },
  { id: 'r4', nameAr: 'عنابي', nameEn: 'Burgundy', color: '#66101F' },
  { id: 'r5', nameAr: 'نحاسي', nameEn: 'Copper', color: '#b87333' },
];

const CARD_DESIGNS = [
  { id: 'c1', nameAr: 'كلاسيكي ذهبي', nameEn: 'Classic Gold', bg: 'bg-[#F8F5EF]', text: 'text-[#4A3525]', border: 'border-brand-gold' },
  { id: 'c2', nameAr: 'أسود ملكي', nameEn: 'Royal Black', bg: 'bg-[#1A1A1A]', text: 'text-brand-gold', border: 'border-brand-gold' },
  { id: 'c3', nameAr: 'أبيض بسيط', nameEn: 'Simple White', bg: 'bg-white', text: 'text-[#1A1A1A]', border: 'border-black/10' },
  { id: 'c4', nameAr: 'عنابي فاخر', nameEn: 'Luxury Crimson', bg: 'bg-[#5A1818]', text: 'text-[#F8F5EF]', border: 'border-brand-gold' },
  { id: 'c5', nameAr: 'شفاف أكريليك', nameEn: 'Transparent Acrylic', bg: 'bg-white/50 backdrop-blur-sm', text: 'text-[#1A1A1A]', border: 'border-white' },
];

const CONTAINERS = [
  { id: 'b1', type: 'box', nameAr: 'بوكس كلاسيك (صغير)', nameEn: 'Classic Box (Small)', price: 50, capacity: 4, img: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', descAr: 'مناسب للهدايا البسيطة والرقيقة.', descEn: 'Perfect for simple and delicate gifts.' },
  { id: 'b2', type: 'box', nameAr: 'بوكس مخملي فاخر (كبير)', nameEn: 'Luxury Velvet Box (Large)', price: 90, capacity: 10, img: 'https://images.unsplash.com/photo-1579738012674-32e602717904?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', descAr: 'تغليف مخملي يعكس أعلى معايير الفخامة.', descEn: 'Velvet wrapping that reflects the highest standards of luxury.' },
  { id: 't1', type: 'tray', nameAr: 'صينية ضيافة أكريليك', nameEn: 'Acrylic Hospitality Tray', price: 150, capacity: 15, img: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', descAr: 'صينية أكريليك شفافة للضيافة العصرية.', descEn: 'Transparent acrylic tray for modern hospitality.' },
  { id: 't2', type: 'tray', nameAr: 'صينية خشبية فاخرة', nameEn: 'Premium Wooden Tray', price: 200, capacity: 20, img: 'https://images.unsplash.com/photo-1599598425947-3300262955fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', descAr: 'مصنوعة من الخشب الطبيعي المحفور.', descEn: 'Crafted from finely engraved natural wood.' },
  { id: 'p1', type: 'plate', nameAr: 'صحن خزفي مطرز', nameEn: 'Embroidered Ceramic Plate', price: 120, capacity: 8, img: 'https://images.unsplash.com/photo-1511381939415-e440c94625f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', descAr: 'صحن تقديم خزفي بلمسات تراثية.', descEn: 'Ceramic serving plate with traditional heritage touches.' }
];

const WRAPPING_PRICE = 20;
const DELIVERY_PRICE = 35;

const Preview3DContainer = ({ type, wrapColor, ribbonColor, isRotating, scale = "scale-100" }: { type: string, wrapColor: string, ribbonColor: string, isRotating: boolean, scale?: string }) => {
  const isTray = type === 'tray' || type === 'plate';

  return (
    <div className={cn("relative mx-auto flex items-center justify-center transition-all duration-1000", scale, isTray ? "w-64 h-64 mt-8 mb-16" : "w-48 h-48 mt-16 mb-24")} style={{ perspective: '1200px' }}>
      <div 
        className={cn(
          "w-full h-full relative transition-transform duration-700 ease-in-out preserve-3d",
          isRotating ? "animate-[spin3d_12s_linear_infinite]" : ""
        )}
        style={{ 
          transform: isRotating ? undefined : (isTray ? 'rotateX(30deg) rotateY(-25deg)' : 'rotateX(-25deg) rotateY(-45deg)') 
        }}
      >
        <style>{`
          @keyframes spin3d {
            from { transform: rotateX(-25deg) rotateY(0deg); }
            to { transform: rotateX(-25deg) rotateY(360deg); }
          }
        `}</style>
        
        {isTray ? (
          <>
            {/* Tray Base */}
            <div className="absolute inset-0 m-auto w-56 h-56 rounded-full border-4 flex items-center justify-center shadow-2xl transition-colors duration-500" style={{ backgroundColor: wrapColor, borderColor: ribbonColor, transform: 'rotateX(75deg) translateZ(10px)' }}>
              <div className="w-48 h-48 rounded-full border-2 border-dashed opacity-50 flex items-center justify-center" style={{borderColor: ribbonColor}}>
                 <Sparkles className="w-8 h-8 opacity-20" style={{color: ribbonColor}} />
              </div>
            </div>
            {/* Tray Products Placeholder (Abstract) */}
            <div className="absolute inset-0 m-auto w-32 h-32 rounded-full flex flex-wrap gap-2 items-center justify-center" style={{ transform: 'rotateX(75deg) translateZ(30px)' }}>
               <div className="w-8 h-8 rounded-full bg-brand-brown/80 shadow-lg"></div>
               <div className="w-8 h-8 rounded-sm bg-brand-gold/80 shadow-lg"></div>
               <div className="w-8 h-8 rounded-full bg-brand-black/80 shadow-lg"></div>
            </div>
          </>
        ) : (
          <>
            {/* Top */}
            <div className="absolute w-48 h-48 border border-black/5 flex items-center justify-center transition-colors duration-500" style={{ backgroundColor: wrapColor, transform: 'rotateX(90deg) translateZ(48px)' }}>
              {/* Ribbon */}
              <div className="absolute w-full h-6 shadow-sm transition-colors duration-500" style={{ backgroundColor: ribbonColor, opacity: 0.9 }}></div>
              <div className="absolute h-full w-6 shadow-sm transition-colors duration-500" style={{ backgroundColor: ribbonColor, opacity: 0.9 }}></div>
              {/* Bow */}
              <div className="absolute z-10 flex items-center justify-center">
                <div className="w-12 h-12 border-[6px] rounded-[40%] absolute -translate-x-5 -translate-y-3 rotate-45 shadow-md transition-colors duration-500" style={{ borderColor: ribbonColor }}></div>
                <div className="w-12 h-12 border-[6px] rounded-[40%] absolute translate-x-5 -translate-y-3 -rotate-45 shadow-md transition-colors duration-500" style={{ borderColor: ribbonColor }}></div>
                <div className="w-8 h-8 rounded-full absolute shadow-lg transition-colors duration-500" style={{ backgroundColor: ribbonColor }}></div>
              </div>
            </div>
            
            {/* Front */}
            <div className="absolute w-48 h-24 border border-black/10 flex items-center justify-center brightness-95 transition-colors duration-500" style={{ backgroundColor: wrapColor, transform: 'translateZ(96px) translateY(96px)' }}>
              <div className="absolute h-full w-6 shadow-sm transition-colors duration-500" style={{ backgroundColor: ribbonColor, opacity: 0.9 }}></div>
            </div>
            
            {/* Right */}
            <div className="absolute w-48 h-24 border border-black/10 flex items-center justify-center brightness-90 transition-colors duration-500" style={{ backgroundColor: wrapColor, transform: 'rotateY(90deg) translateZ(96px) translateY(96px)' }}>
              <div className="absolute h-full w-6 shadow-sm transition-colors duration-500" style={{ backgroundColor: ribbonColor, opacity: 0.9 }}></div>
            </div>
            
            {/* Left */}
            <div className="absolute w-48 h-24 border border-black/10 flex items-center justify-center brightness-105 transition-colors duration-500" style={{ backgroundColor: wrapColor, transform: 'rotateY(-90deg) translateZ(96px) translateY(96px)' }}>
              <div className="absolute h-full w-6 shadow-sm transition-colors duration-500" style={{ backgroundColor: ribbonColor, opacity: 0.9 }}></div>
            </div>
            
            {/* Back */}
            <div className="absolute w-48 h-24 border border-black/10 flex items-center justify-center brightness-95 transition-colors duration-500" style={{ backgroundColor: wrapColor, transform: 'rotateY(180deg) translateZ(96px) translateY(96px)' }}>
              <div className="absolute h-full w-6 shadow-sm transition-colors duration-500" style={{ backgroundColor: ribbonColor, opacity: 0.9 }}></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export function GiftCustomization() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBox, setSelectedBox] = useState<string | null>(null);
  const [transitionMessage, setTransitionMessage] = useState<string | null>(null);
  
  // Step 2 State
  const [selectedProducts, setSelectedProducts] = useState<{product: any, quantity: number}[]>([]);

  const selectedContainerDetails = useMemo(() => CONTAINERS.find(c => c.id === selectedBox), [selectedBox]);
  const containerPrice = selectedContainerDetails?.price || 0;
  const containerCapacity = selectedContainerDetails?.capacity || 0;
  const containerType = selectedContainerDetails?.type || 'box';
  
  const totalProductsQuantity = useMemo(() => {
    return selectedProducts.reduce((sum, item) => sum + item.quantity, 0);
  }, [selectedProducts]);

  const isAtCapacity = totalProductsQuantity >= containerCapacity;

  const totalProductsPrice = useMemo(() => {
    return selectedProducts.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }, [selectedProducts]);

  const handleAddProduct = (product: any) => {
    if (totalProductsQuantity >= containerCapacity) return;

    setSelectedProducts(prev => {
      const existing = prev.find(p => p.product.id === product.id);
      let updated;
      if (existing) {
        updated = prev.map(p => p.product.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      } else {
        updated = [...prev, { product, quantity: 1 }];
      }

      // Check if newly updated total quantity has reached container capacity
      const newTotal = updated.reduce((sum, item) => sum + item.quantity, 0);
      if (newTotal >= containerCapacity) {
        setTransitionMessage(language === 'ar' 
          ? 'تم ملء الوعاء بالكامل! جاري الانتقال لمرحلة التغليف والرسالة...' 
          : 'Container is full! Transitioning to wrapping & message stage...'
        );
        setTimeout(() => {
          setCurrentStep(3);
          setTransitionMessage(null);
        }, 1200);
      }

      return updated;
    });
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(prev => {
      const existing = prev.find(p => p.product.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(p => p.product.id === productId ? { ...p, quantity: p.quantity - 1 } : p);
      }
      return prev.filter(p => p.product.id !== productId);
    });
  };
  
  // Step 3 State
  const [selectedCard, setSelectedCard] = useState(CARD_DESIGNS[0]);
  const [messageTo, setMessageTo] = useState('');
  const [messageFrom, setMessageFrom] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [wrapColor, setWrapColor] = useState(WRAPPING_COLORS[0].color);
  const [ribbonColor, setRibbonColor] = useState(RIBBON_COLORS[0].color);
  const [isRotating, setIsRotating] = useState(false);
  const [isPreview3DOpen, setIsPreview3DOpen] = useState(false);

  const handleNextStep = () => {
    if (currentStep === 4) {
      const customGiftProduct = {
        id: `custom-gift-${Date.now()}`,
        name: language === 'ar' 
          ? `هدية مخصصة (${selectedContainerDetails?.nameAr || 'وعاء'})` 
          : `Custom Gift (${selectedContainerDetails?.nameEn || 'Container'})`,
        price: containerPrice + totalProductsPrice + WRAPPING_PRICE + DELIVERY_PRICE,
        category: 'بوكسات هدايا',
        image: selectedContainerDetails?.img || 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: language === 'ar'
          ? `بوكس مخصص يحتوي على ${totalProductsQuantity} قطعة شوكولاتة فاخرة. تغليف بلون ${wrapColor} مع شريطة ${ribbonColor}.`
          : `Custom gift containing ${totalProductsQuantity} premium chocolates. Wrapped in ${wrapColor} paper with ${ribbonColor} ribbon.`,
        descriptionEn: `Custom gift containing ${totalProductsQuantity} premium chocolates. Wrapped in ${wrapColor} paper with ${ribbonColor} ribbon.`,
        inStock: true,
        defaultUom: 'uom_piece'
      };

      addToCart(customGiftProduct as any, 1);
      navigate('/checkout');
    } else {
      setCurrentStep(prev => Math.min(4, prev + 1));
    }
  };

  return (
    <div className="bg-brand-ivory min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl text-brand-black font-bold mb-4">
            {language === 'ar' ? 'صمم هديتك' : 'Design Your Gift'}
          </h1>
          <p className="text-brand-gray">
            {language === 'ar' ? 'تجربة تخصيص فاخرة تعكس ذوقك الرفيع في الإهداء.' : 'A luxury customization experience that reflects your sophisticated gifting taste.'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-12 relative">
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-brand-brown/20 -z-10"></div>
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex flex-col items-center bg-brand-ivory px-2">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300",
                  isActive ? "bg-brand-gold text-brand-black shadow-lg" : 
                  isCompleted ? "bg-brand-brown text-white" : "bg-brand-light-gray text-brand-gray"
                )}>
                  {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={cn(
                  "text-xs font-medium mt-2",
                  isActive || isCompleted ? "text-brand-black" : "text-brand-gray"
                )}>
                  {language === 'ar' ? step.titleAr : step.titleEn}
                </span>
              </div>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="bg-white border border-brand-black/5 p-6 md:p-10 mb-8 min-h-[400px]">
          
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-end mb-8 border-b border-brand-black/10 pb-4">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-brand-black">
                    {language === 'ar' ? 'اختر الوعاء' : 'Choose Container'}
                  </h2>
                  <p className="text-brand-gray mt-2">
                    {language === 'ar' ? 'تشكيلة واسعة من البوكسات الفاخرة والصواني الراقية.' : 'A wide selection of premium boxes and elegant trays.'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {CONTAINERS.map(container => (
                  <button 
                    key={container.id}
                    onClick={() => {
                      setSelectedBox(container.id);
                      setTransitionMessage(language === 'ar' 
                        ? 'تم اختيار الوعاء! جاري الانتقال لتشكيل الشوكولاتة...' 
                        : 'Container selected! Transitioning to chocolate assortment...'
                      );
                      setTimeout(() => {
                        setCurrentStep(2);
                        setTransitionMessage(null);
                      }, 1000);
                    }}
                    className={cn(
                      "text-right rounded-sm overflow-hidden border-2 transition-all group flex flex-col h-full",
                      selectedBox === container.id ? "border-brand-gold shadow-lg transform -translate-y-1" : "border-brand-black/5 hover:border-brand-gold/30 bg-white hover:shadow-md"
                    )}
                  >
                    <div className="aspect-[4/3] bg-brand-light-gray relative overflow-hidden">
                      <img 
                        src={container.img} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        alt="" 
                        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' }}
                      />
                      {selectedBox === container.id && (
                        <div className="absolute top-4 right-4 bg-brand-gold text-brand-black w-8 h-8 rounded-full flex items-center justify-center animate-fade-in shadow-md">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-sm text-xs flex items-center gap-1 font-medium">
                        {container.type === 'box' ? <Package className="w-3 h-3" /> : <Info className="w-3 h-3" />}
                        {language === 'ar' ? `السعة: ${container.capacity} منتجات` : `Capacity: ${container.capacity} products`}
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-brand-black text-lg mb-2">
                          {language === 'ar' ? container.nameAr : container.nameEn}
                        </h3>
                        <p className="text-brand-gray text-sm leading-relaxed mb-4">
                          {language === 'ar' ? container.descAr : container.descEn}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-brand-black/5">
                        <span className="text-sm font-bold text-brand-black/50">
                          {container.type === 'box' 
                            ? (language === 'ar' ? 'بوكس' : 'Box') 
                            : (language === 'ar' ? 'صينية/صحن' : 'Tray/Plate')}
                        </span>
                        <span className="text-brand-brown font-bold text-lg">
                          {container.price} {language === 'ar' ? 'ر.س' : 'SAR'}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-end border-b border-brand-black/10 pb-4 mb-6">
                  <div>
                    <h2 className="font-serif text-3xl font-bold">
                      {language === 'ar' ? 'تنسيق المحتويات' : 'Assort Contents'}
                    </h2>
                    <p className="text-brand-gray mt-2">
                      {language === 'ar' 
                        ? `اختر المنتجات لإضافتها إلى ${language === 'ar' ? selectedContainerDetails?.nameAr : selectedContainerDetails?.nameEn}.` 
                        : `Select products to add to ${language === 'ar' ? selectedContainerDetails?.nameAr : selectedContainerDetails?.nameEn}.`}
                    </p>
                  </div>
                  <div className="text-left bg-brand-light-gray px-4 py-2 rounded-sm border border-brand-black/5">
                    <span className="text-sm text-brand-gray block mb-1">
                      {language === 'ar' ? 'السعة المتبقية' : 'Remaining Capacity'}
                    </span>
                    <span className={cn("font-bold text-lg", isAtCapacity ? "text-red-500" : "text-brand-black")}>
                      {containerCapacity - totalProductsQuantity} <span className="text-sm font-normal text-brand-gray">{language === 'ar' ? `من ${containerCapacity}` : `of ${containerCapacity}`}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[600px] overflow-y-auto pr-2 custom-scrollbar pb-10">
                  {MOCK_PRODUCTS.map(product => {
                    const quantity = selectedProducts.find(p => p.product.id === product.id)?.quantity || 0;
                    return (
                      <div key={product.id} className="bg-white border border-brand-black/5 rounded-sm p-4 flex gap-4 hover:border-brand-gold/30 hover:shadow-sm transition-all group">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-24 h-24 object-cover rounded-sm border border-brand-black/5"
                          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' }}
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-sm text-brand-black line-clamp-2 leading-tight group-hover:text-brand-brown transition-colors">
                              {language === 'ar' ? product.name : product.nameEn || product.name}
                            </h3>
                            <p className="text-brand-brown text-sm font-bold mt-2">{product.price} {language === 'ar' ? 'ر.س' : 'SAR'}</p>
                          </div>
                          <div className="flex items-center gap-3 mt-4">
                            {quantity === 0 ? (
                              <button 
                                onClick={() => handleAddProduct(product)}
                                disabled={isAtCapacity}
                                className={cn(
                                  "text-xs px-3 py-2 rounded-sm font-bold w-full transition-colors flex items-center justify-center gap-2",
                                  isAtCapacity ? "bg-brand-light-gray text-brand-gray cursor-not-allowed" : "bg-brand-gold/20 text-brand-brown hover:bg-brand-gold hover:text-brand-black"
                                )}
                              >
                                <Plus className="w-3 h-3" />
                                {language === 'ar' ? 'إضافة' : 'Add'}
                              </button>
                            ) : (
                              <div className="flex items-center justify-between w-full bg-brand-ivory border border-brand-gold/30 rounded-sm">
                                <button onClick={() => handleRemoveProduct(product.id)} className="p-2 text-brand-black hover:text-brand-brown hover:bg-brand-gold/10 transition-colors"><Minus className="w-4 h-4" /></button>
                                <span className="font-bold text-sm text-brand-brown w-8 text-center">{quantity}</span>
                                <button 
                                  onClick={() => handleAddProduct(product)} 
                                  disabled={isAtCapacity}
                                  className={cn("p-2 transition-colors", isAtCapacity ? "text-brand-gray/30 cursor-not-allowed" : "text-brand-black hover:text-brand-brown hover:bg-brand-gold/10")}
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-brand-ivory p-6 rounded-sm border border-brand-gold/20 shadow-sm h-fit sticky top-24">
                <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-brand-brown" />
                  {language === 'ar' 
                    ? `محتويات ${containerType === 'box' ? 'البوكس' : 'الصينية'}` 
                    : `${containerType === 'box' ? 'Box' : 'Tray'} Contents`}
                </h3>
                {selectedProducts.length === 0 ? (
                  <div className="text-center py-12 px-4 border-2 border-dashed border-brand-black/10 rounded-sm bg-white/50">
                    <Gift className="w-12 h-12 text-brand-gray/30 mx-auto mb-3" />
                    <p className="text-brand-gray text-sm">
                      {language === 'ar' ? 'لم تقم بإضافة أي منتجات بعد.' : 'You have not added any products yet.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {selectedProducts.map(item => (
                      <div key={item.product.id} className="flex justify-between items-start text-sm bg-white p-3 rounded-sm border border-brand-black/5 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="bg-brand-light-gray text-brand-black px-2 py-1 rounded-sm text-xs font-bold w-8 text-center">
                            {item.quantity}x
                          </div>
                          <span className="font-medium text-brand-black flex-1 pr-2 line-clamp-2 leading-tight">
                            {language === 'ar' ? item.product.name : item.product.nameEn || item.product.name}
                          </span>
                        </div>
                        <span className="font-bold text-brand-brown whitespace-nowrap mr-2">{item.product.price * item.quantity} {language === 'ar' ? 'ر.س' : 'SAR'}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="border-t border-brand-black/10 pt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-gray">
                      {language === 'ar' 
                        ? `سعر ${containerType === 'box' ? 'البوكس' : 'الصينية'}` 
                        : `${containerType === 'box' ? 'Box' : 'Tray'} Price`}
                    </span>
                    <span className="font-medium">{containerPrice} {language === 'ar' ? 'ر.س' : 'SAR'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-gray">
                      {language === 'ar' ? `المنتجات (${totalProductsQuantity})` : `Products (${totalProductsQuantity})`}
                    </span>
                    <span className="font-medium">{totalProductsPrice} {language === 'ar' ? 'ر.س' : 'SAR'}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-4 border-t border-brand-black/10 mt-2">
                    <span>{language === 'ar' ? 'المجموع المؤقت' : 'Subtotal'}</span>
                    <span className="text-brand-brown">{containerPrice + totalProductsPrice} {language === 'ar' ? 'ر.س' : 'SAR'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="animate-fade-in space-y-16">
              {/* Wrapping Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="font-serif text-2xl font-bold mb-8">
                    {language === 'ar' ? 'اختر تفاصيل التغليف' : 'Choose Wrapping Details'}
                  </h2>
                  
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-brand-black mb-4">
                      {language === 'ar' ? 'لون ورق التغليف' : 'Wrapping Paper Color'}
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {WRAPPING_COLORS.map(color => (
                        <button
                          key={color.id}
                          onClick={() => setWrapColor(color.color)}
                          className={cn(
                            "w-12 h-12 rounded-full border-2 transition-all",
                            wrapColor === color.color ? "border-brand-gold scale-110 shadow-md" : "border-brand-black/10 hover:scale-105"
                          )}
                          style={{ backgroundColor: color.color }}
                          title={language === 'ar' ? color.nameAr : color.nameEn}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-brand-black mb-4">
                      {language === 'ar' ? 'لون شريطة الهدايا (Ribbon)' : 'Gift Ribbon Color'}
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {RIBBON_COLORS.map(color => (
                        <button
                          key={color.id}
                          onClick={() => setRibbonColor(color.color)}
                          className={cn(
                            "w-12 h-12 rounded-full border-2 transition-all",
                            ribbonColor === color.color ? "border-brand-gold scale-110 shadow-md" : "border-brand-black/10 hover:scale-105"
                          )}
                          style={{ backgroundColor: color.color }}
                          title={language === 'ar' ? color.nameAr : color.nameEn}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-brand-light-gray/20 rounded-sm border border-brand-gold/20 p-8 flex flex-col items-center justify-center relative min-h-[400px]">
                  <button 
                    onClick={() => setIsRotating(!isRotating)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm text-brand-gray hover:text-brand-gold transition-colors z-20"
                    title={language === 'ar' ? 'تدوير / إيقاف' : 'Rotate / Stop'}
                  >
                    <Rotate3D className="w-5 h-5" />
                  </button>

                  <button 
                    onClick={() => setIsPreview3DOpen(true)}
                    className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-sm text-brand-gray hover:text-brand-gold border border-brand-gold/10 hover:border-brand-gold/30 transition-all duration-300 z-20 flex items-center gap-1.5 text-xs font-bold px-3 cursor-pointer shadow-sm active:scale-95"
                    title={language === 'ar' ? 'معاينة ثلاثية الأبعاد تفاعلية' : 'Interactive 3D Preview'}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
                    <span>{language === 'ar' ? 'معاينة تفاعلية تفصيلية' : 'Full 3D Preview'}</span>
                  </button>
                  
                  <div className="text-sm font-bold text-brand-black/60 uppercase tracking-wider mb-8 z-20">
                    {language === 'ar' ? 'معاينة التغليف' : 'Wrapping Preview'}
                  </div>
                  
                  <Preview3DContainer type={containerType} wrapColor={wrapColor} ribbonColor={ribbonColor} isRotating={isRotating} />
                </div>
              </div>

              <div className="border-t border-brand-black/10 pt-16"></div>

              {/* Message Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div>
                  <h2 className="font-serif text-2xl font-bold mb-8">
                    {language === 'ar' ? 'اكتب رسالتك (اختياري)' : 'Write Your Message (Optional)'}
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-brand-black mb-2">
                        {language === 'ar' ? 'اختر تصميم البطاقة' : 'Select Card Design'}
                      </label>
                      <div className="flex gap-4 overflow-x-auto pb-2">
                        {CARD_DESIGNS.map(design => (
                          <button
                            key={design.id}
                            onClick={() => setSelectedCard(design)}
                            className={cn(
                              "flex-shrink-0 w-24 h-32 rounded-sm border-2 transition-all flex items-center justify-center p-2 text-xs text-center font-serif",
                              selectedCard.id === design.id ? "border-brand-gold shadow-md scale-105" : "border-brand-black/10 hover:border-brand-black/30",
                              design.bg, design.text
                            )}
                          >
                            {language === 'ar' ? design.nameAr : design.nameEn}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="msgTo" className="block text-sm font-bold text-brand-black mb-2">
                          {language === 'ar' ? 'إلى' : 'To'}
                        </label>
                        <input 
                          id="msgTo"
                          type="text" 
                          value={messageTo}
                          onChange={(e) => setMessageTo(e.target.value)}
                          placeholder={language === 'ar' ? 'الاسم' : 'Name'}
                          className="w-full border border-brand-black/10 rounded-sm px-4 py-3 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
                        />
                      </div>
                      <div>
                        <label htmlFor="msgFrom" className="block text-sm font-bold text-brand-black mb-2">
                          {language === 'ar' ? 'من' : 'From'}
                        </label>
                        <input 
                          id="msgFrom"
                          type="text" 
                          value={messageFrom}
                          onChange={(e) => setMessageFrom(e.target.value)}
                          placeholder={language === 'ar' ? 'الاسم' : 'Name'}
                          className="w-full border border-brand-black/10 rounded-sm px-4 py-3 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="msgBody" className="block text-sm font-bold text-brand-black mb-2">
                        {language === 'ar' ? 'نص الرسالة' : 'Message Body'}
                      </label>
                      <textarea 
                        id="msgBody"
                        value={messageBody}
                        onChange={(e) => setMessageBody(e.target.value)}
                        placeholder={language === 'ar' ? 'اكتب أمنياتك وتهانيك هنا...' : 'Write your wishes and greetings here...'}
                        rows={4}
                        className="w-full border border-brand-black/10 rounded-sm px-4 py-3 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="bg-brand-light-gray/20 rounded-sm border border-brand-gold/20 p-8 flex flex-col items-center justify-center min-h-[400px]">
                  <div className="text-sm font-bold text-brand-black/60 uppercase tracking-wider mb-8">
                    {language === 'ar' ? 'معاينة البطاقة' : 'Card Preview'}
                  </div>
                  
                  <div 
                    className={cn(
                      "w-full max-w-sm aspect-[3/4] p-8 rounded-sm shadow-xl flex flex-col justify-between border relative",
                      selectedCard.bg, selectedCard.text, selectedCard.border
                    )}
                  >
                    <div className="font-serif text-xl opacity-90">
                      {messageTo ? (language === 'ar' ? `إلى: ${messageTo}` : `To: ${messageTo}`) : (language === 'ar' ? 'إلى: ...' : 'To: ...')}
                    </div>
                    
                    <div className="font-serif text-2xl text-center leading-relaxed my-8 break-words overflow-hidden whitespace-pre-wrap">
                      {messageBody || (language === 'ar' ? 'نص الرسالة سيظهر هنا...' : 'Message text will appear here...')}
                    </div>

                    <div className="font-serif text-xl opacity-90 text-left">
                      {messageFrom ? (language === 'ar' ? `من: ${messageFrom}` : `From: ${messageFrom}`) : (language === 'ar' ? 'من: ...' : 'From: ...')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="animate-fade-in max-w-5xl mx-auto py-10">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-gold/10 rounded-full mb-6 border-2 border-brand-gold/30">
                  <Sparkles className="w-10 h-10 text-brand-brown" />
                </div>
                <h2 className="font-serif text-4xl font-bold mb-4">
                  {language === 'ar' ? 'تحفة فنية تليق بإهدائك' : 'A Masterpiece Worthy of Your Gifting'}
                </h2>
                <p className="text-brand-gray text-lg max-w-2xl mx-auto">
                  {language === 'ar' 
                    ? 'تم تصميم هديتك بعناية فائقة. راجع التفاصيل النهائية واستمتع بالمعاينة التفاعلية قبل تأكيد الطلب.' 
                    : 'Your gift was designed with ultimate care. Review the final details and enjoy the interactive preview before confirming your order.'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* 3D Showcase */}
                <div className="bg-brand-black rounded-sm p-12 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px] border-4 border-brand-gold/20 shadow-2xl group">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-gold via-brand-black to-brand-black pointer-events-none"></div>
                  
                  <div className="relative z-10 w-full h-full flex flex-col items-center justify-center transform group-hover:scale-110 transition-transform duration-1000">
                     <Preview3DContainer type={containerType} wrapColor={wrapColor} ribbonColor={ribbonColor} isRotating={true} scale="scale-125 md:scale-150" />
                  </div>
                  
                  <div className="absolute bottom-6 left-0 right-0 text-center z-20">
                    <button 
                      onClick={() => setIsPreview3DOpen(true)}
                      className="bg-brand-black/85 text-brand-gold hover:bg-brand-gold hover:text-brand-black px-5 py-2.5 rounded-sm text-sm font-bold backdrop-blur-md border border-brand-gold/40 inline-flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-xl active:scale-95 cursor-pointer"
                    >
                       <Rotate3D className="w-4 h-4 animate-spin-slow" />
                       {language === 'ar' ? 'معاينة ثلاثية الأبعاد عالية الدقة' : 'High-Definition 3D Preview'}
                    </button>
                  </div>
                </div>

                {/* Final Bill */}
                <div className="bg-white border border-brand-black/10 rounded-sm shadow-xl overflow-hidden sticky top-24">
                  <div className="bg-brand-black text-brand-gold px-8 py-6 border-b border-brand-gold/20 flex items-center justify-between">
                    <h3 className="font-serif text-2xl font-bold">
                      {language === 'ar' ? 'الفاتورة النهائية' : 'Final Invoice'}
                    </h3>
                    <CreditCard className="w-6 h-6" />
                  </div>
                  
                  <div className="p-8 space-y-8">
                    {/* Container */}
                    <div className="flex justify-between items-start border-b border-brand-black/5 pb-6">
                      <div>
                        <h4 className="font-bold text-brand-black mb-1 flex items-center gap-2">
                          <Package className="w-4 h-4 text-brand-brown" />
                          {language === 'ar' ? selectedContainerDetails?.nameAr : selectedContainerDetails?.nameEn}
                        </h4>
                        <p className="text-sm text-brand-gray">
                          {containerType === 'box' 
                            ? (language === 'ar' ? 'تغليف بوكس' : 'Box Wrapping') 
                            : (language === 'ar' ? 'تنسيق صينية' : 'Tray Arrangement')}
                        </p>
                      </div>
                      <span className="font-bold text-lg">{containerPrice} {language === 'ar' ? 'ر.س' : 'SAR'}</span>
                    </div>
                    
                    {/* Products */}
                    <div className="border-b border-brand-black/5 pb-6">
                      <h4 className="font-bold text-brand-black mb-4 flex items-center gap-2">
                        <Gift className="w-4 h-4 text-brand-brown" />
                        {language === 'ar' ? `المنتجات المختارة (${totalProductsQuantity})` : `Selected Products (${totalProductsQuantity})`}
                      </h4>
                      <ul className="space-y-3">
                        {selectedProducts.map(item => (
                          <li key={item.product.id} className="flex justify-between text-sm">
                            <span className="text-brand-gray font-medium flex items-center gap-2">
                              <span className="bg-brand-light-gray px-2 py-0.5 rounded-sm text-brand-black text-xs">{item.quantity}x</span>
                              {language === 'ar' ? item.product.name : item.product.nameEn || item.product.name}
                            </span>
                            <span className="font-bold">{item.product.price * item.quantity} {language === 'ar' ? 'ر.س' : 'SAR'}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Extras */}
                    <div className="border-b border-brand-black/5 pb-6">
                      <h4 className="font-bold text-brand-black mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-brand-brown" />
                        {language === 'ar' ? 'الخدمات الإضافية' : 'Additional Services'}
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex justify-between text-sm">
                          <span className="text-brand-gray font-medium">
                            {language === 'ar' ? 'خدمة التغليف والتنسيق اليدوي' : 'Wrapping & Hand-styling Service'}
                          </span>
                          <span className="font-bold">{WRAPPING_PRICE} {language === 'ar' ? 'ر.س' : 'SAR'}</span>
                        </li>
                        <li className="flex justify-between text-sm">
                          <span className="text-brand-gray font-medium flex items-center gap-2">
                            <Truck className="w-4 h-4" /> 
                            {language === 'ar' ? 'توصيل خاص ومبرد' : 'Special Refrigerated Delivery'}
                          </span>
                          <span className="font-bold">{DELIVERY_PRICE} {language === 'ar' ? 'ر.س' : 'SAR'}</span>
                        </li>
                      </ul>
                    </div>
                    
                    {/* Total */}
                    <div className="bg-brand-ivory p-6 rounded-sm border border-brand-gold/30 flex justify-between items-center mt-4">
                      <div>
                        <span className="block text-brand-gray font-medium text-sm mb-1">
                          {language === 'ar' ? 'المجموع الكلي' : 'Grand Total'}
                        </span>
                        <span className="text-xs text-brand-gray/60">
                          {language === 'ar' ? 'شامل ضريبة القيمة المضافة' : 'Includes Value Added Tax'}
                        </span>
                      </div>
                      <span className="font-serif font-bold text-3xl text-brand-brown">
                        {containerPrice + totalProductsPrice + WRAPPING_PRICE + DELIVERY_PRICE} <span className="text-lg">{language === 'ar' ? 'ر.س' : 'SAR'}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="flex gap-2"
          >
            {language === 'ar' ? (
              <>
                <ChevronRight className="w-4 h-4" />
                السابق
              </>
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                Previous
              </>
            )}
          </Button>

          <Button 
            variant="primary" 
            onClick={handleNextStep}
            disabled={currentStep === 1 && !selectedBox}
            className="flex gap-2 px-8"
          >
            {currentStep === 4 ? (
              language === 'ar' ? 'إضافة للسلة' : 'Add to Cart'
            ) : (
              language === 'ar' ? 'التالي' : 'Next'
            )}
            {currentStep !== 4 && (
              language === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Elegant Auto-Transition Notification */}
        {transitionMessage && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-brand-black/95 text-brand-gold border border-brand-gold/30 px-6 py-4 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-3 animate-fade-in backdrop-blur-md max-w-[90vw] text-center font-bold">
            <div className="w-4 h-4 border-2 border-brand-gold border-t-transparent rounded-full animate-spin shrink-0" />
            <span className="text-sm tracking-wide">{transitionMessage}</span>
          </div>
        )}

        <Preview3DModal 
          isOpen={isPreview3DOpen}
          onClose={() => setIsPreview3DOpen(false)}
          type={containerType}
          wrapColor={wrapColor}
          ribbonColor={ribbonColor}
          selectedProducts={selectedProducts}
        />

      </div>
    </div>
  );
}
