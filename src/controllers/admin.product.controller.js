const prisma = require('../config/prisma');
const { withRetry } = require('../utils/prismaRetry');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * GET /api/admin/products
 * List all products (admin only)
 */
async function getAllProducts(req, res, next) {
  try {
    const { page = 1, limit = 50, category, search } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (category && category !== 'all') {
      where.category = { equals: category, mode: 'insensitive' };
    }
    if (search) {
      where.OR = [
        { nameAr: { contains: search, mode: 'insensitive' } },
        { nameEn: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, products] = await withRetry(async () => {
      return await Promise.all([
        prisma.product.count({ where }),
        prisma.product.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: { createdAt: 'desc' },
        }),
      ]);
    });

    res.json({
      success: true,
      data: products,
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
 * POST /api/admin/products
 * Create a new product
 */
async function createProduct(req, res, next) {
  try {
    // Whitelist: Only allow known Product model fields
    const allowedFields = [
      'nameAr', 'nameEn', 'category', 'subCategory', 'price', 'stockQty',
      'imageUrl', 'emoji', 'badge', 'skinTypes', 'concerns', 'hairTypes',
      'budgetTier', 'forWhom', 'occasion', 'family'
    ];

    const data = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        data[field] = req.body[field];
      }
    });

    // Validation
    if (!data.nameAr || !data.category || data.price == null) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء إدخال الاسم بالعربي، الفئة، والسعر',
      });
    }

    // Set defaults and parse types
    data.nameEn = data.nameEn || data.nameAr;
    data.price = parseFloat(data.price);
    data.stockQty = data.stockQty != null ? parseInt(data.stockQty, 10) : 100;
    data.subCategory = data.subCategory || null;
    data.imageUrl = data.imageUrl || null;
    data.emoji = data.emoji || null;
    data.badge = data.badge || null;
    data.family = data.family || null;

    // Ensure JSON array fields are arrays (not strings)
    const jsonArrayFields = ['skinTypes', 'concerns', 'hairTypes', 'budgetTier', 'forWhom', 'occasion'];
    jsonArrayFields.forEach(field => {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        data[field] = [];
      } else if (typeof data[field] === 'string') {
        // Convert pipe-separated string to array
        data[field] = data[field].split('|').map(v => v.trim()).filter(Boolean);
      } else if (!Array.isArray(data[field])) {
        data[field] = [];
      }
    });

    const product = await withRetry(async () => {
      return await prisma.product.create({ data });
    });

    res.status(201).json({
      success: true,
      message: 'تم إضافة المنتج بنجاح',
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/admin/products/:id
 * Update a product
 */
async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;

    // Whitelist: Only allow known Product model fields
    const allowedFields = [
      'nameAr', 'nameEn', 'category', 'subCategory', 'price', 'stockQty',
      'imageUrl', 'emoji', 'badge', 'skinTypes', 'concerns', 'hairTypes',
      'budgetTier', 'forWhom', 'occasion', 'family'
    ];

    const data = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        data[field] = req.body[field];
      }
    });

    // Convert numeric fields
    if (data.price != null) {
      data.price = parseFloat(data.price);
    }
    if (data.stockQty != null) {
      data.stockQty = parseInt(data.stockQty, 10);
    }

    // Ensure JSON array fields are arrays
    const jsonArrayFields = ['skinTypes', 'concerns', 'hairTypes', 'budgetTier', 'forWhom', 'occasion'];
    jsonArrayFields.forEach(field => {
      if (data[field] !== undefined) {
        if (data[field] === null || data[field] === '') {
          data[field] = [];
        } else if (typeof data[field] === 'string') {
          // Convert pipe-separated string to array
          data[field] = data[field].split('|').map(v => v.trim()).filter(Boolean);
        } else if (!Array.isArray(data[field])) {
          data[field] = [];
        }
      }
    });

    // Convert null strings to actual null
    ['subCategory', 'imageUrl', 'emoji', 'badge', 'family'].forEach(field => {
      if (data[field] === '' || data[field] === 'null') {
        data[field] = null;
      }
    });

    const product = await withRetry(async () => {
      return await prisma.product.update({
        where: { id },
        data,
      });
    });

    res.json({
      success: true,
      message: 'تم تحديث المنتج بنجاح',
      data: product,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير موجود',
      });
    }
    next(error);
  }
}

/**
 * DELETE /api/admin/products/:id
 * Delete a product
 */
