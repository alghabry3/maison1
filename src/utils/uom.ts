export interface UoM {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'weight' | 'count' | 'packaging';
  uomType: 'reference' | 'smaller' | 'bigger';
  ratio: number; // Ratio relative to reference unit
}

export const DEFAULT_UOMS: UoM[] = [
  // Count / Units (Reference is 'حبة')
  { id: 'uom_piece', nameAr: 'حبة', nameEn: 'Piece', category: 'count', uomType: 'reference', ratio: 1.0 },
  { id: 'uom_dozen', nameAr: 'درزن (12 حبة)', nameEn: 'Dozen (12 pcs)', category: 'count', uomType: 'bigger', ratio: 12.0 },
  { id: 'uom_box12', nameAr: 'علبة (12 حبة)', nameEn: 'Box of 12', category: 'count', uomType: 'bigger', ratio: 12.0 },
  { id: 'uom_box24', nameAr: 'علبة (24 حبة)', nameEn: 'Box of 24', category: 'count', uomType: 'bigger', ratio: 24.0 },
  
  // Weight (Reference is 'كيلو جرام')
  { id: 'uom_kg', nameAr: 'كيلو جرام (كجم)', nameEn: 'Kilogram (Kg)', category: 'weight', uomType: 'reference', ratio: 1.0 },
  { id: 'uom_g', nameAr: 'جرام (ج)', nameEn: 'Gram (g)', category: 'weight', uomType: 'smaller', ratio: 1000.0 },
  { id: 'uom_250g', nameAr: 'ربع كيلو (250 جرام)', nameEn: 'Quarter Kg (250g)', category: 'weight', uomType: 'smaller', ratio: 4.0 },
  { id: 'uom_500g', nameAr: 'نصف كيلو (500 جرام)', nameEn: 'Half Kg (500g)', category: 'weight', uomType: 'smaller', ratio: 2.0 },
  
  // Packaging (Reference is 'علبة تعبئة')
  { id: 'uom_box', nameAr: 'علبة كرتون', nameEn: 'Cardboard Box', category: 'packaging', uomType: 'reference', ratio: 1.0 },
  { id: 'uom_carton6', nameAr: 'كرتون (6 علب)', nameEn: 'Carton of 6', category: 'packaging', uomType: 'bigger', ratio: 6.0 },
  { id: 'uom_carton12', nameAr: 'كرتون (12 علبة)', nameEn: 'Carton of 12', category: 'packaging', uomType: 'bigger', ratio: 12.0 },
];

export function getUoms(): UoM[] {
  const saved = localStorage.getItem('odoo_custom_uoms');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return DEFAULT_UOMS;
    }
  }
  return DEFAULT_UOMS;
}

export function saveUoms(uoms: UoM[]) {
  localStorage.setItem('odoo_custom_uoms', JSON.stringify(uoms));
}

export function getPriceInUom(basePrice: number, defaultUomId: string, targetUomId: string, uomsList?: UoM[]): number {
  const list = uomsList || getUoms();
  const sourceUom = list.find(u => u.id === defaultUomId);
  const targetUom = list.find(u => u.id === targetUomId);
  
  if (!sourceUom || !targetUom) return basePrice;
  if (sourceUom.category !== targetUom.category) {
    // Odoo strict rule: cannot convert between different categories!
    console.error(`Odoo Policy Violation: Cannot convert between ${sourceUom.category} and ${targetUom.category}`);
    return basePrice;
  }
  
  // 1. Convert base price of source UoM to reference unit price
  let referencePrice = basePrice;
  if (sourceUom.uomType === 'smaller') {
    referencePrice = basePrice * sourceUom.ratio;
  } else if (sourceUom.uomType === 'bigger') {
    referencePrice = basePrice / sourceUom.ratio;
  }
  
  // 2. Convert reference unit price to target UoM unit price
  let targetPrice = referencePrice;
  if (targetUom.uomType === 'smaller') {
    targetPrice = referencePrice / targetUom.ratio;
  } else if (targetUom.uomType === 'bigger') {
    targetPrice = referencePrice * targetUom.ratio;
  }
  
  return targetPrice;
}

export function getCategoryNameAr(category: string): string {
  switch (category) {
    case 'weight': return 'الوزن (Weight)';
    case 'count': return 'العدد (Units/Count)';
    case 'packaging': return 'العلب والتعبئة (Packaging)';
    default: return category;
  }
}
