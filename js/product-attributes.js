/* =============================================
   LAMSA — Product Attributes Constants
   Used for recommendations, validation, and admin forms
   ============================================= */

// ══════════════════════════════════════════════════
// ROUTINE RECOMMENDATION ATTRIBUTES
// ══════════════════════════════════════════════════

const SKIN_TYPES = [
  { value: 'dry', labelAr: 'جافة', labelEn: 'Dry' },
  { value: 'oily', labelAr: 'دهنية', labelEn: 'Oily' },
  { value: 'combo', labelAr: 'مختلطة', labelEn: 'Combination' },
  { value: 'sensitive', labelAr: 'حساسة', labelEn: 'Sensitive' },
  { value: 'all', labelAr: 'جميع الأنواع', labelEn: 'All Types' }
];

const HAIR_TYPES = [
  { value: 'dry', labelAr: 'جاف', labelEn: 'Dry' },
  { value: 'oily', labelAr: 'دهني', labelEn: 'Oily' },
  { value: 'damaged', labelAr: 'تالف / متقصف', labelEn: 'Damaged' },
  { value: 'normal', labelAr: 'عادي / صحي', labelEn: 'Normal' },
  { value: 'all', labelAr: 'جميع الأنواع', labelEn: 'All Types' }
];

const CONCERNS = [
  { value: 'acne', labelAr: 'حب شباب ومسام واسعة', labelEn: 'Acne & Large Pores' },
  { value: 'dry_skin', labelAr: 'جفاف وقشور', labelEn: 'Dryness & Flaking' },
  { value: 'hair_loss', labelAr: 'تساقط وضعف الشعر', labelEn: 'Hair Loss & Weakness' },
  { value: 'dull', labelAr: 'بهتان وفقدان النضارة', labelEn: 'Dullness & Loss of Radiance' },
  { value: 'wrinkles', labelAr: 'خطوط دقيقة وتجاعيد', labelEn: 'Fine Lines & Wrinkles' },
  { value: 'dark_spots', labelAr: 'بقع داكنة وتصبغات', labelEn: 'Dark Spots & Pigmentation' },
  { value: 'all', labelAr: 'جميع المشاكل', labelEn: 'All Concerns' }
];

const BUDGET_TIERS = [
  { value: 'eco', labelAr: 'اقتصادي (أقل من 500 ج.م)', labelEn: 'Economy (Under 500 EGP)' },
  { value: 'mid', labelAr: 'متوسط (500-1000 ج.م)', labelEn: 'Mid-range (500-1000 EGP)' },
  { value: 'prem', labelAr: 'بريميوم (أكثر من 1000 ج.م)', labelEn: 'Premium (Over 1000 EGP)' }
];

// ══════════════════════════════════════════════════
// GIFT RECOMMENDATION ATTRIBUTES
// ══════════════════════════════════════════════════

const FOR_WHOM = [
  { value: 'her', labelAr: 'لها (سيدة/بنت)', labelEn: 'For Her (Woman/Girl)' },
  { value: 'him', labelAr: 'له (رجل)', labelEn: 'For Him (Man)' },
  { value: 'mom', labelAr: 'أمي', labelEn: 'Mom' },
  { value: 'friend', labelAr: 'صديق/صديقة', labelEn: 'Friend' },
  { value: 'wife', labelAr: 'زوجتي', labelEn: 'Wife' },
  { value: 'bride', labelAr: 'عروس', labelEn: 'Bride' },
  { value: 'all', labelAr: 'للجميع', labelEn: 'For Everyone' }
];

const OCCASIONS = [
  { value: 'bday', labelAr: 'عيد ميلاد', labelEn: 'Birthday' },
  { value: 'engage', labelAr: 'خطوبة', labelEn: 'Engagement' },
  { value: 'wedding', labelAr: 'زفاف', labelEn: 'Wedding' },
  { value: 'grad', labelAr: 'تخرج', labelEn: 'Graduation' },
  { value: 'ramadan', labelAr: 'رمضان / عيد', labelEn: 'Ramadan / Eid' },
  { value: 'just', labelAr: 'مجرد هدية ذوق', labelEn: 'Just Because' },
  { value: 'all', labelAr: 'جميع المناسبات', labelEn: 'All Occasions' }
];

