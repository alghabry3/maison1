import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';
import { MOCK_PRODUCTS, Product } from '../data';
import { OdooUomPanel } from '../components/OdooUomPanel';
import { 
  ShoppingCart, User, Gift, LogOut, ChevronRight, Star, ArrowUp, ArrowDown,
  BarChart2, Activity, DollarSign, Users, Package, Settings, Edit3, Trash2, 
  Plus, Search, Filter, CheckCircle2, Clock, Truck, Eye, X, Check, Save,
  ShieldAlert, Sparkles, RefreshCw, AlertTriangle, AppWindow, LayoutGrid, HelpCircle,
  Laptop, Moon, Sun, Sliders, CheckSquare, Palette, Globe
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

// --- Translation Helpers for MOCK_PRODUCTS ---
const getTranslatedProductName = (name: string, lang: 'ar' | 'en') => {
  if (lang === 'ar') return name;
  const map: Record<string, string> = {
    "بوكس الشوكولاتة الكلاسيكي": "Classic Chocolate Box",
    "بوكس ترافل ميزون": "Maison Truffles Box",
    "بوكس المناسبات الأبيض الذهبي": "Golden White Occasion Box",
    "ألواح الشوكولاتة الداكنة بالمكسرات": "Dark Chocolate Nut Bars",
    "صينية أكريليك فاخرة": "Premium Acrylic Tray",
    "صينية خشبية كلاسيكية": "Classic Wooden Tray",
    "بوكس هدايا الشركات (مخصص)": "Corporate Gifts Box (Custom)",
    "مجموعة السجنتشر (قهوة وهيل)": "Signature Collection (Cardamom & Coffee)",
    "حبات الكراميل المملح الذهبية": "Golden Salted Caramels",
    "حبوب القهوة المغطاة": "Chocolate-Covered Coffee Beans",
    "تمور محشية مكسوة بالشوكولاتة": "Stuffed Dates with Chocolate",
    "بوكس التغليف الراقي": "Elegant Wrapped Gift Box",
    "المجموعة الملكية الثلاثية": "Triple Royal Occasions Bundle",
  };
  return map[name] || name;
};

const getTranslatedProductDesc = (desc: string, lang: 'ar' | 'en') => {
  if (lang === 'ar') return desc;
  const map: Record<string, string> = {
    "بوكس 24 قطعة منوعة من الشوكولاتة البلجيكية": "24 pieces of fine assorted Belgian chocolates",
    "ترافل شوكولاتة فاخر محشو بالجاناش الغني": "Gourmet truffles with smooth dark ganache",
    "بوكس هدايا فاخر 48 قطعة للمناسبات": "Grand 48-piece occasion gift box",
    "شوكولاتة داكنة بالمكسرات والفواكه": "Dark chocolate with roasted nuts & fruits",
    "صينية ضيافة أكريليك 1 كجم منوعة": "Acrylic hosting tray with 1kg premium chocolates",
    "صينية ضيافة خشبية بقطع منوعة": "Wooden hosting tray with assorted luxury pieces",
    "هدايا شركات قابلة للتخصيص": "Custom corporate logo-engraved gifting boxes",
    "إصدار حصري بنكهات شرقية (هيل وقهوة)": "Exclusive fusion flavor of cardamom & Arabic coffee",
    "شوكولاتة بحشوة الكراميل المملح الفاخر": "Premium chocolate filled with savory salted caramel",
    "حبوب بن أرابيكا مغطاة بالشوكولاتة": "Gourmet arabica coffee beans covered in fine chocolate",
    "تمور فاخرة محشوة ومغطاة بالشوكولاتة": "Stuffed premium dates coated with Belgian chocolate",
    "بوكس هدايا فاخر بالشريطة": "Premium gift box with custom satin ribbon",
    "3 صناديق هدايا متدرجة الحجم": "Three nested royal boxes with fine chocolates"
  };
  return map[desc] || desc;
};

const getTranslatedProductCat = (cat: string, lang: 'ar' | 'en') => {
  if (lang === 'ar') return cat;
  const map: Record<string, string> = {
    "شوكولاتة فاخرة": "Premium Chocolates",
    "بوكسات هدايا": "Gift Boxes",
    "مناسبات": "Special Occasions",
    "صواني ضيافة": "Hosting Trays",
    "هدايا شركات": "Corporate Gifts",
    "الكل": "All",
  };
  return map[cat] || cat;
};

const getTranslatedProductSize = (size: string | undefined, lang: 'ar' | 'en') => {
  if (!size) return '';
  if (lang === 'ar') return size;
  const map: Record<string, string> = {
    "24 قطعة (350 جرام)": "24 pieces (350g)",
    "16 قطعة (200 جرام)": "16 pieces (200g)",
    "48 قطعة (800 جرام)": "48 pieces (800g)",
    "3 ألواح (250 جرام)": "3 bars (250g)",
    "صينية أكريليك (1 كيلو جرام)": "Acrylic tray (1kg)",
    "صينية خشبية (1.2 كيلو جرام)": "Wooden tray (1.2kg)",
    "12 قطعة (180 جرام)": "12 pieces (180g)",
    "20 قطعة (250 جرام)": "20 pieces (250g)",
    "18 قطعة (220 جرام)": "18 pieces (220g)",
    "عبوة (150 جرام)": "Pack (150g)",
    "24 حبة": "24 pieces",
    "20 قطعة (280 جرام)": "20 pieces (280g)",
    "3 صناديق (1.2 كيلو جرام)": "3 boxes (1.2kg)"
  };
  return map[size] || size;
};

// --- Types ---
interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  date: string;
  total: number;
  paymentMethod: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
}

interface LoyaltyCustomer {
  id: string;
  name: string;
  phone: string;
  points: number;
  tier: 'Elite' | 'Gold' | 'Silver';
  totalSpent: number;
}

