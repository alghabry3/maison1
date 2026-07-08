import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export function WhatsAppButton() {
  const location = useLocation();
  const { language } = useLanguage();
  
  // Only show on Home and Shop pages
  if (location.pathname !== '/' && location.pathname !== '/shop') {
    return null;
  }

  // Example WhatsApp number
  const phoneNumber = '966500000000'; 
  const message = language === 'ar' 
    ? 'مرحباً، لدي استفسار حول منتجاتكم.' 
    : 'Hello, I have an inquiry about your products.';
    
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#1ebe57] transition-all duration-300 hover:scale-110 flex items-center justify-center group"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
      {/* Optional tooltip */}
      <span className="absolute right-full mr-4 bg-white text-brand-black text-sm px-3 py-1.5 rounded shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300">
        {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
      </span>
    </a>
  );
}
