import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

export function FloatingNav() {
  const [isVisible, setIsVisible] = useState(false);

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