const GIFT_BUDGETS = [
  { value: 'low', labelAr: 'أقل من 300 جنيه', labelEn: 'Under 300 EGP' },
  { value: 'mid', labelAr: '300 - 700 جنيه', labelEn: '300 - 700 EGP' },
  { value: 'high', labelAr: 'أكثر من 700 جنيه', labelEn: 'Over 700 EGP' }
];

// ══════════════════════════════════════════════════
// PERFUME ATTRIBUTES
// ══════════════════════════════════════════════════

const PERFUME_FAMILIES = [
  { value: 'floral', labelAr: 'زهري', labelEn: 'Floral' },
  { value: 'oud', labelAr: 'عود', labelEn: 'Oud' },
  { value: 'musky', labelAr: 'مسكي', labelEn: 'Musky' },
  { value: 'fruity', labelAr: 'فاكهي', labelEn: 'Fruity' },
  { value: 'woody', labelAr: 'خشبي', labelEn: 'Woody' },
  { value: 'oriental', labelAr: 'شرقي', labelEn: 'Oriental' },
  { value: 'fresh', labelAr: 'منعش', labelEn: 'Fresh' }
];

// ══════════════════════════════════════════════════
// CATEGORY-SPECIFIC REQUIRED ATTRIBUTES
// ══════════════════════════════════════════════════

const REQUIRED_ATTRIBUTES_BY_CATEGORY = {
  skin: {
    routine: ['skinType', 'concern', 'budget'],
    description: 'منتجات البشرة تحتاج: نوع البشرة + المشكلة + الميزانية للظهور في "اختارلي روتين"'
  },
  hair: {
    routine: ['hairType', 'budget'],
    description: 'منتجات الشعر تحتاج: نوع الشعر + الميزانية للظهور في "اختارلي روتين"'
  },
  gifts: {
    gift: ['forWhom', 'occasion', 'budget'],
    description: 'الهدايا تحتاج: لمن + المناسبة + الميزانية للظهور في "صمم هديتك"'
  },
  perfumes: {
    perfume: ['family'],
    description: 'العطور تحتاج: العائلة العطرية للظهور في "اعمل برفانك"'
  }
};

// ══════════════════════════════════════════════════
// VALIDATION HELPERS
// ══════════════════════════════════════════════════

/**
 * Get allowed values for an attribute
 */
function getAllowedValues(attributeName) {
  const map = {
    skinType: SKIN_TYPES.map(s => s.value),
    hairType: HAIR_TYPES.map(h => h.value),
    concern: CONCERNS.map(c => c.value),
    budget: BUDGET_TIERS.map(b => b.value),
    forWhom: FOR_WHOM.map(f => f.value),
    occasion: OCCASIONS.map(o => o.value),
    giftBudget: GIFT_BUDGETS.map(g => g.value),
    family: PERFUME_FAMILIES.map(p => p.value)
  };
  return map[attributeName] || [];
}

/**
 * Validate attribute values
 */
function validateAttributeValues(attributeName, values) {
  if (!values || !Array.isArray(values)) return { valid: false, errors: ['القيمة يجب أن تكون مصفوفة'] };
  
  const allowed = getAllowedValues(attributeName);
  const invalid = values.filter(v => !allowed.includes(v));
  
  if (invalid.length > 0) {
    return {
      valid: false,
      errors: [`قيم غير صالحة: ${invalid.join(', ')}. القيم المسموحة: ${allowed.join(', ')}`]
    };
  }
  
  return { valid: true, errors: [] };
}

/**
 * Check if product has required attributes for recommendations
 */