export function AdminDashboard() {
  const { language, toggleLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  
  // Odoo Active Tab and Switcher States
  const [activeTab, setActiveTab] = useState('website'); // default to the Odoo Customizer website tab!
  const [showAppSwitcher, setShowAppSwitcher] = useState(false);
  const [studioMode, setStudioMode] = useState(false);

  // --- Odoo Default Customization Options State (Saved in LocalStorage) ---
  const [customizer, setCustomizer] = useState({
    font: localStorage.getItem('odoo-font') || 'Tajawal',
    theme: localStorage.getItem('odoo-theme') || 'default',
    headerStyle: localStorage.getItem('odoo-header') || 'classic',
    showWhatsapp: localStorage.getItem('odoo-show-whatsapp') !== 'false',
    showCompare: localStorage.getItem('odoo-show-compare') !== 'false',
    showWrapping: localStorage.getItem('odoo-show-wrapping') !== 'false',
    showLoyalty: localStorage.getItem('odoo-show-loyalty') !== 'false',
    vatPercent: parseInt(localStorage.getItem('odoo-vat-percent') || '15'),
    freeShippingThreshold: parseInt(localStorage.getItem('odoo-free-shipping') || '350'),
    promoCode: localStorage.getItem('odoo-promo-code') || 'MAISON10',
    welcomePoints: parseInt(localStorage.getItem('odoo-welcome-points') || '100'),
    storeNameAr: localStorage.getItem('odoo-store-name-ar') || 'ميزون إتش (Maison H)',
    storeNameEn: localStorage.getItem('odoo-store-name-en') || 'Maison H Chocolatier'
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Handle customizer adjustments
  const handleConfigChange = (key: string, value: any) => {
    setCustomizer(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  // Save Config to Odoo LocalStorage and reflect immediately
  const handleSaveOdooConfig = () => {
    localStorage.setItem('odoo-font', customizer.font);
    localStorage.setItem('odoo-theme', customizer.theme);
    localStorage.setItem('odoo-header', customizer.headerStyle);
    localStorage.setItem('odoo-show-whatsapp', String(customizer.showWhatsapp));
    localStorage.setItem('odoo-show-compare', String(customizer.showCompare));
    localStorage.setItem('odoo-show-wrapping', String(customizer.showWrapping));
    localStorage.setItem('odoo-show-loyalty', String(customizer.showLoyalty));
    localStorage.setItem('odoo-vat-percent', String(customizer.vatPercent));
    localStorage.setItem('odoo-free-shipping', String(customizer.freeShippingThreshold));
    localStorage.setItem('odoo-promo-code', customizer.promoCode);
    localStorage.setItem('odoo-welcome-points', String(customizer.welcomePoints));
    localStorage.setItem('odoo-store-name-ar', customizer.storeNameAr);
    localStorage.setItem('odoo-store-name-en', customizer.storeNameEn);

    // Apply font to body
    document.body.style.fontFamily = 
      customizer.font === 'Cairo' ? '"Cairo", sans-serif' : 
      customizer.font === 'Inter' ? '"Inter", sans-serif' : 
      '"Tajawal", sans-serif';

    // Apply theme
    setTheme(customizer.theme as any);

    setHasChanges(false);
    showToast(
      language === 'ar' 
        ? 'تم حفظ وتثبيت خيارات مخصص سمات أودو بنجاح!' 
        : 'Odoo customizer options saved and applied successfully!'
    );
  };

  // Discard changes
  const handleDiscardChanges = () => {
    setCustomizer({
      font: localStorage.getItem('odoo-font') || 'Tajawal',
      theme: localStorage.getItem('odoo-theme') || 'default',
      headerStyle: localStorage.getItem('odoo-header') || 'classic',
      showWhatsapp: localStorage.getItem('odoo-show-whatsapp') !== 'false',
      showCompare: localStorage.getItem('odoo-show-compare') !== 'false',
      showWrapping: localStorage.getItem('odoo-show-wrapping') !== 'false',
      showLoyalty: localStorage.getItem('odoo-show-loyalty') !== 'false',
      vatPercent: parseInt(localStorage.getItem('odoo-vat-percent') || '15'),
      freeShippingThreshold: parseInt(localStorage.getItem('odoo-free-shipping') || '350'),
      promoCode: localStorage.getItem('odoo-promo-code') || 'MAISON10',
      welcomePoints: parseInt(localStorage.getItem('odoo-welcome-points') || '100'),
      storeNameAr: localStorage.getItem('odoo-store-name-ar') || 'ميزون إتش (Maison H)',
      storeNameEn: localStorage.getItem('odoo-store-name-en') || 'Maison H Chocolatier'
    });
    setHasChanges(false);
    showToast(language === 'ar' ? 'تم تجاهل التعديلات الأخيرة' : 'All changes discarded', 'error');
  };

  // --- Store States ---
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'MH-ORD-1024',
      customerName: 'سارة العتيبي',
      phone: '0501234567',
      email: 'sarah.o@gmail.com',
      date: '2026-06-30',
      total: 370,
      paymentMethod: 'مدى (Mada)',
      status: 'processing',
      items: [{ productId: 'p2', name: 'بوكس ترافل ميزون', quantity: 2, price: 185 }]
    },
    {
      id: 'MH-ORD-1023',
      customerName: 'خالد عبد الله',
      phone: '0547654321',
      email: 'khaled.a@yahoo.com',
      date: '2026-06-29',
      total: 850,
      paymentMethod: 'بطاقة ائتمانية',
      status: 'shipped',
      items: [{ productId: 'p5', name: 'صينية أكريليك فاخرة', quantity: 1, price: 850 }]
    },
    {
      id: 'MH-ORD-1022',
      customerName: 'محمد الشهري',
      phone: '0559876543',
      email: 'm.shehri@outlook.com',
      date: '2026-06-28',
      total: 315,
      paymentMethod: 'الدفع عند الاستلام',
      status: 'delivered',
      items: [
        { productId: 'p4', name: 'ألواح الشوكولاتة الداكنة بالمكسرات', quantity: 1, price: 120 },
        { productId: 'p9', name: 'حبات الكراميل المملح الذهبية', quantity: 1, price: 195 }
      ]
    },
    {
      id: 'MH-ORD-1021',
      customerName: 'نورة السديري',
      phone: '0561112223',
      email: 'noura.s@gmail.com',
      date: '2026-06-27',
      total: 420,
      paymentMethod: 'Apple Pay',
      status: 'processing',
      items: [{ productId: 'p3', name: 'بوكس المناسبات الأبيض الذهبي', quantity: 1, price: 420 }]
    }
  ]);

  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [loyaltyCustomers, setLoyaltyCustomers] = useState<LoyaltyCustomer[]>([
    { id: '1', name: 'سارة العتيبي', phone: '0501234567', points: 1250, tier: 'Elite', totalSpent: 3500 },
    { id: '2', name: 'خالد عبد الله', phone: '0547654321', points: 850, tier: 'Gold', totalSpent: 2100 },
    { id: '3', name: 'محمد الشهري', phone: '0559876543', points: 420, tier: 'Silver', totalSpent: 980 },
    { id: '4', name: 'نورة السديري', phone: '0561112223', points: 1900, tier: 'Elite', totalSpent: 5200 }
  ]);

  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('today');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Search state
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [productSearch, setProductSearch] = useState('');
  const [loyaltySearch, setLoyaltySearch] = useState('');
  
  // Modal states
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: 'شوكولاتة فاخرة',
    price: '',
    shortDescription: '',
    inStock: true,
    size: 'بوكس وسط',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  });

  const [selectedLoyaltyCust, setSelectedLoyaltyCust] = useState<LoyaltyCustomer | null>(null);
  const [pointsAdjustment, setPointsAdjustment] = useState('');
  const [pointsAction, setPointsAction] = useState<'add' | 'deduct'>('add');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // --- Handlers ---
  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(language === 'ar' ? `تم تحديث الطلب ${orderId} بنجاح` : `Order ${orderId} updated`);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleToggleProductStock = (prodId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === prodId) {
        const nextState = !p.inStock;
        showToast(language === 'ar' ? `تحديث التوفر للمنتج: ${nextState ? 'متوفر' : 'نفذ'}` : `Availability toggled`);
        return { ...p, inStock: nextState };
      }
      return p;
    }));
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name || !newProductForm.price) {
      showToast(language === 'ar' ? 'الرجاء تعبئة الاسم والسعر' : 'Please fill out required fields', 'error');
      return;
    }
    const newProduct: Product = {
      id: `p${products.length + 1}`,
      name: newProductForm.name,
      description: newProductForm.shortDescription,
      shortDescription: newProductForm.shortDescription,
      price: parseFloat(newProductForm.price),
      image: newProductForm.image,
      category: newProductForm.category,
      tags: [newProductForm.category],
      inStock: newProductForm.inStock,
      size: newProductForm.size
    };
    setProducts(prev => [newProduct, ...prev]);
    setIsAddingProduct(false);
    showToast(language === 'ar' ? 'تمت إضافة المنتج بنجاح!' : 'Product published');
    setNewProductForm({
      name: '',
      category: 'شوكولاتة فاخرة',
      price: '',
      shortDescription: '',
      inStock: true,
      size: 'بوكس وسط',
      image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    });
  };

  const handleAdjustPointsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoyaltyCust) return;
    const pts = parseInt(pointsAdjustment);
    if (isNaN(pts) || pts <= 0) return;

    setLoyaltyCustomers(prev => prev.map(c => {
      if (c.id === selectedLoyaltyCust.id) {
        const diff = pointsAction === 'add' ? pts : -pts;
        const newPts = Math.max(0, c.points + diff);
        let nextTier: 'Elite' | 'Gold' | 'Silver' = 'Silver';
        if (newPts >= 1200) nextTier = 'Elite';
        else if (newPts >= 600) nextTier = 'Gold';

        showToast(language === 'ar' ? `تم تعديل نقاط العميل بنجاح` : `Points updated`);
        return { ...c, points: newPts, tier: nextTier };
      }
      return c;
    }));
    setSelectedLoyaltyCust(null);
    setPointsAdjustment('');
  };

  // --- Dynamic Odoo App List ---
  const odooApps = [
    { id: 'website', name: 'الموقع والتخصيص', nameEn: 'Website & Theme', icon: AppWindow, color: 'bg-indigo-600', tab: 'website' },
    { id: 'overview', name: 'لوحة التحكم والتحليل', nameEn: 'Pivot Analytics', icon: BarChart2, color: 'bg-emerald-600', tab: 'overview' },
    { id: 'sales', name: 'المبيعات والطلبات', nameEn: 'Sales & Orders', icon: ShoppingCart, color: 'bg-amber-600', tab: 'sales' },
    { id: 'inventory', name: 'المخزون والمخازن', nameEn: 'Inventory Control', icon: Package, color: 'bg-blue-600', tab: 'inventory' },
    { id: 'crm', name: 'برنامج الولاء والـ CRM', nameEn: 'CRM & Loyalty', icon: Gift, color: 'bg-purple-600', tab: 'crm' },
    { id: 'uom', name: 'وحدات القياس المتعددة', nameEn: 'Units of Measure', icon: Sliders, color: 'bg-teal-600', tab: 'uom' },
    { id: 'apps', name: 'متجر تطبيقات أودو', nameEn: 'Addons App Store', icon: LayoutGrid, color: 'bg-pink-600', tab: 'apps' }
  ];

  // Filters
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.includes(orderSearch) || o.id.includes(orderSearch);
    const matchesFilter = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredProducts = products.filter(p => p.name.includes(productSearch) || p.category.includes(productSearch));
  const filteredLoyalty = loyaltyCustomers.filter(c => c.name.includes(loyaltySearch) || c.phone.includes(loyaltySearch));

  // Visual datasets
  const salesData = timeframe === 'today' 
    ? [{ name: '08:00', total: 2400 }, { name: '12:00', total: 8200 }, { name: '16:00', total: 5400 }, { name: '20:00', total: 11000 }]
    : [
        { name: language === 'ar' ? 'الأحد' : 'Sun', total: 32000 },
        { name: language === 'ar' ? 'الأربعاء' : 'Wed', total: 45000 },
        { name: language === 'ar' ? 'السبت' : 'Sat', total: 58000 }
      ];

  const trafficData = timeframe === 'today'
    ? [
        { name: language === 'ar' ? 'صباحاً' : 'Morning', visitors: 180 },
        { name: language === 'ar' ? 'ظهراً' : 'Noon', visitors: 420 },
        { name: language === 'ar' ? 'عصراً' : 'Afternoon', visitors: 650 },
        { name: language === 'ar' ? 'مساءً' : 'Evening', visitors: 390 }
      ]
    : [
        { name: language === 'ar' ? 'الأسبوع 1' : 'Week 1', visitors: 1900 },
        { name: language === 'ar' ? 'الأسبوع 2' : 'Week 2', visitors: 2800 },
        { name: language === 'ar' ? 'الأسبوع 3' : 'Week 3', visitors: 3500 },
        { name: language === 'ar' ? 'الأسبوع 4' : 'Week 4', visitors: 2100 }
      ];

  return (
    <div className="flex flex-col h-screen bg-[#F9F9FA] overflow-hidden select-none text-slate-800 font-sans" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* 1. Odoo Enterprise Top Header Bar */}
      <header className="bg-[#71639e] text-white h-12 shrink-0 flex items-center justify-between px-4 shadow-md z-40">
        <div className="flex items-center gap-4">
          {/* App Switcher button (The Odoo 3x3 Grid) */}
          <button 
            id="odoo-app-switcher-btn"
            onClick={() => setShowAppSwitcher(!showAppSwitcher)}
            className="p-1.5 rounded hover:bg-white/10 active:scale-95 transition-all text-white focus:outline-none"
            title={language === 'ar' ? "تبديل تطبيقات أودو" : "Switch Odoo Apps"}
          >
            <LayoutGrid className="w-6 h-6 shrink-0" />
          </button>

          {/* Odoo Title Brand */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base tracking-wide font-mono">odoo</span>
            <span className="text-white/40 text-xs">|</span>
            <span className="text-sm font-medium tracking-wide">Maison H Enterprise</span>
          </div>

          {/* Active Breadcrumb */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-white/80 pr-4 border-r border-white/20">
            <span>{language === 'ar' ? 'التجارة الإلكترونية' : 'E-Commerce'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-bold text-white">
              {language === 'ar' ? (odooApps.find(a => a.tab === activeTab)?.name) : (odooApps.find(a => a.tab === activeTab)?.nameEn)}
            </span>
          </div>
        </div>

        {/* Top bar right utilities */}
        <div className="flex items-center gap-4">
          
          {/* Odoo Studio Live Builder Trigger Button */}
          <button 
            id="odoo-studio-toggle"
            onClick={() => {
              setStudioMode(!studioMode);
              if (!studioMode) setActiveTab('website'); // jump to website for live customization
              showToast(
                language === 'ar'
                  ? (!studioMode ? 'تم تفعيل وضع أودو ستوديو للتصميم المباشر!' : 'تم الخروج من وضع أودو ستوديو')
                  : (!studioMode ? 'Odoo Studio live design mode activated!' : 'Exited Odoo Studio mode'),
                'success'
              );
            }}
            className={cn(
              "hidden md:flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold transition-colors active:scale-95",
              studioMode ? "bg-[#00A09D] text-white animate-pulse" : "bg-white/10 text-white/90 hover:bg-white/20"
            )}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{studioMode ? (language === 'ar' ? 'الخروج من ستوديو' : 'Exit Studio') : (language === 'ar' ? 'أودو ستوديو 🛠️' : 'Odoo Studio 🛠️')}</span>
          </button>

          {/* Language Switcher */}
          <button 
            id="odoo-language-toggle"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/10 text-white/90 hover:bg-white/20 rounded text-xs font-bold transition-all active:scale-95"
            title={language === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
          >
            <Globe className="w-3.5 h-3.5 shrink-0 text-white/80" />
            <span>{language === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {/* Connected Server Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] bg-white/15 px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{language === 'ar' ? 'أودو سحابي: مستقر' : 'Odoo Cloud: Connected'}</span>
          </div>

          {/* Administrator Profile */}
          <div className="flex items-center gap-2">
            <div className="text-left hidden md:block text-right">
              <p className="text-[10px] text-white/60 font-medium">{language === 'ar' ? 'المدير العام' : 'General Manager'}</p>
              <p className="text-xs font-bold">{language === 'ar' ? 'مطور ميزون' : 'Maison Developer'}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-950 text-white flex items-center justify-center font-bold text-xs border border-white/30">
              M
            </div>
          </div>
        </div>
      </header>

      {/* 2. Odoo Save/Discard Banner when changes are pending */}
      {hasChanges && (
        <div className="bg-[#EFEFEF] border-b border-slate-300 px-6 py-2 flex items-center justify-between z-30 animate-fade-in shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#00A09D] animate-ping"></div>
            <p className="text-xs font-bold text-slate-700">
              {language === 'ar' ? 'لديك تعديلات غير محفوظة على خيارات وقالب المتجر الافتراضية' : 'You have unsaved changes to store options and default templates'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              id="odoo-discard-btn"
              onClick={handleDiscardChanges}
              className="px-4 py-1 rounded bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 text-xs font-bold transition-all active:scale-95"
            >
              {language === 'ar' ? 'تجاهل' : 'Discard'}
            </button>
            <button 
              id="odoo-save-btn"
              onClick={handleSaveOdooConfig}
              className="px-4 py-1 rounded bg-[#71639e] text-white hover:bg-[#5E5186] text-xs font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'حفظ وتطبيق الخيارات' : 'Save & Apply Options'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Dashboard Workspace Split */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* APP SWITCHER FULLSCREEN OVERLAY (Iconic Odoo feature) */}
        {showAppSwitcher && (
          <div className="absolute inset-0 bg-[#2C243B]/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-8 transition-all animate-fade-in text-white">
            <div className="max-w-4xl w-full">
              <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold font-mono tracking-widest text-indigo-300">ODOO APPS MATRIX</h2>
                <button 
                  onClick={() => setShowAppSwitcher(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Grid of Apps */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                {odooApps.map((app) => {
                  const Icon = app.icon;
                  return (
                    <button
                      key={app.id}
                      onClick={() => {
                        setActiveTab(app.tab);
                        setShowAppSwitcher(false);
                      }}
                      className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-white/10 transition-all active:scale-95 text-center group"
                    >
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-105 duration-300", app.color)}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-bold leading-relaxed">{language === 'ar' ? app.name : app.nameEn}</span>
                      <span className="text-[9px] text-white/40 uppercase tracking-widest">{app.nameEn}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-16 text-center text-white/30 text-xs">
                {language === 'ar' ? 'انقر على التطبيق لتشغيله في لوحة إدارة ميزون إتش الموحدة' : 'Click on an app to launch it in the unified Maison H admin suite'}
              </div>
            </div>
          </div>
        )}

        {/* SIDEBAR: Modular Odoo Navigation */}
        <aside className="w-56 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-l border-slate-800">
          <div className="p-4 border-b border-slate-800 text-center bg-slate-950/40">
            <span className="font-serif text-lg tracking-wider font-bold text-white block">MAISON H</span>
            <span className="text-[9px] text-[#C8A46A] tracking-widest uppercase font-bold mt-1 block">ERP Integration Suite</span>
          </div>

          <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
            {odooApps.map((app) => {
              const Icon = app.icon;
              return (
                <button
                  key={app.id}
                  onClick={() => setActiveTab(app.tab)}
                  className={cn(
                    "w-full flex items-center gap-3 px-5 py-3 text-xs font-bold transition-all relative border-r-4",
                    activeTab === app.tab
                      ? "bg-indigo-650/15 text-indigo-400 border-indigo-500 font-bold"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100 border-transparent"
                  )}
                >
                  <Icon className={cn("w-4 h-4 shrink-0", activeTab === app.tab ? "text-indigo-400" : "text-slate-500")} />
                  <span>{language === 'ar' ? app.name : app.nameEn}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <Link 
              to="/" 
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-all w-full"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'العودة للمتجر العام' : 'Return to General Store'}</span>
            </Link>
          </div>
        </aside>

        {/* WORKSPACE AREA */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Sub Header / Action Buttons */}
          <div className="h-11 bg-white border-b border-slate-200 shrink-0 flex items-center justify-between px-6 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#71639e] rounded-full"></span>
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {language === 'ar' ? (odooApps.find(a => a.tab === activeTab)?.name) : (odooApps.find(a => a.tab === activeTab)?.nameEn)} / {language === 'ar' ? 'تهيئة النظام' : 'Setup'}
              </h2>
            </div>
            <div className="text-[11px] text-slate-400">
              {language === 'ar' ? 'المنطقة الزمنية: الرياض (GMT+3)' : 'Timezone: Riyadh (GMT+3)'}
            </div>
          </div>

          {/* Dynamic App Content Body */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">

            {/* A. APP 1: WEBSITE & THEME CUSTOMIZER (Odoo Website Editor) */}
            {activeTab === 'website' && (
              <div className="space-y-6 max-w-6xl animate-fade-in">
                
                {/* Intro banner */}
                <div className="bg-white p-5 rounded border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">{language === 'ar' ? 'تخصيص القالب والهوية البصرية والمبيعات' : 'Customize Template, Identity, & Sales'}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {language === 'ar' 
                        ? 'الخيارات الافتراضية المأخوذة من نظام أودو لتخصيص متجر ميزون إتش. تحكم بالخطوط، الهيدر، المظهر والملحقات.' 
                        : 'Default configuration rules retrieved from Odoo ERP to customize Maison H. Control fonts, headers, color palettes and active add-ons.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded h-fit shrink-0 text-[11px] text-amber-800 font-bold">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>{language === 'ar' ? 'التغييرات تنعكس فورياً في سلة الشراء والواجهة العامة' : 'Changes apply instantly to checkout and public storefront'}</span>
                  </div>
                </div>

                {/* Grid Split: Left (Settings Form) | Right (Interactive live preview widget) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Column: Form Configs (8 cols) */}
                  <div className="lg:col-span-8 bg-white p-6 rounded border border-slate-200 shadow-xs space-y-6">
                    
                    {/* Block 1: Typography & Palette */}
                    <div>
                      <h4 className="text-xs font-bold text-[#71639e] uppercase border-b border-slate-100 pb-2 mb-4 flex items-center gap-1.5">
                        <Palette className="w-4 h-4" />
                        <span>{language === 'ar' ? 'الهوية البصرية والسمة والألوان' : 'Visual Identity, Theme & Colors'}</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Font Choice */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1.5">{language === 'ar' ? 'الخط الأساسي للمتجر' : 'Primary Store Font'}</label>
                          <select 
                            value={customizer.font}
                            onChange={(e) => handleConfigChange('font', e.target.value)}
                            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-indigo-500 font-bold"
                          >
                            <option value="Tajawal">Tajawal | تجول (أنيق ومستدير)</option>
                            <option value="Cairo">Cairo | القاهرة (جاف ومقروء جداً)</option>
                            <option value="Inter">Inter | إنتر (عصري ومناسب للتصاميم اللاتينية)</option>
                          </select>
                        </div>

                        {/* Theme Preset */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1.5">{language === 'ar' ? 'المخطط اللوني للموقع' : 'Website Color Scheme'}</label>
                          <select 
                            value={customizer.theme}
                            onChange={(e) => handleConfigChange('theme', e.target.value)}
                            className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-indigo-500 font-bold"
                          >
                            <option value="default">{language === 'ar' ? 'ذهبي ميزون الكلاسيكي (الفاخر)' : 'Classic Maison Gold (Luxury)'}</option>
                            <option value="winter">{language === 'ar' ? 'التوت الشتوي (أحمر عنابي دافئ)' : 'Winter Berry (Warm Burgundy)'}</option>
                            <option value="spring">{language === 'ar' ? 'الربيع المنعش (أخضر هادئ ووردي)' : 'Fresh Spring (Green & Pink)'}</option>
                          </select>
                        </div>

                      </div>
                    </div>

                    {/* Block 2: Header Styles */}
                    <div>
                      <h4 className="text-xs font-bold text-[#71639e] uppercase border-b border-slate-100 pb-2 mb-4 flex items-center gap-1.5">
                        <Laptop className="w-4 h-4" />
                        <span>{language === 'ar' ? 'تخطيط الهيدر وأشرطة التنقل' : 'Header Layout & Navigation'}</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { id: 'classic', label: language === 'ar' ? 'كلاسيكي (لوجو بالمنتصف)' : 'Classic (Centered Logo)', desc: language === 'ar' ? 'شريط تقليدي فخم' : 'Traditional luxury header' },
                          { id: 'minimal', label: language === 'ar' ? 'عصري (لوجو باليمين)' : 'Modern (Logo Left)', desc: language === 'ar' ? 'مساحة إضافية واسعة' : 'Clean & spacious width' },
                          { id: 'floating', label: language === 'ar' ? 'عائم (شفاف ذكي)' : 'Floating (Smart Sticky)', desc: language === 'ar' ? 'تثبيت ذكي أثناء التمرير' : 'Sticky scrolling effect' }
                        ].map((style) => (
                           <button
                             key={style.id}
                             type="button"
                             onClick={() => handleConfigChange('headerStyle', style.id)}
                             className={cn(
                               "p-3 rounded border text-right transition-all hover:border-indigo-300",
                               language === 'ar' ? "text-right" : "text-left",
                               customizer.headerStyle === style.id 
                                 ? "border-indigo-650 bg-indigo-50/20 text-indigo-900" 
                                 : "border-slate-200 bg-slate-50 text-slate-700"
                             )}
                           >
                            <span className="block text-xs font-bold">{style.label}</span>
                            <span className="block text-[9px] text-slate-400 mt-1">{style.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Block 3: Storefront Extras Addons */}
                    <div>
                      <h4 className="text-xs font-bold text-[#71639e] uppercase border-b border-slate-100 pb-2 mb-4 flex items-center gap-1.5">
                        <CheckSquare className="w-4 h-4" />
                        <span>{language === 'ar' ? 'الملحقات والميزات النشطة (أودو للأدوات الذكية)' : 'Active Storefront Add-ons & Widgets'}</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* WhatsApp support floating button */}
                        <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded">
                          <div className="space-y-0.5">
                            <span className="block text-xs font-bold text-slate-800">{language === 'ar' ? 'أيقونة الواتساب للمساعدة' : 'WhatsApp Floating Widget'}</span>
                            <span className="block text-[10px] text-slate-400">{language === 'ar' ? 'تواصل مباشر سريع مع الرياض' : 'Instant live help link with Riyadh team'}</span>
                          </div>
                          <button 
                            onClick={() => handleConfigChange('showWhatsapp', !customizer.showWhatsapp)}
                            className={cn("w-10 h-6 flex items-center rounded-full p-1 transition-colors", customizer.showWhatsapp ? "bg-[#00A09D]" : "bg-slate-300")}
                          >
                            <div className={cn("bg-white w-4 h-4 rounded-full shadow-md transform transition-transform", customizer.showWhatsapp ? (language === 'ar' ? "-translate-x-4" : "translate-x-4") : "translate-x-0")}></div>
                          </button>
                        </div>

                        {/* Comparison widget */}
                        <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded">
                          <div className="space-y-0.5">
                            <span className="block text-xs font-bold text-slate-800">{language === 'ar' ? 'شريط مقارنة الشوكولاتة' : 'Maison Compare Widget'}</span>
                            <span className="block text-[10px] text-slate-400">{language === 'ar' ? 'مقارنة الحجم، المكونات والسعرات' : 'Compare product dimensions & ingredients'}</span>
                          </div>
                          <button 
                            onClick={() => handleConfigChange('showCompare', !customizer.showCompare)}
                            className={cn("w-10 h-6 flex items-center rounded-full p-1 transition-colors", customizer.showCompare ? "bg-[#00A09D]" : "bg-slate-300")}
                          >
                            <div className={cn("bg-white w-4 h-4 rounded-full shadow-md transform transition-transform", customizer.showCompare ? (language === 'ar' ? "-translate-x-4" : "translate-x-4") : "translate-x-0")}></div>
                          </button>
                        </div>

                        {/* Luxury Wrapping Guide */}
                        <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded">
                          <div className="space-y-0.5">
                            <span className="block text-xs font-bold text-slate-800">{language === 'ar' ? 'دليل التغليف والشرائط الفاخرة' : 'Ribbons & Gift Wrapping Guide'}</span>
                            <span className="block text-[10px] text-slate-400">{language === 'ar' ? 'صفحة مخصصة توضح أسلوب التعبئة' : 'Dedicated styling tips for luxury packs'}</span>
                          </div>
                          <button 
                            onClick={() => handleConfigChange('showWrapping', !customizer.showWrapping)}
                            className={cn("w-10 h-6 flex items-center rounded-full p-1 transition-colors", customizer.showWrapping ? "bg-[#00A09D]" : "bg-slate-300")}
                          >
                            <div className={cn("bg-white w-4 h-4 rounded-full shadow-md transform transition-transform", customizer.showWrapping ? (language === 'ar' ? "-translate-x-4" : "translate-x-4") : "translate-x-0")}></div>
                          </button>
                        </div>

                        {/* CRM Loyalty Welcome Pop-up */}
                        <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded">
                          <div className="space-y-0.5">
                            <span className="block text-xs font-bold text-slate-800">{language === 'ar' ? 'لوحة ترحيب الولاء التلقائية' : 'CRM Welcome Points Pop-up'}</span>
                            <span className="block text-[10px] text-slate-400">{language === 'ar' ? 'ظهور ترحيبي لربح نقاط مجانية' : 'Welcome overlay to grant sign-up points'}</span>
                          </div>
                          <button 
                            onClick={() => handleConfigChange('showLoyalty', !customizer.showLoyalty)}
                            className={cn("w-10 h-6 flex items-center rounded-full p-1 transition-colors", customizer.showLoyalty ? "bg-[#00A09D]" : "bg-slate-300")}
                          >
                            <div className={cn("bg-white w-4 h-4 rounded-full shadow-md transform transition-transform", customizer.showLoyalty ? (language === 'ar' ? "-translate-x-4" : "translate-x-4") : "translate-x-0")}></div>
                          </button>
                        </div>

                      </div>
                    </div>

                    {/* Block 4: Financial & Store variables */}
                    <div>
                      <h4 className="text-xs font-bold text-[#71639e] uppercase border-b border-slate-100 pb-2 mb-4 flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4" />
                        <span>{language === 'ar' ? 'معاملات ومحددات المتجر المالية (أودو للفوترة والمحاسبة)' : 'Financial Settings & Parameters (Odoo Invoicing)'}</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1">{language === 'ar' ? 'نسبة ضريبة القيمة المضافة (%)' : 'VAT Percent (%)'}</label>
                          <input 
                            type="number" 
                            min="0" max="100"
                            value={customizer.vatPercent}
                            onChange={(e) => handleConfigChange('vatPercent', parseInt(e.target.value) || 0)}
                            className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded text-center font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1">{language === 'ar' ? 'حد الشحن المجاني (ر.س)' : 'Free Shipping Limit (SAR)'}</label>
                          <input 
                            type="number" 
                            min="0"
                            value={customizer.freeShippingThreshold}
                            onChange={(e) => handleConfigChange('freeShippingThreshold', parseInt(e.target.value) || 0)}
                            className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded text-center font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1">{language === 'ar' ? 'كوبون خصم ترويجي نشط' : 'Active Promo Coupon'}</label>
                          <input 
                            type="text" 
                            value={customizer.promoCode}
                            onChange={(e) => handleConfigChange('promoCode', e.target.value.toUpperCase())}
                            className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded text-center font-bold font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1">{language === 'ar' ? 'نقاط ترحيب التسجيل الجديد' : 'New User Welcome Points'}</label>
                          <input 
                            type="number" 
                            min="0"
                            value={customizer.welcomePoints}
                            onChange={(e) => handleConfigChange('welcomePoints', parseInt(e.target.value) || 0)}
                            className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded text-center font-bold"
                          />
                        </div>

                      </div>
                    </div>

                  </div>

                  {/* Right Column: Live Mockup Interactive Preview Card (4 cols) */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#1e1e2d] text-white rounded shadow-md overflow-hidden border border-slate-800">
                      
                      <div className="px-4 py-2 bg-slate-950 flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-400">{language === 'ar' ? 'معاينة تفاعلية حية (أودو ستوديو)' : 'Live Interactive Preview (Odoo Studio)'}</span>
                        <div className="flex gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                        </div>
                      </div>

                      {/* Header Preview Box */}
                      <div className="p-4 bg-slate-900 border-b border-slate-800">
                        <p className="text-[10px] text-slate-400 mb-2 font-mono">{language === 'ar' ? '1. الواجهة العليا (Header)' : '1. Top Header Viewport'}</p>
                        
                        {/* The Mock Navigation bar based on choices */}
                        <div className={cn(
                          "bg-black p-3 border border-indigo-500/20 rounded flex items-center justify-between text-xs",
                          customizer.headerStyle === 'minimal' && 'flex-row-reverse'
                        )}>
                          {customizer.headerStyle !== 'classic' ? (
                            <span className="font-serif font-bold text-amber-400 text-xs tracking-wider">MAISON H</span>
                          ) : (
                            <div className="flex flex-col items-center flex-1">
                              <span className="font-serif font-bold text-amber-400 text-xs tracking-widest leading-none">MAISON H</span>
                              <span className="text-[6px] text-white/50 tracking-wider">CHOCOLATIER</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-[9px] text-slate-300">
                            <span>{language === 'ar' ? 'الرئيسية' : 'Home'}</span>
                            <span>{language === 'ar' ? 'المتجر' : 'Shop'}</span>
                            {customizer.showWrapping && (
                              <span className="text-amber-400 font-bold">{language === 'ar' ? '★ دليل التغليف' : '★ Wrapping Guide'}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Store Details and Pricing Mock */}
                      <div className="p-4 space-y-4">
                        <p className="text-[10px] text-slate-400 font-mono">{language === 'ar' ? '2. تفاصيل الفاتورة وقوانين الشحن' : '2. Mock Invoice & Shipping Rules'}</p>
                        
                        <div className="bg-slate-950/80 p-3 rounded space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-400">{language === 'ar' ? 'بوكس الشوكولاتة الكلاسيكي' : 'Classic Chocolate Box'}</span>
                            <span>250 {language === 'ar' ? 'ر.س' : 'SAR'}</span>
                          </div>
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">{language === 'ar' ? 'ضريبة القيمة المضافة' : 'VAT'} ({customizer.vatPercent}%)</span>
                            <span className="text-slate-300">+{((250 * customizer.vatPercent) / 100).toFixed(1)} {language === 'ar' ? 'ر.س' : 'SAR'}</span>
                          </div>
                          <div className="flex justify-between text-[11px] border-b border-slate-800 pb-1.5">
                            <span className="text-slate-400">{language === 'ar' ? `التوصيل (الشحن المجاني > ${customizer.freeShippingThreshold} ر.س)` : `Delivery (Free Shipping > ${customizer.freeShippingThreshold} SAR)`}</span>
                            <span className="text-green-400 font-medium">{language === 'ar' ? 'مجانًا' : 'Free'}</span>
                          </div>
                          <div className="flex justify-between font-bold text-amber-400 pt-0.5">
                            <span>{language === 'ar' ? 'الإجمالي' : 'Grand Total'}</span>
                            <span>{(250 + (250 * customizer.vatPercent) / 100).toFixed(1)} {language === 'ar' ? 'ر.س' : 'SAR'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Active Widgets Mockup */}
                      <div className="p-4 bg-slate-900/50 border-t border-slate-800 space-y-2 text-xs">
                        <p className="text-[10px] text-slate-400 font-mono">{language === 'ar' ? '3. الأدوات النشطة على المتجر' : '3. Active Live Widgets'}</p>
                        <div className="flex flex-wrap gap-2">
                          {customizer.showWhatsapp && (
                            <span className="px-2 py-1 bg-green-950/60 border border-green-800 rounded text-green-300 text-[10px] font-bold">
                              🟢 {language === 'ar' ? 'زر مساعد الرياض النشط' : 'Riyadh Floating Chat Active'}
                            </span>
                          )}
                          {customizer.showCompare && (
                            <span className="px-2 py-1 bg-indigo-950/60 border border-indigo-800 rounded text-indigo-300 text-[10px] font-bold">
                              ⚖️ {language === 'ar' ? 'شريط المقارنة مفعل' : 'Comparison Helper Active'}
                            </span>
                          )}
                          {customizer.showLoyalty && (
                            <span className="px-2 py-1 bg-purple-950/60 border border-purple-800 rounded text-purple-300 text-[10px] font-bold">
                              🎁 {language === 'ar' ? `هدية الولاء (${customizer.welcomePoints} نقطة)` : `Loyalty Reward Gift (${customizer.welcomePoints} pts)`}
                            </span>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Quick ERP Guide */}
                    <div className="bg-indigo-50 border border-indigo-200 p-4 rounded text-xs leading-relaxed text-indigo-950">
                      <p className="font-bold flex items-center gap-1">
                        <HelpCircle className="w-4 h-4 text-indigo-700" />
                        <span>{language === 'ar' ? 'ما هي "الخيارات الافتراضية بأودو"؟' : 'What are "Odoo Default Parameters"?'}</span>
                      </p>
                      <p className="mt-1">
                        {language === 'ar' 
                          ? 'هي البنية الأساسية في ERP Odoo لتهيئة (Website Configurator). من خلال هذه اللوحة، يتحكم مدير النظام بقوانين الفوترة التلقائية والمظهر بدون كتابة كود برمجي واحد.' 
                          : 'These are database properties mapped directly to Odoo ERP (Website Configurator). Through this dashboard, store owners rule live checkout flows and styles without deploying any new code.'}
                      </p>
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* B. APP 2: PIVOT ANALYTICS & DASHBOARD */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                
                {/* Filters */}
                <div className="bg-white p-4 rounded border border-slate-200 shadow-xs flex flex-wrap justify-between items-center gap-4">
                  <h3 className="text-sm font-bold text-slate-800">{language === 'ar' ? 'تحليل الأداء المالي والمبيعات والزيارات' : 'Financial Performance, Sales & Traffic Analytics'}</h3>
                  
                  <div className="inline-flex rounded-md p-1 bg-slate-100 border border-slate-300">
                    {['today', 'week', 'month'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTimeframe(t as any)}
                        className={cn(
                          "px-4 py-1.5 rounded text-xs font-bold transition-all",
                          timeframe === t ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-900"
                        )}
                      >
                        {t === 'today' ? (language === 'ar' ? 'اليوم' : 'Today') : t === 'week' ? (language === 'ar' ? 'هذا الأسبوع' : 'This Week') : (language === 'ar' ? 'هذا الشهر' : 'This Month')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* KPI metrics cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  <div className="bg-white p-5 rounded border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">{language === 'ar' ? 'إجمالي مبيعات أودو المكتملة' : 'Total Odoo Completed Sales'}</span>
                      <span className="block text-2xl font-bold text-slate-800 mt-1">
                        {timeframe === 'today' ? (language === 'ar' ? '12,450 ر.س' : '12,450 SAR') : timeframe === 'week' ? (language === 'ar' ? '82,900 ر.س' : '82,900 SAR') : (language === 'ar' ? '289,000 ر.س' : '289,000 SAR')}
                      </span>
                      <span className="text-xs text-green-600 font-bold flex items-center gap-0.5 mt-1">
                        <ArrowUp className="w-3.5 h-3.5" />
                        <span>+12.4% {language === 'ar' ? 'عن السابق' : 'vs previous period'}</span>
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded bg-indigo-50 flex items-center justify-center text-indigo-700">
                      <DollarSign className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">{language === 'ar' ? 'أوامر المبيعات المؤكدة (Sales Orders)' : 'Confirmed Sales Orders (Sales Orders)'}</span>
                      <span className="block text-2xl font-bold text-slate-800 mt-1">
                        {timeframe === 'today' ? (language === 'ar' ? '32 طلب' : '32 orders') : timeframe === 'week' ? (language === 'ar' ? '184 طلب' : '184 orders') : (language === 'ar' ? '620 طلب' : '620 orders')}
                      </span>
                      <span className="text-xs text-green-600 font-bold flex items-center gap-0.5 mt-1">
                        <ArrowUp className="w-3.5 h-3.5" />
                        <span>+8% {language === 'ar' ? 'نمو الطلبات' : 'order growth'}</span>
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded bg-amber-50 flex items-center justify-center text-amber-700">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">{language === 'ar' ? 'الزوار الفريدين للمتجر' : 'Unique Storefront Visitors'}</span>
                      <span className="block text-2xl font-bold text-slate-800 mt-1">
                        {timeframe === 'today' ? (language === 'ar' ? '1,240 زائر' : '1,240 visitors') : timeframe === 'week' ? (language === 'ar' ? '7,890 زائر' : '7,890 visitors') : (language === 'ar' ? '22,400 زائر' : '22,400 visitors')}
                      </span>
                      <span className="text-xs text-green-600 font-bold flex items-center gap-0.5 mt-1">
                        <ArrowUp className="w-3.5 h-3.5" />
                        <span>+15% {language === 'ar' ? 'زيارات حية' : 'live traffic'}</span>
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded bg-emerald-50 flex items-center justify-center text-emerald-700">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>

                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Revenue Chart */}
                  <div className="bg-white p-5 rounded border border-slate-200 shadow-xs">
                    <h4 className="text-xs font-bold text-slate-700 mb-4 uppercase tracking-wider flex items-center gap-1">
                      <Activity className="w-4 h-4 text-indigo-600" />
                      <span>{language === 'ar' ? 'منحنى الإيرادات التراكمي المباشر' : 'Live Cumulative Revenue Trend'}</span>
                    </h4>
                    <div className="h-64" dir="ltr">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#71639e" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#71639e" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#888' }} />
                          <YAxis tick={{ fontSize: 10, fill: '#888' }} />
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFEFEF" />
                          <Tooltip />
                          <Area type="monotone" dataKey="total" stroke="#71639e" strokeWidth={2.5} fillOpacity={1} fill="url(#revenueGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Traffic Bar Chart */}
                  <div className="bg-white p-5 rounded border border-slate-200 shadow-xs">
                    <h4 className="text-xs font-bold text-slate-700 mb-4 uppercase tracking-wider flex items-center gap-1">
                      <Users className="w-4 h-4 text-indigo-600" />
                      <span>{language === 'ar' ? 'تدفق زيارات ومستخدمي المتجر' : 'Store Traffic & Visitors Flow'}</span>
                    </h4>
                    <div className="h-64" dir="ltr">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#888' }} />
                          <YAxis tick={{ fontSize: 10, fill: '#888' }} />
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFEFEF" />
                          <Tooltip />
                          <Bar dataKey="visitors" fill="#00A09D" radius={[3, 3, 0, 0]} maxBarSize={35} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* C. APP 3: SALES & ORDERS */}
            {activeTab === 'sales' && (
              <div className="space-y-6 animate-fade-in">
                
                {/* Search & Actions toolbar */}
                <div className="bg-white p-4 rounded border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
                  
                  {/* Search input */}
                  <div className="relative w-full md:w-80">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder={language === 'ar' ? "البحث باسم العميل أو رمز الطلب..." : "Search customer name or order code..."}
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded p-2 pr-9 pl-4 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Status buttons */}
                  <div className="flex flex-wrap gap-1.5">
                    {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setOrderStatusFilter(status)}
                        className={cn(
                          "px-3 py-1.5 rounded text-xs font-bold border transition-all capitalize",
                          orderStatusFilter === status 
                            ? "bg-slate-800 text-white border-slate-800 shadow-xs" 
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                        )}
                      >
                        {status === 'all' && (language === 'ar' ? 'الكل' : 'All')}
                        {status === 'processing' && (language === 'ar' ? 'قيد التجهيز' : 'Processing')}
                        {status === 'shipped' && (language === 'ar' ? 'تم الشحن' : 'Shipped')}
                        {status === 'delivered' && (language === 'ar' ? 'تم التوصيل' : 'Delivered')}
                        {status === 'cancelled' && (language === 'ar' ? 'ملغي' : 'Cancelled')}
                      </button>
                    ))}
                  </div>

                </div>

                {/* Orders list table */}
                <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className={cn("w-full text-xs", language === 'ar' ? "text-right" : "text-left")}>
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                        <tr>
                          <th className="px-6 py-3.5 font-bold uppercase tracking-wider">{language === 'ar' ? 'رقم أمر البيع (Sales Order)' : 'Sales Order ID'}</th>
                          <th className="px-6 py-3.5 font-bold uppercase tracking-wider">{language === 'ar' ? 'العميل والمستلم' : 'Customer & Recipient'}</th>
                          <th className="px-6 py-3.5 font-bold uppercase tracking-wider">{language === 'ar' ? 'تاريخ الإنشاء' : 'Creation Date'}</th>
                          <th className="px-6 py-3.5 font-bold uppercase tracking-wider">{language === 'ar' ? 'مبلغ الفاتورة (شامل الضريبة)' : 'Invoice Amount (Inc. VAT)'}</th>
                          <th className="px-6 py-3.5 font-bold uppercase tracking-wider">{language === 'ar' ? 'طريقة السداد' : 'Payment Method'}</th>
                          <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-center">{language === 'ar' ? 'حالة أمر التوصيل' : 'Delivery Status'}</th>
                          <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-center">{language === 'ar' ? 'الإجراءات والعمليات' : 'Actions & Operations'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-bold">
                              {language === 'ar' ? 'لا توجد مبيعات متطابقة حالياً في النظام' : 'No matching sales orders found in system'}
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 font-mono font-bold text-slate-900">{order.id}</td>
                              <td className="px-6 py-4">
                                <div>
                                  <p className="font-bold text-slate-800">{order.customerName}</p>
                                  <p className="text-[10px] text-slate-400">{order.phone}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-slate-500">{order.date}</td>
                              <td className="px-6 py-4 font-bold text-[#71639e]">{order.total} {language === 'ar' ? 'ر.س' : 'SAR'}</td>
                              <td className="px-6 py-4 text-slate-500">
                                {order.paymentMethod === 'بطاقة ائتمانية' 
                                  ? (language === 'ar' ? 'بطاقة ائتمانية' : 'Credit Card') 
                                  : order.paymentMethod === 'الدفع عند الاستلام' 
                                    ? (language === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery') 
                                    : order.paymentMethod}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className={cn(
                                  "inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase",
                                  order.status === 'processing' && 'bg-blue-50 border-blue-200 text-blue-700',
                                  order.status === 'shipped' && 'bg-amber-50 border-amber-200 text-amber-700',
                                  order.status === 'delivered' && 'bg-green-50 border-green-200 text-green-700',
                                  order.status === 'cancelled' && 'bg-red-50 border-red-100 text-red-600'
                                )}>
                                  {order.status === 'processing' && (language === 'ar' ? 'تحت التجهيز' : 'Processing')}
                                  {order.status === 'shipped' && (language === 'ar' ? 'تم الشحن' : 'Shipped')}
                                  {order.status === 'delivered' && (language === 'ar' ? 'تم التوصيل' : 'Delivered')}
                                  {order.status === 'cancelled' && (language === 'ar' ? 'ملغي' : 'Cancelled')}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  {order.status === 'processing' && (
                                    <button 
                                      onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                                      className="px-2.5 py-1.5 bg-amber-600 text-white rounded text-[10px] font-bold hover:bg-amber-700 active:scale-95 transition-all"
                                      title={language === 'ar' ? "تأكيد الشحن الفوري" : "Confirm instant shipping"}
                                    >
                                      {language === 'ar' ? 'شحن الطرد' : 'Ship Parcel'}
                                    </button>
                                  )}
                                  {order.status === 'shipped' && (
                                    <button 
                                      onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                                      className="px-2.5 py-1.5 bg-green-600 text-white rounded text-[10px] font-bold hover:bg-green-700 active:scale-95 transition-all"
                                      title={language === 'ar' ? "تأكيد التوصيل الفعلي للرياض" : "Confirm physical delivery to Riyadh"}
                                    >
                                      {language === 'ar' ? 'توصيل للعميل' : 'Deliver to Client'}
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => setSelectedOrder(order)}
                                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
                                    title={language === 'ar' ? "تفاصيل الفاتورة ومحتوياتها" : "Invoice breakdown & items"}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* D. APP 4: INVENTORY & PRODUCTS */}
            {activeTab === 'inventory' && (
              <div className="space-y-6 animate-fade-in">
                
                {/* Search & Actions Bar */}
                <div className="bg-white p-4 rounded border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
                  
                  {/* Search field */}
                  <div className="relative w-full md:w-80">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder={language === 'ar' ? "البحث باسم الشوكولاتة أو التصنيف..." : "Search chocolate name or category..."}
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded p-2 pr-9 pl-4 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Add New Product Trigger */}
                  <button
                    onClick={() => setIsAddingProduct(true)}
                    className="px-4 py-2 bg-[#71639e] text-white hover:bg-[#5E5186] rounded text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{language === 'ar' ? 'إدراج صنف شوكولاتة جديد' : 'Add New Chocolate Product'}</span>
                  </button>

                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((p) => (
                    <div key={p.id} className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden flex flex-col group">
                      
                      {/* Product image */}
                      <div className="h-40 bg-slate-100 overflow-hidden relative">
                        <img 
                          src={p.image} 
                          alt={getTranslatedProductName(p.name, language)} 
                          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 left-2 bg-slate-900/85 backdrop-blur-xs px-2.5 py-0.5 rounded text-[9px] text-white font-mono font-bold">
                          {p.id}
                        </div>
                        
                        {/* Status label overlay */}
                        <div className="absolute bottom-2 right-2">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shadow-sm border",
                            p.inStock ? "bg-green-500 text-white border-green-600" : "bg-red-500 text-white border-red-600"
                          )}>
                            {p.inStock ? (language === 'ar' ? 'متوفر بالمستودع' : 'In Stock') : (language === 'ar' ? 'غير متوفر' : 'Out of Stock')}
                          </span>
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <p className="text-[10px] text-[#C8A46A] font-bold tracking-wider">{getTranslatedProductCat(p.category, language)}</p>
                          <h4 className="text-xs font-bold text-slate-800 mt-1 leading-normal line-clamp-1">{getTranslatedProductName(p.name, language)}</h4>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{getTranslatedProductDesc(p.shortDescription, language)}</p>
                          {p.size && (
                            <span className="inline-block bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[9px] font-bold mt-2 font-mono">
                              {getTranslatedProductSize(p.size, language)}
                            </span>
                          )}
                        </div>

                        {/* Inventory adjustments inputs and togglers */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          
                          {/* Price edit */}
                          <div className="space-y-0.5">
                            <span className="block text-[9px] text-slate-400">{language === 'ar' ? 'سعر الصنف للبيع' : 'Retail Price'}</span>
                            <span className="text-xs font-bold text-slate-900">{p.price} {language === 'ar' ? 'ر.س' : 'SAR'}</span>
                          </div>

                          {/* Fast Stock Toggle */}
                          <button
                            onClick={() => handleToggleProductStock(p.id)}
                            className={cn(
                              "px-2.5 py-1.5 rounded text-[10px] font-bold border transition-colors active:scale-95",
                              p.inStock 
                                ? "bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100" 
                                : "bg-green-600 text-white border-green-600 hover:bg-green-700"
                            )}
                          >
                            {p.inStock ? (language === 'ar' ? 'تغيير لـ نفذ' : 'Mark Out') : (language === 'ar' ? 'تفعيل التوفر' : 'Mark Available')}
                          </button>

                        </div>

                      </div>

                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* E. APP 5: CRM & LOYALTY */}
            {activeTab === 'crm' && (
              <div className="space-y-6 animate-fade-in">
                
                {/* Intro metrics cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="bg-white p-5 rounded border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">{language === 'ar' ? 'إجمالي نقاط الولاء للعملاء' : 'Total Customer Loyalty Points'}</span>
                      <span className="block text-3xl font-serif font-bold text-indigo-700 mt-1">145,280</span>
                      <p className="text-[10px] text-slate-400 mt-1">{language === 'ar' ? 'خصومات مستحقة جاهزة للاسترداد' : 'Redeemable discount vouchers ready'}</p>
                    </div>
                    <div className="w-12 h-12 rounded bg-indigo-50 flex items-center justify-center text-indigo-700 shrink-0">
                      <Gift className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-[#1e1e2d] text-white p-5 rounded shadow-xs relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">{language === 'ar' ? 'قوانين الترقية الآلية (Tier Setup)' : 'Automated Tier Progression Rules'}</span>
                      <span className="block text-lg font-serif font-bold text-amber-400 mt-1">{language === 'ar' ? 'الفضية ➔ الذهبية ➔ النخبة VIP' : 'Silver ➔ Gold ➔ Elite VIP'}</span>
                      <p className="text-[10px] text-slate-400 mt-1">{language === 'ar' ? 'المعادلة: كل مشتريات بـ 1 ر.س تمنح نقطة ولاء مجانية' : 'Formula: Every 1 SAR spent grants 1 free loyalty point'}</p>
                    </div>
                    
                    {/* Visual gauge */}
                    <div className="relative z-10 mt-4 space-y-1">
                      <div className="w-full bg-white/10 rounded-full h-1.5">
                        <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                      <div className="flex justify-between text-[8px] text-white/40 font-mono">
                        <span>{language === 'ar' ? '600 نقطة (ذهبى)' : '600 pts (Gold)'}</span>
                        <span>{language === 'ar' ? '1200 نقطة (نخبة)' : '1200 pts (Elite)'}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Search ledger */}
                <div className="bg-white p-4 rounded border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-800">{language === 'ar' ? 'سجل أرصدة نقاط عملاء الولاء' : 'Loyalty Customers Points Ledger'}</h4>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder={language === 'ar' ? "ابحث باسم العميل أو جواله..." : "Search customer name or mobile..."}
                      value={loyaltySearch}
                      onChange={(e) => setLoyaltySearch(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded p-2 pr-9 pl-4 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Loyalty Table ledger */}
                <div className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden">
                  <table className={cn("w-full text-xs", language === 'ar' ? "text-right" : "text-left")}>
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                      <tr>
                        <th className="px-6 py-3.5 font-bold uppercase">{language === 'ar' ? 'العميل المستفيد' : 'Beneficiary Customer'}</th>
                        <th className="px-6 py-3.5 font-bold uppercase">{language === 'ar' ? 'رقم الجوال' : 'Mobile Number'}</th>
                        <th className="px-6 py-3.5 font-bold uppercase text-center">{language === 'ar' ? 'رصيد النقاط الفعلي' : 'Actual Points Balance'}</th>
                        <th className="px-6 py-3.5 font-bold uppercase text-center">{language === 'ar' ? 'فئة العضوية' : 'Membership Tier'}</th>
                        <th className="px-6 py-3.5 font-bold uppercase">{language === 'ar' ? 'إجمالي الإنفاق التراكمي' : 'Cumulative Lifetime Spending'}</th>
                        <th className="px-6 py-3.5 font-bold uppercase text-center">{language === 'ar' ? 'عمليات التعديل اليدوي' : 'Manual Point Adjustments'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredLoyalty.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold">
                            {language === 'ar' ? 'لا يوجد عملاء ولاء مطابقين' : 'No matching loyalty customers found'}
                          </td>
                        </tr>
                      ) : (
                        filteredLoyalty.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-900">{c.name}</td>
                            <td className="px-6 py-4 font-mono text-slate-500">{c.phone}</td>
                            <td className="px-6 py-4 text-center font-bold text-amber-500 text-sm">{c.points}</td>
                            <td className="px-6 py-4 text-center">
                              <span className={cn(
                                "inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                                c.tier === 'Elite' && 'bg-purple-50 border-purple-200 text-purple-700',
                                c.tier === 'Gold' && 'bg-amber-50 border-amber-200 text-amber-700',
                                c.tier === 'Silver' && 'bg-slate-100 border-slate-200 text-slate-700'
                              )}>
                                {c.tier === 'Elite' && (language === 'ar' ? 'نخبة VIP' : 'Elite VIP')}
                                {c.tier === 'Gold' && (language === 'ar' ? 'العضوية الذهبية' : 'Gold Membership')}
                                {c.tier === 'Silver' && (language === 'ar' ? 'العضوية الفضية' : 'Silver Membership')}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-800">{c.totalSpent} {language === 'ar' ? 'ر.س' : 'SAR'}</td>
                            <td className="px-6 py-4 text-center">
                              <button 
                                onClick={() => setSelectedLoyaltyCust(c)}
                                className="px-3 py-1.5 bg-slate-50 border border-slate-300 hover:border-indigo-500 hover:text-indigo-600 rounded text-[10px] font-bold transition-all active:scale-95"
                              >
                                {language === 'ar' ? 'تعديل يدوي' : 'Manual Edit'}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* E2. APP 6: MULTI UNITS OF MEASURE (Odoo Multi-UoM Core) */}
            {activeTab === 'uom' && (
              <OdooUomPanel showToast={showToast} language={language} />
            )}

            {/* F. APP 6: APPS STORE (Odoo Addons Store) */}
             {activeTab === 'apps' && (
              <div className="space-y-6 animate-fade-in">
                
                <div className="bg-white p-5 rounded border border-slate-200 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-800">{language === 'ar' ? 'متجر تطبيقات وإضافات أودو للمؤسسات' : 'Odoo Enterprise Add-ons & Apps Store'}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {language === 'ar' 
                      ? 'قم بتثبيت وترقية الميزات والملحقات بضغطة زر. تفعيل التطبيقات يضمن تزويد الواجهة العامة بها وحفظ الخيارات.' 
                      : 'Install and upgrade features and plugins with a single click. Activating apps ensures the storefront has these capabilities enabled and options saved.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* App 1: Whatsapp */}
                  <div className="bg-white p-5 rounded border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="w-10 h-10 rounded bg-green-150 flex items-center justify-center text-green-600">
                        <Sliders className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-800">{language === 'ar' ? 'مساعد الرياض للواتساب الفوري' : 'Riyadh Instant WhatsApp Assistant'}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {language === 'ar' 
                          ? 'يمنح عملائك إمكانية التواصل مباشرة مع مندوبي المبيعات في الرياض بضغطة زر.' 
                          : 'Allows your customers to communicate directly with sales representatives in Riyadh with a single click.'}
                      </p>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{language === 'ar' ? 'مدمج مجاناً' : 'Free / Built-in'}</span>
                      <button
                        onClick={() => handleConfigChange('showWhatsapp', !customizer.showWhatsapp)}
                        className={cn(
                          "px-3 py-1.5 rounded text-[10px] font-bold transition-all active:scale-95 border",
                          customizer.showWhatsapp 
                            ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" 
                            : "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                        )}
                      >
                        {customizer.showWhatsapp 
                          ? (language === 'ar' ? 'إلغاء التثبيت ❌' : 'Uninstall ❌') 
                          : (language === 'ar' ? 'تثبيت الآن 📥' : 'Install Now 📥')}
                      </button>
                    </div>
                  </div>

                  {/* App 2: Compare Chocolate */}
                  <div className="bg-white p-5 rounded border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="w-10 h-10 rounded bg-indigo-150 flex items-center justify-center text-indigo-600">
                        <Sliders className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-800">{language === 'ar' ? 'أداة مقارنة مواصفات الشوكولاتة' : 'Chocolate Spec Comparison Widget'}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {language === 'ar' 
                          ? 'لوحة مقارنة تفاعلية تتيح للمشترين مقارنة الحشوة، السعرات، والمكسرات لأكثر من صنف.' 
                          : 'An interactive comparison panel letting buyers compare the filling, calories, and nuts across multiple items.'}
                      </p>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{language === 'ar' ? 'مدمج مجاناً' : 'Free / Built-in'}</span>
                      <button
                        onClick={() => handleConfigChange('showCompare', !customizer.showCompare)}
                        className={cn(
                          "px-3 py-1.5 rounded text-[10px] font-bold transition-all active:scale-95 border",
                          customizer.showCompare 
                            ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" 
                            : "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                        )}
                      >
                        {customizer.showCompare 
                          ? (language === 'ar' ? 'إلغاء التثبيت ❌' : 'Uninstall ❌') 
                          : (language === 'ar' ? 'تثبيت الآن 📥' : 'Install Now 📥')}
                      </button>
                    </div>
                  </div>

                  {/* App 3: Wrapping guide */}
                  <div className="bg-white p-5 rounded border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="w-10 h-10 rounded bg-amber-150 flex items-center justify-center text-amber-600">
                        <Sliders className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-800">{language === 'ar' ? 'دليل التغليف الفاخر الحصري' : 'Exclusive Premium Gift Wrapping Guide'}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {language === 'ar' 
                          ? 'يستعرض للزائر تفاصيل نوع ورق الهدايا المستورد وألوان الشرائط الساتان لتخصيص مثالي.' 
                          : 'Showcases import gift paper details and custom satin ribbons for perfect personalization.'}
                      </p>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{language === 'ar' ? 'مدمج مجاناً' : 'Free / Built-in'}</span>
                      <button
                        onClick={() => handleConfigChange('showWrapping', !customizer.showWrapping)}
                        className={cn(
                          "px-3 py-1.5 rounded text-[10px] font-bold transition-all active:scale-95 border",
                          customizer.showWrapping 
                            ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" 
                            : "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                        )}
                      >
                        {customizer.showWrapping 
                          ? (language === 'ar' ? 'إلغاء التثبيت ❌' : 'Uninstall ❌') 
                          : (language === 'ar' ? 'تثبيت الآن 📥' : 'Install Now 📥')}
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>
        </div>

      </div>

      {/* ================= MODALS & DIALOGS ================= */}

      {/* I. Adjust Loyalty Points Modal */}
      {selectedLoyaltyCust && (
        <div id="odoo-points-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in text-xs">
          <div className="bg-white max-w-sm w-full rounded border border-slate-300 shadow-2xl overflow-hidden animate-scale-up text-xs">
            
            <div className="px-5 py-3.5 bg-slate-900 text-white flex justify-between items-center font-bold">
              <span>{language === 'ar' ? 'تعديل رصيد العميل:' : 'Modify Customer Balance:'} {selectedLoyaltyCust.name}</span>
              <button onClick={() => setSelectedLoyaltyCust(null)} className="text-white/60 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdjustPointsSubmit} className="p-5 space-y-4">
              
              <div className="bg-indigo-50 p-3 rounded text-indigo-950 font-bold flex justify-between">
                <span>{language === 'ar' ? 'رصيد النقاط الحالي:' : 'Current Points Balance:'}</span>
                <span className="text-sm font-bold text-indigo-700">{selectedLoyaltyCust.points} {language === 'ar' ? 'نقطة' : 'points'}</span>
              </div>

              {/* Action type */}
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">{language === 'ar' ? 'نوع العملية' : 'Transaction Type'}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPointsAction('add')}
                    className={cn(
                      "py-2 rounded border font-bold text-center",
                      pointsAction === 'add' ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    {language === 'ar' ? 'إضافة نقاط ولاء' : 'Add Loyalty Points'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPointsAction('deduct')}
                    className={cn(
                      "py-2 rounded border font-bold text-center",
                      pointsAction === 'deduct' ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    {language === 'ar' ? 'خصم نقاط ولاء' : 'Deduct Loyalty Points'}
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">{language === 'ar' ? 'عدد النقاط' : 'Number of Points'}</label>
                <input 
                  type="number"
                  required
                  min="1"
                  value={pointsAdjustment}
                  onChange={(e) => setPointsAdjustment(e.target.value)}
                  placeholder={language === 'ar' ? "مثال: 100" : "e.g., 100"}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded font-bold text-center focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-150 flex justify-end gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSelectedLoyaltyCust(null)}
                  className="px-4 py-2 rounded bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-slate-900 text-white hover:bg-slate-800"
                >
                  {language === 'ar' ? 'تعديل الآن' : 'Modify Now'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* II. Order Details Invoice Modal */}
      {selectedOrder && (
        <div id="odoo-invoice-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in text-xs">
          <div className="bg-white max-w-lg w-full rounded border border-slate-300 shadow-2xl overflow-hidden animate-scale-up">
            
            <div className="px-5 py-3 bg-slate-950 text-white flex justify-between items-center font-bold">
              <span>{language === 'ar' ? 'أمر بيع أودو المؤكد:' : 'Confirmed Odoo Sales Order:'} {selectedOrder.id}</span>
              <button onClick={() => setSelectedOrder(null)} className="text-white/60 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Header Invoice info */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <h4 className="font-serif text-sm font-bold text-slate-900">Maison H Chocolatier</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{language === 'ar' ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}</p>
                  <p className="text-[10px] text-slate-400">{language === 'ar' ? 'الرقم الضريبي: 300482930283003' : 'VAT ID: 300482930283003'}</p>
                </div>
                <div className={language === 'ar' ? 'text-left' : 'text-right'}>
                  <p className="font-bold text-slate-800">{language === 'ar' ? 'فاتورة ضريبية مبسطة' : 'Simplified Tax Invoice'}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{language === 'ar' ? 'تاريخ الإنشاء:' : 'Creation Date:'} {selectedOrder.date}</p>
                  <p className="text-[10px] text-slate-500">{language === 'ar' ? 'حالة السداد: مدفوع بالكامل' : 'Payment Status: Fully Paid'}</p>
                </div>
              </div>

              {/* Customer details */}
              <div className="bg-slate-50 p-3.5 rounded border border-slate-200 grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[9px] text-slate-400 uppercase font-bold">{language === 'ar' ? 'العميل والمشتري:' : 'Customer & Buyer:'}</span>
                  <span className="block font-bold text-slate-800 mt-0.5">{selectedOrder.customerName}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-400 uppercase font-bold">{language === 'ar' ? 'رقم الجوال والاتصال:' : 'Mobile & Contact:'}</span>
                  <span className="block font-bold text-slate-800 mt-0.5">{selectedOrder.phone}</span>
                </div>
              </div>

              {/* Items List */}
              <div>
                <span className="block text-[10px] font-bold text-slate-600 uppercase mb-2">{language === 'ar' ? 'المنتجات المشحونة بالطرد:' : 'Products Shipped in Parcel:'}</span>
                <div className="border border-slate-200 rounded overflow-hidden">
                  <table className={cn("w-full", language === 'ar' ? "text-right" : "text-left")}>
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2">{language === 'ar' ? 'الصنف' : 'Item'}</th>
                        <th className="px-4 py-2 text-center">{language === 'ar' ? 'الكمية' : 'Quantity'}</th>
                        <th className="px-4 py-2">{language === 'ar' ? 'سعر القطعة' : 'Unit Price'}</th>
                        <th className={cn("px-4 py-2", language === 'ar' ? "text-left" : "text-right")}>{language === 'ar' ? 'الإجمالي' : 'Total'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2.5 font-bold text-slate-800">{getTranslatedProductName(item.name, language)}</td>
                          <td className="px-4 py-2.5 text-center font-mono font-bold text-slate-900">{item.quantity}</td>
                          <td className="px-4 py-2.5">{item.price} {language === 'ar' ? 'ر.س' : 'SAR'}</td>
                          <td className={cn("px-4 py-2.5 font-bold text-[#71639e]", language === 'ar' ? "text-left" : "text-right")}>{item.price * item.quantity} {language === 'ar' ? 'ر.س' : 'SAR'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary prices */}
              <div className={cn("flex", language === 'ar' ? "justify-end" : "justify-start")}>
                <div className="w-52 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>{language === 'ar' ? 'المجموع الصافي (Subtotal)' : 'Subtotal'}</span>
                    <span>{selectedOrder.total} {language === 'ar' ? 'ر.س' : 'SAR'}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1.5">
                    <span>{language === 'ar' ? 'إجمالي القيمة الفواتيرية' : 'Total Invoice Amount'}</span>
                    <span>{selectedOrder.total} {language === 'ar' ? 'ر.س' : 'SAR'}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-150 font-bold text-xs">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded bg-slate-900 text-white hover:bg-slate-800"
                >
                  {language === 'ar' ? 'إغلاق وتأكيد مراجعة الفاتورة' : 'Close & Confirm Invoice Review'}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* III. Add Chocolate Product Modal */}
      {isAddingProduct && (
        <div id="odoo-product-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in text-xs">
          <div className="bg-white max-w-md w-full rounded border border-slate-300 shadow-2xl overflow-hidden animate-scale-up">
            
            <div className="px-5 py-3.5 bg-slate-950 text-white flex justify-between items-center font-bold">
              <span>{language === 'ar' ? 'إنشاء صنف شوكولاتة جديد بالكتالوج' : 'Create New Chocolate Catalog Item'}</span>
              <button onClick={() => setIsAddingProduct(false)} className="text-white/60 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="p-5 space-y-4">
              
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">{language === 'ar' ? 'اسم الشوكولاتة والمنتج *' : 'Chocolate Name & Product *'}</label>
                <input 
                  type="text"
                  required
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={language === 'ar' ? "مثال: شوكولاتة البندق المحمص الفاخرة" : "e.g., Luxury Roasted Hazelnut Chocolate"}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-indigo-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">{language === 'ar' ? 'الفئة والتصنيف *' : 'Category & Classification *'}</label>
                  <select 
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-indigo-500 font-bold"
                  >
                    <option value="شوكولاتة فاخرة">{language === 'ar' ? 'شوكولاتة فاخرة' : 'Premium Chocolates'}</option>
                    <option value="بوكسات هدايا">{language === 'ar' ? 'بوكسات هدايا' : 'Gift Boxes'}</option>
                    <option value="صواني ضيافة">{language === 'ar' ? 'صواني ضيافة' : 'Hospitality Trays'}</option>
                    <option value="مناسبات">{language === 'ar' ? 'مناسبات' : 'Occasions'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">{language === 'ar' ? 'السعر البيعي للعملاء (ر.س) *' : 'Retail Sale Price (SAR) *'}</label>
                  <input 
                    type="number"
                    required
                    min="1"
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder={language === 'ar' ? "مثال: 120" : "e.g., 120"}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-indigo-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">{language === 'ar' ? 'الحجم والمقاس' : 'Size & Weight'}</label>
                  <input 
                    type="text"
                    value={newProductForm.size}
                    onChange={(e) => setNewProductForm(prev => ({ ...prev, size: e.target.value }))}
                    placeholder={language === 'ar' ? "مثال: 24 قطعة (350 جرام)" : "e.g., 24 pieces (350g)"}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">{language === 'ar' ? 'رابط صورة واقعية' : 'Realistic Image URL'}</label>
                  <input 
                    type="text"
                    value={newProductForm.image}
                    onChange={(e) => setNewProductForm(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">{language === 'ar' ? 'وصف تسويقي قصير وجذاب *' : 'Short & Catchy Description *'}</label>
                <input 
                  type="text"
                  required
                  value={newProductForm.shortDescription}
                  onChange={(e) => setNewProductForm(prev => ({ ...prev, shortDescription: e.target.value }))}
                  placeholder={language === 'ar' ? "مثال: كاكاو داكن فخم محشي بالكراميل واللوز المقرمش" : "e.g., Luxury dark cocoa filled with caramel and crunchy almonds"}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-150 flex justify-end gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="px-4 py-2 rounded bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#71639e] text-white hover:bg-[#5E5186]"
                >
                  {language === 'ar' ? 'نشر وإتاحة الصنف الآن' : 'Publish & Make Available'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Toast Overlay notification popup */}
      {toast && (
        <div 
          className={cn(
            "fixed bottom-6 left-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded shadow-xl border animate-slide-up max-w-sm text-xs font-bold",
            toast.type === 'success' ? 'bg-slate-900 border-indigo-500/35 text-white' : 'bg-red-950 border-red-500 text-red-100'
          )}
        >
          {toast.type === 'success' ? (
            <Sparkles className="w-4 h-4 text-[#00A09D] animate-pulse" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-400" />
          )}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="text-white/40 hover:text-white shrink-0 mr-4">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
