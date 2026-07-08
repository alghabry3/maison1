import { Link } from 'react-router-dom';
import { CreditCard, Smartphone } from 'lucide-react';
import { MaisonHLogo } from './MaisonHLogo';

export function Footer() {
  return (
    <footer className="bg-brand-black text-brand-ivory pt-20 pb-10 border-t border-brand-brown/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          <div className="space-y-6">
            <MaisonHLogo size="custom" customSize={64} alignment="left" showSubtext="CHOCOLATIER DE LUXE" />
            <p className="text-brand-gray text-sm leading-relaxed max-w-xs">
              شوكولاتة أوروبية فاخرة، وهدايا مصممة لتترك أثراً لا يُنسى في كل مناسباتكم.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg text-brand-gold mb-6 font-medium">تسوق</h4>
            <ul className="space-y-4 text-sm text-brand-light-gray">
              <li><Link to="/shop" className="hover:text-brand-gold transition-colors">جميع المنتجات</Link></li>
              <li><Link to="/shop?category=بوكسات" className="hover:text-brand-gold transition-colors">بوكسات الهدايا</Link></li>
              <li><Link to="/shop?category=مناسبات" className="hover:text-brand-gold transition-colors">المناسبات</Link></li>
              <li><Link to="/gift-customization" className="hover:text-brand-gold transition-colors">صمم هديتك</Link></li>
              <li><Link to="/shop?category=شركات" className="hover:text-brand-gold transition-colors">هدايا الشركات</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg text-brand-gold mb-6 font-medium">مساعدة</h4>
            <ul className="space-y-4 text-sm text-brand-light-gray">
              <li><Link to="/help?tab=faqs" className="hover:text-brand-gold transition-colors">الأسئلة الشائعة</Link></li>
              <li><Link to="/help?tab=shipping" className="hover:text-brand-gold transition-colors">سياسة الشحن</Link></li>
              <li><Link to="/help?tab=returns" className="hover:text-brand-gold transition-colors">سياسة الإرجاع</Link></li>
              <li><Link to="/track-order" className="hover:text-brand-gold transition-colors">تتبع طلبك</Link></li>
              <li><Link to="/help?tab=contact" className="hover:text-brand-gold transition-colors">تواصل معنا</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg text-brand-gold mb-6 font-medium">النشرة البريدية</h4>
            <p className="text-brand-gray text-sm mb-4">اشترك ليصلك جديدنا وعروضنا الحصرية.</p>
            <form className="flex" onSubmit={e => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="البريد الإلكتروني" 
                className="bg-transparent border border-brand-brown/40 rounded-r-md px-4 py-2 text-sm focus:outline-none focus:border-brand-gold text-left flex-1"
                dir="ltr"
              />
              <button type="submit" className="bg-brand-gold text-brand-black px-4 py-2 rounded-l-md text-sm font-medium hover:bg-brand-gold/90 transition-colors">
                اشتراك
              </button>
            </form>
          </div>

        </div>

        <div className="pt-8 border-t border-brand-brown/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-brand-gray">
          <p>© {new Date().getFullYear()} Maison H. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4 group/secure relative cursor-help">
            {/* Payment Methods - Interactive */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-brand-black border border-brand-gold/30 text-white text-xs px-3 py-2 rounded opacity-0 group-hover/secure:opacity-100 transition-opacity whitespace-nowrap pointer-events-none flex flex-col items-center z-10 shadow-xl">
              <span className="font-bold text-brand-gold">Secure Checkout</span>
              <span className="text-[9px] text-brand-gray">256-bit SSL Encryption</span>
            </div>
            <div className="group relative flex items-center justify-center w-10 h-6 bg-brand-light-gray/10 rounded cursor-pointer hover:bg-brand-gold/20 transition-all duration-300">
              <span className="font-bold text-[10px] text-white opacity-60 group-hover:opacity-100 transition-opacity italic">VISA</span>
              <span className="absolute -top-8 bg-brand-brown text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Visa</span>
            </div>
            
            <div className="group relative flex items-center justify-center w-10 h-6 bg-brand-light-gray/10 rounded cursor-pointer hover:bg-brand-gold/20 transition-all duration-300">
              <div className="flex -space-x-1 opacity-60 group-hover:opacity-100 transition-opacity">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 mix-blend-screen"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 mix-blend-screen"></div>
              </div>
              <span className="absolute -top-8 bg-brand-brown text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Mastercard</span>
            </div>
            
            <div className="group relative flex items-center justify-center w-10 h-6 bg-brand-light-gray/10 rounded cursor-pointer hover:bg-brand-gold/20 transition-all duration-300">
              <span className="font-bold text-[10px] text-white opacity-60 group-hover:opacity-100 transition-opacity"> Pay</span>
              <span className="absolute -top-8 bg-brand-brown text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Apple Pay</span>
            </div>

            <div className="group relative flex items-center justify-center w-10 h-6 bg-brand-light-gray/10 rounded cursor-pointer hover:bg-brand-gold/20 transition-all duration-300">
              <span className="font-bold text-[10px] text-white opacity-60 group-hover:opacity-100 transition-opacity">mada</span>
              <span className="absolute -top-8 bg-brand-brown text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">مدى</span>
            </div>

            <div className="group relative flex items-center justify-center w-10 h-6 bg-brand-light-gray/10 rounded cursor-pointer hover:bg-brand-gold/20 transition-all duration-300">
              <span className="font-bold text-[10px] text-white opacity-60 group-hover:opacity-100 transition-opacity">stc pay</span>
              <span className="absolute -top-8 bg-brand-brown text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">STC Pay</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
