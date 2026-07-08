import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Package, Heart, Sparkles, ChevronLeft, Gift } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const WRAPPING_STYLES = [
  {
    id: 'classic',
    title: 'الكلاسيكي الفاخر',
    titleEn: 'Classic Luxury',
    desc: 'تغليف أنيق بورق عالي الجودة وشريط حريري بسيط يعكس الفخامة الهادئة.',
    descEn: 'Elegant wrapping with premium paper and a simple silk ribbon reflecting quiet luxury.',
    color: '#4A3525',
    ribbon: '#C8A46A',
  },
  {
    id: 'modern',
    title: 'العصري الجريء',
    titleEn: 'Bold Modern',
    desc: 'استخدام ألوان داكنة متباينة مع لمسات معدنية لإطلالة عصرية ومميزة.',
    descEn: 'Using contrasting dark colors with metallic touches for a distinct modern look.',
    color: '#1A1A1A',
    ribbon: '#E0E0E0',
  },
  {
    id: 'minimalist',
    title: 'الأبيض الناصع',
    titleEn: 'Pure Minimalist',
    desc: 'نقاء الأبيض مع شريط بلون بارز يعطي طابعاً رومانسياً ورقيقاً.',
    descEn: 'Pure white with a prominent ribbon color giving a romantic and delicate touch.',
    color: '#F8F5EF',
    ribbon: '#1B263B',
  },
  {
    id: 'royal',
    title: 'الملكي العنابي',
    titleEn: 'Royal Burgundy',
    desc: 'ورق مخملي الملمس بلون عنابي عميق، مزين بشريط ذهبي لإطلالة ملوكية.',
    descEn: 'Velvet-textured deep burgundy paper, adorned with a gold ribbon for a royal look.',
    color: '#5A1818',
    ribbon: '#C8A46A',
  }
];

const AnimatedBox = ({ color, ribbonColor, isHovered }: { color: string, ribbonColor: string, isHovered: boolean }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-1000">
      <div 
        className={cn(
          "w-32 h-32 relative transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] preserve-3d",
          isHovered ? "[transform:rotateX(-15deg)_rotateY(35deg)_scale(1.1)]" : "[transform:rotateX(-25deg)_rotateY(-25deg)]"
        )}
      >
        {/* Top */}
        <div className="absolute w-32 h-32 border border-black/5 flex items-center justify-center transform-style-preserve-3d transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]" 
             style={{ 
               backgroundColor: color, 
               transform: `rotateX(90deg) translateZ(${isHovered ? '40px' : '16px'}) scale(${isHovered ? 1.05 : 1})`
             }}>
          {/* Ribbon on top */}
          <div className="absolute w-full h-4 shadow-sm" style={{ backgroundColor: ribbonColor, opacity: 0.9 }}></div>
          <div className="absolute h-full w-4 shadow-sm" style={{ backgroundColor: ribbonColor, opacity: 0.9 }}></div>
          {/* Bow */}
          <div className={cn(
            "absolute z-10 flex items-center justify-center transition-all duration-1000 delay-100",
            isHovered ? "scale-125 -translate-y-2" : ""
          )}>
            <div className="w-8 h-8 border-[4px] rounded-[40%] absolute -translate-x-3 -translate-y-2 rotate-45 shadow-md" style={{ borderColor: ribbonColor }}></div>
            <div className="w-8 h-8 border-[4px] rounded-[40%] absolute translate-x-3 -translate-y-2 -rotate-45 shadow-md" style={{ borderColor: ribbonColor }}></div>
            <div className="w-5 h-5 rounded-full absolute shadow-lg" style={{ backgroundColor: ribbonColor }}></div>
          </div>
        </div>
        
        {/* Front */}
        <div className="absolute w-32 h-24 border border-black/10 flex items-center justify-center brightness-95" 
             style={{ backgroundColor: color, transform: 'translateZ(16px) translateY(16px)' }}>
          <div className="absolute h-full w-4 shadow-sm" style={{ backgroundColor: ribbonColor, opacity: 0.9 }}></div>
        </div>
        
        {/* Right */}
        <div className="absolute w-32 h-24 border border-black/10 flex items-center justify-center brightness-90" 
             style={{ backgroundColor: color, transform: 'rotateY(90deg) translateZ(16px) translateY(16px)' }}>
          <div className="absolute h-full w-4 shadow-sm" style={{ backgroundColor: ribbonColor, opacity: 0.9 }}></div>
        </div>
        
        {/* Left */}
        <div className="absolute w-32 h-24 border border-black/10 flex items-center justify-center brightness-105" 
             style={{ backgroundColor: color, transform: 'rotateY(-90deg) translateZ(16px) translateY(16px)' }}>
          <div className="absolute h-full w-4 shadow-sm" style={{ backgroundColor: ribbonColor, opacity: 0.9 }}></div>
        </div>
        
        {/* Back */}
        <div className="absolute w-32 h-24 border border-black/10 flex items-center justify-center brightness-95" 
             style={{ backgroundColor: color, transform: 'rotateY(180deg) translateZ(16px) translateY(16px)' }}>
          <div className="absolute h-full w-4 shadow-sm" style={{ backgroundColor: ribbonColor, opacity: 0.9 }}></div>
        </div>
      </div>
    </div>
  );
};

