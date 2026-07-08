import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Package } from 'lucide-react';
import { cn } from '../lib/utils';
import { useQuickTrack } from '../context/QuickTrackContext';
import { useLanguage } from '../context/LanguageContext';

export function FloatingNav() {
  const [isVisible, setIsVisible] = useState(false);
  const { openQuickTrack } = useQuickTrack();
  const { language } = useLanguage();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <div className={cn(
      "fixed right-6 bottom-24 flex flex-col gap-2 z-50 transition-all duration-300",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
    )}>
      <button 
        onClick={() => openQuickTrack('')}
        className="group w-10 h-10 bg-brand-brown border border-brand-gold text-brand-gold rounded-full flex items-center justify-center shadow-lg hover:bg-brand-gold hover:text-brand-black hover:scale-110 hover:shadow-[0_0_15px_rgba(200,164,106,0.5)] transition-all duration-300 relative"
        title={language === 'ar' ? 'التتبع السريع للطلب' : 'Quick Track Order'}
        aria-label="Quick Track Order"
      >
        <Package className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
        <span className="absolute -left-28 top-1/2 -translate-y-1/2 bg-brand-black text-brand-ivory text-[10px] px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-brand-gold/20">
          {language === 'ar' ? 'تتبع طلبك سريعاً' : 'Quick Track Order'}
        </span>
      </button>
      <button 
        onClick={scrollToTop}
        className="group w-10 h-10 bg-brand-gold text-brand-black rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 hover:shadow-[0_0_15px_rgba(200,164,106,0.5)] transition-all duration-300"
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-5 h-5 transition-transform duration-300 group-hover:scale-125" />
      </button>
      <button 
        onClick={scrollToBottom}
        className="group w-10 h-10 bg-brand-gold text-brand-black rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 hover:shadow-[0_0_15px_rgba(200,164,106,0.5)] transition-all duration-300"
        aria-label="Scroll to bottom"
      >
        <ChevronDown className="w-5 h-5 transition-transform duration-300 group-hover:scale-125" />
      </button>
    </div>
  );
}
