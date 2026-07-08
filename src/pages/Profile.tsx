import React, { useState } from 'react';
import { Package, User, MapPin, Clock, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';
import { MOCK_PRODUCTS } from '../data';

// Mock order data
const MOCK_ORDERS = [
  {
    id: 'ORD-2023-001',
    date: '2023-10-25',
    status: 'Delivered',
    statusAr: 'تم التوصيل',
    total: 350,
    items: [
      { productId: 'p1', quantity: 2 },
      { productId: 'p2', quantity: 1 }
    ]
  },
  {
    id: 'ORD-2023-089',
    date: '2023-11-12',
    status: 'Processing',
    statusAr: 'قيد التجهيز',
    total: 120,
    items: [
      { productId: 'p4', quantity: 1 }
    ]
  }
];

export function Profile() {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<'orders' | 'details' | 'addresses'>('orders');
  const contentRef = React.useRef<HTMLDivElement>(null);

  const handleTabChange = (tab: 'orders' | 'details' | 'addresses') => {
    setActiveTab(tab);
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleReorder = (order: typeof MOCK_ORDERS[0]) => {
    order.items.forEach(orderItem => {
      const product = MOCK_PRODUCTS.find(p => p.id === orderItem.productId);
      if (product) {
        addToCart(product, orderItem.quantity);
      }
    });
    // Visual feedback could be added here
    alert(language === 'ar' ? 'تمت إضافة المنتجات إلى السلة' : 'Items added to cart');
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Delivered': return 'text-green-600 bg-green-50 border-green-200';
      case 'Processing': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-brand-gray bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-brand-ivory min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-brand-black mb-2">
            {language === 'ar' ? 'حسابي' : 'My Account'}
          </h1>
          <p className="text-brand-gray">
            {language === 'ar' ? 'مرحباً بعودتك، سارة' : 'Welcome back, Sarah'}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white border border-brand-brown/10 rounded-sm overflow-hidden sticky top-32">
              <button 
                onClick={() => handleTabChange('orders')}
                className={cn(
                  "w-full flex items-center gap-3 px-6 py-4 text-sm transition-colors text-right",
                  activeTab === 'orders' ? "bg-brand-brown/5 text-brand-brown border-r-4 border-brand-brown font-bold" : "text-brand-black hover:bg-brand-light-gray/20"
                )}
              >
                <Package className="w-5 h-5" />
                {language === 'ar' ? 'الطلبات السابقة' : 'Order History'}
              </button>
              <button 
                onClick={() => handleTabChange('details')}
                className={cn(
                  "w-full flex items-center gap-3 px-6 py-4 text-sm transition-colors text-right",
                  activeTab === 'details' ? "bg-brand-brown/5 text-brand-brown border-r-4 border-brand-brown font-bold" : "text-brand-black hover:bg-brand-light-gray/20 border-t border-brand-brown/5"
                )}
              >
                <User className="w-5 h-5" />
                {language === 'ar' ? 'تفاصيل الحساب' : 'Account Details'}
              </button>
              <button 
                onClick={() => handleTabChange('addresses')}
                className={cn(
                  "w-full flex items-center gap-3 px-6 py-4 text-sm transition-colors text-right",
                  activeTab === 'addresses' ? "bg-brand-brown/5 text-brand-brown border-r-4 border-brand-brown font-bold" : "text-brand-black hover:bg-brand-light-gray/20 border-t border-brand-brown/5"
                )}
              >
                <MapPin className="w-5 h-5" />
                {language === 'ar' ? 'عناوين التوصيل' : 'Addresses'}
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1" ref={contentRef} style={{ scrollMarginTop: '100px' }}>
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-bold text-brand-black mb-6">
                  {language === 'ar' ? 'الطلبات السابقة' : 'Order History'}
                </h2>
                
                {MOCK_ORDERS.map(order => (
                  <div key={order.id} className="bg-white border border-brand-brown/10 rounded-sm overflow-hidden">
                    {/* Order Header */}
                    <div className="bg-brand-light-gray/20 p-4 border-b border-brand-brown/10 flex flex-wrap gap-4 justify-between items-center">
                      <div>
                        <p className="text-xs text-brand-gray mb-1">{language === 'ar' ? 'رقم الطلب' : 'Order ID'}</p>
                        <p className="font-bold text-brand-black text-sm">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-brand-gray mb-1">{language === 'ar' ? 'تاريخ الطلب' : 'Date'}</p>
                        <p className="text-sm font-medium text-brand-black flex items-center gap-1">
                          <Clock className="w-3 h-3 text-brand-gold" />
                          {order.date}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-brand-gray mb-1">{language === 'ar' ? 'الإجمالي' : 'Total'}</p>
                        <p className="text-sm font-bold text-brand-brown">{order.total} {language === 'ar' ? 'ر.س' : 'SAR'}</p>
                      </div>
                      <div>
                        <span className={cn("px-3 py-1 text-xs font-medium rounded-full border", getStatusColor(order.status))}>
                          {language === 'ar' ? order.statusAr : order.status}
                        </span>
                      </div>
                    </div>
                    
                    {/* Order Body */}
                    <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex -space-x-4 space-x-reverse overflow-hidden">
                        {order.items.map((item, idx) => {
                          const product = MOCK_PRODUCTS.find(p => p.id === item.productId);
                          if (!product) return null;
                          return (
                            <div key={idx} className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-sm">
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' }}
                                className="w-full h-full object-cover" 
                              />
                            </div>
                          )
                        })}
                        {order.items.length > 0 && (
                          <div className="text-xs text-brand-gray flex items-center mr-6">
                            {order.items.length} {language === 'ar' ? 'منتجات' : 'items'}
                          </div>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => handleReorder(order)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-brand-black text-white text-sm font-medium rounded hover:bg-brand-brown transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                        {language === 'ar' ? 'إعادة الطلب' : 'Reorder'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'details' && (
              <div className="bg-white border border-brand-brown/10 rounded-sm p-8">
                <h2 className="font-serif text-2xl font-bold text-brand-black mb-6">
                  {language === 'ar' ? 'تفاصيل الحساب' : 'Account Details'}
                </h2>
                <p className="text-brand-gray text-sm">{language === 'ar' ? 'هنا يمكنك تحديث معلوماتك الشخصية.' : 'Update your personal information here.'}</p>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-white border border-brand-brown/10 rounded-sm p-8">
                <h2 className="font-serif text-2xl font-bold text-brand-black mb-6">
                  {language === 'ar' ? 'عناوين التوصيل' : 'Addresses'}
                </h2>
                <p className="text-brand-gray text-sm">{language === 'ar' ? 'إدارة العناوين المحفوظة.' : 'Manage your saved addresses.'}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