export function WrappingGuide() {
  const { language } = useLanguage();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="bg-brand-ivory min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-gold/20 mb-6">
            <Sparkles className="w-8 h-8 text-brand-brown" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-brand-black font-bold mb-6">
            {language === 'ar' ? 'دليل التغليف الفاخر' : 'Luxury Wrapping Guide'}
          </h1>
          <p className="text-lg text-brand-gray leading-relaxed">
            {language === 'ar' 
              ? 'اكتشف فن التغليف الراقي. نقدم مجموعة من الأساليب المتقنة لتجعل هديتك لوحة فنية تعبر عن اهتمامك وذوقك الرفيع قبل أن تُفتح.'
              : 'Discover the art of fine wrapping. We offer a collection of exquisite styles to make your gift a masterpiece that expresses your care and refined taste before it is even opened.'}
          </p>
        </div>

        {/* Styles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {WRAPPING_STYLES.map((style, index) => (
            <div 
              key={style.id}
              className="bg-white rounded-sm border border-brand-black/5 overflow-hidden group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="h-64 bg-brand-light-gray/30 relative flex items-center justify-center overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #C8A46A 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                {/* 3D Box */}
                <div className="relative z-10 w-full h-full p-8">
                   <AnimatedBox color={style.color} ribbonColor={style.ribbon} isHovered={hoveredIndex === index} />
                </div>
              </div>
              
              <div className="p-8 text-center border-t border-brand-black/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-gold/5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                <div className="relative z-10">
                  <h3 className="font-serif text-2xl font-bold text-brand-black mb-3">
                    {language === 'ar' ? style.title : style.titleEn}
                  </h3>
                  <p className="text-brand-gray leading-relaxed mb-6">
                    {language === 'ar' ? style.desc : style.descEn}
                  </p>
                  <Link 
                    to="/gift-customization" 
                    className="inline-flex items-center gap-2 text-brand-brown font-bold text-sm uppercase tracking-wider group-hover:text-brand-gold transition-colors"
                  >
                    {language === 'ar' ? 'صمم هديتك بهذا الأسلوب' : 'Build gift with this style'}
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Building Section */}
        <div className="bg-brand-black text-brand-ivory rounded-sm p-12 md:p-20 text-center relative overflow-hidden">
          {/* Abstract geometric background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 border border-brand-gold rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 border border-brand-gold rounded-full translate-y-1/3 -translate-x-1/4"></div>
          </div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <Heart className="w-12 h-12 text-brand-gold mx-auto mb-8" />
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
              {language === 'ar' ? 'اصنع لحظة لا تُنسى' : 'Create an Unforgettable Moment'}
            </h2>
            <p className="text-white/70 text-lg mb-10 leading-relaxed">
              {language === 'ar' 
                ? 'استخدم أداة بناء الهدايا التفاعلية لدينا لاختيار البوكس، تنسيق المنتجات، وإضافة لمستك الشخصية على التغليف والبطاقة.'
                : 'Use our interactive gift building tool to select the box, curate products, and add your personal touch to the wrapping and card.'}
            </p>
            <Link 
              to="/gift-customization"
              className="inline-flex items-center gap-3 bg-brand-gold text-brand-black px-8 py-4 rounded-sm font-bold hover:bg-white transition-colors duration-300"
            >
              <Gift className="w-5 h-5" />
              <span>{language === 'ar' ? 'ابدأ بناء هديتك الآن' : 'Start Building Your Gift Now'}</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
