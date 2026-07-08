import React, { useState, useRef, useEffect } from 'react';
import { X, Rotate3D, Sparkles, HelpCircle, Eye, EyeOff, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';

interface Preview3DModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  wrapColor: string;
  ribbonColor: string;
  selectedProducts: { product: any; quantity: number }[];
}

export function Preview3DModal({
  isOpen,
  onClose,
  type,
  wrapColor,
  ribbonColor,
  selectedProducts,
}: Preview3DModalProps) {
  const { language } = useLanguage();
  const [isRotating, setIsRotating] = useState(true);
  const [isLidOpen, setIsLidOpen] = useState(false);
  const [zoom, setZoom] = useState(1.1); // Scale multiplier
  const [studioStyle, setStudioStyle] = useState<'luxury' | 'amber' | 'studio'>('luxury');
  
  // Drag rotation states
  const [rotation, setRotation] = useState({ x: -20, y: -45 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragStartRotation = useRef({ x: -20, y: -45 });

  const isTray = type === 'tray' || type === 'plate';

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle drag controls
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsRotating(false); // Pause auto-rotation on user drag
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    dragStartRotation.current = { ...rotation };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;

    setRotation({
      x: Math.min(60, Math.max(-60, dragStartRotation.current.x - deltaY * 0.4)), // Bound vertical rotation
      y: dragStartRotation.current.y + deltaX * 0.4,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsRotating(false);
    setIsDragging(true);
    const touch = e.touches[0];
    dragStart.current = { x: touch.clientX, y: touch.clientY };
    dragStartRotation.current = { ...rotation };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.current.x;
    const deltaY = touch.clientY - dragStart.current.y;

    setRotation({
      x: Math.min(60, Math.max(-60, dragStartRotation.current.x - deltaY * 0.4)),
      y: dragStartRotation.current.y + deltaX * 0.4,
    });
  };

  // Generate abstract items in the box based on actual selected products
  const renderedMiniProducts = [];
  let itemIndex = 0;
  selectedProducts.forEach((item) => {
    for (let q = 0; q < item.quantity; q++) {
      renderedMiniProducts.push({
        id: `${item.product.id}-${q}`,
        name: item.product.name,
        color: itemIndex % 3 === 0 ? 'bg-amber-900' : itemIndex % 3 === 1 ? 'bg-amber-700' : 'bg-yellow-600',
        shape: itemIndex % 2 === 0 ? 'rounded-full' : 'rounded-sm',
        accentColor: itemIndex % 4 === 0 ? '#C8A46A' : 'transparent',
      });
      itemIndex++;
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-5xl h-[85vh] bg-[#121212] border border-brand-gold/20 rounded-lg overflow-hidden flex flex-col lg:flex-row shadow-[0_0_50px_rgba(200,164,106,0.15)]"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Main 3D Viewport Area */}
        <div 
          className={cn(
            "flex-1 relative flex items-center justify-center overflow-hidden transition-all duration-700 select-none cursor-grab active:cursor-grabbing",
            studioStyle === 'luxury' && "bg-[radial-gradient(circle_at_center,_#201b15_0%,_#0a0a0a_80%)]",
            studioStyle === 'amber' && "bg-[radial-gradient(circle_at_center,_#3e2a1b_0%,_#0f0a07_80%)]",
            studioStyle === 'studio' && "bg-[radial-gradient(circle_at_center,_#333a42_0%,_#111417_80%)]"
          )}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {/* Studio Labels / Badges */}
          <div className="absolute top-6 right-6 flex items-center gap-2 pointer-events-none">
            <span className="bg-brand-gold/10 text-brand-gold border border-brand-gold/30 px-3 py-1 rounded-sm text-xs font-bold flex items-center gap-1 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              {language === 'ar' ? 'معاينة سينمائية عالية الدقة' : 'HD Cinematic Preview'}
            </span>
          </div>

          <div className="absolute top-6 left-6 text-xs text-white/40 pointer-events-none font-mono hidden md:block">
            {language === 'ar' ? 'اسحب لتدوير المجسم في كل الاتجاهات' : 'Drag to rotate the 3D model in all directions'}
          </div>

          {/* 3D Box Container Stage */}
          <div 
            className="relative flex items-center justify-center transition-all duration-500" 
            style={{ 
              perspective: '1500px',
              transform: `scale(${zoom})`
            }}
          >
            <div 
              className={cn(
                "w-56 h-56 relative preserve-3d transition-transform duration-300 ease-out",
                isRotating ? "animate-[spin3d_16s_linear_infinite]" : ""
              )}
              style={{ 
                transform: isRotating 
                  ? undefined 
                  : `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` 
              }}
            >
              <style>{`
                @keyframes spin3d {
                  from { transform: rotateX(-20deg) rotateY(0deg); }
                  to { transform: rotateX(-20deg) rotateY(360deg); }
                }
              `}</style>
              
              {isTray ? (
                <>
                  {/* TRAY 3D RENDERING */}
                  {/* Rim edge (Side 3D rings) */}
                  <div className="absolute inset-0 m-auto w-56 h-56 rounded-full border-[10px] shadow-2xl transition-all duration-500" 
                    style={{ 
                      backgroundColor: 'transparent', 
                      borderColor: ribbonColor, 
                      transform: 'rotateX(75deg) translateZ(5px)',
                      filter: 'brightness(0.8)'
                    }} 
                  />
                  
                  {/* Tray Base Floor */}
                  <div className="absolute inset-0 m-auto w-56 h-56 rounded-full border-4 flex items-center justify-center shadow-2xl transition-all duration-500" 
                    style={{ 
                      backgroundColor: wrapColor, 
                      borderColor: ribbonColor, 
                      transform: 'rotateX(75deg) translateZ(10px)' 
                    }}
                  >
                    <div className="w-48 h-48 rounded-full border-2 border-dashed opacity-40 flex items-center justify-center" style={{ borderColor: ribbonColor }}>
                      <Sparkles className="w-12 h-12 opacity-10" style={{ color: ribbonColor }} />
                    </div>
                  </div>

                  {/* Tray Products Placement */}
                  <div className="absolute inset-0 m-auto w-40 h-40 rounded-full flex flex-wrap gap-2 items-center justify-center p-4" 
                    style={{ 
                      transform: 'rotateX(75deg) translateZ(28px)',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {renderedMiniProducts.slice(0, 15).map((p, idx) => (
                      <div 
                        key={p.id} 
                        className={cn("w-7 h-7 shadow-lg flex items-center justify-center border border-white/5", p.color, p.shape)}
                        style={{
                          transform: `translateZ(${5 + (idx % 3) * 3}px)`,
                          boxShadow: '0 4px 6px rgba(0,0,0,0.4)'
                        }}
                      >
                        {p.accentColor !== 'transparent' && (
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.accentColor }} />
                        )}
                      </div>
                    ))}
                    {renderedMiniProducts.length === 0 && (
                      <div className="text-white/20 text-[10px] text-center w-full transform -rotate-12 mt-4 font-bold tracking-widest uppercase">
                        {language === 'ar' ? 'فارغ' : 'EMPTY'}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* BOX 3D RENDERING */}
                  {/* Inner Box floor (Visible when Lid is Open) */}
                  <div className="absolute w-48 h-48 border border-brand-brown/10 flex flex-wrap gap-2.5 items-center justify-center p-5 transition-all duration-500" 
                    style={{ 
                      backgroundColor: '#2b1b11', // Inside wood/chocolate background
                      transform: 'rotateX(90deg) translateZ(-46px)', // Inside base floor
                    }}
                  >
                    {renderedMiniProducts.slice(0, 9).map((p) => (
                      <div 
                        key={p.id} 
                        className={cn("w-9 h-9 shadow-inner transition-transform duration-500 relative flex items-center justify-center", p.color, p.shape)}
                        style={{ 
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.5)',
                        }}
                      >
                        {p.accentColor !== 'transparent' && (
                          <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: p.accentColor }} />
                        )}
                      </div>
                    ))}
                    {renderedMiniProducts.length === 0 && (
                      <div className="text-white/20 text-xs font-serif font-semibold text-center select-none">
                        {language === 'ar' ? 'البوكس فارغ' : 'Empty Box'}
                      </div>
                    )}
                  </div>

                  {/* Top Lid Face (Animated Open/Close) */}
                  <div 
                    className="absolute w-48 h-48 border border-white/5 flex items-center justify-center shadow-xl transition-all duration-1000 ease-in-out z-30" 
                    style={{ 
                      backgroundColor: wrapColor, 
                      transform: isLidOpen 
                        ? 'rotateX(45deg) translateZ(130px) translateY(-100px) rotateY(-20deg)' 
                        : 'rotateX(90deg) translateZ(48px)',
                      transformOrigin: 'top center',
                      boxShadow: isLidOpen ? '0 15px 30px rgba(0,0,0,0.5)' : 'none'
                    }}
                  >
                    {/* Ribbon Crossing on the Lid */}
                    <div className="absolute w-full h-8 shadow-sm transition-colors duration-500" style={{ backgroundColor: ribbonColor, opacity: 0.95 }}></div>
                    <div className="absolute h-full w-8 shadow-sm transition-colors duration-500" style={{ backgroundColor: ribbonColor, opacity: 0.95 }}></div>
                    
                    {/* Ribbon Bow Ornament */}
                    <div className="absolute z-10 flex items-center justify-center">
                      <div className="w-16 h-16 border-[8px] rounded-[42%] absolute -translate-x-7 -translate-y-4 rotate-45 shadow-md transition-colors duration-500" style={{ borderColor: ribbonColor }}></div>
                      <div className="w-16 h-16 border-[8px] rounded-[42%] absolute translate-x-7 -translate-y-4 -rotate-45 shadow-md transition-colors duration-500" style={{ borderColor: ribbonColor }}></div>
                      <div className="w-10 h-10 rounded-full absolute shadow-xl transition-colors duration-500 flex items-center justify-center" style={{ backgroundColor: ribbonColor }}>
                        <div className="w-4 h-4 rounded-full bg-white/20 animate-ping"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Front Face of Box */}
                  <div className="absolute w-48 h-24 border border-black/10 flex items-center justify-center brightness-95 transition-colors duration-500 z-10" style={{ backgroundColor: wrapColor, transform: 'translateZ(96px) translateY(96px)' }}>
                    <div className="absolute h-full w-8 shadow-sm transition-colors duration-500" style={{ backgroundColor: ribbonColor, opacity: 0.9 }}></div>
                  </div>
                  
                  {/* Right Face of Box */}
                  <div className="absolute w-48 h-24 border border-black/10 flex items-center justify-center brightness-90 transition-colors duration-500 z-10" style={{ backgroundColor: wrapColor, transform: 'rotateY(90deg) translateZ(96px) translateY(96px)' }}>
                    <div className="absolute h-full w-8 shadow-sm transition-colors duration-500" style={{ backgroundColor: ribbonColor, opacity: 0.9 }}></div>
                  </div>
                  
                  {/* Left Face of Box */}
                  <div className="absolute w-48 h-24 border border-black/10 flex items-center justify-center brightness-105 transition-colors duration-500 z-10" style={{ backgroundColor: wrapColor, transform: 'rotateY(-90deg) translateZ(96px) translateY(96px)' }}>
                    <div className="absolute h-full w-8 shadow-sm transition-colors duration-500" style={{ backgroundColor: ribbonColor, opacity: 0.9 }}></div>
                  </div>
                  
                  {/* Back Face of Box */}
                  <div className="absolute w-48 h-24 border border-black/10 flex items-center justify-center brightness-95 transition-colors duration-500 z-10" style={{ backgroundColor: wrapColor, transform: 'rotateY(180deg) translateZ(96px) translateY(96px)' }}>
                    <div className="absolute h-full w-8 shadow-sm transition-colors duration-500" style={{ backgroundColor: ribbonColor, opacity: 0.9 }}></div>
                  </div>

                  {/* Bottom Face of Box */}
                  <div className="absolute w-48 h-48 border border-black/20 transition-colors duration-500" style={{ backgroundColor: wrapColor, transform: 'rotateX(-90deg) translateZ(48px)', filter: 'brightness(0.7)' }}>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Floated Control Widgets over Viewport */}
          <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-black/60 backdrop-blur-md p-1.5 rounded-md border border-white/15">
            <button 
              onClick={() => setZoom(prev => Math.min(1.8, prev + 0.1))}
              className="p-2 text-white/80 hover:text-brand-gold hover:bg-white/5 transition-colors rounded-sm cursor-pointer"
              title={language === 'ar' ? 'تقريب' : 'Zoom In'}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-white/10" />
            <button 
              onClick={() => setZoom(prev => Math.max(0.6, prev - 0.1))}
              className="p-2 text-white/80 hover:text-brand-gold hover:bg-white/5 transition-colors rounded-sm cursor-pointer"
              title={language === 'ar' ? 'إبعاد' : 'Zoom Out'}
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-white/10" />
            <button 
              onClick={() => {
                setRotation({ x: -20, y: -45 });
                setIsRotating(false);
              }}
              className="p-2 text-white/80 hover:text-brand-gold hover:bg-white/5 transition-colors rounded-sm cursor-pointer"
              title={language === 'ar' ? 'إعادة ضبط المنظور' : 'Reset Camera'}
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sidebar Panel: Controls and Customizer */}
        <div className="w-full lg:w-80 bg-[#161616] border-t lg:border-t-0 lg:border-l border-brand-gold/15 flex flex-col justify-between p-6 overflow-y-auto">
          <div>
            {/* Header */}
            <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-6">
              <div>
                <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  <Rotate3D className="w-5 h-5 text-brand-gold" />
                  <span>{language === 'ar' ? 'تفاعل ثلاثي الأبعاد' : '3D Interaction'}</span>
                </h2>
                <p className="text-white/40 text-xs mt-1">
                  {language === 'ar' ? 'معاينة سينمائية تفاعلية عالية الدقة.' : 'Interactive high-definition cinematic preview.'}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-1 text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Interactivity Section */}
            <div className="space-y-6">
              {/* Rotation Type */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider">
                  {language === 'ar' ? 'وضع الدوران' : 'Rotation Mode'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsRotating(true)}
                    className={cn(
                      "py-2 px-3 text-xs font-semibold rounded-sm border transition-all cursor-pointer",
                      isRotating 
                        ? "bg-brand-gold text-brand-black border-brand-gold font-bold" 
                        : "bg-transparent text-white/60 border-white/10 hover:border-white/20"
                    )}
                  >
                    {language === 'ar' ? 'دوران مستمر' : 'Continuous'}
                  </button>
                  <button
                    onClick={() => {
                      setIsRotating(false);
                      setRotation({ x: -20, y: -45 });
                    }}
                    className={cn(
                      "py-2 px-3 text-xs font-semibold rounded-sm border transition-all cursor-pointer",
                      !isRotating 
                        ? "bg-brand-gold text-brand-black border-brand-gold font-bold" 
                        : "bg-transparent text-white/60 border-white/10 hover:border-white/20"
                    )}
                  >
                    {language === 'ar' ? 'تحكم يدوي' : 'Manual Drag'}
                  </button>
                </div>
              </div>

              {/* Box Lid Opening/Closing Control */}
              {!isTray && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider">
                    {language === 'ar' ? 'الغطاء العلوي للبوكس' : 'Box Lid Cover'}
                  </label>
                  <button
                    onClick={() => setIsLidOpen(!isLidOpen)}
                    className={cn(
                      "w-full py-2.5 px-4 rounded-sm border transition-all flex items-center justify-center gap-2 cursor-pointer font-bold text-xs",
                      isLidOpen 
                        ? "bg-brand-brown/30 text-brand-gold border-brand-gold" 
                        : "bg-brand-gold/10 text-brand-gold border-brand-gold/30 hover:bg-brand-gold/20"
                    )}
                  >
                    {isLidOpen ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span>{isLidOpen ? (language === 'ar' ? 'إغلاق غطاء البوكس' : 'Close Box Lid') : (language === 'ar' ? 'فتح غطاء البوكس وعرض المحتوى' : 'Open Box Lid to view contents')}</span>
                  </button>
                </div>
              )}

              {/* Studio lighting background style selection */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider">
                  {language === 'ar' ? 'نمط بيئة الإضاءة (Studio)' : 'Studio Lighting Ambiance'}
                </label>
                <div className="flex flex-col gap-2">
                  {[
                    { id: 'luxury', ar: 'ستوديو فخم مظلم', en: 'Luxury Dark Studio' },
                    { id: 'amber', ar: 'ستوديو الكهرمان الدافئ', en: 'Warm Amber Ambiance' },
                    { id: 'studio', ar: 'ستوديو أبيض كلاسيكي', en: 'Classic Bright Studio' }
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setStudioStyle(style.id as any)}
                      className={cn(
                        "w-full py-2 px-3 text-xs text-right font-medium rounded-sm border transition-all cursor-pointer flex justify-between items-center",
                        studioStyle === style.id 
                          ? "bg-white/10 text-brand-gold border-brand-gold" 
                          : "bg-transparent text-white/60 border-white/5 hover:border-white/15"
                      )}
                    >
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        style.id === 'luxury' && "bg-[#201b15]",
                        style.id === 'amber' && "bg-[#3e2a1b]",
                        style.id === 'studio' && "bg-[#333a42]"
                      )} />
                      <span>{language === 'ar' ? style.ar : style.en}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Specifications */}
          <div className="border-t border-white/10 pt-4 mt-6">
            <h4 className="text-xs font-bold text-white/60 mb-2.5 uppercase tracking-wider">
              {language === 'ar' ? 'تفاصيل الهدية المخصصة' : 'Customized Gift Specs'}
            </h4>
            <div className="bg-white/5 rounded-sm p-3.5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-white/40">{language === 'ar' ? 'نوع الوعاء:' : 'Container Type:'}</span>
                <span className="text-white/80 font-medium">
                  {isTray ? (language === 'ar' ? 'صينية أكريليك / صحن خزفي' : 'Tray / Serving Plate') : (language === 'ar' ? 'علبة / بوكس كلاسيك فاخر' : 'Luxury Gift Box')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">{language === 'ar' ? 'عدد الشوكولاتة:' : 'Chocolate count:'}</span>
                <span className="text-brand-gold font-bold">
                  {renderedMiniProducts.length} {language === 'ar' ? 'قطع مضافة' : 'pieces added'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40">{language === 'ar' ? 'لون الورق / الشريطة:' : 'Paper / Ribbon:'}</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: wrapColor }} title="Wrap Color" />
                  <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: ribbonColor }} title="Ribbon Color" />
                </div>
              </div>
            </div>

            {/* Quick Helper Tip */}
            <div className="mt-4 flex items-start gap-2.5 text-[11px] text-white/40 leading-relaxed">
              <HelpCircle className="w-4 h-4 text-brand-gold/60 shrink-0 mt-0.5" />
              <p>
                {language === 'ar' 
                  ? 'انقر واسحب بالفأرة لتدوير الهدية في جميع الزوايا، أو استخدم أزرار الزوم للتقريب.' 
                  : 'Click and drag with your mouse to inspect from any angle. Use zoom buttons for details.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
