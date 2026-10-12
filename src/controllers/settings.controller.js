/**
 * Settings Controller
 * Handles reading/updating app settings like perfume pricing
 */

const prisma = require('../config/prisma');
const { 
  PERFUME_SIZES, 
  PERFUME_CONCENTRATIONS, 
  PERFUME_SETTINGS_KEY, 
  DEFAULT_PERFUME_PRICES 
} = require('../constants/perfume');

/**
 * Get perfume pricing settings
 * GET /api/settings/perfume-prices
 */
async function getPerfumePrices(req, res, next) {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: PERFUME_SETTINGS_KEY },
    });

    res.json({
      prices: setting ? setting.value : DEFAULT_PERFUME_PRICES,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update perfume pricing settings
 * PUT /api/settings/perfume-prices
 * Admin only
 */
async function updatePerfumePrices(req, res, next) {
  try {
    const { prices } = req.body;

    // Validate structure
    if (!prices || typeof prices !== 'object') {
      return res.status(400).json({ message: 'Invalid prices format' });
    }

    // Validate all sizes are present and valid
    for (const size of PERFUME_SIZES) {
      if (!prices[size]) {
        return res.status(400).json({ message: `Missing size: ${size}` });
      }
      
      // Validate all concentrations for this size
      for (const conc of PERFUME_CONCENTRATIONS) {
        const price = prices[size][conc];
        
        if (typeof price !== 'number') {
          return res.status(400).json({ 
            message: `Price for ${size} ${conc} must be a number` 
          });
        }
        
        if (price < 0) {
          return res.status(400).json({ 
            message: `Price for ${size} ${conc} cannot be negative` 
          });
        }
        
        if (!isFinite(price)) {
          return res.status(400).json({ 
            message: `Price for ${size} ${conc} must be a valid number` 
          });
        }
      }
    }

    // Reject any keys not in PERFUME_SIZES
    const extraKeys = Object.keys(prices).filter(k => !PERFUME_SIZES.includes(k));
    if (extraKeys.length > 0) {
      return res.status(400).json({ 
        message: `Invalid size keys: ${extraKeys.join(', ')}. Allowed: ${PERFUME_SIZES.join(', ')}` 
      });
    }

    // Reject any concentration keys not in PERFUME_CONCENTRATIONS
    for (const size of PERFUME_SIZES) {
      const extraConcs = Object.keys(prices[size]).filter(c => !PERFUME_CONCENTRATIONS.includes(c));
      if (extraConcs.length > 0) {
        return res.status(400).json({ 
          message: `Invalid concentration keys for ${size}: ${extraConcs.join(', ')}. Allowed: ${PERFUME_CONCENTRATIONS.join(', ')}` 
        });
      }
    }

    // Upsert setting using constants key
    const setting = await prisma.setting.upsert({
      where: { key: PERFUME_SETTINGS_KEY },
      update: { value: prices },
      create: { key: PERFUME_SETTINGS_KEY, value: prices },
    });

    res.json({
      message: 'تم تحديث أسعار العطور بنجاح',
      prices: setting.value,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPerfumePrices,
  updatePerfumePrices,
};