async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;

    // Get product to delete image from Cloudinary if exists
    const product = await withRetry(async () => {
      return await prisma.product.findUnique({ where: { id } });
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير موجود',
      });
    }

    // Delete image from Cloudinary if exists
    if (product.imageUrl && product.imageUrl.includes('cloudinary.com')) {
      try {
        const publicId = product.imageUrl.split('/').slice(-1)[0].split('.')[0];
        await cloudinary.uploader.destroy(`lamsa/${publicId}`);
      } catch (err) {
        console.warn('[Admin] Failed to delete image from Cloudinary:', err.message);
      }
    }

    await withRetry(async () => {
      return await prisma.product.delete({ where: { id } });
    });

    res.json({
      success: true,
      message: 'تم حذف المنتج بنجاح',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/admin/products/upload-image
 * Upload image to Cloudinary
 */
async function uploadImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'لم يتم اختيار صورة',
      });
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return res.status(500).json({
        success: false,
        message: 'خدمة رفع الصور غير مفعلة. الرجاء تكوين Cloudinary في .env',
      });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'lamsa',
          resource_type: 'image',
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(req.file.buffer);
    });

    res.json({
      success: true,
      message: 'تم رفع الصورة بنجاح',
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (error) {
    console.error('[Admin] Image upload error:', error);
    next(error);
  }
}

/**
 * POST /api/admin/products/import-csv
 * Import products from CSV with smart upsert logic
 */
async function importCSV(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'لم يتم اختيار ملف CSV',
      });
    }

    const csvContent = req.file.buffer.toString('utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());

    if (lines.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'ملف CSV فارغ أو غير صالح',
      });
    }

    // Load subcategories mapping for validation
    const { SUBCATEGORIES, getSubCategoryId } = require('../../js/subcategories.js');

    // Parse CSV headers
    const headers = lines[0].split(',').map(h => h.trim());
    
    const results = {
      created: 0,
      updated: 0,
      skipped: 0,
      errors: []
    };

    // Process each row
    for (let i = 1; i < lines.length; i++) {
      const rowNum = i + 1;
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, '')); // Remove quotes
      const row = {};

      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      try {
        // Validation
        if (!row.nameAr || !row.nameAr.trim()) {
          results.errors.push({ row: rowNum, error: 'الاسم بالعربي مطلوب (nameAr)' });
          results.skipped++;
          continue;
        }

        if (!row.nameEn || !row.nameEn.trim()) {
          results.errors.push({ row: rowNum, error: 'الاسم بالإنجليزي مطلوب (nameEn)' });
          results.skipped++;
          continue;
        }

        if (!row.category || !row.category.trim()) {
          results.errors.push({ row: rowNum, error: 'الفئة مطلوبة (category)' });
          results.skipped++;
          continue;
        }

        const price = parseFloat(row.price);
        if (isNaN(price) || price < 0) {
          results.errors.push({ row: rowNum, error: `السعر غير صالح: ${row.price}` });
          results.skipped++;
          continue;
        }

        const stockQty = row.stockQty ? parseInt(row.stockQty, 10) : 100;
        if (isNaN(stockQty) || stockQty < 0) {
          results.errors.push({ row: rowNum, error: `الكمية غير صالحة: ${row.stockQty}` });
          results.skipped++;
          continue;
        }

        // Process subCategory: accept English ID or Arabic label
        let subCategory = null;
        if (row.subCategory && row.subCategory.trim()) {
          const subCatValue = row.subCategory.trim();
          const category = row.category.trim().toLowerCase();
          
          // Check if it's an English ID (valid)
          if (SUBCATEGORIES[category]) {
            const isValidId = SUBCATEGORIES[category].some(
              sub => sub.id.toLowerCase() === subCatValue.toLowerCase()
            );
            
            if (isValidId) {
              subCategory = subCatValue.toLowerCase();
            } else {
              // Try to convert from Arabic label
              const englishId = getSubCategoryId(subCatValue, category);
              if (englishId) {
                subCategory = englishId;
              } else {
                results.errors.push({ 
                  row: rowNum, 
                  error: `قيمة subCategory غير معروفة: "${subCatValue}" للفئة ${category}` 
                });
                results.skipped++;
                continue;
              }
            }
          }
        }

        // Build product data
        const productData = {
          nameAr: row.nameAr.trim(),
          nameEn: row.nameEn.trim(),
          category: row.category.trim().toLowerCase(),
          subCategory,
          price,
          stockQty,
          imageUrl: row.imageUrl && row.imageUrl.trim() ? row.imageUrl.trim() : null,
          emoji: row.emoji && row.emoji.trim() ? row.emoji.trim() : null,
          badge: row.badge && row.badge.trim() ? row.badge.trim() : null,
          family: row.family && row.family.trim() ? row.family.trim() : null,
        };

        // Parse array fields (pipe-separated)
        const arrayFields = ['skinTypes', 'concerns', 'hairTypes', 'budgetTier', 'forWhom', 'occasion'];
        arrayFields.forEach(field => {
          if (row[field] && row[field].trim()) {
            productData[field] = row[field].split('|').map(v => v.trim()).filter(Boolean);
          } else {
            productData[field] = [];
          }
        });

        // Smart upsert logic:
        // 1. If row has "id" and product exists with that ID → update
        // 2. Else if product exists with same nameEn + category → update
        // 3. Else → create new

        let existingProduct = null;

        if (row.id && row.id.trim()) {
          existingProduct = await withRetry(async () => {
            return await prisma.product.findUnique({
              where: { id: row.id.trim() }
            });
          });
        }

        if (!existingProduct) {
          existingProduct = await withRetry(async () => {
            return await prisma.product.findFirst({
              where: {
                nameEn: {
                  equals: productData.nameEn,
                  mode: 'insensitive'
                },
                category: {
                  equals: productData.category,
                  mode: 'insensitive'
                }
              }
            });
          });
        }

        if (existingProduct) {
          // Update existing product
          await withRetry(async () => {
            return await prisma.product.update({
              where: { id: existingProduct.id },
              data: productData
            });
          });
          results.updated++;
        } else {
          // Create new product
          const createData = row.id && row.id.trim() 
            ? { id: row.id.trim(), ...productData } 
            : productData;
          
          await withRetry(async () => {
            return await prisma.product.create({
              data: createData
            });
          });
          results.created++;
        }

      } catch (error) {
        console.error(`[Admin] Error processing row ${rowNum}:`, error);
        results.errors.push({ 
          row: rowNum, 
          error: error.message || 'خطأ غير معروف'
        });
        results.skipped++;
      }
    }

    // Build response message
    let message = `✅ تم الاستيراد: `;
    const parts = [];
    if (results.created > 0) parts.push(`${results.created} منتج جديد`);
    if (results.updated > 0) parts.push(`${results.updated} محدّث`);
    if (results.skipped > 0) parts.push(`${results.skipped} متجاوز`);
    message += parts.join(' | ');

    res.json({
      success: true,
      message,
      data: {
        created: results.created,
        updated: results.updated,
        skipped: results.skipped,
        errors: results.errors,
        total: lines.length - 1 // Exclude header
      }
    });
  } catch (error) {
    console.error('[Admin] CSV import error:', error);
    next(error);
  }
}