function checkProductRecommendationReadiness(product) {
  const missing = {
    routine: false,
    gift: false,
    perfume: false,
    details: []
  };
  
  const category = product.category;
  const requirements = REQUIRED_ATTRIBUTES_BY_CATEGORY[category];
  
  if (!requirements) {
    return missing; // Category doesn't need special attributes
  }
  
  // Check routine requirements (skin/hair products)
  if (requirements.routine) {
    const missingRoutine = [];
    
    if (requirements.routine.includes('skinType') && (!product.skinType || product.skinType.length === 0)) {
      missingRoutine.push('نوع البشرة');
    }
    if (requirements.routine.includes('hairType') && (!product.hairType || product.hairType.length === 0)) {
      missingRoutine.push('نوع الشعر');
    }
    if (requirements.routine.includes('concern') && (!product.concern || product.concern.length === 0)) {
      missingRoutine.push('المشكلة');
    }
    if (requirements.routine.includes('budget') && (!product.budget || product.budget.length === 0)) {
      missingRoutine.push('الميزانية');
    }
    
    if (missingRoutine.length > 0) {
      missing.routine = true;
      missing.details.push(`روتين: ناقص ${missingRoutine.join(' + ')}`);
    }
  }
  
  // Check gift requirements
  if (requirements.gift) {
    const missingGift = [];
    
    if (requirements.gift.includes('forWhom') && (!product.forWhom || product.forWhom.length === 0)) {
      missingGift.push('لمن');
    }
    if (requirements.gift.includes('occasion') && (!product.occasion || product.occasion.length === 0)) {
      missingGift.push('المناسبة');
    }
    if (requirements.gift.includes('budget') && !product.budget) {
      missingGift.push('الميزانية');
    }
    
    if (missingGift.length > 0) {
      missing.gift = true;
      missing.details.push(`هدايا: ناقص ${missingGift.join(' + ')}`);
    }
  }
  
  // Check perfume requirements
  if (requirements.perfume) {
    if (requirements.perfume.includes('family') && !product.family) {
      missing.perfume = true;
      missing.details.push('عطور: ناقص العائلة العطرية');
    }
  }
  
  return missing;
}

/**
 * Get Arabic label for attribute value
 */
function getAttributeLabel(attributeName, value, lang = 'ar') {
  const map = {
    skinType: SKIN_TYPES,
    hairType: HAIR_TYPES,
    concern: CONCERNS,
    budget: BUDGET_TIERS,
    forWhom: FOR_WHOM,
    occasion: OCCASIONS,
    giftBudget: GIFT_BUDGETS,
    family: PERFUME_FAMILIES
  };
  
  const list = map[attributeName];
  if (!list) return value;
  
  const item = list.find(i => i.value === value);
  return item ? (lang === 'ar' ? item.labelAr : item.labelEn) : value;
}

// ══════════════════════════════════════════════════
// EXPORT FOR USE
// ══════════════════════════════════════════════════

if (typeof window !== 'undefined') {
  window.LAMSA_ATTRIBUTES = {
    SKIN_TYPES,
    HAIR_TYPES,
    CONCERNS,
    BUDGET_TIERS,
    FOR_WHOM,
    OCCASIONS,
    GIFT_BUDGETS,
    PERFUME_FAMILIES,
    REQUIRED_ATTRIBUTES_BY_CATEGORY,
    getAllowedValues,
    validateAttributeValues,
    checkProductRecommendationReadiness,
    getAttributeLabel
  };
}

// Export for Node.js (server-side)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SKIN_TYPES,
    HAIR_TYPES,
    CONCERNS,
    BUDGET_TIERS,
    FOR_WHOM,
    OCCASIONS,
    GIFT_BUDGETS,
    PERFUME_FAMILIES,
    REQUIRED_ATTRIBUTES_BY_CATEGORY,
    getAllowedValues,
    validateAttributeValues,
    checkProductRecommendationReadiness,
    getAttributeLabel
  };
}
