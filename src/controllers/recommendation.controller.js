const prisma = require('../config/prisma');
const { withRetry } = require('../utils/prismaRetry');

// Simple in-memory cache
let recommendationCache = {
  data: null,
  timestamp: 0,
  ttl: 60000 // 1 minute cache
};

/**
 * GET /api/products/recommendation-pool
 * Returns all ACTIVE products with attributes needed for recommendations
 * Max 500 products, cached for 1 minute
 */
async function getRecommendationPool(req, res, next) {
  try {
    const now = Date.now();
    
    // Check cache
    if (recommendationCache.data && (now - recommendationCache.timestamp) < recommendationCache.ttl) {
      return res.json({
        success: true,
        data: recommendationCache.data,
        cached: true,
        cacheAge: Math.floor((now - recommendationCache.timestamp) / 1000)
      });
    }

    // Fetch all active products with attributes (max 500)
    // Include all fields needed for recommendations
    const products = await withRetry(async () => {
      return await prisma.product.findMany({
        where: {
          stockQty: { gt: 0 } // Only active products with stock
        },
        select: {
          id: true,
          nameAr: true,
          nameEn: true,
          category: true,
          subCategory: true,
          price: true,
          stockQty: true,
          imageUrl: true,
          emoji: true,
          badge: true,
          // Recommendation attributes
          skinType: true,
          concern: true,
          hairType: true,
          budget: true,
          forWhom: true,
          occasion: true,
          family: true
        },
        orderBy: [
          { badge: 'desc' }, // Popular/featured first
          { createdAt: 'desc' }
        ],
        take: 500 // Max 500 products
      });
    });

    // Update cache
    recommendationCache.data = products;
    recommendationCache.timestamp = now;

    res.json({
      success: true,
      data: products,
      cached: false,
      count: products.length
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/products/recommendation-pool/invalidate
 * Invalidate the recommendation cache (admin only)
 * Called after product create/update/delete
 */
function invalidateCache(req, res, next) {
  recommendationCache.data = null;
  recommendationCache.timestamp = 0;
  
  res.json({
    success: true,
    message: 'Cache invalidated successfully'
  });
}

module.exports = {
  getRecommendationPool,
  invalidateCache
};
