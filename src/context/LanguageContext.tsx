import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    'nav.home': 'الرئيسية',
    'nav.shop': 'المتجر',
    'nav.gift': 'تغليف الهدايا',
    'nav.track': 'تتبع الطلب',
    'header.search': 'البحث...',
    'header.wishlist': 'المفضلة',
    'header.cart': 'السلة',
  },
  en: {
    'nav.home': 'Home',
    'nav.shop': 'Shop',
    'nav.gift': 'Gift Wrapping',
    'nav.track': 'Track Order',
    'header.search': 'Search...',
    'header.wishlist': 'Wishlist',
    'header.cart': 'Cart',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const t = (key: string) => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
