/* =============================================
   LAMSA — Products Data & Quiz Logic
   ============================================= */

const PRODUCTS = [
  // ── SKINCARE ──
  { id: 'sk1', name: 'غسول الوجه المنقي', nameEn: 'Purifying Face Wash', category: 'skin', price: 180, emoji: '🧴', badge: 'new', skinType: ['oily','combo'], concern: ['acne'], budget: ['eco','mid'] },
  { id: 'sk2', name: 'غسول مرطب للبشرة الجافة', nameEn: 'Hydrating Cleanser', category: 'skin', price: 220, emoji: '💧', skinType: ['dry','sensitive'], concern: ['dry_skin'], budget: ['eco','mid'] },
  { id: 'sk3', name: 'سيروم فيتامين سي', nameEn: 'Vitamin C Serum', category: 'skin', price: 350, emoji: '✨', badge: 'popular', skinType: ['all'], concern: ['dull','dark_spots'], budget: ['mid','prem'] },
  { id: 'sk4', name: 'سيروم حمض الهيالورونيك', nameEn: 'Hyaluronic Acid Serum', category: 'skin', price: 280, emoji: '💦', skinType: ['dry','sensitive','combo'], concern: ['dry_skin','wrinkles'], budget: ['mid'] },
  { id: 'sk5', name: 'مرطب للبشرة الدهنية', nameEn: 'Oil-Free Moisturizer', category: 'skin', price: 240, emoji: '🌿', skinType: ['oily','combo'], concern: ['acne'], budget: ['eco','mid'] },
  { id: 'sk6', name: 'مرطب مكثف للبشرة الجافة', nameEn: 'Rich Moisturizer', category: 'skin', price: 320, emoji: '🥛', skinType: ['dry','sensitive'], concern: ['dry_skin','wrinkles'], budget: ['mid','prem'] },
  { id: 'sk7', name: 'واقي شمس SPF 50', nameEn: 'Sunscreen SPF 50', category: 'skin', price: 200, emoji: '☀️', badge: 'popular', skinType: ['all'], concern: ['all'], budget: ['eco','mid'] },
  { id: 'sk8', name: 'كريم تفتيح البقع', nameEn: 'Dark Spot Corrector', category: 'skin', price: 450, emoji: '⭐', skinType: ['all'], concern: ['dark_spots','dull'], budget: ['mid','prem'] },
  { id: 'sk9', name: 'تونر منقي المسام', nameEn: 'Pore Toner', category: 'skin', price: 160, emoji: '🌸', skinType: ['oily','combo'], concern: ['acne'], budget: ['eco','mid'] },
  { id: 'sk10', name: 'كريم ليلي مضاد للشيخوخة', nameEn: 'Anti-Aging Night Cream', category: 'skin', price: 580, emoji: '🌙', badge: 'new', skinType: ['all'], concern: ['wrinkles','dull'], budget: ['prem'] },

  // ── HAIRCARE ──
  { id: 'hr1', name: 'شامبو للشعر الجاف والتالف', nameEn: 'Repair Shampoo', category: 'hair', price: 150, emoji: '🧖', hairType: ['dry','damaged'], budget: ['eco','mid'] },
  { id: 'hr2', name: 'شامبو للشعر الدهني', nameEn: 'Oil-Control Shampoo', category: 'hair', price: 140, emoji: '🌊', hairType: ['oily'], budget: ['eco','mid'] },
  { id: 'hr3', name: 'بلسم مغذي للشعر', nameEn: 'Nourishing Conditioner', category: 'hair', price: 160, emoji: '💆', hairType: ['dry','damaged','normal'], budget: ['eco','mid'] },
  { id: 'hr4', name: 'زيت الأرغان للشعر', nameEn: 'Argan Hair Oil', category: 'hair', price: 280, emoji: '🌰', badge: 'popular', hairType: ['dry','damaged'], concern: ['hair_loss'], budget: ['mid'] },
  { id: 'hr5', name: 'ماسك الكيراتين', nameEn: 'Keratin Hair Mask', category: 'hair', price: 320, emoji: '✨', hairType: ['damaged','dry'], budget: ['mid','prem'] },
  { id: 'hr6', name: 'سيروم ضد تساقط الشعر', nameEn: 'Anti Hair-Loss Serum', category: 'hair', price: 380, emoji: '💪', badge: 'new', hairType: ['all'], concern: ['hair_loss'], budget: ['mid','prem'] },
  { id: 'hr7', name: 'كريم تسريح الشعر', nameEn: 'Detangling Cream', category: 'hair', price: 130, emoji: '🌿', hairType: ['all'], budget: ['eco'] },

  // ── BODY CARE ──
  { id: 'bd1', name: 'بادي لوشن الحرير المرطب', nameEn: 'Silk Body Lotion', category: 'body', price: 120, emoji: '🌺' },
  { id: 'bd2', name: 'بادي سبلاش الزهور', nameEn: 'Floral Body Splash', category: 'body', price: 90, emoji: '🌸' },
  { id: 'bd3', name: 'شاور جيل مغذي', nameEn: 'Nourishing Shower Gel', category: 'body', price: 100, emoji: '🚿' },
  { id: 'bd4', name: 'سكراب الجسم', nameEn: 'Body Scrub', category: 'body', price: 180, emoji: '✨', badge: 'new' },
  { id: 'bd5', name: 'زيت الجسم الفاخر', nameEn: 'Luxury Body Oil', category: 'body', price: 250, emoji: '🌟' },

  // ── PERFUMES ──
  { id: 'pf1', name: 'عطر أوركيد الليل', nameEn: 'Night Orchid', category: 'perfumes', price: 450, emoji: '🌙', badge: 'popular', family: 'floral' },
  { id: 'pf2', name: 'عود الملكي', nameEn: 'Royal Oud', category: 'perfumes', price: 600, emoji: '🪵', family: 'oud' },
  { id: 'pf3', name: 'مسك الفجر', nameEn: 'Dawn Musk', category: 'perfumes', price: 380, emoji: '🌫️', badge: 'new', family: 'musky' },
  { id: 'pf4', name: 'تركيبة خاصة — زهور وعود', nameEn: 'Custom Blend — Floral & Oud', category: 'perfumes', price: 500, emoji: '🌹', badge: 'popular', custom: true },
  { id: 'pf5', name: 'برفان فاكهي منعش', nameEn: 'Fresh Fruity Fragrance', category: 'perfumes', price: 350, emoji: '🍑', family: 'fruity' },

  // ── GIFTS ──
  { id: 'gf1', name: 'مجموعة الإطراقة الملكية', nameEn: 'Royal Pampering Set', category: 'gifts', price: 650, emoji: '🎁', badge: 'popular', forWhom: ['her','wife','bride'], occasion: ['wedding','bday','engage'], budget: 'high' },
  { id: 'gf2', name: 'باقة العناية الكاملة', nameEn: 'Full Care Bundle', category: 'gifts', price: 420, emoji: '🎀', forWhom: ['her','mom','friend'], occasion: ['bday','grad'], budget: 'mid' },
  { id: 'gf3', name: 'مجموعة العطور المختارة', nameEn: 'Selected Fragrance Set', category: 'gifts', price: 350, emoji: '🌹', forWhom: ['her','him','wife'], occasion: ['bday','just','ramadan'], budget: 'mid' },
  { id: 'gf4', name: 'باقة رجالية فاخرة', nameEn: 'Luxury Men\'s Set', category: 'gifts', price: 500, emoji: '💼', forWhom: ['him'], occasion: ['bday','just'], budget: 'mid' },
  { id: 'gf5', name: 'هدية رمضان الفاخرة', nameEn: 'Luxury Ramadan Gift', category: 'gifts', price: 280, emoji: '🌙', forWhom: ['all'], occasion: ['ramadan'], budget: 'low' },
  { id: 'gf6', name: 'باقة العروس', nameEn: 'Bridal Package', category: 'gifts', price: 900, emoji: '👰', badge: 'new', forWhom: ['bride'], occasion: ['wedding','engage'], budget: 'high' },

  // ── ACCESSORIES ──
  { id: 'ac1', name: 'قلادة ذهبية رفيعة', nameEn: 'Delicate Gold Necklace', category: 'accessories', price: 180, emoji: '📿' },
  { id: 'ac2', name: 'خاتم أنسيال', nameEn: 'Initial Ring', category: 'accessories', price: 120, emoji: '💍' },
  { id: 'ac3', name: 'توك شعر لؤلؤي', nameEn: 'Pearl Hair Clip', category: 'accessories', price: 60, emoji: '🪮' },
  { id: 'ac4', name: 'خلخال ذهبي', nameEn: 'Gold Anklet', category: 'accessories', price: 150, emoji: '✨' },

  // ── DEVICES ──
  { id: 'dv1', name: 'ماكينة إزالة الشعر النسائية', nameEn: 'Ladies Hair Remover', category: 'devices', price: 350, emoji: '⚡' },
  { id: 'dv2', name: 'ماكينة الحلاقة الرجالية', nameEn: "Men's Shaver", category: 'devices', price: 420, emoji: '🪒' },
  { id: 'dv3', name: 'مكواة الشعر الاحترافية', nameEn: 'Professional Hair Straightener', category: 'devices', price: 580, emoji: '💇', badge: 'new' },
  { id: 'dv4', name: 'مجفف الشعر الهادئ', nameEn: 'Quiet Hair Dryer', category: 'devices', price: 480, emoji: '💨' },
];

