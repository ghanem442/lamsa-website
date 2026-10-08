/* =============================================
   LAMSA — SubCategories Definition
   Single source of truth for admin form and shop filters
   ============================================= */

// SubCategory system:
// - DB stores: English IDs (e.g., "cleanser", "shampoo")
// - UI shows: Arabic labels (e.g., "غسول", "شامبو")
// - CSV uses: English IDs (same as DB)

const SUBCATEGORIES = {
  skin: [
    { id: 'cleanser', name: 'غسول' },
    { id: 'toner', name: 'تونر' },
    { id: 'serum', name: 'سيروم' },
    { id: 'moisturizer', name: 'مرطب' },
    { id: 'sunscreen', name: 'واقي شمس' },
    { id: 'face-mask', name: 'ماسك وجه' }
  ],
  hair: [
    { id: 'shampoo', name: 'شامبو' },
    { id: 'conditioner', name: 'بلسم' },
    { id: 'hair-cream', name: 'كريم شعر' },
    { id: 'hair-gel', name: 'جل' },
    { id: 'hair-oil', name: 'زيت شعر' },
    { id: 'oil-alternative', name: 'بديل زيت' },
    { id: 'protein', name: 'بروتين' },
    { id: 'hair-mask', name: 'ماسك شعر' }
  ],
  body: [
    { id: 'shower-gel', name: 'شاور جل' },
    { id: 'body-lotion', name: 'مرطب جسم' },
    { id: 'body-scrub', name: 'مقشر جسم' },
    { id: 'body-butter', name: 'زبدة الجسم' }
  ],
  deodorant: [
    { id: 'body-splash', name: 'بودي سبلاش' },
    { id: 'spray', name: 'سبراي' },
    { id: 'roll-on', name: 'رول أون' },
    { id: 'stick', name: 'استيك' }
  ],
  makeup: [
    { id: 'foundation', name: 'فاونديشن' },
    { id: 'lipstick', name: 'أحمر شفاه' },
    { id: 'mascara', name: 'ماسكارا' },
    { id: 'eyeshadow', name: 'ظلال عيون' },
    { id: 'blush', name: 'بلاشر' },
    { id: 'eyeliner', name: 'آيلاينر' }
  ],
  perfumes: [
    { id: 'ready-made', name: 'عطور جاهزة 🌹' },
    { id: 'custom', name: 'تركيبة خاصة ✨' }
  ],
  tools: [
    { id: 'brushes', name: 'فرش المكياج' },
    { id: 'sponges', name: 'إسفنجات' },
    { id: 'mirrors', name: 'مرايا' }
  ],
  gifts: [
    { id: 'sets', name: 'مجموعات' },
    { id: 'boxes', name: 'علب هدايا' },
    { id: 'bundles', name: 'باقات' }
  ],
  accessories: [
    { id: 'jewelry', name: 'مجوهرات' },
    { id: 'hair-accessories', name: 'إكسسوارات شعر' },
    { id: 'bags', name: 'حقائب' }
  ],
  devices: [
    { id: 'hair-tools', name: 'أدوات الشعر' },
    { id: 'shavers', name: 'ماكينات حلاقة' },
    { id: 'epilators', name: 'أجهزة إزالة الشعر' }
  ]
};

// Helper: Convert Arabic label to English ID
function getSubCategoryId(arabicLabel, category) {
  if (!arabicLabel || !category || !SUBCATEGORIES[category]) {
    return null;
  }
  
  const found = SUBCATEGORIES[category].find(
    sub => sub.name.toLowerCase() === arabicLabel.toLowerCase()
  );
  
  return found ? found.id : null;
}

// Helper: Convert English ID to Arabic label
function getSubCategoryName(englishId, category) {
  if (!englishId || !category || !SUBCATEGORIES[category]) {
    return null;
  }
  
  const found = SUBCATEGORIES[category].find(
    sub => sub.id.toLowerCase() === englishId.toLowerCase()
  );
  
  return found ? found.name : null;
}

// Helper: Validate if a subCategory ID is valid for a category
function isValidSubCategory(subCategoryId, category) {
  if (!subCategoryId || !category || !SUBCATEGORIES[category]) {
    return false;
  }
  
  return SUBCATEGORIES[category].some(
    sub => sub.id.toLowerCase() === subCategoryId.toLowerCase()
  );
}

// Export for use in browser
if (typeof window !== 'undefined') {
  window.LAMSA_SUBCATEGORIES = SUBCATEGORIES;
  window.getSubCategoryId = getSubCategoryId;
  window.getSubCategoryName = getSubCategoryName;
  window.isValidSubCategory = isValidSubCategory;
}

// Export for Node.js (backend)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SUBCATEGORIES,
    getSubCategoryId,
    getSubCategoryName,
    isValidSubCategory
  };
}