/**
 * GET /api/admin/products/export-csv
 * Export all products to CSV
 */
async function exportCSV(req, res, next) {
  try {
    const products = await withRetry(async () => {
      return await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
      });
    });

    // CSV headers (id column first)
    const headers = [
      'id',
      'nameAr',
      'nameEn',
      'category',
      'subCategory',
      'price',
      'stockQty',
      'imageUrl',
      'emoji',
      'badge',
      'skinTypes',
      'concerns',
      'hairTypes',
      'budgetTier',
      'forWhom',
      'occasion',
      'family',
    ];

    let csv = headers.join(',') + '\n';

    // Add products
    products.forEach(product => {
      const row = headers.map(header => {
        let value = product[header];
        
        // Convert arrays to pipe-separated string
        if (Array.isArray(value)) {
          value = value.join('|');
        }
        
        // Escape commas and quotes
        if (value == null) {
          return '';
        }
        
        value = String(value).replace(/"/g, '""');
        if (value.includes(',') || value.includes('\n')) {
          value = `"${value}"`;
        }
        
        return value;
      });

      csv += row.join(',') + '\n';
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="lamsa-products.csv"');
    res.send('\uFEFF' + csv); // BOM for Excel UTF-8
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/products/csv-template
 * Download CSV template
 */
function getCSVTemplate(req, res) {
  const headers = [
    'id',
    'nameAr',
    'nameEn',
    'category',
    'subCategory',
    'price',
    'stockQty',
    'imageUrl',
    'emoji',
    'badge',
    'skinTypes',
    'concerns',
    'hairTypes',
    'budgetTier',
    'forWhom',
    'occasion',
    'family',
  ];

  // Example rows
  const examples = [
    [
      '', // Empty id for new products
      'غسول الوجه المنقي',
      'Purifying Face Wash',
      'skin',
      'cleanser',
      '180',
      '50',
      '',
      '🧴',
      'new',
      'oily|combo',
      'acne',
      '',
      'eco|mid',
      '',
      '',
      '',
    ],
    [
      '', // Empty id for new products
      'شامبو للشعر الجاف',
      'Repair Shampoo',
      'hair',
      'shampoo',
      '150',
      '30',
      '',
      '🧖',
      '',
      '',
      '',
      'dry|damaged',
      'eco|mid',
      '',
      '',
      '',
    ],
  ];

  let csv = headers.join(',') + '\n';
  examples.forEach(row => {
    csv += row.join(',') + '\n';
  });

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="lamsa-products-template.csv"');
  res.send('\uFEFF' + csv);
}

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  importCSV,
  exportCSV,
  getCSVTemplate,
};
