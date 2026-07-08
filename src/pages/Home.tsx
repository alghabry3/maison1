import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
import { RecommendedSection } from '../components/RecommendedSection';
import { MOCK_PRODUCTS } from '../data';
import { ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';

const FAQS = [
  {
    questionAr: "من أين تستوردون الشوكولاتة؟",
    questionEn: "Where do you import your chocolate from?",
    answerAr: "نحن نستورد الشوكولاتة الخاصة بنا من أفضل الموردين في بلجيكا وسويسرا، حيث يتم اختيار حبوب الكاكاو بعناية فائقة لضمان أعلى مستويات الجودة والمذاق الفاخر.",
    answerEn: "We import our chocolate from the finest suppliers in Belgium and Switzerland, where cocoa beans are carefully selected to ensure the highest levels of quality and premium taste."
  },
  {
    questionAr: "هل تتوفر خدمة التوصيل خارج الرياض؟",
    questionEn: "Is delivery available outside Riyadh?",
    answerAr: "حالياً، نوفر خدمة التوصيل السريع داخل مدينة الرياض فقط لضمان وصول الشوكولاتة في أفضل حالة ممكنة. نعمل على توسيع نطاق التوصيل قريباً.",
    answerEn: "Currently, we offer express delivery inside Riyadh city only to guarantee the chocolate arrives in the best possible condition. We are working on expanding our coverage soon."
  },
  {
    questionAr: "كيف يجب تخزين الشوكولاتة للحفاظ على جودتها؟",
    questionEn: "How should chocolate be stored to maintain its quality?",
    answerAr: "للحفاظ على جودة الشوكولاتة، يُنصح بتخزينها في مكان بارد وجاف، بعيداً عن أشعة الشمس المباشرة والروائح القوية. درجة الحرارة المثالية تتراوح بين 15 إلى 18 درجة مئوية.",
    answerEn: "To maintain its quality, we recommend storing the chocolate in a cool, dry place away from direct sunlight and strong odors. The ideal temperature ranges between 15°C and 18°C."
  },
  {
    questionAr: "هل يمكنني تخصيص الطلبات الخاصة والمناسبات الكبيرة؟",
    questionEn: "Can I customize special orders and large events?",
    answerAr: "نعم، نقدم خدمة تخصيص الطلبات للشركات والمناسبات الخاصة مثل الزواجات والأعياد. يمكننا توفير تغليف مخصص وبطاقات إهداء بتصميمكم الخاص.",
    answerEn: "Yes, we offer customization services for corporate orders and special events such as weddings and holidays. We can provide bespoke packaging and gift cards tailored to your design."
  }
];

export function Home() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'all' | 'best' | 'gifts' | 'luxury' | 'trays' | 'occasions'>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const tabs = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All Collections' },
    { id: 'best', labelAr: 'الأكثر مبيعاً', labelEn: 'Best Sellers' },
    { id: 'gifts', labelAr: 'بوكسات الهدايا', labelEn: 'Gift Boxes' },
    { id: 'luxury', labelAr: 'شوكولاتة فاخرة', labelEn: 'Luxury Chocolate' },
    { id: 'trays', labelAr: 'صواني الضيافة', labelEn: 'Serving Trays' },
    { id: 'occasions', labelAr: 'مناسبات خاصة', labelEn: 'Occasions' }
  ] as const;

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    if (activeTab === 'all') return true;
    if (activeTab === 'best') return product.isBestSeller;
    if (activeTab === 'gifts') return product.category === 'بوكسات هدايا';
    if (activeTab === 'luxury') return product.category === 'شوكولاتة فاخرة';
    if (activeTab === 'trays') return product.category === 'صواني ضيافة';
    if (activeTab === 'occasions') return product.category === 'مناسبات';
    return true;
  }).slice(0, 8); // Display up to 8 items elegantly

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const homeTitle = language === 'ar'
    ? 'ميزون إتش | الشوكولاتة البلجيكية والسويسرية الفاخرة بالرياض'
    : 'Maison H | Luxury Belgian & Swiss Chocolate in Riyadh';
  const homeDesc = language === 'ar'
    ? 'اكتشفوا أرقى تشكيلات الشوكولاتة البلجيكية والسويسرية من ميزون إتش. نوفر هدايا شوكولاتة مخصصة، صواني ضيافة فاخرة، وتوصيل سريع ومبرد في الرياض.'
    : 'Discover the finest Belgian and Swiss chocolate collections from Maison H. We offer customized chocolate gifts, luxurious serving trays, and express cold-chain delivery in Riyadh.';
  const homeUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>{homeTitle}</title>
        <meta name="description" content={homeDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={homeTitle} />
        <meta property="og:description" content={homeDesc} />
        <meta property="og:image" content="https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" />
        <meta property="og:url" content={homeUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={homeTitle} />
        <meta name="twitter:description" content={homeDesc} />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" />
        <meta name="keywords" content={language === 'ar'
          ? "شوكولاتة فاخرة, شوكولاتة بلجيكية, متجر شوكولاتة الرياض, هدايا شوكولاتة, بوكس هدايا, صواني ضيافة, ميزون اتش"
          : "luxury chocolate, belgian chocolate, chocolate riyadh, chocolate gifts, premium chocolate box, Maison H"
        } />
        {/* Structured Data for local business / online shop */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Store",
            "name": "Maison H",
            "image": "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
            "description": homeDesc,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Riyadh",
              "addressCountry": "SA"
            },
            "priceRange": "$$$"
          })}
        </script>
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden bg-brand-dark">
        {/* Background Image & Gradient */}
        <div className="absolute inset-0 z-0 opacity-20" style={{ background: 'radial-gradient(circle at 30% 50%, #8A5A3B 0%, transparent 70%)' }}></div>
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Luxury Chocolate Hero" 
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 px-4 md:px-20 max-w-7xl mx-auto w-full animate-slide-up">
          <span className="text-brand-gold uppercase tracking-[0.3em] text-xs font-semibold mb-4 block">Maison H Chocolatier</span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-brand-ivory font-light mb-6 leading-tight">
            {language === 'ar' ? (
              <>اكتشفوا أرقى <br/><span className="text-brand-gold italic">تشكيلات الشوكولاتة</span></>
            ) : (
              <>Discover Fine <br/><span className="text-brand-gold italic">Chocolate Blends</span></>
            )}
          </h1>
          <p className="text-brand-gray text-lg md:text-xl mb-10 max-w-lg leading-relaxed font-light">
            {language === 'ar' 
              ? 'شوكولاتة أوروبية مختارة بعناية، وهدايا مصممة لتترك أثراً لا يُنسى في كل مناسباتكم.' 
              : 'Meticulously selected European chocolate and gifts tailored to leave an unforgettable impression on every occasion.'}
          </p>
          
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link to="/shop">
              <Button size="lg" className="w-full sm:w-auto text-sm px-10 gold-gradient text-brand-black border-none uppercase tracking-wider font-bold">
                {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
              </Button>
            </Link>
            <Link to="/gift-customization">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm px-10 border-brand-gold text-brand-gold hover:bg-brand-gold/10 uppercase tracking-wider font-bold">
                {language === 'ar' ? 'صمم هديتك' : 'Design Your Gift'}
              </Button>
            </Link>
          </div>
        </div>

        {/* Trust Indicators - bottom bar */}
        <div className="absolute bottom-0 inset-x-0 bg-brand-black/80 backdrop-blur-md border-t border-brand-gold/20 hidden md:block">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center text-sm text-brand-ivory/80">
            <div className="flex items-center gap-2">
              <span className="text-brand-gold">✧</span> 
              {language === 'ar' ? 'توصيل داخل الرياض' : 'Delivery inside Riyadh'}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-brand-gold">✧</span> 
              {language === 'ar' ? 'تغليف فاخر' : 'Luxury Packaging'}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-brand-gold">✧</span> 
              {language === 'ar' ? 'خيارات تقسيط متعددة' : 'Flexible Installments'}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-brand-gold">✧</span> 
              {language === 'ar' ? 'منتجات مستوردة ومسجلة' : 'Registered Import Products'}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Products Showcase & Tabs Section */}
      <section className="py-24 bg-brand-ivory" id="collections-showcase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-2 block flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              {language === 'ar' ? 'صُنعت بحب وشغف' : 'CRAFTED WITH LOVE & PASSION'}
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-brand-black font-light mb-4">
              {language === 'ar' ? 'تصفح تشكيلاتنا الفاخرة' : 'Browse Our Luxury Collections'}
            </h2>
            <div className="w-20 h-0.5 bg-brand-gold mx-auto mb-4"></div>
            <p className="text-brand-gray max-w-2xl mx-auto text-sm md:text-base">
              {language === 'ar' 
                ? 'تنقل بين أرقى أنواع الشوكولاتة البلجيكية، الصواني الفاخرة، والبوكسات المصممة لترضي ذوقكم الرفيع.' 
                : 'Navigate through elite Belgian chocolates, luxury trays, and custom gift boxes designed for your taste.'}
            </p>
          </div>

          {/* Bilingual Tabs Bar */}
          <div className="flex justify-center mb-12 border-b border-brand-brown/10 pb-1 overflow-x-auto scrollbar-none scroll-smooth">
            <div className="flex gap-1 md:gap-4 px-2 whitespace-nowrap">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      const el = document.getElementById('collections-showcase');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className={cn(
                      "px-5 py-3.5 text-xs md:text-sm font-medium transition-all relative border-b-2 duration-300",
                      isActive 
                        ? "border-brand-gold text-brand-gold font-bold scale-105" 
                        : "border-transparent text-brand-gray hover:text-brand-black hover:border-brand-brown/30"
                    )}
                  >
                    {language === 'ar' ? tab.labelAr : tab.labelEn}
                    {isActive && (
                      <span className="absolute inset-x-0 bottom-0 h-[2px] bg-brand-gold animate-scale-up" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtered Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 transition-opacity duration-300">
              {filteredProducts.map((product) => (
                <div key={product.id} className="animate-fade-in">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-brand-brown/5 rounded p-8">
              <p className="text-brand-gray text-base">
                {language === 'ar' ? 'عذراً، لم يتم العثور على منتجات في هذه الفئة حالياً.' : 'No products found in this category at the moment.'}
              </p>
            </div>
          )}
          
          <div className="mt-16 text-center">
            <Link to="/shop">
              <Button variant="outline" size="lg" className="border-brand-brown text-brand-brown hover:bg-brand-brown hover:text-white transition-colors duration-300 font-bold px-10">
                {language === 'ar' ? 'عرض المتجر كاملاً' : 'View Full Boutique'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      <RecommendedSection />

      {/* Occasions / Categories Split */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Link to="/shop?category=مناسبات" className="group relative h-[400px] overflow-hidden rounded-sm block border border-brand-black/5 hover:border-brand-gold/50 transition-colors">
              <img src="https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt={language === 'ar' ? 'المناسبات' : 'Occasions'} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/20 to-transparent"></div>
              <div className="absolute inset-x-0 bottom-0 p-8 text-center">
                <h3 className="font-serif text-3xl text-white font-bold mb-2">
                  {language === 'ar' ? 'هدايا المناسبات' : 'Occasion Gifts'}
                </h3>
                <p className="text-brand-ivory/80 mb-6">
                  {language === 'ar' ? 'تشكيلات مصممة للزواجات والأعياد' : 'Collections styled for weddings & holidays'}
                </p>
                <span className="inline-block border-b border-brand-gold text-brand-gold pb-1 font-medium group-hover:text-white group-hover:border-white transition-colors">
                  {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
                </span>
              </div>
            </Link>

            <Link to="/shop?category=شركات" className="group relative h-[400px] overflow-hidden rounded-sm block border border-brand-black/5 hover:border-brand-gold/50 transition-colors">
              <img src="https://images.unsplash.com/photo-1579738012674-32e602717904?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt={language === 'ar' ? 'هدايا الشركات' : 'Corporate Gifts'} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/20 to-transparent"></div>
              <div className="absolute inset-x-0 bottom-0 p-8 text-center">
                <h3 className="font-serif text-3xl text-white font-bold mb-2">
                  {language === 'ar' ? 'هدايا الشركات' : 'Corporate Gifts'}
                </h3>
                <p className="text-brand-ivory/80 mb-6">
                  {language === 'ar' ? 'باقات مخصصة مع خيارات طباعة الشعار' : 'Custom packages with logo printing options'}
                </p>
                <span className="inline-block border-b border-brand-gold text-brand-gold pb-1 font-medium group-hover:text-white group-hover:border-white transition-colors">
                  {language === 'ar' ? 'اكتشف المزيد' : 'Discover More'}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Build your gift CTA */}
      <section className="py-24 bg-brand-black text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1548135898-35619b0cece9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" className="w-full h-full object-cover" alt="" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-5xl text-brand-ivory font-bold mb-6 leading-tight">
            {language === 'ar' ? 'صمم هديتك بتفاصيلك الخاصة' : 'Design Your Gift with Custom Details'}
          </h2>
          <p className="text-brand-gray text-lg mb-10">
            {language === 'ar' 
              ? 'اختر البوكس، التشكيلة، ولون التغليف لتكوين هدية تعبر عن مشاعرك بدقة.' 
              : 'Choose the box, selection, and wrapping color to construct a gift that accurately conveys your emotions.'}
          </p>
          <Link to="/gift-customization">
            <Button variant="gold" size="lg" className="px-12 text-lg shadow-[0_0_20px_rgba(200,164,106,0.3)]">
              {language === 'ar' ? 'ابدأ التصميم' : 'Start Designing'}
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-brand-ivory">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-brand-black font-bold mb-4">
              {language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
            </h2>
            <div className="w-16 h-0.5 bg-brand-gold mx-auto"></div>
          </div>
          
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div 
                key={index}
                className="bg-white border border-brand-brown/10 rounded-sm overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-right focus:outline-none"
                >
                  <span className="font-bold text-brand-black">
                    {language === 'ar' ? faq.questionAr : faq.questionEn}
                  </span>
                  <ChevronDown 
                    className={cn(
                      "w-5 h-5 text-brand-gold transition-transform duration-300",
                      openFaq === index ? "rotate-180" : ""
                    )}
                  />
                </button>
                <div 
                  className={cn(
                    "px-6 overflow-hidden transition-all duration-300 ease-in-out",
                    openFaq === index ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <p className="text-brand-gray leading-relaxed text-sm">
                    {language === 'ar' ? faq.answerAr : faq.answerEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
