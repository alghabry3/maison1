import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  HelpCircle, 
  Truck, 
  RotateCcw, 
  MessageSquare, 
  Search, 
  ChevronDown, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Thermometer, 
  Sparkles,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/Button';

// FAQs Interface
interface FAQItem {
  id: string;
  category: 'products' | 'orders' | 'shipping' | 'customization';
  qAr: string;
  qEn: string;
  aAr: string;
  aEn: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'products',
    qAr: 'هل الشوكولاتة المستخدمة طبيعية وخالية من المواد الحافظة؟',
    qEn: 'Are the chocolates natural and preservative-free?',
    aAr: 'نعم، نلتزم في Maison H باستخدام أجود أنواع الكاكاو وزبدة الكاكاو الطبيعية 100% المستوردة من بلجيكا وسويسرا والإكوادور. منتجاتنا خالية تماماً من الزيوت المهدرجة، المواد الحافظة الصناعية، والألوان المعدلة جينياً لضمان مذاق نقي وصحي.',
    aEn: 'Yes, at Maison H we are committed to using 100% natural premium cocoa and cocoa butter imported from Belgium, Switzerland, and Ecuador. Our products are completely free from hydrogenated oils, artificial preservatives, and GMO colors to ensure a pure and healthy taste.'
  },
  {
    id: 'faq-2',
    category: 'products',
    qAr: 'كيف يمكنني حفظ الشوكولاتة لتبقى طازجة لأطول فترة؟',
    qEn: 'How should I store the chocolates to keep them fresh?',
    aAr: 'يُنصح بحفظ الشوكولاتة الفاخرة في مكان بارد وجاف تتراوح درجة حرارته بين 15 إلى 18 درجة مئوية (رطوبة أقل من 50%). يرجى تجنب حفظها في الثلاجة العادية مباشرة لمنع تكثف الرطوبة وتغير لون الشوكولاتة (تفتح السكر)، واحتفظ بها بعيداً عن الروائح القوية.',
    aEn: 'It is highly recommended to store luxury chocolates in a cool, dry place with temperatures between 15°C and 18°C (humidity below 50%). Avoid placing them directly in a standard home refrigerator to prevent moisture condensation and chocolate blooming, and keep them away from strong odors.'
  },
  {
    id: 'faq-3',
    category: 'products',
    qAr: 'هل تتوفر لديكم خيارات مخصصة للنباتيين أو خالية من السكر؟',
    qEn: 'Do you offer sugar-free or vegan options?',
    aAr: 'نعم، نوفر تشكيلة مميزة من الشوكولاتة الداكنة الفاخرة (نسبة كاكاو 70% فما فوق) والتي تعد نباتية بطبيعتها وخالية من مشتقات الحليب. كما يتوفر لدينا ألواح شوكولاتة داكنة خالية من السكر المضاف ومحلاة بمستخلص عشبة الستيفيا الطبيعية.',
    aEn: 'Yes, we offer a select range of dark chocolates (70% cocoa and above) which are naturally vegan and dairy-free. We also offer premium dark chocolate bars with no added sugar, sweetened with natural stevia extract.'
  },
  {
    id: 'faq-4',
    category: 'customization',
    qAr: 'هل يمكنني تصميم بوكس الشوكولاتة الخاص بي واختيار الحشوات؟',
    qEn: 'Can I design my own chocolate box and choose the fillings?',
    aAr: 'بالتأكيد! من خلال خدمة "صمم هديتك" (Gift Customization) المتوفرة في القائمة العلوية، يمكنك اختيار نوع وحجم البوكس الفاخر، ولون الشريط الحريري، والبطاقة المخصصة، ثم اختيار كل حبة شوكولاتة بحشوتها المفضلة بدقة تامة.',
    aEn: 'Absolutely! Through our "Gift Customization" service available in the top menu, you can select the type and size of the luxury box, the color of the silk ribbon, write a custom card, and handpick each individual chocolate with your preferred filling.'
  },
  {
    id: 'faq-5',
    category: 'customization',
    qAr: 'هل تتوفر لديكم خدمات هدايا الشركات والمناسبات الرسمية؟',
    qEn: 'Do you offer corporate gifting and official event services?',
    aAr: 'نعم، نقدم حلولاً فاخرة وحصرية للشركات والهيئات تشمل تصميم صناديق خاصة تحمل الهوية البصرية للشركة، طباعة الشعارات بالألوان الذهبية والحرارية، وحفر شعار الشركة بدقة على قطع الشوكولاتة البلجيكية، بالإضافة إلى صواني الضيافة الكبرى للمؤتمرات.',
    aEn: 'Yes, we provide premium, bespoke solutions for corporations and VIP clients. This includes custom packaging with corporate branding, hot-foil gold logo printing, precision-engraving of corporate logos directly onto chocolate pieces, and large hospitality trays for conferences.'
  },
  {
    id: 'faq-6',
    category: 'shipping',
    qAr: 'كيف تضمنون عدم ذوبان الشوكولاتة أثناء الشحن في الصيف؟',
    qEn: 'How do you guarantee the chocolates won\'t melt during shipping in summer?',
    aAr: 'نحن ندرك حساسية الشوكولاتة للحرارة، لذلك نقوم بتعبئتها في صناديق عازلة للحرارة ومبطنة بطبقات من القصدير الواقي مع عبوات جل تبريد تحافظ على درجة حرارة مثالية لمدة 72 ساعة. بالإضافة إلى ذلك، يتم شحن جميع الطلبات عبر أسطول سيارات مبردة ومتحكم بحرارتها.',
    aEn: 'We understand the delicate nature of chocolate. Therefore, we package our products in insulated thermal boxes lined with protective foil and packed with reusable cooling gel packs that maintain a stable cool temperature for up to 72 hours. All local shipments are handled via climate-controlled, refrigerated vehicles.'
  },
  {
    id: 'faq-7',
    category: 'shipping',
    qAr: 'ما هي مدة وتكلفة الشحن داخل المملكة ودول الخليج؟',
    qEn: 'What is the shipping duration and cost for KSA and GCC?',
    aAr: 'التوصيل داخل الرياض وجدة والدمام يستغرق 24 إلى 48 ساعة بتكلفة 35 ريالاً (ومجاناً للطلبات فوق 350 ريالاً). الشحن لبقية مدن المملكة يستغرق 2-4 أيام عمل. التوصيل لدول الخليج (الإمارات، الكويت، قطر، البحرين، عمان) يستغرق 3-5 أيام عمل بتكلفة 95 ريالاً.',
    aEn: 'Delivery within Riyadh, Jeddah, and Dammam takes 24 to 48 hours for 35 SAR (FREE for orders above 350 SAR). For other KSA cities, it takes 2-4 business days. Delivery to GCC countries (UAE, Kuwait, Qatar, Bahrain, Oman) takes 3-5 business days for 95 SAR.'
  },
  {
    id: 'faq-8',
    category: 'orders',
    qAr: 'هل يمكنني إرسال طلب كهدية مباشرة لشخص آخر دون إدراج الفاتورة؟',
    qEn: 'Can I send an order as a gift directly to someone else without the invoice?',
    aAr: 'بالتأكيد، هذه هي خدمتنا الأساسية! يمكنك تحديد خيار "إرسال كهدية" عند الدفع، وإدخال عنوان المستلم وصياغة رسالة الإهداء. سنقوم بتغليف الطلب كهدية راقية وإرسالها مباشرة للمستلم دون تضمين أي تفاصيل مادية أو فواتير ورقية (ستصلك الفاتورة إلكترونياً فقط).',
    aEn: 'Absolutely, that is our specialty! You can select the "Send as a Gift" option during checkout, enter the recipient\'s details, and write a personalized message. We will wrap the order elegantly and deliver it directly to them without any pricing details or paper invoices (you will receive the invoice electronically).'
  }
];

