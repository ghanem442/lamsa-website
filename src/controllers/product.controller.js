const prisma = require('../config/prisma');
const { withRetry } = require('../utils/prismaRetry');

// Helper to format product consistently for API & frontend
function formatProduct(p) {
  return {
    id: p.id,
    name: p.nameAr,
    nameEn: p.nameEn,
    category: p.category,
    subCategory: p.subCategory,
    price: p.price,
    stockQty: p.stockQty,
    imageUrl: p.imageUrl,
    emoji: p.emoji,
    badge: p.badge,
    skinType: p.skinType,
    concern: p.concern,
    hairType: p.hairType,
    budget: p.budget,
    forWhom: p.forWhom,
    occasion: p.occasion,
    family: p.family,
    createdAt: p.createdAt,
  };
}

/**
 * GET /api/products
 * Query filters:
 * - category (string)
 * - subCategory (string)
 * - search (string in Arabic or English)
 * - sort: 'price_asc' | 'price_desc' | 'low' | 'high' | 'newest'
 * - page: number (default 1)
 * - limit: number (default 50)
 */
async function getProducts(req, res, next) {
  try {
    const { category, subCategory, search, sort, page = 1, limit = 50 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    // Build Prisma where clause
    const where = {};

    if (category && category !== 'all') {
      where.category = {
        equals: category,
        mode: 'insensitive',
      };
    }

    if (subCategory && subCategory !== 'all') {
      where.subCategory = {
        equals: subCategory,
        mode: 'insensitive',
      };
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { nameAr: { contains: q, mode: 'insensitive' } },
        { nameEn: { contains: q, mode: 'insensitive' } },
        { subCategory: { contains: q, mode: 'insensitive' } },
        { category: { contains: q, mode: 'insensitive' } },
      ];
    }

    // Build Prisma orderBy
    let orderBy = { createdAt: 'desc' };
    if (sort === 'low' || sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'high' || sort === 'price_desc') {
      orderBy = { price: 'desc' };
    }

    const [total, products] = await withRetry(async () => {
      return await Promise.all([
        prisma.product.count({ where }),
        prisma.product.findMany({
          where,
          orderBy,
          skip,
          take: limitNum,
        }),
      ]);
    });

    const formatted = products.map(formatProduct);

    res.json({
      success: true,
      data: formatted,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/products/featured
 * Returns popular and new products
 */
async function getFeaturedProducts(req, res, next) {
  try {
    const { limit = 6 } = req.query;
    const limitNum = Math.min(20, Math.max(1, parseInt(limit, 10) || 6));

    const products = await withRetry(async () => {
      return await prisma.product.findMany({
        where: {
          badge: {
            in: ['popular', 'new'],
          },
        },
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      });
    });

    res.json({
      success: true,
      data: products.map(formatProduct),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/products/:id
 */
async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    const product = await withRetry(async () => {
      return await prisma.product.findUnique({
        where: { id },
      });
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير موجود',
      });
    }

    res.json({
      success: true,
      data: formatProduct(product),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductById,
};
