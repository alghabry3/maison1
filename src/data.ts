export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  shortDescription: string;
  shortDescriptionEn?: string;
  price: number;
  image: string;
  category: string;
  tags: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  inStock: boolean;
  ingredients?: string;
  size?: string;
  nutritionalValues?: {
    calories: string;
    fat: string;
    carbs: string;
    protein: string;
  };
  allergens?: string[];
  uomCategory?: 'weight' | 'count' | 'packaging';
  defaultUom?: string;
  cocoaPercent?: number;
  origin?: string;
  shelfLife?: string;
  pairing?: string;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "بوكس الشوكولاتة الكلاسيكي",
    description: "تشكيلة فاخرة من الشوكولاتة البلجيكية الداكنة وبالحليب، تم اختيارها بعناية لتكون الهدية المثالية. يحتوي البوكس على 24 قطعة منوعة محشوة بالكراميل المملح، البرالين الغني، والجاناش الناعم لتأخذك في رحلة تذوق لا تنسى.",
    shortDescription: "بوكس 24 قطعة منوعة من الشوكولاتة البلجيكية",
    price: 250,
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "بوكسات هدايا",
    tags: ["هدايا", "كلاسيك"],
    isBestSeller: true,
    inStock: true,
    ingredients: "كاكاو بلجيكي، زبدة الكاكاو، سكر، حليب كامل الدسم، كراميل، فانيليا",
    size: "24 قطعة (350 جرام)",
    nutritionalValues: { calories: "520 kcal", fat: "32g", carbs: "54g", protein: "6g" },
    allergens: ["حليب", "صويا", "مكسرات (قد يحتوي على آثار)"],
    uomCategory: "count",
    defaultUom: "uom_piece",
    cocoaPercent: 54,
    origin: "بلجيكا (بإشراف خبراء بلجيكيين)",
    shelfLife: "6 أشهر في درجة حرارة باردة",
    pairing: "القهوة العربية الفاخرة أو الكورتادو أو إسبريسو خفيف"
  },
  {
    id: "p2",
    name: "بوكس ترافل ميزون",
    description: "مجموعة من قطع الترافل الفاخرة المصنوعة يدوياً، المغطاة ببودرة الكاكاو البلجيكية والمكسرات المحمصة. تذوب في الفم لتجربة غنية تدمج بين مرارة الكاكاو وحلاوة الحشوة الداخلية.",
    shortDescription: "ترافل شوكولاتة فاخر محشو بالجاناش الغني",
    price: 185,
    image: "https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "شوكولاتة فاخرة",
    tags: ["ترافل"],
    isNew: true,
    inStock: true,
    ingredients: "كاكاو داكن 70%، كريمة طازجة، بندق محمص، بودرة الكاكاو",
    size: "16 قطعة (200 جرام)",
    nutritionalValues: { calories: "580 kcal", fat: "45g", carbs: "35g", protein: "8g" },
    allergens: ["حليب", "بندق"],
    uomCategory: "count",
    defaultUom: "uom_piece",
    cocoaPercent: 70,
    origin: "سويسرا (مصنوعة يدوياً)",
    shelfLife: "3 أشهر لتجربة التذوق الأمثل",
    pairing: "الإسبريسو المركز، أو الشاي الأسود الفاخر (Earl Grey)"
  },
  {
    id: "p3",
    name: "بوكس المناسبات الأبيض الذهبي",
    description: "صمم خصيصاً للمناسبات السعيدة ولحظات الاحتفال الكبرى. يحتوي على 48 قطعة شوكولاتة مع تغليف ذهبي وأبيض فاخر، خيار مثالي للزواجات والأعياد لتقديم ضيافة تليق بك وبضيوفك.",
    shortDescription: "بوكس هدايا فاخر 48 قطعة للمناسبات",
    price: 420,
    image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "مناسبات",
    tags: ["زواج", "هدايا"],
    inStock: true,
    ingredients: "تشكيلة منوعة من الكاكاو البلجيكي، مكسرات، كراميل، فواكه مجففة",
    size: "48 قطعة (800 جرام)",
    nutritionalValues: { calories: "540 kcal", fat: "35g", carbs: "50g", protein: "7g" },
    allergens: ["حليب", "صويا", "مكسرات متنوعة"],
    uomCategory: "count",
    defaultUom: "uom_piece",
    cocoaPercent: 45,
    origin: "بلجيكا وفرنسا",
    shelfLife: "6 أشهر في علبتها المغلقة محكمة الإغلاق",
    pairing: "القهوة العربية الأصيلة بالهيل والزعفران"
  },
  {
    id: "p4",
    name: "ألواح الشوكولاتة الداكنة بالمكسرات",
    description: "ألواح من الشوكولاتة الداكنة 70% الفاخرة، مزينة بتشكيلة من المكسرات المحمصة المقرمشة والفواكه المجففة اللذيذة. توازن مثالي بين النكهة العميقة للشوكولاتة وقرمشة المكسرات.",
    shortDescription: "شوكولاتة داكنة بالمكسرات والفواكه",
    price: 120,
    image: "https://images.unsplash.com/photo-1548135898-35619b0cece9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "شوكولاتة فاخرة",
    tags: ["دارك", "مكسرات"],
    inStock: true,
    ingredients: "كاكاو داكن 70%، لوز محمص، فستق، توت بري مجفف، زبدة الكاكاو",
    size: "3 ألواح (250 جرام)",
    nutritionalValues: { calories: "560 kcal", fat: "40g", carbs: "42g", protein: "9g" },
    allergens: ["لوز", "فستق"],
    uomCategory: "weight",
    defaultUom: "uom_kg",
    cocoaPercent: 70,
    origin: "جزيرة مدغشقر الاستوائية",
    shelfLife: "8 أشهر في مكان جاف ومعتم",
    pairing: "القهوة السوداء المقطرة V60 أو الشاي الأخضر بالياسمين"
  },
  {
    id: "p5",
    name: "صينية أكريليك فاخرة",
    description: "صينية أكريليك راقية مصممة بدقة لتبرز جمال الشوكولاتة التي بداخلها. تحتوي على تشكيلة مذهلة من حبات الشوكولاتة المتنوعة لتناسب أرقى مجالس الضيافة والمناسبات الفخمة.",
    shortDescription: "صينية ضيافة أكريليك 1 كجم منوعة",
    price: 850,
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "صواني ضيافة",
    tags: ["ضيافة", "VIP"],
    isBestSeller: true,
    inStock: true,
    ingredients: "شوكولاتة فاخرة، مكسرات متنوعة، كراميل، قهوة، توت، حشوات برالين",
    size: "صينية أكريليك (1 كيلو جرام)",
    nutritionalValues: { calories: "530 kcal", fat: "34g", carbs: "52g", protein: "7g" },
    allergens: ["حليب", "صويا", "مكسرات متنوعة", "قمح (في بعض الحشوات)"],
    uomCategory: "weight",
    defaultUom: "uom_kg",
    cocoaPercent: 55,
    origin: "بلجيكا وسويسرا",
    shelfLife: "4 أشهر في حرارة الغرفة المكيفة",
    pairing: "شاي إيرل غراي الفاخر أو القهوة المقطرة"
  },
  {
    id: "p6",
    name: "صينية خشبية كلاسيكية",
    description: "صينية خشبية أنيقة تضفي لمسة من الدفء والأصالة على تقديم الشوكولاتة. معبأة بتشكيلة منتقاة من قطع الشوكولاتة الفاخرة التي ترضي جميع الأذواق.",
    shortDescription: "صينية ضيافة خشبية بقطع منوعة",
    price: 950,
    image: "https://images.unsplash.com/photo-1599598425947-3300262955fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "صواني ضيافة",
    tags: ["ضيافة", "خشب"],
    inStock: true,
    ingredients: "شوكولاتة فاخرة، بندق، فستق، كريمة الكراميل",
    size: "صينية خشبية (1.2 كيلو جرام)",
    nutritionalValues: { calories: "550 kcal", fat: "36g", carbs: "50g", protein: "8g" },
    allergens: ["حليب", "صويا", "بندق", "فستق"],
    uomCategory: "weight",
    defaultUom: "uom_kg",
    cocoaPercent: 50,
    origin: "سويسرا وهولندا",
    shelfLife: "4 أشهر",
    pairing: "شاي الكرك الساخن أو القهوة التركية الثقيلة"
  },
  {
    id: "p7",
    name: "بوكس هدايا الشركات (مخصص)",
    description: "بوكس أنيق يحتوي على 12 قطعة، مصمم خصيصاً لهدايا الشركات الفاخرة، مع إمكانية طباعة شعار الشركة على التغليف الخارجي أو حتى حفر الشعار على قطع الشوكولاتة نفسها لتعزيز هوية علامتك التجارية.",
    shortDescription: "هدايا شركات قابلة للتخصيص",
    price: 150,
    image: "https://images.unsplash.com/photo-1579738012674-32e602717904?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "هدايا شركات",
    tags: ["شركات", "تخصيص"],
    inStock: true,
    ingredients: "شوكولاتة بلجيكية، سكر، زبدة كاكاو، حشوات منوعة، فانيليا",
    size: "12 قطعة (180 جرام)",
    nutritionalValues: { calories: "510 kcal", fat: "30g", carbs: "55g", protein: "6g" },
    allergens: ["حليب", "صويا"],
    uomCategory: "count",
    defaultUom: "uom_piece",
    cocoaPercent: 54,
    origin: "بلجيكا",
    shelfLife: "6 أشهر",
    pairing: "قهوة إسبريسو أو قهوة فرنسية بالبندق"
  },
  {
    id: "p8",
    name: "مجموعة السجنتشر (قهوة وهيل)",
    description: "الإصدار الحصري والأكثر تميزاً لدينا. يتضمن مزيجاً من الشوكولاتة الداكنة بنسبة 85٪، محشوة بالقهوة العربية والهيل، لتجربة تجمع بين أصالة الشرق وفخامة الشوكولاتة الغربية.",
    shortDescription: "إصدار حصري بنكهات شرقية (هيل وقهوة)",
    price: 320,
    image: "https://images.unsplash.com/photo-1613941450005-5fb901f46d9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "شوكولاتة فاخرة",
    tags: ["حصري", "سجنتشر"],
    isNew: true,
    inStock: true,
    ingredients: "كاكاو داكن 85%، قهوة عربية أصيلة، مستخلص الهيل، زبدة الكاكاو",
    size: "20 قطعة (250 جرام)",
    nutritionalValues: { calories: "590 kcal", fat: "48g", carbs: "25g", protein: "10g" },
    allergens: [],
    uomCategory: "count",
    defaultUom: "uom_piece",
    cocoaPercent: 85,
    origin: "الإكوادور (أرقى مزارع الكاكاو الاستوائي)",
    shelfLife: "6 أشهر",
    pairing: "القهوة العربية الأصيلة بالهيل والزعفران، أو شاي النعناع"
  },
  {
    id: "p9",
    name: "حبات الكراميل المملح الذهبية",
    description: "تشكيلة من الشوكولاتة بالحليب والشوكولاتة الداكنة المحشوة بصوص الكراميل المملح الناعم والمحضر يدوياً. التوازن المثالي بين الملوحة الخفيفة والحلاوة الغنية.",
    shortDescription: "شوكولاتة بحشوة الكراميل المملح الفاخر",
    price: 195,
    image: "https://images.unsplash.com/photo-1587635235882-628d09aa1e6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "شوكولاتة فاخرة",
    tags: ["كراميل", "حلو_ومالح"],
    isBestSeller: true,
    inStock: true,
    ingredients: "شوكولاتة بالحليب، شوكولاتة داكنة، كراميل فرنسي مملح، ملح بحري",
    size: "18 قطعة (220 جرام)",
    nutritionalValues: { calories: "500 kcal", fat: "28g", carbs: "60g", protein: "5g" },
    allergens: ["حليب", "صويا"],
    uomCategory: "count",
    defaultUom: "uom_piece",
    cocoaPercent: 35,
    origin: "فرنسا (بريتاني)",
    shelfLife: "4 أشهر",
    pairing: "اللاتيه الساخن، قهوة فلات وايت، أو إسبريسو ماكياتو"
  },
  {
    id: "p10",
    name: "حبوب القهوة المغطاة",
    description: "حبوب قهوة أرابيكا محمصة بعناية ومغطاة بطبقات من الشوكولاتة البلجيكية الداكنة. مثالية لمحبي القهوة والشوكولاتة، وتقدم دفعة من الطاقة مع طعم لا يقاوم.",
    shortDescription: "حبوب بن أرابيكا مغطاة بالشوكولاتة",
    price: 95,
    image: "https://images.unsplash.com/photo-1542843997-6a2d67ec1be8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "شوكولاتة فاخرة",
    tags: ["قهوة", "سناك"],
    inStock: true,
    ingredients: "حبوب بن أرابيكا، شوكولاتة داكنة 60%، بودرة كاكاو للتغليف",
    size: "عبوة (150 جرام)",
    nutritionalValues: { calories: "480 kcal", fat: "35g", carbs: "45g", protein: "8g" },
    allergens: ["صويا (من الشوكولاتة)"],
    uomCategory: "weight",
    defaultUom: "uom_kg",
    cocoaPercent: 60,
    origin: "كولومبيا (البن) والبلجيك (الشوكولاتة)",
    shelfLife: "8 أشهر",
    pairing: "كوب دافئ من الحليب الطازج أو الكابوتشينو"
  },
  {
    id: "p11",
    name: "تمور محشية مكسوة بالشوكولاتة",
    description: "تمور سعودية فاخرة محشوة بالمكسرات ومغطاة بطبقة من الشوكولاتة البلجيكية الغنية. خيار مميز يجمع بين الأصالة والمذاق العصري.",
    shortDescription: "تمور فاخرة محشوة ومغطاة بالشوكولاتة",
    price: 140,
    image: "https://images.unsplash.com/photo-1557925923-33b251dc32d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "مناسبات",
    tags: ["تمر", "ضيافة"],
    inStock: true,
    ingredients: "تمور فاخرة، لوز، جوز، شوكولاتة بلجيكية",
    size: "24 حبة",
    nutritionalValues: { calories: "450 kcal", fat: "25g", carbs: "60g", protein: "4g" },
    allergens: ["لوز", "جوز", "حليب"],
    uomCategory: "count",
    defaultUom: "uom_piece",
    cocoaPercent: 40,
    origin: "المملكة العربية السعودية (تمور الخلاص)",
    shelfLife: "6 أشهر",
    pairing: "القهوة السعودية بالهيل والقرنفل أو الشاي الأحمر بالنعناع"
  },
  {
    id: "p12",
    name: "بوكس التغليف الراقي",
    description: "بوكس هدايا أنيق جداً مزين بشريطة فاخرة، يحتوي على أشهى تشكيلة من الشوكولاتة المتنوعة ليعكس ذوقك الرفيع في الإهداء.",
    shortDescription: "بوكس هدايا فاخر بالشريطة",
    price: 210,
    image: "https://images.unsplash.com/photo-1604514628550-37477afdf4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "بوكسات هدايا",
    tags: ["هدايا", "فاخر"],
    inStock: true,
    ingredients: "شوكولاتة متنوعة، مكسرات، كراميل",
    size: "20 قطعة (280 جرام)",
    nutritionalValues: { calories: "520 kcal", fat: "30g", carbs: "52g", protein: "6g" },
    allergens: ["حليب", "صويا", "مكسرات"],
    uomCategory: "count",
    defaultUom: "uom_piece",
    cocoaPercent: 50,
    origin: "بلجيكا",
    shelfLife: "6 أشهر",
    pairing: "القهوة التركية أو الكورتادو"
  },
  {
    id: "p13",
    name: "المجموعة الملكية الثلاثية",
    description: "المجموعة الأكبر والأقوى في تشكيلاتنا الفاخرة. ثلاثة بوكسات متدرجة الحجم مزينة بأرقى تفاصيل الخط العربي وشرايط الحرير الفاخرة، تحتوي على تشكيلة هائلة من قطع الترافل، الشوكولاتة الكلاسيكية، وصواني الضيافة المصغرة لتكون هدية VIP مثالية لإبهار من تحب في المناسبات الكبرى.",
    shortDescription: "3 صناديق هدايا متدرجة الحجم",
    price: 650,
    image: "https://images.unsplash.com/photo-1553452118-621e1f860f43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "مناسبات",
    tags: ["VIP", "هدايا_كبرى"],
    inStock: true,
    ingredients: "شوكولاتة فاخرة، ترافل، مكسرات، فواكه",
    size: "3 صناديق (1.2 كيلو جرام)",
    nutritionalValues: { calories: "510 kcal", fat: "30g", carbs: "55g", protein: "7g" },
    allergens: ["حليب", "صويا", "مكسرات متنوعة"],
    uomCategory: "count",
    defaultUom: "uom_piece",
    cocoaPercent: 55,
    origin: "بلجيكا وفرنسا وسويسرا",
    shelfLife: "6 أشهر",
    pairing: "القهوة المختصة، أو الشاي الأبيض العضوي"
  }
];

export const CATEGORIES = [
  "الكل",
  "شوكولاتة فاخرة",
  "بوكسات هدايا",
  "مناسبات",
  "صواني ضيافة",
  "هدايا شركات",
];
