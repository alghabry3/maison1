import React, { useState, useEffect } from 'react';
import { getUoms, saveUoms, UoM, getCategoryNameAr, DEFAULT_UOMS } from '../utils/uom';
import { Sliders, Plus, Trash2, CheckCircle2, ShieldAlert, Sparkles, Scale, RefreshCw, Layers, Calculator } from 'lucide-react';

interface OdooUomPanelProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
  language: 'ar' | 'en';
}

export function OdooUomPanel({ showToast, language }: OdooUomPanelProps) {
  const [uoms, setUoms] = useState<UoM[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  
  // New UoM Form State
  const [newUom, setNewUom] = useState<{
    nameAr: string;
    nameEn: string;
    category: 'weight' | 'count' | 'packaging';
    uomType: 'reference' | 'smaller' | 'bigger';
    ratio: number;
  }>({
    nameAr: '',
    nameEn: '',
    category: 'count',
    uomType: 'bigger',
    ratio: 1.0
  });

  // Sandbox Converter State
  const [sandboxAmount, setSandboxAmount] = useState<number>(1);
  const [sandboxFromUom, setSandboxFromUom] = useState<string>('uom_piece');
  const [sandboxToUom, setSandboxToUom] = useState<string>('uom_dozen');
  const [sandboxResult, setSandboxResult] = useState<number | null>(null);

  useEffect(() => {
    setUoms(getUoms());
  }, []);

  const handleSaveAll = (updated: UoM[]) => {
    setUoms(updated);
    saveUoms(updated);
  };

  const handleCreateUom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUom.nameAr.trim() || !newUom.nameEn.trim()) {
      showToast(language === 'ar' ? 'يرجى إدخال اسم الوحدة باللغتين' : 'Please input names in both languages', 'error');
      return;
    }
    if (newUom.ratio <= 0) {
      showToast(language === 'ar' ? 'يجب أن تكون النسبة أكبر من صفر' : 'Ratio must be greater than zero', 'error');
      return;
    }

    const newId = `uom_custom_${Date.now()}`;
    const customRecord: UoM = {
      id: newId,
      nameAr: newUom.nameAr,
      nameEn: newUom.nameEn,
      category: newUom.category,
      uomType: newUom.uomType,
      ratio: Number(newUom.ratio)
    };

    // If new UoM is reference, demote other references in same category to bigger with ratio 1.0
    let updatedUoms = [...uoms];
    if (newUom.uomType === 'reference') {
      updatedUoms = updatedUoms.map(u => 
        u.category === newUom.category && u.uomType === 'reference'
          ? { ...u, uomType: 'bigger', ratio: 1.0 }
          : u
      );
    }

    const finalUoms = [...updatedUoms, customRecord];
    handleSaveAll(finalUoms);
    setIsAdding(false);
    
    // Reset form
    setNewUom({
      nameAr: '',
      nameEn: '',
      category: 'count',
      uomType: 'bigger',
      ratio: 1.0
    });

    showToast(
      language === 'ar' 
        ? `تم إنشاء وحدة القياس "${customRecord.nameAr}" وتفعيلها بنجاح` 
        : `Unit of Measure "${customRecord.nameEn}" successfully added`,
      'success'
    );
  };

  const handleDeleteUom = (id: string) => {
    const target = uoms.find(u => u.id === id);
    if (!target) return;
    
    if (target.uomType === 'reference') {
      showToast(
        language === 'ar' 
          ? 'لا يمكن حذف الوحدة المرجعية للفئة. يرجى تعيين وحدة أخرى كمرجع أولاً.' 
          : 'Cannot delete the reference unit. Please set another unit as reference first.',
        'error'
      );
      return;
    }

    // Check if it is a default system unit
    const isDefault = DEFAULT_UOMS.some(du => du.id === id);
    if (isDefault) {
      showToast(
        language === 'ar' 
          ? 'الوحدات الافتراضية للنظام محمية ضد الحذف للحفاظ على الاستقرار.' 
          : 'System default units are write-protected for reliability.',
        'error'
      );
      return;
    }

    const filtered = uoms.filter(u => u.id !== id);
    handleSaveAll(filtered);
    showToast(
      language === 'ar' ? 'تم حذف وحدة القياس بنجاح' : 'Unit of measure removed successfully',
      'success'
    );
  };

  const handleResetDefaults = () => {
    if (window.confirm(language === 'ar' ? 'هل أنت متأكد من استعادة الوحدات الافتراضية للنظام؟' : 'Are you sure you want to restore system default units?')) {
      handleSaveAll(DEFAULT_UOMS);
      showToast(
        language === 'ar' ? 'تمت استعادة وحدات القياس الافتراضية' : 'Default Units of Measure restored',
        'success'
      );
    }
  };

  // Perform testing calculation
  useEffect(() => {
    const fromUnit = uoms.find(u => u.id === sandboxFromUom);
    const toUnit = uoms.find(u => u.id === sandboxToUom);

    if (!fromUnit || !toUnit) {
      setSandboxResult(null);
      return;
    }

    if (fromUnit.category !== toUnit.category) {
      setSandboxResult(null); // incompatible categories
      return;
    }

    // Convert from unit to reference quantity
    let refQty = sandboxAmount;
    if (fromUnit.uomType === 'smaller') {
      refQty = sandboxAmount / fromUnit.ratio;
    } else if (fromUnit.uomType === 'bigger') {
      refQty = sandboxAmount * fromUnit.ratio;
    }

    // Convert reference quantity to target unit quantity
    let finalQty = refQty;
    if (toUnit.uomType === 'smaller') {
      finalQty = refQty * toUnit.ratio;
    } else if (toUnit.uomType === 'bigger') {
      finalQty = refQty / toUnit.ratio;
    }

    setSandboxResult(finalQty);
  }, [sandboxAmount, sandboxFromUom, sandboxToUom, uoms]);

  // Group units by category
  const categories: ('weight' | 'count' | 'packaging')[] = ['count', 'weight', 'packaging'];

  return (
    <div className="space-y-6 max-w-6xl animate-fade-in text-xs leading-relaxed text-slate-800">
      
      {/* Intro Header */}
      <div className="bg-white p-5 rounded border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-teal-600" />
            <span>{language === 'ar' ? 'إدارة وتكوين وحدات القياس المتعددة (Odoo ERP Units of Measure)' : 'Odoo ERP Units of Measure'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'ar' 
              ? 'تهيئة فئات المقاييس وتحويلاتها للمخزون والبيع وفقاً لضوابط أودو ERP للشركات والمصانع الشريكة.' 
              : 'Configure UoM categories and conversions for inventory and sales under Odoo ERP corporate guidelines.'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-3 py-2 rounded bg-teal-600 text-white font-bold hover:bg-teal-700 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'ar' ? 'إنشاء وحدة قياس جديدة' : 'Create New UoM'}</span>
          </button>
          <button
            onClick={handleResetDefaults}
            className="px-3 py-2 rounded bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 font-bold flex items-center gap-1 transition-all"
            title={language === 'ar' ? 'استعادة الافتراضيات' : 'Restore Defaults'}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'استعادة الافتراضي' : 'Restore Defaults'}</span>
          </button>
        </div>
      </div>

      {/* Sandbox Live Converter Tool */}
      <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 p-5 rounded border border-teal-200 shadow-xs">
        <div className="flex items-center gap-2 mb-3.5">
          <Calculator className="w-5 h-5 text-teal-700" />
          <h4 className="text-sm font-bold text-teal-900">{language === 'ar' ? 'محاكي تحويل المقاييس الذكي (Odoo ERP Sandbox)' : 'Smart Metric Converter Simulator (Odoo ERP Sandbox)'}</h4>
        </div>
        <p className="text-xs text-teal-800 mb-4">
          {language === 'ar' 
            ? 'أداة لاختبار معادلات تحويل الكميات للطلبات والتحقق من توافق الفئات القياسية والنسب الحسابية تلقائياً.' 
            : 'A sandbox tool to test quantity conversions and automatically verify standard categories and conversion ratios.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-white p-4 rounded-lg border border-teal-200/50 shadow-inner">
          {/* Amount Input */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">{language === 'ar' ? 'الكمية المدخلة' : 'Input Quantity'}</label>
            <input
              type="number"
              min="0"
              step="any"
              value={sandboxAmount}
              onChange={(e) => setSandboxAmount(Math.max(0, Number(e.target.value)))}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs text-center font-bold font-mono focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* From Unit */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">{language === 'ar' ? 'من وحدة' : 'From Unit'}</label>
            <select
              value={sandboxFromUom}
              onChange={(e) => setSandboxFromUom(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none focus:border-teal-500"
            >
              {uoms.map(u => (
                <option key={u.id} value={u.id}>
                  {language === 'ar' ? u.nameAr : u.nameEn} ({language === 'ar' ? getCategoryNameAr(u.category) : (u.category === 'count' ? 'Count' : u.category === 'weight' ? 'Weight' : 'Packaging')})
                </option>
              ))}
            </select>
          </div>

          {/* To Unit */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">{language === 'ar' ? 'إلى وحدة' : 'To Unit'}</label>
            <select
              value={sandboxToUom}
              onChange={(e) => setSandboxToUom(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold focus:outline-none focus:border-teal-500"
            >
              {uoms.map(u => (
                <option key={u.id} value={u.id}>
                  {language === 'ar' ? u.nameAr : u.nameEn} ({language === 'ar' ? getCategoryNameAr(u.category) : (u.category === 'count' ? 'Count' : u.category === 'weight' ? 'Weight' : 'Packaging')})
                </option>
              ))}
            </select>
          </div>

          {/* Calculations Result */}
          <div className="bg-teal-50 border border-teal-200/80 p-2.5 rounded text-center">
            <span className="block text-[9px] text-teal-700 uppercase font-bold">{language === 'ar' ? 'النتيجة المعادلة بأودو' : 'Odoo Equivalent Qty'}</span>
            {sandboxResult !== null ? (
              <span className="text-sm font-serif font-bold text-teal-800 font-mono">
                {sandboxResult.toFixed(4)} {language === 'ar' ? uoms.find(u => u.id === sandboxToUom)?.nameAr : uoms.find(u => u.id === sandboxToUom)?.nameEn}
              </span>
            ) : (
              <span className="text-xs text-red-600 font-bold flex items-center justify-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'فئات غير متوافقة! ❌' : 'Incompatible Categories! ❌'}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Add New Unit Form */}
      {isAdding && (
        <form onSubmit={handleCreateUom} className="bg-white p-6 rounded border border-slate-300 shadow-md space-y-4 animate-scale-up">
          <h4 className="text-xs font-bold text-teal-800 uppercase border-b border-slate-150 pb-2 mb-4 flex items-center gap-1.5">
            <Scale className="w-4.5 h-4.5" />
            <span>{language === 'ar' ? 'تكوين وتعريف وحدة قياس جديدة بالسياسات' : 'Configure New Unit of Measure'}</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">{language === 'ar' ? 'الاسم بالعربية *' : 'Name in Arabic *'}</label>
              <input
                type="text"
                required
                value={newUom.nameAr}
                onChange={(e) => setNewUom(prev => ({ ...prev, nameAr: e.target.value }))}
                placeholder={language === 'ar' ? 'مثال: درزن كبير (12 علبة)' : 'e.g., Dozen (12 pcs)'}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-teal-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">{language === 'ar' ? 'الاسم بالإنجليزية *' : 'Name in English *'}</label>
              <input
                type="text"
                required
                value={newUom.nameEn}
                onChange={(e) => setNewUom(prev => ({ ...prev, nameEn: e.target.value }))}
                placeholder="e.g., Large Dozen (12 boxes)"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-teal-500 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">{language === 'ar' ? 'الفئة القياسية *' : 'Standard Category *'}</label>
              <select
                value={newUom.category}
                onChange={(e) => setNewUom(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-teal-500 font-bold"
              >
                <option value="count">{language === 'ar' ? 'العدد / الحبات (Count)' : 'Count / Pieces (Count)'}</option>
                <option value="weight">{language === 'ar' ? 'الأوزان / الكتلة (Weight)' : 'Weight / Mass (Weight)'}</option>
                <option value="packaging">{language === 'ar' ? 'العلب وتعبئة الطرود (Packaging)' : 'Boxes & Packaging'}</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">{language === 'ar' ? 'نوع المعامل مقارنة بالمرجع *' : 'Unit Type Compared to Reference *'}</label>
              <select
                value={newUom.uomType}
                onChange={(e) => setNewUom(prev => ({ ...prev, uomType: e.target.value as any }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-teal-500 font-bold"
              >
                <option value="bigger">{language === 'ar' ? 'أكبر من الوحدة المرجعية (Bigger)' : 'Bigger than Reference (Bigger)'}</option>
                <option value="smaller">{language === 'ar' ? 'أصغر من الوحدة المرجعية (Smaller)' : 'Smaller than Reference (Smaller)'}</option>
                <option value="reference">{language === 'ar' ? 'تعيين كالوحدة المرجعية للفئة (Reference)' : 'Set as Reference Unit (Reference)'}</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">{language === 'ar' ? 'معدل التحويل (Ratio) *' : 'Ratio *'}</label>
              <input
                type="number"
                required
                min="0.0001"
                step="any"
                value={newUom.ratio}
                onChange={(e) => setNewUom(prev => ({ ...prev, ratio: Number(e.target.value) }))}
                disabled={newUom.uomType === 'reference'}
                placeholder={language === 'ar' ? 'مثال: 12' : 'e.g., 12'}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-teal-500 font-mono font-bold text-center"
              />
            </div>
          </div>

          {newUom.uomType !== 'reference' && (
            <div className="bg-amber-50 text-amber-800 p-2.5 rounded border border-amber-200 text-[11px]">
              {newUom.uomType === 'bigger' ? (
                <span>
                  {language === 'ar' 
                    ? <>⚠️ تعني نسبة <strong>{newUom.ratio}</strong> أن: 1 من الوحدة الجديدة هذه يساوي <strong>{newUom.ratio}</strong> من الوحدة المرجعية الأساسية للمخزون.</>
                    : <>⚠️ A ratio of <strong>{newUom.ratio}</strong> means: 1 of this new unit equals <strong>{newUom.ratio}</strong> reference units.</>}
                </span>
              ) : (
                <span>
                  {language === 'ar'
                    ? <>⚠️ تعني نسبة <strong>{newUom.ratio}</strong> أن: 1 من الوحدة المرجعية الأساسية للمخزون يساوي <strong>{newUom.ratio}</strong> من هذه الوحدة الجديدة.</>
                    : <>⚠️ A ratio of <strong>{newUom.ratio}</strong> means: 1 reference unit equals <strong>{newUom.ratio}</strong> of this new unit.</>}
                </span>
              )}
            </div>
          )}

          <div className="pt-2 border-t border-slate-150 flex justify-end gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700"
            >
              {language === 'ar' ? 'حفظ وتفعيل الوحدة' : 'Save & Activate Unit'}
            </button>
          </div>
        </form>
      )}

      {/* Categories Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const catUnits = uoms.filter(u => u.category === cat);
          const refUnit = catUnits.find(u => u.uomType === 'reference');
          
          return (
            <div key={cat} className="bg-white rounded border border-slate-200 shadow-xs overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-slate-500" />
                  {language === 'ar' ? getCategoryNameAr(cat) : (cat === 'count' ? 'Count' : cat === 'weight' ? 'Weight' : 'Packaging')}
                </span>
                {refUnit && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                    {language === 'ar' ? `المرجع: ${refUnit.nameAr}` : `Reference: ${refUnit.nameEn}`}
                  </span>
                )}
              </div>

              <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto">
                {catUnits.map((u) => (
                  <div key={u.id} className="p-3.5 flex justify-between items-start hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-xs">
                          {language === 'ar' ? u.nameAr : u.nameEn}
                        </span>
                        {u.uomType === 'reference' ? (
                          <span className="text-[8px] bg-emerald-100 text-emerald-800 font-sans px-1.5 py-0.2 rounded">
                            Reference
                          </span>
                        ) : u.uomType === 'bigger' ? (
                          <span className="text-[8px] bg-blue-50 text-blue-800 font-sans px-1.5 py-0.2 rounded">
                            Bigger
                          </span>
                        ) : (
                          <span className="text-[8px] bg-amber-50 text-amber-800 font-sans px-1.5 py-0.2 rounded">
                            Smaller
                          </span>
                        )}
                      </div>
                      
                      <div className="text-[10px] text-slate-400 font-mono">
                        ID: {u.id} • Ratio: {u.ratio}
                      </div>

                      {u.uomType !== 'reference' && refUnit && (
                        <p className="text-[11px] text-slate-500 italic mt-1">
                          {language === 'ar'
                            ? (u.uomType === 'bigger' 
                              ? `1 ${u.nameAr} = ${u.ratio} ${refUnit.nameAr}`
                              : `1 ${refUnit.nameAr} = ${u.ratio} ${u.nameAr}`)
                            : (u.uomType === 'bigger'
                              ? `1 ${u.nameEn} = ${u.ratio} ${refUnit.nameEn}`
                              : `1 ${refUnit.nameEn} = ${u.ratio} ${u.nameEn}`)
                          }
                        </p>
                      )}
                    </div>

                    <div className="flex items-center">
                      {!DEFAULT_UOMS.some(du => du.id === u.id) ? (
                        <button
                          onClick={() => handleDeleteUom(u.id)}
                          className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100 active:scale-95 transition-all"
                          title={language === 'ar' ? 'حذف هذه الوحدة المخصصة' : 'Delete custom unit'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-[9px] text-slate-400 font-mono italic px-1 bg-slate-100 rounded">
                          System
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