// ── Routine Logic ─────────────────────────────
function getRoutineProducts(answers) {
  const { skinType, hairType, concerns, budget } = answers;
  const result = [];

  // Skincare picks (2-3 products)
  const skinProducts = PRODUCTS.filter(p =>
    p.category === 'skin' &&
    (p.skinType?.includes('all') || p.skinType?.includes(skinType)) &&
    p.budget?.includes(budget)
  );

  // Prioritize by concern
  const byConern = skinProducts.filter(p =>
    p.concern?.some(c => concerns.includes(c))
  );

  const skinPicks = [...new Set([...byConern, ...skinProducts])].slice(0, 3);

  // Always include sunscreen
  const spf = PRODUCTS.find(p => p.id === 'sk7');
  if (!skinPicks.find(p => p.id === 'sk7') && budget !== 'eco') skinPicks.push(spf);

  // Haircare pick (1-2 products)
  const hairProducts = PRODUCTS.filter(p =>
    p.category === 'hair' &&
    (p.hairType?.includes('all') || p.hairType?.includes(hairType)) &&
    p.budget?.includes(budget)
  ).slice(0, 2);

  result.push(...skinPicks, ...hairProducts);
  return result;
}

// ── Gift Logic ────────────────────────────────
function getGiftProducts(answers) {
  const { forWhom, occasion, budget } = answers;

  const budgetMap = { low: 'low', mid: 'mid', high: 'high' };
  const budgetKey = budgetMap[budget] || 'mid';

  const gifts = PRODUCTS.filter(p =>
    p.category === 'gifts' &&
    (p.forWhom?.includes('all') || p.forWhom?.includes(forWhom)) &&
    (p.occasion?.includes('all') || p.occasion?.some(o => o === occasion)) &&
    p.budget === budgetKey
  );

  if (gifts.length > 0) return gifts.slice(0, 2);

  // Fallback: just budget match
  return PRODUCTS.filter(p =>
    p.category === 'gifts' &&
    p.budget === budgetKey
  ).slice(0, 2);
}

// ── Perfume Pricing (Dynamic from Admin) ──────
const DEFAULT_PERFUME_PRICES = {
  '30ml': { edt: 250, edp: 350, ext: 450 },
  '50ml': { edt: 400, edp: 500, ext: 650 },
  '100ml': { edt: 600, edp: 750, ext: 950 },
};

function getPerfumePrice(size, concentration) {
  let prices = DEFAULT_PERFUME_PRICES;
  const savedPrices = localStorage.getItem('lamsa_perfume_prices');
  if (savedPrices) {
    try {
      prices = JSON.parse(savedPrices);
    } catch (e) {
      prices = DEFAULT_PERFUME_PRICES;
    }
  }
  return prices[size]?.[concentration] || 0;
}

// Check if custom products exist in localStorage
const savedCustomProducts = localStorage.getItem('lamsa_custom_products');
let activeProductsList = PRODUCTS;
if (savedCustomProducts) {
  try {
    activeProductsList = JSON.parse(savedCustomProducts);
  } catch (e) {
    activeProductsList = PRODUCTS;
  }
}

// Export for use in pages
window.LAMSA = {
  PRODUCTS: activeProductsList,
  getRoutineProducts,
  getGiftProducts,
  getPerfumePrice,
};

