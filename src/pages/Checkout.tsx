import { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { MOCK_PRODUCTS } from '../data';
import { Gift, Check, Trash2, Plus, Minus, Truck, FileText } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { getUoms, getPriceInUom } from '../utils/uom';
import { useQuickTrack } from '../context/QuickTrackContext';

export function Checkout() {
  const { language } = useLanguage();
  const { cartItems, cartTotal, cartCount, updateQuantity, removeFromCart } = useCart();
  const uomsList = getUoms();
  const { openQuickTrack } = useQuickTrack();
  
  // Mock loyalty points data
  const userPoints = 500;
  const pointsToCurrencyRate = 0.01; // 100 points = 1 SAR
  const maxDiscount = userPoints * pointsToCurrencyRate;
  
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [wrappingPaper, setWrappingPaper] = useState('none');
  const [ribbon, setRibbon] = useState('none');
  
  // Personalized message card states
  const [hasMessageCard, setHasMessageCard] = useState(false);
  const [cardStyle, setCardStyle] = useState('classic_ivory');
  const [cardRecipient, setCardRecipient] = useState('');
  const [cardSender, setCardSender] = useState('');
  const [cardMessage, setCardMessage] = useState('');
  
  const [orderStatus, setOrderStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [boxOpened, setBoxOpened] = useState(false);

  // Dynamic Odoo Settings
  const vatPercent = parseInt(localStorage.getItem('odoo-vat-percent') || '15');
  const freeShippingThreshold = parseInt(localStorage.getItem('odoo-free-shipping') || '350');
  const showLoyalty = localStorage.getItem('odoo-show-loyalty') !== 'false';
  
  const subtotal = cartTotal;
  const shipping = subtotal === 0 ? 0 : (subtotal >= freeShippingThreshold ? 0 : 30);
  const baseWrappingPrice = wrappingPaper !== 'none' ? 25 : 0;
  const cardPrice = hasMessageCard ? 10 : 0;
  const wrappingPrice = baseWrappingPrice + cardPrice;
  const discount = (redeemPoints && showLoyalty) ? maxDiscount : 0;
  const total = subtotal + shipping + wrappingPrice - discount;
  
  // Calculate points earned (e.g., 5 points per 1 SAR spent)
  const pointsEarned = Math.floor(subtotal * 5);

  const handleConfirm = () => {
    if (cartCount === 0) return;
    setOrderStatus('processing');
    setTimeout(() => {
      setOrderStatus('success');
      setTimeout(() => {
        setBoxOpened(true);
        // Clear cart after order is successfully completed
        localStorage.removeItem('maisonh_cart');
      }, 800); // delay before box opens
    }, 2000); // processing time
  };

  return (
    <div className="bg-brand-ivory min-h-screen py-12 relative overflow-hidden">
      
      {/* Overlay Animation */}
      {orderStatus !== 'idle' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-ivory">
          
          {orderStatus === 'processing' && (
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 border-4 border-brand-brown/20 border-t-brand-gold rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="font-serif text-xl font-bold text-brand-black animate-pulse">
                {language === 'ar' ? 'جاري معالجة الطلب...' : 'Processing order...'}
              </h2>
            </div>
          )}
          
          {orderStatus === 'success' && (
            <div className="relative flex flex-col items-center justify-center w-full h-full perspective-1000">
              
              {/* The Success Message (Revealed) */}
              <div className={cn(
                "absolute flex flex-col items-center text-center transition-all duration-1000 ease-out z-10",
                boxOpened ? "translate-y-[-80px] opacity-100 scale-100" : "translate-y-[20px] opacity-0 scale-50"
              )}>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto shadow-inner">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="font-serif text-4xl font-bold text-brand-black mb-4">
                  {language === 'ar' ? 'تم الطلب بنجاح!' : 'Order Placed Successfully!'}
                </h2>
                <p className="text-brand-gray mb-2">
                  {language === 'ar' ? 'رقم الطلب: #ORD-84392' : 'Order ID: #ORD-84392'}
                </p>
                <p className="text-brand-gray mb-8">
                  {language === 'ar' ? 'شكراً لتسوقك معنا. سنقوم بتجهيز طلبك قريباً.' : 'Thank you for shopping with us. We will prepare your order shortly.'}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <Button onClick={() => window.location.href = '/'}>
                    {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                  </Button>
                  <Button 
                    variant="outline" 
                    id="checkout-quick-track-btn"
                    onClick={() => openQuickTrack('ORD-84392')}
                    className="flex items-center gap-2"
                  >
                    <Truck className="w-4 h-4" />
                    {language === 'ar' ? 'تتبع حالة طلبك سريعاً' : 'Quick Track Order Now'}
                  </Button>
                </div>
              </div>

              {/* The Gift Box */}
              <div className={cn(
                "relative w-48 h-48 transition-all duration-1000 ease-in-out z-20",
                boxOpened ? "translate-y-[120px] opacity-0 scale-95" : "translate-y-0 opacity-100 scale-100"
              )}>
                
                {/* Box lid */}
                <div className={cn(
                  "absolute top-0 left-0 w-full h-14 bg-brand-brown rounded-sm z-30 origin-bottom transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-lg",
                  boxOpened ? "-translate-y-24 -rotate-12 opacity-0 scale-110" : "translate-y-0 rotate-0 opacity-100 scale-100"
                )}>
                  {/* Ribbon horizontal on lid */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-full bg-brand-gold shadow-sm"></div>
                  {/* Ribbon bow */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-20 h-12 flex justify-center">
                    <div className="w-10 h-10 border-4 border-brand-gold rounded-full absolute -ml-6 shadow-sm"></div>
                    <div className="w-10 h-10 border-4 border-brand-gold rounded-full absolute ml-6 shadow-sm"></div>
                    <div className="w-4 h-4 bg-brand-gold rounded-full absolute top-3 shadow-sm z-10"></div>
                  </div>
                </div>
                
                {/* Box body */}
                <div className="absolute top-12 left-[4%] w-[92%] h-36 bg-brand-black rounded-b-sm z-20 shadow-2xl overflow-hidden">
                  {/* Ribbon vertical on body */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-full bg-brand-gold shadow-sm"></div>
                  {/* Inside shading */}
                  <div className={cn(
                    "absolute top-0 left-0 w-full h-8 bg-black/40 transition-opacity duration-500",
                    boxOpened ? "opacity-100" : "opacity-0"
                  )}></div>
                </div>
                
                {/* Box Backing (Inside) */}
                <div className="absolute top-12 left-[4%] w-[92%] h-36 bg-brand-brown/80 rounded-b-sm z-10"></div>

              </div>
            </div>
          )}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl font-bold text-brand-black">
            {language === 'ar' ? 'إتمام الطلب' : 'Checkout'}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main Checkout Form */}
          <div className="w-full lg:w-2/3 space-y-8">
            
            {/* Customer Info */}
            <section className="bg-white p-6 md:p-8 border border-black/5 rounded-sm shadow-sm">
              <h2 className="font-serif text-xl font-bold mb-6 border-b border-brand-brown/10 pb-4">
                {language === 'ar' ? 'المعلومات الشخصية' : 'Personal Information'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-brand-gray mb-1">
                    {language === 'ar' ? 'الاسم الأول' : 'First Name'}
                  </label>
                  <input type="text" className="w-full bg-brand-light-gray/30 border border-brand-brown/20 rounded-md p-3 focus:outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown" />
                </div>
                <div>
                  <label className="block text-sm text-brand-gray mb-1">
                    {language === 'ar' ? 'اسم العائلة' : 'Last Name'}
                  </label>
                  <input type="text" className="w-full bg-brand-light-gray/30 border border-brand-brown/20 rounded-md p-3 focus:outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-brand-gray mb-1">
                    {language === 'ar' ? 'رقم الجوال' : 'Mobile Number'}
                  </label>
                  <input type="tel" dir="ltr" className="w-full bg-brand-light-gray/30 border border-brand-brown/20 rounded-md p-3 focus:outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown text-right" placeholder="+966 5X XXX XXXX" />
                </div>
              </div>
            </section>

            {/* Shipping Info */}
            <section className="bg-white p-6 md:p-8 border border-black/5 rounded-sm shadow-sm">
              <h2 className="font-serif text-xl font-bold mb-6 border-b border-brand-brown/10 pb-4">
                {language === 'ar' ? 'عنوان التوصيل' : 'Shipping Address'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-brand-gray mb-1">
                    {language === 'ar' ? 'المدينة' : 'City'}
                  </label>
                  <select className="w-full bg-brand-light-gray/30 border border-brand-brown/20 rounded-md p-3 focus:outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown">
                    <option>{language === 'ar' ? 'الرياض' : 'Riyadh'}</option>
                    <option>{language === 'ar' ? 'جدة' : 'Jeddah'}</option>
                    <option>{language === 'ar' ? 'الدمام' : 'Dammam'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-brand-gray mb-1">
                    {language === 'ar' ? 'العنوان بالتفصيل (الحي، الشارع، المبنى)' : 'Detailed Address (District, Street, Building)'}
                  </label>
                  <textarea rows={3} className="w-full bg-brand-light-gray/30 border border-brand-brown/20 rounded-md p-3 focus:outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown"></textarea>
                </div>
              </div>
            </section>

            {/* Gift Wrapping Options */}
            <section className="bg-white p-6 md:p-8 border border-black/5 rounded-sm shadow-sm">
              <h2 className="font-serif text-xl font-bold mb-6 border-b border-brand-brown/10 pb-4">
                {language === 'ar' ? 'خيارات تغليف الهدايا' : 'Gift Wrapping Options'}
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-brand-black mb-3">
                    {language === 'ar' ? 'ورق التغليف (Premium Paper)' : 'Wrapping Paper (Premium Paper)'}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { id: 'none', labelAr: 'بدون تغليف', labelEn: 'No Wrapping' },
                      { id: 'matte_white', labelAr: 'أبيض مطفي', labelEn: 'Matte White' },
                      { id: 'textured_black', labelAr: 'أسود بارز', labelEn: 'Textured Black' },
                      { id: 'gold_foil', labelAr: 'رقائق ذهبية', labelEn: 'Gold Foil' }
                    ].map(option => (
                      <label 
                        key={option.id}
                        className={`border rounded p-3 text-center cursor-pointer transition-colors text-sm ${wrappingPaper === option.id ? 'border-brand-gold bg-brand-gold/5 font-bold text-brand-black' : 'border-brand-brown/20 hover:border-brand-gold/50 text-brand-gray'}`}
                      >
                        <input 
                          type="radio" 
                          name="wrappingPaper" 
                          className="hidden" 
                          checked={wrappingPaper === option.id}
                          onChange={() => setWrappingPaper(option.id)}
                        />
                        {language === 'ar' ? option.labelAr : option.labelEn}
                      </label>
                    ))}
                  </div>
                </div>

                {wrappingPaper !== 'none' && (
                  <div className="animate-fade-in">
                    <label className="block text-sm font-bold text-brand-black mb-3">
                      {language === 'ar' ? 'شريطة التغليف (Velvet Ribbon)' : 'Velvet Ribbon'}
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { id: 'none', labelAr: 'بدون شريطة', labelEn: 'No Ribbon' },
                        { id: 'velvet_red', labelAr: 'مخمل أحمر', labelEn: 'Velvet Red' },
                        { id: 'velvet_navy', labelAr: 'مخمل كحلي', labelEn: 'Velvet Navy' },
                        { id: 'satin_gold', labelAr: 'ساتان ذهبي', labelEn: 'Satin Gold' }
                      ].map(option => (
                        <label 
                          key={option.id}
                          className={`border rounded p-3 text-center cursor-pointer transition-colors text-sm ${ribbon === option.id ? 'border-brand-gold bg-brand-gold/5 font-bold text-brand-black' : 'border-brand-brown/20 hover:border-brand-gold/50 text-brand-gray'}`}
                        >
                          <input 
                            type="radio" 
                            name="ribbon" 
                            className="hidden" 
                            checked={ribbon === option.id}
                            onChange={() => setRibbon(option.id)}
                          />
                          {language === 'ar' ? option.labelAr : option.labelEn}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Personalized Message Card Subsection */}
                <div className="border-t border-brand-brown/10 pt-6 mt-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={hasMessageCard}
                      onChange={(e) => setHasMessageCard(e.target.checked)}
                      className="w-5 h-5 rounded border-brand-brown/30 text-brand-brown focus:ring-brand-brown accent-brand-brown cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="font-serif text-sm font-bold text-brand-black group-hover:text-brand-gold transition-colors flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-brand-gold" />
                        {language === 'ar' ? 'إضافة بطاقة إهداء فاخرة (+10 ر.س)' : 'Add Premium Gift Card (+10 SAR)'}
                      </span>
                      <span className="text-xs text-brand-gray">
                        {language === 'ar' ? 'اكتب رسالة خاصة بخط اليد وبطاقة مذهبة' : 'Write a customized handwritten-style gilded message card'}
                      </span>
                    </div>
                  </label>

                  {hasMessageCard && (
                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in bg-brand-ivory/20 border border-brand-gold/15 p-5 rounded-md">
                      {/* Left: Inputs */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-brand-gold font-bold mb-2">
                            {language === 'ar' ? 'تصميم البطاقة الفاخرة' : 'Premium Card Design'}
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: 'classic_ivory', ar: 'عاجي كلاسيكي', en: 'Classic Ivory' },
                              { id: 'midnight_gold', ar: 'أسود ملكي مذهب', en: 'Midnight Gold' },
                              { id: 'rose_romance', ar: 'مخمل وردي', en: 'Rose Velvet' },
                              { id: 'royal_emerald', ar: 'أخضر زمردي', en: 'Royal Emerald' }
                            ].map(card => (
                              <button
                                key={card.id}
                                type="button"
                                onClick={() => setCardStyle(card.id)}
                                className={cn(
                                  "p-2.5 rounded text-xs text-center font-semibold border transition-all cursor-pointer",
                                  cardStyle === card.id 
                                    ? "ring-2 ring-brand-gold font-bold border-brand-gold bg-brand-gold/5" 
                                    : "opacity-80 hover:opacity-100 bg-white border-brand-brown/15"
                                )}
                              >
                                {language === 'ar' ? card.ar : card.en}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-brand-gray mb-1">
                              {language === 'ar' ? 'إلى (اسم المستلم)' : 'To (Recipient)'}
                            </label>
                            <input 
                              type="text" 
                              value={cardRecipient}
                              onChange={(e) => setCardRecipient(e.target.value)}
                              placeholder={language === 'ar' ? 'عبدالعزيز...' : 'Recipient Name...'}
                              className="w-full bg-white border border-brand-brown/15 rounded-md p-2.5 text-xs focus:outline-none focus:border-brand-gold"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-brand-gray mb-1">
                              {language === 'ar' ? 'من (اسم المرسل)' : 'From (Sender)'}
                            </label>
                            <input 
                              type="text" 
                              value={cardSender}
                              onChange={(e) => setCardSender(e.target.value)}
                              placeholder={language === 'ar' ? 'سارة...' : 'Sender Name...'}
                              className="w-full bg-white border border-brand-brown/15 rounded-md p-2.5 text-xs focus:outline-none focus:border-brand-gold"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs text-brand-gray">
                              {language === 'ar' ? 'رسالة الإهداء الخاصة' : 'Gift Message'}
                            </label>
                            <span className="text-[10px] text-brand-gray font-mono">
                              {cardMessage.length}/150
                            </span>
                          </div>
                          <textarea 
                            rows={3} 
                            maxLength={150}
                            value={cardMessage}
                            onChange={(e) => setCardMessage(e.target.value)}
                            placeholder={language === 'ar' ? 'اكتب أمنياتك وتمنياتك الطيبة هنا...' : 'Write your warm wishes and words here...'}
                            className="w-full bg-white border border-brand-brown/15 rounded-md p-2.5 text-xs focus:outline-none focus:border-brand-gold"
                          />
                        </div>
                      </div>

                      {/* Right: Live Preview */}
                      <div className="flex flex-col justify-center items-center">
                        <span className="text-[10px] uppercase tracking-wider text-brand-gold font-bold mb-2 self-start md:self-center">
                          {language === 'ar' ? 'معاينة بطاقة الإهداء الحية' : 'Live Gift Card Preview'}
                        </span>
                        
                        <div className={cn(
                          "w-full max-w-[280px] h-[170px] rounded-lg shadow-lg border p-5 flex flex-col justify-between transition-all duration-300 relative overflow-hidden font-serif",
                          cardStyle === 'classic_ivory' && "bg-[#FAF8F5] border-amber-900/20 text-amber-950",
                          cardStyle === 'midnight_gold' && "bg-[#111111] border-brand-gold/30 text-brand-gold",
                          cardStyle === 'rose_romance' && "bg-[#FFF0F2] border-[#8B263E]/20 text-[#6B1B2D]",
                          cardStyle === 'royal_emerald' && "bg-[#0B2E1C] border-brand-gold/25 text-[#ECD9BA]"
                        )}>
                          {/* Inner elegant gold thin border */}
                          <div className="absolute inset-2 border border-current/15 pointer-events-none rounded" />
                          
                          {/* Card Content */}
                          <div className="relative z-10 flex flex-col h-full justify-between py-1 px-2">
                            {/* Card Top */}
                            <div className="flex justify-between text-[11px] font-bold border-b border-current/10 pb-1">
                              <span>
                                {language === 'ar' ? 'إلى: ' : 'To: '} 
                                <span className="font-sans underline underline-offset-2">{cardRecipient || (language === 'ar' ? 'المستلم' : 'Someone Special')}</span>
                              </span>
                              <span>
                                {language === 'ar' ? 'من: ' : 'From: '}
                                <span className="font-sans underline underline-offset-2">{cardSender || (language === 'ar' ? 'المرسل' : 'You')}</span>
                              </span>
                            </div>

                            {/* Message Body */}
                            <div className="flex-1 flex items-center justify-center text-center my-2 text-xs italic font-medium leading-relaxed px-1 overflow-hidden select-none">
                              <p className="line-clamp-4 font-sans font-medium text-xs break-words">
                                {cardMessage || (language === 'ar' 
                                  ? 'كل عام وأنتم بخير، مع أطيب التمنيات وأعذب اللحظات المليئة بالحب والشوكولاتة الفاخرة.'
                                  : 'Wishing you the sweetest moments and a life full of delicious joy and exquisite luxury chocolate.')}
                              </p>
                            </div>

                            {/* Brand Tagmark */}
                            <div className="text-center text-[7px] tracking-[0.2em] opacity-60 uppercase border-t border-current/10 pt-1 font-sans">
                              {language === 'ar' ? 'ميزون إتش بليجكا' : 'MAISON H BELGIUM'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white p-6 md:p-8 border border-black/5 rounded-sm shadow-sm">
              <h2 className="font-serif text-xl font-bold mb-6 border-b border-brand-brown/10 pb-4">
                {language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
              </h2>
              
              <div className="space-y-4">
                
                <label className="flex items-center justify-between p-4 border border-brand-gold rounded-lg bg-brand-gold/5 cursor-pointer hover:bg-brand-gold/10 transition-colors group">
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" defaultChecked className="accent-brand-brown w-5 h-5" />
                    <span className="font-medium text-brand-black">
                      {language === 'ar' ? 'مدى / بطاقة ائتمانية' : 'Mada / Credit Card'}
                    </span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="font-bold text-[10px] text-brand-black opacity-70 group-hover:opacity-100 transition-opacity uppercase tracking-wider">mada</span>
                    <span className="font-bold text-[11px] text-brand-black opacity-70 group-hover:opacity-100 transition-opacity italic">VISA</span>
                    <div className="flex -space-x-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <div className="w-3 h-3 rounded-full bg-red-500/80 mix-blend-multiply"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80 mix-blend-multiply"></div>
                    </div>
                  </div>
                </label>

                <label className="flex items-center justify-between p-4 border border-brand-brown/20 rounded-lg hover:bg-brand-light-gray/30 cursor-pointer transition-colors group">
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" className="accent-brand-brown w-5 h-5" />
                    <span className="font-medium text-brand-black">Apple Pay</span>
                  </div>
                  <span className="font-bold text-sm text-brand-black opacity-70 group-hover:opacity-100 transition-opacity"> Pay</span>
                </label>

                <label className="flex items-center justify-between p-4 border border-brand-brown/20 rounded-lg hover:bg-brand-light-gray/30 cursor-pointer transition-colors group">
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" className="accent-brand-brown w-5 h-5" />
                    <span className="font-medium text-brand-black">STC Pay</span>
                  </div>
                  <span className="font-bold text-[12px] text-brand-black opacity-70 group-hover:opacity-100 transition-opacity uppercase tracking-wider">STC Pay</span>
                </label>

                <label className="flex flex-col p-4 border border-brand-brown/20 rounded-lg hover:bg-brand-light-gray/30 cursor-pointer transition-colors gap-2 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" className="accent-brand-brown w-5 h-5" />
                      <span className="font-medium text-brand-black">Tabby</span>
                    </div>
                    <span className="font-bold text-black text-xl opacity-70 group-hover:opacity-100 transition-opacity">tabby</span>
                  </div>
                  <p className="text-xs text-brand-gray mr-8">
                    {language === 'ar' ? 'قسم طلبك على 4 دفعات ميسرة بدون رسوم خفية.' : 'Split your purchase into 4 easy interest-free payments.'}
                  </p>
                </label>

              </div>
              <p className="text-xs text-center text-brand-gray mt-6 mt-4 pt-4 border-t border-brand-brown/10">
                {language === 'ar' 
                  ? 'مدعوم بأمان بواسطة MyFatoorah و Odoo Payment Providers.' 
                  : 'Secured and powered by MyFatoorah & Odoo Payment Providers.'}
              </p>
            </section>

          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-1/3 space-y-6">
            
            {/* Loyalty Points Section */}
            {showLoyalty && (
              <div className="bg-white p-6 border border-brand-gold/30 rounded-sm shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-brand-gold/10 rounded-bl-full -z-0"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4 border-b border-brand-gold/20 pb-3">
                    <div className="w-8 h-8 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center">
                      <Gift className="w-4 h-4" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-brand-black">
                      {language === 'ar' ? 'نقاط الولاء' : 'Loyalty Points'}
                    </h3>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm font-bold text-brand-black">
                        {language === 'ar' ? 'رصيدك الحالي' : 'Your Current Balance'}
                      </p>
                      <p className="text-xs text-brand-gray">
                        {language === 'ar' 
                          ? `${userPoints} نقطة (خصم ${maxDiscount.toFixed(2)} ر.س)`
                          : `${userPoints} points (discount of ${maxDiscount.toFixed(2)} SAR)`}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={redeemPoints}
                        onChange={() => setRedeemPoints(!redeemPoints)}
                      />
                      <div className="w-9 h-5 bg-brand-light-gray peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-gold"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Order Summary Box */}
            <div className="bg-white p-6 border border-black/5 rounded-sm shadow-sm sticky top-24">
              <h3 className="font-serif text-lg font-bold mb-6">{language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}</h3>
              
              <div className="space-y-4 mb-6 max-h-[350px] overflow-y-auto pr-1">
                {cartItems.length === 0 ? (
                  <div className="text-center py-10 text-brand-gray">
                    <p>{language === 'ar' ? 'سلتك فارغة' : 'Your cart is empty'}</p>
                  </div>
                ) : (
                  cartItems.map((item) => {
                    const uom = uomsList.find(u => u.id === item.selectedUomId);
                    const uomName = language === 'ar' ? uom?.nameAr : uom?.nameEn;
                    const calculatedPrice = getPriceInUom(item.product.price, item.product.defaultUom || 'uom_piece', item.selectedUomId);
                    
                    return (
                      <div key={`${item.product.id}-${item.selectedUomId}`} className="flex gap-3 border-b border-brand-brown/5 pb-4 last:border-0 last:pb-0">
                        <div className="w-14 h-14 bg-brand-light-gray rounded-md overflow-hidden flex-shrink-0 border border-brand-brown/10">
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-brand-black truncate">{item.product.name}</h4>
                          <p className="text-[11px] text-brand-gold font-medium mt-0.5">
                            {language === 'ar' ? 'الوحدة: ' : 'UoM: '} {uomName}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2 border border-brand-brown/20 rounded-md px-1.5 py-0.5 scale-90 origin-right">
                              <button 
                                onClick={() => updateQuantity(item.product.id, item.selectedUomId, item.quantity - 1)}
                                className="text-brand-gray hover:text-brand-black"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.product.id, item.selectedUomId, item.quantity + 1)}
                                className="text-brand-gray hover:text-brand-black"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.product.id, item.selectedUomId)}
                              className="text-red-500 hover:text-red-700 scale-90"
                              title={language === 'ar' ? 'حذف' : 'Remove'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-left flex flex-col justify-between items-end">
                          <span className="text-[11px] text-brand-gray">
                            {calculatedPrice.toFixed(2)} {language === 'ar' ? 'ر.س' : 'SAR'}
                          </span>
                          <span className="text-sm font-bold text-brand-black">
                            {(calculatedPrice * item.quantity).toFixed(2)} {language === 'ar' ? 'ر.س' : 'SAR'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="border-t border-brand-brown/10 pt-4 space-y-3 text-sm">
                <div className="flex justify-between text-brand-gray">
                  <span>{language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                  <span>{subtotal.toFixed(2)} {language === 'ar' ? 'ر.س' : 'SAR'}</span>
                </div>
                <div className="flex justify-between text-brand-gray">
                  <span>{language === 'ar' ? 'الشحن (توصيل الرياض)' : 'Shipping (Riyadh delivery)'}</span>
                  <span>{shipping === 0 ? (language === 'ar' ? 'مجاني' : 'Free') : `${shipping.toFixed(2)} ${language === 'ar' ? 'ر.س' : 'SAR'}`}</span>
                </div>
                {wrappingPrice > 0 && (
                  <div className="flex justify-between text-brand-gray">
                    <span>
                      {language === 'ar' 
                        ? `${baseWrappingPrice > 0 ? 'تغليف الهدايا' : ''}${baseWrappingPrice > 0 && cardPrice > 0 ? ' و ' : ''}${cardPrice > 0 ? 'بطاقة الإهداء' : ''}`
                        : `${baseWrappingPrice > 0 ? 'Gift Wrapping' : ''}${baseWrappingPrice > 0 && cardPrice > 0 ? ' & ' : ''}${cardPrice > 0 ? 'Premium Card' : ''}`}
                    </span>
                    <span>{wrappingPrice.toFixed(2)} {language === 'ar' ? 'ر.س' : 'SAR'}</span>
                  </div>
                )}
                {redeemPoints && showLoyalty && (
                  <div className="flex justify-between text-brand-gold font-medium">
                    <span>{language === 'ar' ? 'خصم نقاط الولاء' : 'Loyalty Points Discount'}</span>
                    <span>-{discount.toFixed(2)} {language === 'ar' ? 'ر.س' : 'SAR'}</span>
                  </div>
                )}
                <div className="flex justify-between text-brand-gray">
                  <span>{language === 'ar' ? `الضريبة (${vatPercent}%)` : `Tax (${vatPercent}%)`}</span>
                  <span>
                    {language === 'ar' 
                      ? `مشمولة (${((subtotal * vatPercent) / (100 + vatPercent)).toFixed(2)} ر.س)`
                      : `Included (${((subtotal * vatPercent) / (100 + vatPercent)).toFixed(2)} SAR)`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg text-brand-black border-t border-brand-brown/10 pt-4 mt-2">
                  <span>{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
                  <span>{total.toFixed(2)} {language === 'ar' ? 'ر.س' : 'SAR'}</span>
                </div>
              </div>

              {showLoyalty && (
                <div className="mt-6 bg-brand-light-gray/30 p-3 rounded text-center text-sm border border-brand-gold/20">
                  <span className="text-brand-gray">
                    {language === 'ar' ? 'ستحصل على ' : 'You will earn '}
                  </span>
                  <span className="font-bold text-brand-gold">
                    {pointsEarned} {language === 'ar' ? 'نقطة ولاء' : 'loyalty points'}
                  </span>
                  <span className="text-brand-gray">
                    {language === 'ar' ? ' مع هذا الطلب' : ' with this order'}
                  </span>
                </div>
              )}

              <Button size="lg" className="w-full mt-6" onClick={handleConfirm}>
                {language === 'ar' ? 'تأكيد الطلب والدفع' : 'Confirm Order & Pay'}
              </Button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-brand-gray">
                <span>{language === 'ar' ? 'توصيل آمن' : 'Secure Delivery'}</span>
                <span>•</span>
                <span>{language === 'ar' ? 'دفع مشفر' : 'Encrypted Payment'}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
