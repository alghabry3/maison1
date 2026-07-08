import React from 'react';
import { cn } from '../lib/utils';

interface MaisonHLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  customSize?: number;
  showText?: boolean;
  showSubtext?: boolean | string;
  textColor?: string; // 'white' | 'gold' | 'dynamic'
  alignment?: 'center' | 'left' | 'right';
  hoverEffect?: boolean;
}

export function MaisonHLogo({
  className,
  size = 'md',
  customSize,
  showText = true,
  showSubtext = true,
  textColor = 'dynamic',
  alignment = 'center',
  hoverEffect = true,
}: MaisonHLogoProps) {
  
  // Dimensions based on size preset
  const dims = {
    sm: { icon: 42, fontMain: 'text-sm tracking-[0.2em]', fontSub: 'text-[6px] tracking-[0.22em]' },
    md: { icon: 54, fontMain: 'text-base md:text-lg tracking-[0.22em]', fontSub: 'text-[7px] md:text-[8px] tracking-[0.25em]' },
    lg: { icon: 72, fontMain: 'text-xl md:text-2xl tracking-[0.25em]', fontSub: 'text-[8px] md:text-[10px] tracking-[0.28em]' },
    xl: { icon: 110, fontMain: 'text-3xl md:text-4xl tracking-[0.28em]', fontSub: 'text-[10px] md:text-[12px] tracking-[0.3em]' },
    custom: { icon: customSize || 54, fontMain: 'text-lg tracking-[0.22em]', fontSub: 'text-[8px] tracking-[0.25em]' },
  }[size];

  const iconSize = customSize || dims.icon;

  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center transition-all duration-300",
        alignment === 'left' && "items-start justify-start text-left",
        alignment === 'right' && "items-end justify-end text-right",
        hoverEffect && "group",
        className
      )}
    >
      {/* 3D-Like Luxury Crest Container containing the Custom Brand Monogram */}
      <div 
        className={cn(
          "relative flex items-center justify-center transition-all duration-500",
          hoverEffect && "group-hover:scale-105"
        )}
        style={{ width: iconSize, height: iconSize }}
      >
        {/* Subtle radial gold aura background on hover */}
        {hoverEffect && (
          <div className="absolute inset-0 bg-brand-gold/5 rounded-full filter blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        )}
        
        {/* Brand Crest Circular Borders */}
        <div className="absolute inset-0 rounded-full border border-brand-gold/20 group-hover:border-brand-gold/45 transition-colors duration-500" />
        <div className="absolute inset-[3px] rounded-full border border-dashed border-brand-gold/30 group-hover:border-brand-gold/50 transition-colors duration-500 animate-[spin_80s_linear_infinite]" />
        
        {/* Small jewel stars on top/bottom of circle frame */}
        <div className="absolute top-[-3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-brand-gold/90 rotate-45 shadow-[0_0_4px_rgba(200,164,106,0.5)]" />
        <div className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-brand-gold/90 rotate-45 shadow-[0_0_4px_rgba(200,164,106,0.5)]" />

        {/* Monogram SVG drawing of the REAL logo (Stylized copper 'm' + white 'h') */}
        <svg 
          viewBox="0 0 100 100" 
          className="w-[78%] h-[78%] relative z-10 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Tilted Brown Copper "m" path */}
          <path 
            d="M25 50 C23 45, 24 38, 28 35 C32 32, 36 34, 38 41 C40 48, 38 52, 35 56 C33 59, 31 56, 32 50 C33 44, 37 40, 41 38 C45 36, 44 42, 42 47 C40 52, 37 57, 34 60 C32 62, 29 60, 28 55 Z" 
            fill="#8C593B" // The beautiful real company copper-brown color
            className="transition-all duration-300 group-hover:fill-[#9E6746]"
          />
          
          {/* Real corporate logo brown cursive "m" loop stroke */}
          <path 
            d="M26 48 L35 38 C37 36, 41 38, 41 42 L33 54 C31 57, 30 57, 28 54 Z" 
            fill="#8C593B"
            opacity="0.85"
          />

          {/* Elegant White Script "h" path */}
          {/* Drawing a highly customized thick-and-thin brushstroke calligraphy path for 'h' */}
          <path 
            d="M48 65 C45 65, 43 62, 44 56 C45 50, 48 38, 51 29 C53 23, 56 18, 59 18 C61 18, 62 20, 61 24 C60 28, 54 44, 52 50 C51 53, 51 55, 53 55 C56 55, 60 48, 63 42 C66 36, 68 33, 70 33 C72 33, 73 35, 71 40 C69 46, 64 56, 64 60 C64 63, 67 63, 70 60 C72 58, 74 55, 75 55 C76 55, 76 56, 75 58 C73 61, 69 66, 65 66 C61 66, 59 63, 59 58 C59 54, 63 44, 63 41 C63 39, 61 38, 59 40 C56 42, 51 51, 49 57 C48 61, 49 65, 48 65 Z" 
            fill="#FFFFFF"
            className="transition-all duration-300"
          />

          {/* Connecting hairline elegant script touch */}
          <path 
            d="M43 56 C45 53, 49 41, 51 34" 
            stroke="#FFFFFF" 
            strokeWidth="1.5" 
            strokeLinecap="round"
            opacity="0.7"
          />
          
          {/* Subtle gold center-dot/sparkle to bridge monogram and luxury feeling */}
          <circle cx="50" cy="50" r="1.5" fill="#C8A46A" className="animate-pulse" />
        </svg>
      </div>

      {/* Typography with Real Logo Design (White "MAISON" + Brown "H") */}
      {showText && (
        <div className={cn(
          "flex flex-col mt-3 transition-colors duration-300",
          alignment === 'center' && "items-center text-center",
          alignment === 'left' && "items-start text-left",
          alignment === 'right' && "items-end text-right"
        )}>
          {/* Main Brand Title: High-contrast Classy Serif with exact logo coloring */}
          <h1 className={cn(
            "font-serif font-extrabold uppercase leading-none select-none flex items-center gap-1.5",
            dims.fontMain
          )}>
            <span className={cn(
              "transition-colors duration-500",
              textColor === 'white' && "text-white",
              textColor === 'gold' && "text-brand-gold",
              textColor === 'dynamic' && "text-white group-hover:text-brand-gold"
            )}>
              MAISON
            </span>
            <span className="text-[#8C593B] group-hover:text-[#A16745] transition-colors duration-500">
              H
            </span>
          </h1>

          {/* Subtitle - Professional localized descriptor */}
          {showSubtext && (
            <span className={cn(
              "font-sans font-black uppercase mt-2 select-none tracking-[0.25em] transition-colors duration-500",
              textColor === 'gold' ? "text-brand-gold/75" : "text-brand-ivory/45 group-hover:text-brand-gold/80",
              dims.fontSub
            )}>
              {showSubtext && (
                typeof showSubtext === 'string' ? showSubtext : 'PREMIUM BELGIAN CHOCOLATIER'
              )}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
