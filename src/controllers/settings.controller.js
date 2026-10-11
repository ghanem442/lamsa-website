/**
 * Settings Controller
 * Handles reading/updating app settings like perfume pricing
 */

const prisma = require('../config/prisma');

/**
 * Get perfume pricing settings
 * GET /api/settings/perfume-prices
 */
async function getPerfumePrices(req, res, next) {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: 'perfume_prices' },
    });

    // Default prices if not found
    const defaultPrices = {
      '30ml': { edt: 250, edp: 350, ext: 450 },
      '50ml': { edt: 400, edp: 500, ext: 650 },
      '100ml': { edt: 600, edp: 750, ext: 950 },
    };

    res.json({
      prices: setting ? setting.value : defaultPrices,
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

    // Validate required keys and structure
    const requiredSizes = ['30ml', '50ml', '100ml'];
    const requiredConcentrations = ['edt', 'edp', 'ext'];

    for (const size of requiredSizes) {
      if (!prices[size]) {
        return res.status(400).json({ message: `Missing size: ${size}` });
      }
      for (const conc of requiredConcentrations) {
        if (typeof prices[size][conc] !== 'number' || prices[size][conc] < 0) {
          return res.status(400).json({ 
            message: `Invalid price for ${size} ${conc}` 
          });
        }
      }
    }

    // Upsert setting
    const setting = await prisma.setting.upsert({
      where: { key: 'perfume_prices' },
      update: { value: prices },
      create: { key: 'perfume_prices', value: prices },
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
