const prisma = require('../config/prisma');
const { withRetry } = require('../utils/prismaRetry');
const { z } = require('zod');
const {
  SHIPPING_SETTINGS_KEY,
  DEFAULT_SHIPPING_FEE,
  MIN_SHIPPING_FEE,
  MAX_SHIPPING_FEE
} = require('../constants/shipping');
const {
  PERFUME_SETTINGS_KEY,
  DEFAULT_PERFUME_PRICES,
  PERFUME_SIZES,
  PERFUME_CONCENTRATIONS
} = require('../constants/perfume');

/**
 * GET /api/settings/shipping
 * Get current shipping fee (public endpoint with cache)
 * Returns fallback value if database is unreachable
 */
async function getShippingFee(req, res, next) {
  try {
    // Cache for 5 minutes
    res.set('Cache-Control', 'public, max-age=300');
    
    let shippingFee = DEFAULT_SHIPPING_FEE;
    let fallback = false;
    
    try {
      const setting = await withRetry(async () => {
        return await prisma.setting.findUnique({
          where: { key: SHIPPING_SETTINGS_KEY }
        });
      });
      
      if (setting) {
        shippingFee = Number(setting.value);
      }
    } catch (dbError) {
      // Database connection failed - use fallback
      console.error('[Settings] Database error, using fallback shipping fee:', dbError.message);
      fallback = true;
    }
    
    res.json({
      success: true,
      data: {
        shippingFee: shippingFee,
        fallback: fallback
      }
    });
  } catch (error) {
    // Last resort fallback - should never reach here
    console.error('[Settings] Unexpected error:', error);
    res.json({
      success: true,
      data: {
        shippingFee: DEFAULT_SHIPPING_FEE,
        fallback: true
      }
    });
  }
}

// Validation schema for updating shipping fee
const updateShippingFeeSchema = z.object({
  shippingFee: z.number()
    .int('رسوم الشحن يجب أن تكون رقماً صحيحاً')
    .min(MIN_SHIPPING_FEE, `رسوم الشحن يجب أن تكون ${MIN_SHIPPING_FEE} جنيه على الأقل`)
    .max(MAX_SHIPPING_FEE, `رسوم الشحن يجب ألا تتجاوز ${MAX_SHIPPING_FEE} جنيه`)
});

/**
 * PATCH /api/admin/settings/shipping
 * Update shipping fee (admin only)
 */
async function updateShippingFee(req, res, next) {
  try {
    // No cache for admin endpoints
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    
    // Validate input
    const validatedData = updateShippingFeeSchema.parse(req.body);
    
    // Update or create setting
    const setting = await withRetry(async () => {
      return await prisma.setting.upsert({
        where: { key: SHIPPING_SETTINGS_KEY },
        update: {
          value: validatedData.shippingFee
        },
        create: {
          key: SHIPPING_SETTINGS_KEY,
          value: validatedData.shippingFee
        }
      });
    });
    
    res.json({
      success: true,
      message: 'تم تحديث رسوم الشحن بنجاح',
      data: {
        shippingFee: Number(setting.value)
      }
    });
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: error.errors[0].message
      });
    }
    next(error);
  }
}

// Validation schema for updating perfume prices
const updatePerfumePricesSchema = z.object({
  prices: z.record(
    z.enum(PERFUME_SIZES),
    z.record(z.enum(PERFUME_CONCENTRATIONS), z.number().positive())
  )
});

/**
 * GET /api/settings/perfume-prices
 * Get current perfume price matrix (public endpoint)
 * Returns fallback default prices if database is unreachable
 */
async function getPerfumePrices(req, res) {
  try {
    // Cache for 5 minutes
    res.set('Cache-Control', 'public, max-age=300');

    let prices = DEFAULT_PERFUME_PRICES;
    let fallback = false;

    try {
      const setting = await withRetry(async () => {
        return await prisma.setting.findUnique({
          where: { key: PERFUME_SETTINGS_KEY }
        });
      });

      if (setting && setting.value) {
        prices = setting.value;
      }
    } catch (dbError) {
      console.error('[Settings] DB error loading perfume prices, using defaults:', dbError.message);
      fallback = true;
    }

    res.json({
      success: true,
      prices,
      fallback
    });
  } catch (error) {
    // Last-resort fallback — never return 500 for a price lookup
    console.error('[Settings] Unexpected error in getPerfumePrices:', error);
    res.json({
      success: true,
      prices: DEFAULT_PERFUME_PRICES,
      fallback: true
    });
  }
}

/**
 * PUT /api/settings/perfume-prices
 * Update perfume price matrix (admin only)
 */
async function updatePerfumePrices(req, res, next) {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');

    const validatedData = updatePerfumePricesSchema.parse(req.body);

    const setting = await withRetry(async () => {
      return await prisma.setting.upsert({
        where: { key: PERFUME_SETTINGS_KEY },
        update: { value: validatedData.prices },
        create: { key: PERFUME_SETTINGS_KEY, value: validatedData.prices }
      });
    });

    res.json({
      success: true,
      message: 'تم تحديث أسعار العطور بنجاح',
      prices: setting.value
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: error.errors[0].message
      });
    }
    next(error);
  }
}

module.exports = {
  getShippingFee,
  updateShippingFee,
  getPerfumePrices,
  updatePerfumePrices
};
