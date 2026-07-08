import { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { MOCK_PRODUCTS, Product } from '../data';
import { Sparkles } from 'lucide-react';

export function RecommendedSection() {
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        // Mock cart: let's pretend user has p1 in their cart
        const cartItems = [MOCK_PRODUCTS[0]];
        
        const response = await fetch('/api/recommend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ cartItems })
        });
        
        if (response.ok) {
          const data = await response.json();
          const ids: string[] = data.recommendedIds || [];
          
          if (ids.length > 0) {
            const recommendedProducts = ids
              .map(id => MOCK_PRODUCTS.find(p => p.id === id))
              .filter((p): p is Product => p !== undefined)
              .slice(0, 4);
            
            setRecommended(recommendedProducts);
          } else {
            // Fallback
            setRecommended(MOCK_PRODUCTS.slice(1, 5));
          }
        } else {
          setRecommended(MOCK_PRODUCTS.slice(1, 5));
        }
      } catch (error) {
        console.error('Failed to load recommendations', error);
        setRecommended(MOCK_PRODUCTS.slice(1, 5));
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-brand-light-gray/20 border-t border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex items-center justify-center gap-3 mb-12">
            <Sparkles className="text-brand-gold w-6 h-6 animate-pulse" />
            <h2 className="font-serif text-2xl md:text-3xl text-brand-black font-bold">جاري تحليل تفضيلاتك...</h2>
            <Sparkles className="text-brand-gold w-6 h-6 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-80 bg-brand-light-gray/50 animate-pulse rounded-sm"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (recommended.length === 0) return null;

  return (
    <section className="py-24 bg-brand-light-gray/20 border-t border-black/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-brown/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-1.5 bg-brand-gold/10 text-brand-gold rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>مدعوم بالذكاء الاصطناعي</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-brand-black font-bold mb-4">مقترح لك خصيصاً</h2>
          <div className="w-16 h-0.5 bg-brand-gold mx-auto"></div>
          <p className="text-brand-gray mt-4 max-w-2xl mx-auto">بناءً على اختياراتك، نقترح لك هذه التشكيلة الفاخرة</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {recommended.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
