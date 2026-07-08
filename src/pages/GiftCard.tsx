import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Mail, Gift, CreditCard, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';

export function GiftCard() {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  
  const [amount, setAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  
  const [isAdded, setIsAdded] = useState(false);

  const predefinedAmounts = [100, 250, 500, 1000];

  const handleAmountSelect = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmount(val);
    if (!isNaN(Number(val)) && Number(val) > 0) {
      setAmount(Number(val));
    }
  };

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail || !recipientName || amount <= 0) return;
    
    // In a real app we would add a specific gift card item to the cart
    // For now, we simulate adding a product
    const giftCardProduct = {
      id: `gift-card-${Date.now()}`,
      name: language === 'ar' ? 'بطاقة إهداء رقمية' : 'Digital Gift Card',
      price: amount,
      category: 'gift-card',
      image: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?q=80&w=1000&auto=format&fit=crop',
      inStock: true
    };
    
    addToCart(giftCardProduct as any);
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3000);
    
    // Reset form
    setRecipientEmail('');
    setRecipientName('');
    setSenderName('');
    setMessage('');
  };

  return (
    <div className="bg-brand-ivory min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-12">
          <Gift className="w-12 h-12 text-brand-gold mx-auto mb-4" />
          <h1 className="font-serif text-4xl font-bold text-brand-black mb-4">
            {language === 'ar' ? 'بطاقات الإهداء الرقمية' : 'Digital Gift Cards'}
          </h1>
          <p className="text-brand-gray max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'أرسل رصيد متجر لمن تحب عبر البريد الإلكتروني. الهدية المثالية التي تتيح لهم حرية اختيار نكهاتهم المفضلة من تشكيلة الشوكولاتة الفاخرة.'
              : 'Send store credit to your loved ones via email. The perfect gift that gives them the freedom to choose their favorite flavors from our premium chocolate collection.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-sm shadow-sm border border-brand-brown/10">
          
          {/* Left Column: Preview */}
          <div className="flex flex-col gap-6">
            <h3 className="font-serif text-xl font-bold text-brand-black">
              {language === 'ar' ? 'معاينة البطاقة' : 'Card Preview'}
            </h3>
            
            <div className="relative aspect-[1.6/1] bg-brand-black rounded-xl overflow-hidden shadow-2xl p-8 flex flex-col justify-between text-brand-ivory">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
              
              <div className="relative z-10 flex justify-between items-start">
                <span className="font-serif text-2xl font-bold tracking-[0.2em] text-brand-gold">MAISON H</span>
                <span className="text-sm tracking-widest opacity-80">{language === 'ar' ? 'بطاقة إهداء' : 'GIFT CARD'}</span>
              </div>
              
              <div className="relative z-10">
                <div className="text-4xl font-bold text-white mb-1">
                  {amount} {language === 'ar' ? 'ر.س' : 'SAR'}
                </div>
                <div className="text-sm opacity-80">
                  {recipientName ? (language === 'ar' ? `إلى: ${recipientName}` : `To: ${recipientName}`) : (language === 'ar' ? 'اسم المستلم' : 'Recipient Name')}
                </div>
              </div>
            </div>

            <div className="bg-brand-light-gray/20 p-6 rounded-sm border border-brand-brown/10">
              <h4 className="font-bold mb-2 text-brand-black flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-gold" />
                {language === 'ar' ? 'كيف تعمل؟' : 'How it works?'}
              </h4>
              <ul className="text-sm text-brand-gray space-y-2 list-disc list-inside">
                <li>{language === 'ar' ? 'اختر قيمة البطاقة أو أدخل مبلغاً مخصصاً.' : 'Choose a card value or enter a custom amount.'}</li>
                <li>{language === 'ar' ? 'أدخل تفاصيل المستلم والرسالة الشخصية.' : 'Enter the recipient details and a personal message.'}</li>
                <li>{language === 'ar' ? 'سيتم إرسال البطاقة فوراً عبر البريد الإلكتروني بعد إتمام الدفع.' : 'The card will be emailed instantly after payment is completed.'}</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Form */}
          <form onSubmit={handleAddToCart} className="flex flex-col gap-6">
            
            <div>
              <label className="block text-sm font-bold text-brand-black mb-3">
                {language === 'ar' ? 'اختر القيمة' : 'Select Amount'}
              </label>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {predefinedAmounts.map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleAmountSelect(val)}
                    className={cn(
                      "py-3 border rounded-sm font-medium transition-colors text-center",
                      amount === val && customAmount === ''
                        ? "bg-brand-brown border-brand-brown text-white"
                        : "border-brand-brown/20 text-brand-gray hover:border-brand-brown"
                    )}
                  >
                    {val} {language === 'ar' ? 'ر.س' : 'SAR'}
                  </button>
                ))}
              </div>
              <div className="relative">
                <input
                  type="number"
                  placeholder={language === 'ar' ? 'مبلغ آخر...' : 'Other amount...'}
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  className="w-full px-4 py-3 border border-brand-brown/20 rounded-sm focus:outline-none focus:border-brand-brown transition-colors"
                  min="50"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-brand-black mb-1">
                  {language === 'ar' ? 'اسم المستلم' : 'Recipient Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-4 py-3 border border-brand-brown/20 rounded-sm focus:outline-none focus:border-brand-brown"
                  placeholder={language === 'ar' ? 'اسم من تحب...' : 'Their name...'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-brand-black mb-1">
                  {language === 'ar' ? 'البريد الإلكتروني للمستلم' : 'Recipient Email'} *
                </label>
                <input
                  type="email"
                  required
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-brand-brown/20 rounded-sm focus:outline-none focus:border-brand-brown text-left"
                  dir="ltr"
                  placeholder="recipient@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-black mb-1">
                  {language === 'ar' ? 'اسم المرسل (اختياري)' : 'Sender Name (Optional)'}
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-4 py-3 border border-brand-brown/20 rounded-sm focus:outline-none focus:border-brand-brown"
                  placeholder={language === 'ar' ? 'اسمك...' : 'Your name...'}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-black mb-1">
                  {language === 'ar' ? 'رسالة شخصية (اختياري)' : 'Personal Message (Optional)'}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-brand-brown/20 rounded-sm focus:outline-none focus:border-brand-brown resize-none"
                  placeholder={language === 'ar' ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                ></textarea>
              </div>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              className="w-full mt-4"
              disabled={isAdded}
            >
              {isAdded ? (
                <span className="flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" />
                  {language === 'ar' ? 'تمت الإضافة بنجاح' : 'Added to Cart'}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  {language === 'ar' ? `شراء بقيمة ${amount} ر.س` : `Purchase for ${amount} SAR`}
                </span>
              )}
            </Button>
            
          </form>

        </div>
      </div>
    </div>
  );
}
