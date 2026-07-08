import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Box, Truck, CheckCircle2, Package, Search, AlertCircle, Calendar, CreditCard, ShoppingBag, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useQuickTrack } from '../context/QuickTrackContext';
import { cn } from '../lib/utils';

type OrderStatus = 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';

interface OrderInfo {
  id: string;
  status: OrderStatus;
  date: string;
  items: number;
  total: number;
  shippingAddress?: string;
  shippingAddressAr?: string;
}

const MOCK_ORDERS: Record<string, OrderInfo> = {
  'MH-1024': {
    id: 'MH-1024',
    status: 'shipped',
    date: '2026-07-07',
    items: 3,
    total: 450,
    shippingAddress: 'Olaya District, Riyadh, Saudi Arabia',
    shippingAddressAr: 'حي العليا، الرياض، المملكة العربية السعودية'
  },
  'MH-2048': {
    id: 'MH-2048',
    status: 'delivered',
    date: '2026-07-05',
    items: 1,
    total: 150,
    shippingAddress: 'Al-Yasmin District, Riyadh, Saudi Arabia',
    shippingAddressAr: 'حي الياسمين، الرياض، المملكة العربية السعودية'
  },
  'ORD-84392': {
    id: 'ORD-84392',
    status: 'processing',
    date: '2026-07-08',
    items: 2,
    total: 320,
    shippingAddress: 'Al-Malqa District, Riyadh, Saudi Arabia',
    shippingAddressAr: 'حي الملقا، الرياض، المملكة العربية السعودية'
  }
};

const STATUS_STEPS = [
  { id: 'processing', labelAr: 'قيد التجهيز', labelEn: 'Processing', descAr: 'نقوم بتحضير وتعبئة الشوكولاتة الفاخرة الخاصة بك بعناية.', descEn: 'We are carefully preparing and packaging your luxury chocolate.', icon: Clock },
  { id: 'shipped', labelAr: 'تم الشحن', labelEn: 'Shipped', descAr: 'تم تسليم شحنتك المبردة لشركة التوصيل.', descEn: 'Your temperature-controlled package has been handed to the courier.', icon: Box },
  { id: 'out_for_delivery', labelAr: 'في الطريق إليك', labelEn: 'Out for Delivery', descAr: 'مندوبنا في طريقه لتوصيل طلبك المبرد الآن.', descEn: 'Our courier is on the way to deliver your temperature-controlled package.', icon: Truck },
  { id: 'delivered', labelAr: 'تم التوصيل', labelEn: 'Delivered', descAr: 'تم تسليم الشحنة بنجاح. بالهناء والعافية!', descEn: 'Package delivered successfully. Enjoy your premium chocolates!', icon: CheckCircle2 },
];