export function Help() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'faqs' | 'shipping' | 'returns' | 'contact'>('faqs');
  const [searchQuery, setSearchQuery] = useState('');
  const [faqCategory, setFaqCategory] = useState<string>('all');
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderNo: '',
    subject: 'general',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronize tab state with search params
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['faqs', 'shipping', 'returns', 'contact'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'faqs' | 'shipping' | 'returns' | 'contact') => {
    setActiveTab(tab);
    setSearchParams({ tab });
    setOpenFaq(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    // Simulate luxury API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        orderNo: '',
        subject: 'general',
        message: ''
      });
    }, 1500);
  };

  // Filter FAQs
  const filteredFAQs = FAQ_DATA.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.qAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.qEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.aAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.aEn.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = faqCategory === 'all' || faq.category === faqCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-brand-black min-h-screen text-brand-ivory pb-20 animate-fade-in" id="help-page">
      {/* Premium Hero Banner */}
      <div className="relative overflow-hidden border-b border-brand-brown/10 bg-brand-dark/40 py-16 md:py-24">
        {/* Subtle Luxury Pattern Overlays */}
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#C8A46A_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute -left-1/4 -top-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -right-1/4 -bottom-1/4 w-96 h-96 bg-brand-brown/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-gold/30 bg-brand-gold/5 text-brand-gold text-xs font-medium uppercase tracking-wider mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'العناية بالعملاء والكونسيرج' : 'CONCIERGE & CUSTOMER CARE'}</span>
          </div>
          
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            {language === 'ar' ? 'مركز المساعدة الفاخر' : 'Luxury Help Center'}
          </h1>
          
          <p className="text-brand-gray text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            {language === 'ar' 
              ? 'مرحباً بك في كونسيرج ميزون إتش. نحن هنا لضمان حصولك على تجربة تسوق استثنائية تليق بذوقك الرفيع.' 
              : 'Welcome to Maison H Concierge. We are here to ensure you receive an exceptional shopping experience tailored to your refined taste.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Quick Support Navigation Drawer/Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-brand-dark/60 border border-brand-brown/10 rounded-lg p-5 sticky top-32 space-y-2">
              <h3 className="font-serif text-brand-gold font-medium text-lg pb-3 mb-3 border-b border-brand-brown/15">
                {language === 'ar' ? 'أقسام المساعدة' : 'Help Topics'}
              </h3>
              
              <button
                onClick={() => handleTabChange('faqs')}
                className={cn(
                  "w-full text-right flex items-center justify-between px-4 py-3.5 rounded transition-all text-sm",
                  language === 'en' && "flex-row-reverse text-left",
                  activeTab === 'faqs' 
                    ? "bg-brand-gold text-brand-black font-bold shadow-md" 
                    : "text-brand-ivory hover:bg-brand-brown/10 hover:text-brand-gold"
                )}
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4.5 h-4.5" />
                  <span>{language === 'ar' ? 'الأسئلة الشائعة' : 'FAQs'}</span>
                </div>
                {language === 'ar' ? <ArrowLeft className="w-4 h-4 opacity-70" /> : <ArrowRight className="w-4 h-4 opacity-70" />}
              </button>

              <button
                onClick={() => handleTabChange('shipping')}
                className={cn(
                  "w-full text-right flex items-center justify-between px-4 py-3.5 rounded transition-all text-sm",
                  language === 'en' && "flex-row-reverse text-left",
                  activeTab === 'shipping' 
                    ? "bg-brand-gold text-brand-black font-bold shadow-md" 
                    : "text-brand-ivory hover:bg-brand-brown/10 hover:text-brand-gold"
                )}
              >
                <div className="flex items-center gap-3">
                  <Truck className="w-4.5 h-4.5" />
                  <span>{language === 'ar' ? 'سياسة الشحن والتوصيل' : 'Shipping & Delivery'}</span>
                </div>
                {language === 'ar' ? <ArrowLeft className="w-4 h-4 opacity-70" /> : <ArrowRight className="w-4 h-4 opacity-70" />}
              </button>

              <button
                onClick={() => handleTabChange('returns')}
                className={cn(
                  "w-full text-right flex items-center justify-between px-4 py-3.5 rounded transition-all text-sm",
                  language === 'en' && "flex-row-reverse text-left",
                  activeTab === 'returns' 
                    ? "bg-brand-gold text-brand-black font-bold shadow-md" 
                    : "text-brand-ivory hover:bg-brand-brown/10 hover:text-brand-gold"
                )}
              >
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-4.5 h-4.5" />
                  <span>{language === 'ar' ? 'الاستبدال والاسترجاع' : 'Returns & Refunds'}</span>
                </div>
                {language === 'ar' ? <ArrowLeft className="w-4 h-4 opacity-70" /> : <ArrowRight className="w-4 h-4 opacity-70" />}
              </button>

              <button
                onClick={() => handleTabChange('contact')}
                className={cn(
                  "w-full text-right flex items-center justify-between px-4 py-3.5 rounded transition-all text-sm",
                  language === 'en' && "flex-row-reverse text-left",
                  activeTab === 'contact' 
                    ? "bg-brand-gold text-brand-black font-bold shadow-md" 
                    : "text-brand-ivory hover:bg-brand-brown/10 hover:text-brand-gold"
                )}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4.5 h-4.5" />
                  <span>{language === 'ar' ? 'تواصل معنا' : 'Contact Us'}</span>
                </div>
                {language === 'ar' ? <ArrowLeft className="w-4 h-4 opacity-70" /> : <ArrowRight className="w-4 h-4 opacity-70" />}
              </button>

              <div className="pt-6 mt-6 border-t border-brand-brown/15 text-center">
                <p className="text-xs text-brand-gray leading-relaxed">
                  {language === 'ar' ? 'هل تحتاج لمساعدة فورية؟' : 'Need urgent help?'}
                </p>
                <a 
                  href="https://wa.me/966501234567" 
                  target="_blank" 
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center justify-center gap-2 bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold py-2 px-4 rounded hover:bg-emerald-600 hover:text-white w-full transition-all"
                >
                  <span>💬 WhatsApp Live Chat</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Core Support Content Frame */}
          <main className="lg:col-span-3">
            <div className="bg-brand-dark/30 border border-brand-brown/10 rounded-lg p-6 md:p-8 min-h-[500px]">
              
              {/* TAB 1: FAQ COMPONENT */}
              {activeTab === 'faqs' && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-brand-brown/10">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                        <HelpCircle className="w-6 h-6 text-brand-gold" />
                        {language === 'ar' ? 'الأسئلة الشائعة الأكثر تكراراً' : 'Frequently Asked Questions'}
                      </h2>
                      <p className="text-xs text-brand-gray mt-1">
                        {language === 'ar' ? 'اعثر على إجابات سريعة ووافية لجميع استفساراتك.' : 'Find quick and comprehensive answers to your questions.'}
                      </p>
                    </div>
                  </div>

                  {/* Search Bar & Categories Filter */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 relative">
                      <input 
                        type="text"
                        placeholder={language === 'ar' ? 'ابحث في الأسئلة الشائعة...' : 'Search FAQs...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-brand-black/40 border border-brand-brown/20 rounded-md px-4 py-3 pl-10 text-sm focus:outline-none focus:border-brand-gold text-right"
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                      />
                      <Search className={cn("absolute top-3.5 w-4 h-4 text-brand-gray", language === 'ar' ? 'left-3' : 'right-3')} />
                    </div>

                    <select
                      value={faqCategory}
                      onChange={(e) => setFaqCategory(e.target.value)}
                      className="bg-brand-black/40 border border-brand-brown/20 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand-gold text-brand-ivory cursor-pointer"
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                    >
                      <option value="all">{language === 'ar' ? 'كل الأقسام' : 'All Categories'}</option>
                      <option value="products">{language === 'ar' ? 'المنتجات والمكونات' : 'Products & Ingredients'}</option>
                      <option value="customization">{language === 'ar' ? 'التخصيص والهدايا' : 'Customization & Gifts'}</option>
                      <option value="shipping">{language === 'ar' ? 'الشحن والخدمات اللوجستية' : 'Shipping & Logistics'}</option>
                      <option value="orders">{language === 'ar' ? 'الطلبات والمدفوعات' : 'Orders & Payments'}</option>
                    </select>
                  </div>

                  {/* Accordion Grid */}
                  <div className="space-y-3 mt-6">
                    {filteredFAQs.length > 0 ? (
                      filteredFAQs.map((faq) => {
                        const isOpen = openFaq === faq.id;
                        return (
                          <div 
                            key={faq.id}
                            className={cn(
                              "border rounded-lg transition-all overflow-hidden bg-brand-dark/40",
                              isOpen ? "border-brand-gold bg-brand-brown/5 shadow-md" : "border-brand-brown/10 hover:border-brand-brown/20"
                            )}
                          >
                            <button
                              onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                              className="w-full text-right p-4 md:p-5 flex items-center justify-between gap-4 font-medium text-sm md:text-base text-white"
                              dir={language === 'ar' ? 'rtl' : 'ltr'}
                            >
                              <span className={cn(isOpen && "text-brand-gold font-bold")}>
                                {language === 'ar' ? faq.qAr : faq.qEn}
                              </span>
                              <ChevronDown className={cn("w-5 h-5 text-brand-gold transition-transform shrink-0", isOpen && "rotate-180")} />
                            </button>

                            <div 
                              className={cn(
                                "transition-all duration-300 ease-in-out px-4 md:px-5 border-brand-brown/10 text-brand-light-gray text-xs md:text-sm leading-relaxed overflow-hidden",
                                isOpen ? "max-h-[300px] pb-5 border-t pt-4 opacity-100" : "max-h-0 pb-0 pt-0 opacity-0 border-none"
                              )}
                              dir={language === 'ar' ? 'rtl' : 'ltr'}
                            >
                              {language === 'ar' ? faq.aAr : faq.aEn}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-12 border border-dashed border-brand-brown/10 rounded-lg">
                        <HelpCircle className="w-12 h-12 text-brand-gray/40 mx-auto mb-3" />
                        <p className="text-brand-gray text-sm">{language === 'ar' ? 'لم نجد أي أسئلة مطابقة لبحثك.' : 'No matching questions found.'}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: SHIPPING & LOGISTICS POLICY */}
              {activeTab === 'shipping' && (
                <div className="space-y-8">
                  <div className="pb-4 border-b border-brand-brown/10">
                    <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                      <Truck className="w-6 h-6 text-brand-gold" />
                      {language === 'ar' ? 'سياسة الشحن والتوصيل المبرّد الفاخر' : 'Premium Cold-Chain Shipping Policy'}
                    </h2>
                    <p className="text-xs text-brand-gray mt-1">
                      {language === 'ar' ? 'نضمن وصول الشوكولاتة بحالة برودة مثالية تماماً كأنها غادرت معاملنا فوراً.' : 'We guarantee your chocolates arrive in perfect cool condition, as if they just left our labs.'}
                    </p>
                  </div>

                  {/* Thermal Shipping Infographic */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-brand-black/30 border border-brand-gold/15 p-5 rounded-lg text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center mx-auto">
                        <Thermometer className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-sm text-white">{language === 'ar' ? 'تغليف حراري واقٍ' : 'Insulated Packaging'}</h4>
                      <p className="text-xs text-brand-gray leading-relaxed">
                        {language === 'ar' 
                          ? 'نغلف الشوكولاتة الفاخرة بحقائب فقاعية ألومنيوم وعبوات جل تجميد خاصة لدرء حرارة الخارج.' 
                          : 'We package luxury chocolates in thick aluminum bubble bags and freeze gel packs to shield from external heat.'}
                      </p>
                    </div>

                    <div className="bg-brand-black/30 border border-brand-gold/15 p-5 rounded-lg text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center mx-auto">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-sm text-white">{language === 'ar' ? 'نقل مبرد 100%' : '100% Refrigerated Vans'}</h4>
                      <p className="text-xs text-brand-gray leading-relaxed">
                        {language === 'ar' 
                          ? 'يتم نقل الشحنات داخل مدن المملكة الكبرى عبر أسطولنا المخصص ذي الحرارة المتحكم بها (15°C).' 
                          : 'Shipments across KSA major cities are transported via our premium temperature-controlled fleet (15°C).'}
                      </p>
                    </div>

                    <div className="bg-brand-black/30 border border-brand-gold/15 p-5 rounded-lg text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center mx-auto">
                        <Clock className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-sm text-white">{language === 'ar' ? 'توصيل سريع للغاية' : 'Ultra Fast Dispatch'}</h4>
                      <p className="text-xs text-brand-gray leading-relaxed">
                        {language === 'ar' 
                          ? 'توصيل سريع للغاية خلال 24-48 ساعة لضمان عدم تعرّض المنتجات للتخزين لفترات طويلة.' 
                          : 'Express delivery within 24-48 hours to guarantee that products are not stored for extended periods.'}
                      </p>
                    </div>
                  </div>

                  {/* Shipping Rates Table */}
                  <div className="border border-brand-brown/10 rounded-lg overflow-hidden mt-6">
                    <div className="bg-brand-brown/10 px-5 py-4 border-b border-brand-brown/15">
                      <h3 className="font-serif text-brand-gold font-medium text-base">{language === 'ar' ? 'جدول تسعير وتوقيت التوصيل والخدمات اللوجستية' : 'Shipping Rates & Timeframe Guide'}</h3>
                    </div>
                    <div className="divide-y divide-brand-brown/10 bg-brand-black/20 text-sm">
                      <div className="grid grid-cols-3 p-4 font-bold text-brand-gray text-xs uppercase tracking-wider bg-brand-dark/20">
                        <div>{language === 'ar' ? 'المنطقة والمدن' : 'Region & Cities'}</div>
                        <div>{language === 'ar' ? 'مدة التوصيل' : 'Delivery Window'}</div>
                        <div>{language === 'ar' ? 'رسوم الشحن' : 'Shipping Fee'}</div>
                      </div>
                      
                      <div className="grid grid-cols-3 p-4 items-center">
                        <div className="font-bold text-white">{language === 'ar' ? 'الرياض والمدن الكبرى' : 'Riyadh & Major Cities'}</div>
                        <div className="text-brand-light-gray">24 - 48 {language === 'ar' ? 'ساعة' : 'Hours'}</div>
                        <div className="text-brand-gold font-bold">35 {language === 'ar' ? 'ر.س' : 'SAR'} <span className="text-[10px] text-brand-gray block font-normal">{language === 'ar' ? 'مجاني فوق 350 ر.س' : 'Free over 350 SAR'}</span></div>
                      </div>

                      <div className="grid grid-cols-3 p-4 items-center">
                        <div className="font-bold text-white">{language === 'ar' ? 'بقية مدن المملكة' : 'Other KSA Cities'}</div>
                        <div className="text-brand-light-gray">2 - 4 {language === 'ar' ? 'أيام عمل' : 'Business Days'}</div>
                        <div className="text-brand-gold font-bold">45 {language === 'ar' ? 'ر.س' : 'SAR'} <span className="text-[10px] text-brand-gray block font-normal">{language === 'ar' ? 'مجاني فوق 400 ر.س' : 'Free over 400 SAR'}</span></div>
                      </div>

                      <div className="grid grid-cols-3 p-4 items-center">
                        <div className="font-bold text-white">{language === 'ar' ? 'دول مجلس التعاون الخليجي' : 'GCC Countries'}</div>
                        <div className="text-brand-light-gray">3 - 5 {language === 'ar' ? 'أيام عمل' : 'Business Days'}</div>
                        <div className="text-brand-gold font-bold">95 {language === 'ar' ? 'ر.س' : 'SAR'} <span className="text-[10px] text-brand-gray block font-normal">{language === 'ar' ? 'مجاني فوق 750 ر.س' : 'Free over 750 SAR'}</span></div>
                      </div>
                    </div>
                  </div>

                  {/* Important Notes */}
                  <div className="bg-brand-brown/5 border-r-4 border-brand-gold p-5 rounded-l text-xs md:text-sm text-brand-light-gray leading-relaxed space-y-2">
                    <strong className="block text-brand-gold font-bold text-sm">💡 {language === 'ar' ? 'ملاحظات لوجستية بالغة الأهمية:' : 'Critical Logistics Advisories:'}</strong>
                    <ul className="list-disc list-inside space-y-1.5 opacity-90">
                      <li>{language === 'ar' ? 'توصيل الرياض الفوري متوفر للطلبات المستلمة قبل الساعة 2:00 ظهراً.' : 'Same-day dispatch in Riyadh is available for all orders placed before 2:00 PM.'}</li>
                      <li>{language === 'ar' ? 'يرجى تزويدنا بعنوان التوصيل ورقم الجوال بدقة بالغة لتجنب تأخير التوصيل مبرداً.' : 'Please provide absolute accurate address & phone numbers to avoid any delays in climate delivery.'}</li>
                      <li>{language === 'ar' ? 'عند استلام الشحنة، يُرجى فك التغليف بحذر وحفظ الشوكولاتة في بيئة مكيفة فوراً.' : 'Upon receiving the delivery, please unwrap carefully and store in a cool conditioned space immediately.'}</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 3: REFUND & RETURNS POLICY */}
              {activeTab === 'returns' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-brand-brown/10">
                    <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                      <RotateCcw className="w-6 h-6 text-brand-gold" />
                      {language === 'ar' ? 'سياسة الاستبدال والاسترجاع والتعويض' : 'Returns, Exchanges & Refunds'}
                    </h2>
                    <p className="text-xs text-brand-gray mt-1">
                      {language === 'ar' ? 'حرصاً على سلامتك، نطبق سياسات صارمة ملائمة لطبيعة المنتجات الغذائية الفاخرة.' : 'For your safety, we apply strict food hygiene and safety standards on all luxury goods.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-brand-brown/15 bg-brand-black/20 p-6 rounded-lg space-y-3">
                      <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-lg">✕</div>
                      <h4 className="font-serif text-brand-gold font-medium text-base">{language === 'ar' ? 'حالات لا يمكن الاسترجاع فيها' : 'Non-Returnable Scenarios'}</h4>
                      <p className="text-xs md:text-sm text-brand-gray leading-relaxed">
                        {language === 'ar' 
                          ? 'نظراً لأن منتجات الشوكولاتة طازجة وسريعة التلف وحساسة لظروف الحرارة والرطوبة، فلا يُسمح بإرجاع أو استبدال أي منتج سليم بعد استلامه حفاظاً على سلامة جميع عملائنا ووفقاً لتعليمات الهيئة العامة للغذاء والدواء.' 
                          : 'As premium chocolates are fresh, perishable, and highly sensitive to ambient temperature and storage conditions, we cannot accept returns or exchanges for correctly fulfilled orders, complying with food safety regulations.'}
                      </p>
                    </div>

                    <div className="border border-brand-gold/20 bg-brand-brown/5 p-6 rounded-lg space-y-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="font-serif text-brand-gold font-medium text-base">{language === 'ar' ? 'الحالات المعتمدة للتعويض والاستبدال' : 'Eligible Return & Refund Scenarios'}</h4>
                      <p className="text-xs md:text-sm text-brand-light-gray leading-relaxed">
                        {language === 'ar' 
                          ? 'نلتزم فوراً باستبدال المنتجات أو إعادة قيمتها بالكامل في الحالات التالية:' 
                          : 'We are fully committed to replacing products or issuing 100% refunds in the following cases:'}
                      </p>
                      <ul className="list-disc list-inside text-xs text-brand-gray space-y-1">
                        <li>{language === 'ar' ? 'وصول شحنة تالفة أو ذائبة تماماً نتيجة خطأ لوجستي.' : 'Products arriving damaged or completely melted due to shipping error.'}</li>
                        <li>{language === 'ar' ? 'وصول طلب خاطئ أو غير مطابق للطلب الأصلي.' : 'Receiving a wrong order that does not match your purchase details.'}</li>
                        <li>{language === 'ar' ? 'فقدان جزئي لبعض مكونات البوكسات الفاخرة.' : 'Incomplete contents inside luxury customizable boxes.'}</li>
                      </ul>
                    </div>
                  </div>

                  {/* Refund Process Guide */}
                  <div className="mt-6 border border-brand-brown/10 rounded-lg p-6 space-y-4">
                    <h3 className="font-serif text-brand-gold font-medium text-lg">{language === 'ar' ? 'خطوات تقديم طلب استرجاع أو تعويض:' : 'How to request a refund or exchange:'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-brand-black/20 rounded border border-brand-brown/10">
                        <div className="text-brand-gold font-serif font-bold text-xl mb-1">01</div>
                        <h5 className="font-bold text-xs text-white mb-1.5">{language === 'ar' ? 'التصوير الفوري' : 'Photo Evidence'}</h5>
                        <p className="text-[11px] text-brand-gray">{language === 'ar' ? 'يرجى التقاط صور واضحة للتلف فور استلام الشحنة.' : 'Take high-resolution photos of the damaged items immediately.'}</p>
                      </div>

                      <div className="p-4 bg-brand-black/20 rounded border border-brand-brown/10">
                        <div className="text-brand-gold font-serif font-bold text-xl mb-1">02</div>
                        <h5 className="font-bold text-xs text-white mb-1.5">{language === 'ar' ? 'التواصل السريع' : 'Contact Support'}</h5>
                        <p className="text-[11px] text-brand-gray">{language === 'ar' ? 'تواصل معنا عبر نموذج الدعم أو الواتساب خلال 24 ساعة.' : 'Contact customer care within 24 hours of receipt.'}</p>
                      </div>

                      <div className="p-4 bg-brand-black/20 rounded border border-brand-brown/10">
                        <div className="text-brand-gold font-serif font-bold text-xl mb-1">03</div>
                        <h5 className="font-bold text-xs text-white mb-1.5">{language === 'ar' ? 'التعويض العاجل' : 'Fast Compensation'}</h5>
                        <p className="text-[11px] text-brand-gray">{language === 'ar' ? 'يتم فحص الطلب وإعادة المبلغ أو شحن طلب بديل مبرد مجاناً.' : 'Once reviewed, we issue a prompt refund or ship a new box free.'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: CONTACT & SUPPORT INTERACTIVE FORM */}
              {activeTab === 'contact' && (
                <div className="space-y-8">
                  <div className="pb-4 border-b border-brand-brown/10">
                    <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                      <MessageSquare className="w-6 h-6 text-brand-gold" />
                      {language === 'ar' ? 'بوابة التواصل الفاخر والعناية الراقية' : 'Bespoke Support Portal'}
                    </h2>
                    <p className="text-xs text-brand-gray mt-1">
                      {language === 'ar' ? 'اترك رسالتك وسيتواصل معك أحد مستشاري الهدايا في أقل من ساعتين.' : 'Leave your message, and one of our gift consultants will contact you within 2 hours.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    
                    {/* Contact Channels */}
                    <div className="md:col-span-2 space-y-6">
                      <div className="bg-brand-black/20 p-5 rounded-lg border border-brand-brown/10 space-y-4">
                        <h4 className="font-serif text-brand-gold font-medium text-base pb-2 border-b border-brand-brown/10">
                          {language === 'ar' ? 'قنوات الاتصال المباشر' : 'Direct VIP Channels'}
                        </h4>

                        <div className="flex items-start gap-3.5 text-sm">
                          <Mail className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                          <div>
                            <span className="block font-bold text-white">{language === 'ar' ? 'البريد الإلكتروني' : 'Support Email'}</span>
                            <a href="mailto:concierge@maisonh.com" className="text-brand-gray text-xs hover:text-brand-gold">concierge@maisonh.com</a>
                          </div>
                        </div>

                        <div className="flex items-start gap-3.5 text-sm">
                          <Phone className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                          <div>
                            <span className="block font-bold text-white">{language === 'ar' ? 'الرقم الموحد والكونسيرج' : 'Concierge Helpline'}</span>
                            <a href="tel:920012345" className="text-brand-gray text-xs hover:text-brand-gold">9200 12345</a>
                            <span className="block text-[10px] text-brand-gray/60">{language === 'ar' ? 'متاح من 9:00 ص إلى 10:00 م' : 'Available 9:00 AM - 10:00 PM'}</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-3.5 text-sm">
                          <MapPin className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                          <div>
                            <span className="block font-bold text-white">{language === 'ar' ? 'بوتيك المعرض الرئيسي' : 'Maison H Boutique'}</span>
                            <span className="text-brand-gray text-xs block leading-relaxed">
                              {language === 'ar' 
                                ? 'الرياض - طريق التخصصي، حي المعذر الشمالي' 
                                : 'Riyadh - Al-Takhassusi Road, Al-Maather Ash Shamali'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Map Info Widget */}
                      <div className="bg-brand-brown/5 p-4 rounded-lg border border-brand-gold/10 text-center space-y-2">
                        <Sparkles className="w-5 h-5 text-brand-gold mx-auto animate-pulse" />
                        <h5 className="font-serif text-sm font-bold text-white">{language === 'ar' ? 'استشارة هدايا الشركات مجانية' : 'Complimentary Consultation'}</h5>
                        <p className="text-[11px] text-brand-gray leading-relaxed">
                          {language === 'ar' 
                            ? 'هل تخطط لمناسبة كبرى لشركتك؟ يسعدنا استقبالك في المعرض لتذوق العينات وتصميم عبواتك المخصصة.' 
                            : 'Planning a corporate event? We are thrilled to host you at our showroom for chocolate tasting & packaging design.'}
                        </p>
                      </div>
                    </div>

                    {/* Contact Form Component */}
                    <div className="md:col-span-3">
                      {formSubmitted ? (
                        <div className="bg-brand-brown/5 border border-brand-gold/20 p-8 rounded-lg text-center space-y-4 animate-fade-in">
                          <div className="w-16 h-16 rounded-full bg-brand-gold/15 text-brand-gold flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-10 h-10" />
                          </div>
                          <h3 className="font-serif text-xl font-bold text-white">{language === 'ar' ? 'تم استلام طلبك بنجاح' : 'Inquiry Received'}</h3>
                          <p className="text-xs md:text-sm text-brand-gray leading-relaxed max-w-sm mx-auto">
                            {language === 'ar' 
                              ? 'نشكرك على تواصلك مع ميزون إتش. تم تعيين طلبك لمدير كونسيرج الهدايا وسنقوم بالاتصال بك هاتفياً أو عبر البريد الإلكتروني خلال أقل من ساعتين عمل.' 
                              : 'Thank you for contacting Maison H. Your inquiry has been assigned to a luxury concierge manager, and we will contact you via phone or email within 2 business hours.'}
                          </p>
                          <Button 
                            variant="secondary" 
                            onClick={() => setFormSubmitted(false)}
                            className="mt-4 px-6 text-xs"
                          >
                            {language === 'ar' ? 'إرسال رسالة أخرى' : 'Send another inquiry'}
                          </Button>
                        </div>
                      ) : (
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs text-brand-gray mb-1.5">{language === 'ar' ? 'الاسم الكريم *' : 'Full Name *'}</label>
                              <input 
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-brand-black/40 border border-brand-brown/20 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold text-right"
                                dir={language === 'ar' ? 'rtl' : 'ltr'}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-brand-gray mb-1.5">{language === 'ar' ? 'البريد الإلكتروني *' : 'Email Address *'}</label>
                              <input 
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full bg-brand-black/40 border border-brand-brown/20 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold text-left"
                                dir="ltr"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs text-brand-gray mb-1.5">{language === 'ar' ? 'رقم الجوال' : 'Phone Number'}</label>
                              <input 
                                type="tel"
                                placeholder="05xxxxxxxx"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className="w-full bg-brand-black/40 border border-brand-brown/20 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold text-left"
                                dir="ltr"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-brand-gray mb-1.5">{language === 'ar' ? 'رقم الطلب (إن وجد)' : 'Order Number (Optional)'}</label>
                              <input 
                                type="text"
                                placeholder="#10024"
                                value={formData.orderNo}
                                onChange={(e) => setFormData({...formData, orderNo: e.target.value})}
                                className="w-full bg-brand-black/40 border border-brand-brown/20 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold text-left"
                                dir="ltr"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs text-brand-gray mb-1.5">{language === 'ar' ? 'الموضوع الأساسي *' : 'Subject of Inquiry *'}</label>
                            <select 
                              value={formData.subject}
                              onChange={(e) => setFormData({...formData, subject: e.target.value})}
                              className="w-full bg-brand-black/40 border border-brand-brown/20 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold text-brand-ivory cursor-pointer"
                              dir={language === 'ar' ? 'rtl' : 'ltr'}
                            >
                              <option value="general">{language === 'ar' ? 'استفسار عام عن المنتجات' : 'General Product Inquiry'}</option>
                              <option value="corporate">{language === 'ar' ? 'طلب هدايا شركات وجمعيات' : 'Corporate Gifting Request'}</option>
                              <option value="issue">{language === 'ar' ? 'شرح مشكلة بالطلب أو الشحن' : 'Issue with Order/Delivery'}</option>
                              <option value="custom">{language === 'ar' ? 'طلب تخصيص هدايا VIP خاصة' : 'VIP Customization Assistance'}</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs text-brand-gray mb-1.5">{language === 'ar' ? 'تفاصيل الرسالة أو الطلب *' : 'Your Message *'}</label>
                            <textarea 
                              required
                              rows={5}
                              value={formData.message}
                              onChange={(e) => setFormData({...formData, message: e.target.value})}
                              className="w-full bg-brand-black/40 border border-brand-brown/20 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold text-right"
                              dir={language === 'ar' ? 'rtl' : 'ltr'}
                              placeholder={language === 'ar' ? 'اكتب تفاصيل استفسارك هنا بكل وضوح...' : 'Write your details clearly here...'}
                            ></textarea>
                          </div>

                          <Button
                            type="submit"
                            variant="primary"
                            disabled={isSubmitting}
                            className="w-full py-3.5 flex items-center justify-center gap-2 font-bold text-sm"
                          >
                            <Send className="w-4 h-4" />
                            <span>{isSubmitting ? (language === 'ar' ? 'جاري إرسال الرسالة...' : 'Submitting message...') : (language === 'ar' ? 'إرسال الرسالة للكونسيرج' : 'Send message to Concierge')}</span>
                          </Button>
                        </form>
                      )}
                    </div>

                  </div>
                </div>
              )}

            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
