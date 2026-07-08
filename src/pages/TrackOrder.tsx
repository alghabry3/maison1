import React, { useState } from 'react';
import { Package, Search, CheckCircle2, Truck, Box, Clock } from 'lucide-react';
import { Button } from '../components/Button';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';

type OrderStatus = 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';

interface OrderInfo {
  id: string;
  status: OrderStatus;
  date: string;
  items: number;
  total: number;
}

const MOCK_ORDERS: Record<string, OrderInfo> = {
  'MH-1024': {
    id: 'MH-1024',
    status: 'shipped',
    date: '2024-03-15',
    items: 3,
    total: 450,
  },
  'MH-2048': {
    id: 'MH-2048',
    status: 'delivered',
    date: '2024-03-10',
    items: 1,
    total: 150,
  }
};

const STATUS_STEPS = [
  { id: 'processing', labelAr: 'قيد التجهيز', labelEn: 'Processing', icon: Clock },
  { id: 'shipped', labelAr: 'تم الشحن', labelEn: 'Shipped', icon: Box },
  { id: 'out_for_delivery', labelAr: 'في الطريق إليك', labelEn: 'Out for Delivery', icon: Truck },
  { id: 'delivered', labelAr: 'تم التوصيل', labelEn: 'Delivered', icon: CheckCircle2 },
];

export function TrackOrder() {
  const { language } = useLanguage();
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    
    // Simulate API call
    setTimeout(() => {
      const foundOrder = MOCK_ORDERS[orderId];
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        setOrder(null);
        setError(true);
      }
      setLoading(false);
    }, 1000);
  };

  const getCurrentStepIndex = (status: OrderStatus) => {
    return STATUS_STEPS.findIndex(step => step.id === status);
  };

  return (
    <div className="bg-brand-ivory min-h-screen py-12 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-gold">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-brand-black font-bold mb-4">
            {language === 'ar' ? 'تتبع طلبك' : 'Track Your Order'}
          </h1>
          <p className="text-brand-gray">
            {language === 'ar' 
              ? 'أدخل رقم الطلب والبريد الإلكتروني لمعرفة حالة شحنتك.' 
              : 'Enter your order ID and email to see your shipment status.'}
          </p>
        </div>

        <div className="bg-white p-6 md:p-8 border border-black/5 rounded-sm shadow-sm mb-8">
          <form onSubmit={handleTrack} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-brand-gray mb-2">
                  {language === 'ar' ? 'رقم الطلب' : 'Order ID'}
                </label>
                <input 
                  type="text" 
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: MH-1024' : 'e.g. MH-1024'}
                  className="w-full bg-brand-light-gray/30 border border-brand-brown/20 rounded-md p-3 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
                  dir="ltr"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-brand-gray mb-2">
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-brand-light-gray/30 border border-brand-brown/20 rounded-md p-3 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors text-left"
                  dir="ltr"
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 flex items-center justify-center gap-2 text-base"
              disabled={loading || !orderId || !email}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  {language === 'ar' ? 'تتبع الآن' : 'Track Now'}
                </>
              )}
            </Button>
          </form>
          
          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-md text-sm text-center">
              {language === 'ar' 
                ? 'عذراً، لم نتمكن من العثور على طلب بهذا الرقم. يرجى التأكد من صحة البيانات والمحاولة مرة أخرى. (جرب MH-1024)' 
                : 'Sorry, we could not find an order with this ID. Please check the details and try again. (Try MH-1024)'}
            </div>
          )}
        </div>

        {order && (
          <div className="bg-white p-6 md:p-8 border border-black/5 rounded-sm shadow-sm animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-brand-brown/10 pb-6 mb-8 gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-brand-black">
                  {language === 'ar' ? 'طلب رقم: ' : 'Order ID: '}<span dir="ltr">{order.id}</span>
                </h2>
                <p className="text-sm text-brand-gray mt-1">
                  {language === 'ar' ? 'تاريخ الطلب: ' : 'Order Date: '}{order.date}
                </p>
              </div>
              <div className="bg-brand-light-gray/50 px-4 py-2 rounded-md text-sm">
                <span className="text-brand-gray">
                  {language === 'ar' ? 'الإجمالي: ' : 'Total: '}
                </span>
                <span className="font-bold text-brand-black">{order.total} {language === 'ar' ? 'ر.س' : 'SAR'}</span>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="relative pt-4 pb-12">
              <div className="absolute top-[42px] left-[24px] right-[24px] h-[3px] bg-brand-light-gray/50 -z-0 hidden md:block"></div>
              
              <div className="absolute top-[42px] right-[24px] h-[3px] bg-brand-gold hidden md:block transition-all duration-1000 ease-in-out" 
                style={{ 
                  width: `calc((100% - 48px) * ${(getCurrentStepIndex(order.status) / (STATUS_STEPS.length - 1))})`,
                }}
              ></div>

              <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-4 relative z-10">
                {STATUS_STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index <= getCurrentStepIndex(order.status);
                  const isCurrent = index === getCurrentStepIndex(order.status);
                  
                  return (
                    <div key={step.id} className="flex md:flex-col items-center gap-4 md:gap-3">
                      {/* Mobile Line connection */}
                      {index !== STATUS_STEPS.length - 1 && (
                        <div className={`absolute mr-6 mt-12 w-[3px] h-12 md:hidden transition-colors duration-1000 ${isActive ? 'bg-brand-gold' : 'bg-brand-light-gray/50'}`}></div>
                      )}
                      
                      <div className={cn(
                        "relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-white shrink-0 z-10",
                        isActive 
                          ? "border-brand-gold text-brand-gold shadow-[0_0_15px_rgba(200,164,106,0.3)]" 
                          : "border-brand-light-gray text-brand-light-gray"
                      )}>
                        {isCurrent && (
                          <div className="absolute inset-0 rounded-full border-2 border-brand-gold animate-ping opacity-30"></div>
                        )}
                        <Icon className="w-5 h-5 relative z-10" />
                      </div>
                      <div className="md:text-center">
                        <span className={cn(
                          "block font-bold text-sm transition-colors duration-500",
                          isActive ? "text-brand-black" : "text-brand-gray/50",
                          isCurrent && "text-brand-gold"
                        )}>
                          {language === 'ar' ? step.labelAr : step.labelEn}
                        </span>
                        {isCurrent && (
                          <span className="text-xs text-brand-gold mt-1 block animate-pulse">
                            {language === 'ar' ? 'المرحلة الحالية' : 'Current Stage'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