export function QuickTrackModal() {
  const { language } = useLanguage();
  const { isOpen, orderId, closeQuickTrack, openQuickTrack } = useQuickTrack();
  
  const [searchId, setSearchId] = useState('');
  const [currentOrder, setCurrentOrder] = useState<OrderInfo | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // When modal opens or orderId changes, auto-fetch
  useEffect(() => {
    if (isOpen) {
      setSearchId(orderId);
      if (orderId) {
        handleTrackOrder(orderId);
      } else {
        setCurrentOrder(null);
        setError(false);
      }
    }
  }, [isOpen, orderId]);

  const handleTrackOrder = (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError(false);

    // Simulate luxury API lookup delay
    setTimeout(() => {
      const normalizedId = id.trim().toUpperCase();
      const found = MOCK_ORDERS[normalizedId];

      if (found) {
        setCurrentOrder(found);
      } else if (normalizedId.startsWith('MH-') || normalizedId.startsWith('ORD-') || normalizedId.length >= 4) {
        // Generative mock for other typed IDs to make it highly robust and dynamic
        const statuses: OrderStatus[] = ['processing', 'shipped', 'out_for_delivery', 'delivered'];
        // Use string hash code to make status deterministic per ID
        let hash = 0;
        for (let i = 0; i < normalizedId.length; i++) {
          hash = normalizedId.charCodeAt(i) + ((hash << 5) - hash);
        }
        const statusIdx = Math.abs(hash) % statuses.length;
        const totalItems = (Math.abs(hash) % 4) + 1;
        const totalAmount = totalItems * 120 + 50;

        setCurrentOrder({
          id: normalizedId,
          status: statuses[statusIdx],
          date: new Date(Date.now() - (3 - statusIdx) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          items: totalItems,
          total: totalAmount,
          shippingAddress: 'Riyadh District, Saudi Arabia',
          shippingAddressAr: 'منطقة الرياض، المملكة العربية السعودية'
        });
      } else {
        setCurrentOrder(null);
        setError(true);
      }
      setLoading(false);
    }, 850);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrackOrder(searchId);
  };

  const getCurrentStepIndex = (status: OrderStatus) => {
    return STATUS_STEPS.findIndex(step => step.id === status);
  };

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeQuickTrack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeQuickTrack]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuickTrack}
            className="absolute inset-0 bg-brand-black/80 backdrop-blur-md"
            id="quick-track-backdrop"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            id="quick-track-modal-container"
            className={cn(
              "relative bg-brand-ivory text-brand-black w-full max-w-2xl rounded-lg shadow-2xl border border-brand-gold/30 overflow-hidden max-h-[90vh] flex flex-col font-sans",
              language === 'ar' ? 'text-right' : 'text-left'
            )}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="bg-brand-black text-brand-ivory px-6 py-5 border-b border-brand-gold/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-gold/10 rounded-full flex items-center justify-center text-brand-gold border border-brand-gold/20">
                  <Package className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-serif text-lg md:text-xl font-bold tracking-wide text-brand-gold flex items-center gap-2">
                    {language === 'ar' ? 'التتبع السريع المباشر' : 'Live Quick Track'}
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-widest gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span>
                      {language === 'ar' ? 'نشط' : 'Live'}
                    </span>
                  </h3>
                  <p className="text-[10px] text-brand-ivory/60">
                    {language === 'ar' ? 'تتبع حالة شحنتك المبردة لحظة بلحظة' : 'Track your cold-chain shipment status in real-time'}
                  </p>
                </div>
              </div>

              <button 
                id="close-quick-track-btn"
                onClick={closeQuickTrack}
                className="w-8 h-8 rounded-full border border-brand-ivory/15 flex items-center justify-center text-brand-ivory/80 hover:bg-brand-gold hover:text-brand-black hover:border-brand-gold transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
              
              {/* Form Input Section */}
              <form onSubmit={handleSearchSubmit} className="space-y-3">
                <label className="block text-xs font-bold text-brand-brown uppercase tracking-wider">
                  {language === 'ar' ? 'أدخل رقم طلبك للتتبع' : 'Enter Order ID to Track'}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input 
                      id="quick-track-input"
                      type="text"
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      placeholder={language === 'ar' ? 'مثال: MH-1024, MH-2048...' : 'e.g., MH-1024, MH-2048...'}
                      className="w-full bg-white border border-brand-brown/20 rounded-md py-3 px-4 text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors font-sans uppercase placeholder:normal-case font-bold text-brand-black"
                      dir="ltr"
                      required
                    />
                  </div>
                  <button
                    id="quick-track-submit-btn"
                    type="submit"
                    disabled={loading || !searchId.trim()}
                    className="bg-brand-black hover:bg-brand-brown text-white font-bold px-6 py-3 rounded-md text-sm transition-all flex items-center gap-2 shrink-0 hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none active:scale-95"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>{language === 'ar' ? 'تتبع' : 'Track'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Quick Suggestions for Testing */}
              {!currentOrder && !loading && !error && (
                <div className="bg-brand-brown/5 border border-brand-brown/10 p-4 rounded-md space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-brand-brown">
                    <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                    <span>{language === 'ar' ? 'أرقام طلبات تجريبية سريعة:' : 'Quick Sample Order IDs to test:'}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(MOCK_ORDERS).map(id => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          setSearchId(id);
                          handleTrackOrder(id);
                        }}
                        className="px-2.5 py-1 bg-white border border-brand-brown/20 hover:border-brand-gold hover:text-brand-gold rounded text-xs font-bold transition-all text-brand-black active:scale-95 shadow-2xs"
                      >
                        {id}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Loader */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="w-12 h-12 border-4 border-brand-brown/10 border-t-brand-gold rounded-full animate-spin"></div>
                  <p className="text-xs font-bold text-brand-brown animate-pulse">
                    {language === 'ar' ? 'جاري الاتصال بنظام تتبع الشحنات المبردة...' : 'Connecting to cold-chain tracking system...'}
                  </p>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-md flex items-start gap-3 animate-fade-in">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold mb-1">
                      {language === 'ar' ? 'لم يتم العثور على الطلب' : 'Order Not Found'}
                    </p>
                    <p className="leading-relaxed">
                      {language === 'ar' 
                        ? 'يرجى التأكد من كتابة رقم الطلب بشكل صحيح والمحاولة مرة أخرى. يمكنك استخدام أحد الأرقام المقترحة أعلاه للتجربة.' 
                        : 'Please ensure the Order ID is entered correctly and try again. You may use one of the suggested sample IDs above.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Order Tracking Result View */}
              {currentOrder && !loading && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Order Information Card */}
                  <div className="bg-white p-5 rounded-md border border-brand-brown/10 shadow-sm space-y-3 font-sans">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-brand-brown/5 gap-2">
                      <div>
                        <div className="text-xs text-brand-gray font-medium">{language === 'ar' ? 'رقم تتبع الشحنة' : 'Shipment tracking number'}</div>
                        <div className="text-lg font-bold text-brand-black font-mono tracking-wider flex items-center gap-1.5 uppercase">
                          {currentOrder.id}
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-brand-gold/15 border border-brand-gold/20 text-brand-brown text-xs font-bold rounded-full">
                        {STATUS_STEPS[getCurrentStepIndex(currentOrder.status)][language === 'ar' ? 'labelAr' : 'labelEn']}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-1 text-xs">
                      <div className="space-y-1">
                        <span className="text-brand-gray block font-medium">{language === 'ar' ? 'تاريخ الطلب:' : 'Order Date:'}</span>
                        <span className="font-bold text-brand-black flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-brand-brown shrink-0" />
                          {currentOrder.date}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-brand-gray block font-medium">{language === 'ar' ? 'عدد الأصناف:' : 'Total Items:'}</span>
                        <span className="font-bold text-brand-black flex items-center gap-1">
                          <ShoppingBag className="w-3.5 h-3.5 text-brand-brown shrink-0" />
                          {currentOrder.items} {language === 'ar' ? 'أصناف فاخرة' : 'premium items'}
                        </span>
                      </div>
                      <div className="col-span-2 md:col-span-1 space-y-1">
                        <span className="text-brand-gray block font-medium">{language === 'ar' ? 'قيمة الشحنة:' : 'Total Value:'}</span>
                        <span className="font-bold text-brand-brown flex items-center gap-1 font-mono">
                          <CreditCard className="w-3.5 h-3.5 shrink-0" />
                          {currentOrder.total.toFixed(2)} {language === 'ar' ? 'ر.س' : 'SAR'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-brand-brown/5 text-xs text-brand-gray">
                      <span className="font-bold text-brand-black block mb-0.5">{language === 'ar' ? 'عنوان الشحن والتسليم:' : 'Delivery Address:'}</span>
                      <span>{language === 'ar' ? currentOrder.shippingAddressAr : currentOrder.shippingAddress}</span>
                    </div>
                  </div>

                  {/* Vertical / Horizontal Stepper Timeline */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-brand-brown uppercase tracking-wider">
                      {language === 'ar' ? 'حالة التوصيل والتحضير' : 'Preparation & Delivery Status'}
                    </h4>

                    {/* Desktop timeline view */}
                    <div className="hidden md:block relative pt-4 pb-8 px-2 bg-white rounded-md border border-brand-brown/10 p-5 shadow-2xs">
                      {/* Timeline bar base */}
                      <div className="absolute top-[38px] left-[32px] right-[32px] h-1 bg-brand-light-gray/50 -z-0"></div>
                      
                      {/* Timeline bar progress fill */}
                      <div 
                        className="absolute top-[38px] right-[32px] h-1 bg-brand-gold -z-0 transition-all duration-1000 ease-in-out" 
                        style={{ 
                          width: `calc((100% - 64px) * ${(getCurrentStepIndex(currentOrder.status) / (STATUS_STEPS.length - 1))})`,
                        }}
                      ></div>

                      <div className="flex justify-between items-start relative z-10">
                        {STATUS_STEPS.map((step, index) => {
                          const Icon = step.icon;
                          const isActive = index <= getCurrentStepIndex(currentOrder.status);
                          const isCurrent = index === getCurrentStepIndex(currentOrder.status);
                          
                          return (
                            <div key={step.id} className="flex flex-col items-center text-center max-w-[120px] group">
                              <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-white shadow-2xs relative mb-2 shrink-0",
                                isActive 
                                  ? "border-brand-gold text-brand-gold shadow-[0_0_12px_rgba(200,164,106,0.25)]" 
                                  : "border-brand-light-gray text-brand-light-gray/50"
                              )}>
                                {isCurrent && (
                                  <div className="absolute inset-0 rounded-full border-2 border-brand-gold animate-ping opacity-35"></div>
                                )}
                                <Icon className="w-4 h-4 relative z-10" />
                              </div>
                              
                              <span className={cn(
                                "block font-bold text-[11px] transition-colors duration-500 leading-tight mb-1",
                                isActive ? "text-brand-black" : "text-brand-gray/40",
                                isCurrent && "text-brand-gold"
                              )}>
                                {language === 'ar' ? step.labelAr : step.labelEn}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step descriptions cards (shows more detail about current step) */}
                    <div className="space-y-3">
                      {STATUS_STEPS.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = index <= getCurrentStepIndex(currentOrder.status);
                        const isCurrent = index === getCurrentStepIndex(currentOrder.status);
                        
                        return (
                          <div 
                            key={step.id} 
                            className={cn(
                              "flex gap-4 p-4 rounded-md border transition-all duration-300 font-sans",
                              isCurrent 
                                ? "bg-brand-brown/5 border-brand-gold/60 shadow-xs scale-[1.01]" 
                                : isActive 
                                  ? "bg-white/80 border-brand-brown/10 opacity-80" 
                                  : "bg-white/30 border-brand-brown/5 opacity-40"
                            )}
                          >
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center border shrink-0",
                              isActive 
                                ? "bg-brand-gold/10 border-brand-gold text-brand-gold" 
                                : "bg-brand-light-gray/20 border-brand-light-gray text-brand-light-gray"
                            )}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h5 className={cn(
                                  "text-xs font-bold leading-none",
                                  isActive ? "text-brand-black" : "text-brand-gray"
                                )}>
                                  {language === 'ar' ? step.labelAr : step.labelEn}
                                </h5>
                                {isCurrent && (
                                  <span className="text-[9px] bg-brand-gold text-brand-black font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 animate-pulse">
                                    {language === 'ar' ? 'المرحلة الحالية' : 'Current stage'}
                                  </span>
                                )}
                              </div>
                              <p className={cn(
                                "text-[11px] leading-relaxed",
                                isActive ? "text-brand-gray" : "text-brand-gray/50"
                              )}>
                                {language === 'ar' ? step.descAr : step.descEn}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                </div>
              )}

            </div>

            {/* Footer with actions */}
            <div className="bg-brand-light-gray/40 px-6 py-4 border-t border-brand-brown/10 flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-[10px] text-brand-gray text-center sm:text-right">
                {language === 'ar' 
                  ? 'جميع طلبات الشوكولاتة يتم شحنها في سيارات مبردة بدرجة حرارة ١٦-١٨ مئوية للحفاظ على الجودة.' 
                  : 'All chocolate orders are shipped in refrigerated vans at 16-18°C to guarantee peak quality.'}
              </span>
              <button
                id="quick-track-full-page-btn"
                onClick={() => {
                  closeQuickTrack();
                  window.location.href = '/track-order';
                }}
                className="text-xs text-brand-brown hover:text-brand-gold font-bold underline transition-colors whitespace-nowrap"
              >
                {language === 'ar' ? 'عرض صفحة التتبع الكاملة' : 'View full tracking page'}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
