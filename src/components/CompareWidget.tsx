import React, { useState } from 'react';
import { X, ArrowRightLeft } from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { Button } from './Button';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';

export function CompareWidget() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();

  if (compareItems.length === 0) return null;

  return (
    <>
      {/* Floating Action Button or Bar */}
      <div className={cn(
        "fixed bottom-4 z-40 transition-all duration-300",
        language === 'ar' ? 'left-4' : 'right-4'
      )}>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-brand-black text-brand-ivory px-4 py-3 rounded-full shadow-xl flex items-center gap-2 hover:bg-brand-brown transition-colors"
        >
          <ArrowRightLeft className="w-5 h-5" />
          <span className="font-bold">{language === 'ar' ? 'قارن' : 'Compare'} ({compareItems.length})</span>
        </button>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-brand-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="relative bg-white w-full max-w-5xl max-h-[90vh] flex flex-col rounded-sm shadow-2xl overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-brand-brown/10">
              <h2 className="font-serif text-xl font-bold flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-brand-gold" />
                {language === 'ar' ? 'مقارنة المنتجات' : 'Compare Products'}
              </h2>
              <div className="flex items-center gap-4">
                <button 
                  onClick={clearCompare}
                  className="text-xs text-brand-gray hover:text-brand-brown underline"
                >
                  {language === 'ar' ? 'مسح الكل' : 'Clear All'}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-brand-gray hover:text-brand-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="flex-1 overflow-auto p-4 sm:p-6">
              <div className="min-w-[600px]">
                <table className="w-full border-collapse" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                  <thead>
                    <tr>
                      <th className="w-1/4 p-4 border border-brand-brown/10 bg-brand-light-gray/20"></th>
                      {compareItems.map(item => (
                        <th key={item.id} className="w-1/4 p-4 border border-brand-brown/10 relative text-center">
                          <button 
                            onClick={() => removeFromCompare(item.id)}
                            className="absolute top-2 right-2 p-1 text-brand-gray hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <img src={item.image} alt={item.name} className="w-24 h-24 object-cover mx-auto mb-2 rounded-sm" />
                          <h3 className="font-bold text-sm text-brand-black">{item.name}</h3>
                          <p className="text-brand-gold font-bold mt-1">{item.price} {language === 'ar' ? 'ر.س' : 'SAR'}</p>
                        </th>
                      ))}
                      {/* Fill empty columns if less than 3 */}
                      {Array.from({ length: 3 - compareItems.length }).map((_, idx) => (
                        <th key={`empty-${idx}`} className="w-1/4 p-4 border border-brand-brown/10 bg-brand-light-gray/10 text-brand-gray/50 font-normal">
                          {language === 'ar' ? 'أضف منتجاً للمقارنة' : 'Add product to compare'}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Size Row */}
                    <tr>
                      <td className="p-4 border border-brand-brown/10 font-bold bg-brand-light-gray/10">
                        {language === 'ar' ? 'الحجم / العدد' : 'Size / Count'}
                      </td>
                      {compareItems.map(item => (
                        <td key={item.id} className="p-4 border border-brand-brown/10 text-sm text-center">
                          {item.size || (language === 'ar' ? 'غير محدد' : 'N/A')}
                        </td>
                      ))}
                      {Array.from({ length: 3 - compareItems.length }).map((_, idx) => (
                        <td key={`empty-size-${idx}`} className="p-4 border border-brand-brown/10 bg-brand-light-gray/5"></td>
                      ))}
                    </tr>
                    {/* Ingredients Row */}
                    <tr>
                      <td className="p-4 border border-brand-brown/10 font-bold bg-brand-light-gray/10 align-top">
                        {language === 'ar' ? 'المكونات' : 'Ingredients'}
                      </td>
                      {compareItems.map(item => (
                        <td key={item.id} className="p-4 border border-brand-brown/10 text-sm text-brand-gray leading-relaxed text-center align-top">
                          {item.ingredients || (language === 'ar' ? 'غير محدد' : 'N/A')}
                        </td>
                      ))}
                      {Array.from({ length: 3 - compareItems.length }).map((_, idx) => (
                        <td key={`empty-ing-${idx}`} className="p-4 border border-brand-brown/10 bg-brand-light-gray/5"></td>
                      ))}
                    </tr>
                    {/* Actions Row */}
                    <tr>
                      <td className="p-4 border border-brand-brown/10"></td>
                      {compareItems.map(item => (
                        <td key={item.id} className="p-4 border border-brand-brown/10 text-center">
                          <Button variant="primary" className="w-full py-2 text-xs">
                            {language === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                          </Button>
                        </td>
                      ))}
                      {Array.from({ length: 3 - compareItems.length }).map((_, idx) => (
                        <td key={`empty-act-${idx}`} className="p-4 border border-brand-brown/10 bg-brand-light-gray/5"></td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
