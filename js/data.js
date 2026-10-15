/* =============================================
   LAMSA — Quiz Logic & Recommendation Functions
   Fake products removed - uses real database via API
   ============================================= */

// ── Routine Logic ─────────────────────────────
function getRoutineProducts(answers, allProducts) {
  const { skinType, hairType, concerns, budget } = answers;
  const result = [];

  // Skincare picks (2-3 products)
  const skinProducts = allProducts.filter(p =>
    p.category === 'skin' &&
    (p.skinType?.includes('all') || p.skinType?.includes(skinType)) &&
    p.budget?.includes(budget)
  );

  // Prioritize by concern
  const byConcern = skinProducts.filter(p =>
    p.concern?.some(c => concerns.includes(c))
  );

  const skinPicks = [...new Set([...byConcern, ...skinProducts])].slice(0, 3);
  // Always include sunscreen if budget allows
  const spf = allProducts.find(p => p.id === 'sk7' || (p.category === 'skin' && p.nameEn && p.nameEn.toLowerCase().includes('sunscreen')));
  if (spf && !skinPicks.find(p => p.id === spf.id) && budget !== 'eco') {
    skinPicks.push(spf);
  }

  // Haircare pick (1-2 products)
  const hairProducts = allProducts.filter(p =>
    p.category === 'hair' &&
    (p.hairType?.includes('all') || p.hairType?.includes(hairType)) &&
    p.budget?.includes(budget)
  ).slice(0, 2);

  result.push(...skinPicks, ...hairProducts);
  return result;
}

// ── Gift Logic ────────────────────────────────
function getGiftProducts(answers, allProducts) {
  const { forWhom, occasion, budget } = answers;

  const budgetMap = { low: 'low', mid: 'mid', high: 'high' };
  const budgetKey = budgetMap[budget] || 'mid';

  const gifts = allProducts.filter(p =>
    p.category === 'gifts' &&
    (p.forWhom?.includes('all') || p.forWhom?.includes(forWhom)) &&
    (p.occasion?.includes('all') || p.occasion?.some(o => o === occasion)) &&
    p.budget && Array.isArray(p.budget) && p.budget.includes(budgetKey)
  );

  if (gifts.length > 0) return gifts.slice(0, 2);

  // Fallback: just budget match
  return allProducts.filter(p =>
    p.category === 'gifts' &&
    p.budget && Array.isArray(p.budget) && p.budget.includes(budgetKey)
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

// Helper: get product by ID from real products list
function getProductById(id, productsList) {
  return productsList ? productsList.find(p => p.id === id) : null;
}

// Helper: add to cart by ID
function addToCartById(id, qty = 1) {
  // This function needs the product object, so it should be called with the product from the API
  console.warn('[data.js] addToCartById called but needs refactoring to pass product object from API');
}

// Export for use in pages
window.LAMSA = {
  getRoutineProducts,
  getGiftProducts,
  getPerfumePrice,
  DEFAULT_PERFUME_PRICES,
  getProductById
};
