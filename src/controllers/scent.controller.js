const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get all scents (with optional filtering by layer and active status)
 * Public endpoint - used by perfume.html
 */
async function getAllScents(req, res) {
  try {
    const { layer, active } = req.query;
    
    const where = {};
    if (layer) where.layer = layer;
    if (active !== undefined) where.isActive = active === 'true';
    
    const scents = await prisma.scent.findMany({
      where,
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'asc' }
      ]
    });
    
    res.json({
      success: true,
      data: scents
    });
  } catch (error) {
    console.error('[Scent] Error fetching scents:', error);
    res.status(500).json({
      success: false,
      message: 'فشل تحميل قائمة العطور'
    });
  }
}

/**
 * Get scents grouped by layer (top/heart/base)
 * Public endpoint - optimized for perfume.html
 */
async function getScentsByLayer(req, res) {
  try {
    const { active } = req.query;
    
    const where = { isActive: active === 'false' ? false : true };
    
    const [topNotes, heartNotes, baseNotes] = await Promise.all([
      prisma.scent.findMany({
        where: { ...where, layer: 'top' },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }]
      }),
      prisma.scent.findMany({
        where: { ...where, layer: 'heart' },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }]
      }),
      prisma.scent.findMany({
        where: { ...where, layer: 'base' },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }]
      })
    ]);
    
    res.json({
      success: true,
      data: {
        top: topNotes,
        heart: heartNotes,
        base: baseNotes
      }
    });
  } catch (error) {
    console.error('[Scent] Error fetching scents by layer:', error);
    res.status(500).json({
      success: false,
      message: 'فشل تحميل قائمة العطور'
    });
  }
}

/**
 * Create a new scent (Admin only)
 */
async function createScent(req, res) {
  try {
    const {
      layer,
      nameAr,
      nameEn,
      icon,
      description,
      color,
      glowColor,
      boostSillage,
      boostLongevity,
      isActive,
      sortOrder
    } = req.body;
    
    // Validation
    if (!layer || !['top', 'heart', 'base'].includes(layer)) {
      return res.status(400).json({
        success: false,
        message: 'يجب تحديد الطبقة (top, heart, base)'
      });
    }
    
    if (!nameAr || nameAr.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'يجب إدخال اسم العطر بالعربية (حرفين على الأقل)'
      });
    }
    
    if (!description || description.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'يجب إدخال وصف العطر (3 أحرف على الأقل)'
      });
    }
    
    // Create scent
    const scent = await prisma.scent.create({
      data: {
        layer,
        nameAr: nameAr.trim(),
        nameEn: nameEn?.trim() || null,
        icon: icon || '🌸',
        description: description.trim(),
        color: color || '#FFE066',
        glowColor: glowColor || 'rgba(255, 224, 102, 0.5)',
        boostSillage: layer !== 'base' ? (boostSillage || 5) : null,
        boostLongevity: layer === 'base' ? (boostLongevity || 8) : null,
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder || 0
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'تم إضافة العطر بنجاح',
      data: scent
    });
  } catch (error) {
    console.error('[Scent] Error creating scent:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إضافة العطر'
    });
  }
}

/**
 * Update an existing scent (Admin only)
 */
async function updateScent(req, res) {
  try {
    const { id } = req.params;
    const {
      layer,
      nameAr,
      nameEn,
      icon,
      description,
      color,
      glowColor,
      boostSillage,
      boostLongevity,
      isActive,
      sortOrder
    } = req.body;
    
    // Check if scent exists
    const existingScent = await prisma.scent.findUnique({
      where: { id }
    });
    
    if (!existingScent) {
      return res.status(404).json({
        success: false,
        message: 'العطر غير موجود'
      });
    }
    
    // Build update data
    const updateData = {};
    if (layer !== undefined && ['top', 'heart', 'base'].includes(layer)) updateData.layer = layer;
    if (nameAr !== undefined) updateData.nameAr = nameAr.trim();
    if (nameEn !== undefined) updateData.nameEn = nameEn?.trim() || null;
    if (icon !== undefined) updateData.icon = icon;
    if (description !== undefined) updateData.description = description.trim();
    if (color !== undefined) updateData.color = color;
    if (glowColor !== undefined) updateData.glowColor = glowColor;
    if (boostSillage !== undefined) updateData.boostSillage = boostSillage;
    if (boostLongevity !== undefined) updateData.boostLongevity = boostLongevity;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
    
    const scent = await prisma.scent.update({
      where: { id },
      data: updateData
    });
    
    res.json({
      success: true,
      message: 'تم تحديث العطر بنجاح',
      data: scent
    });
  } catch (error) {
    console.error('[Scent] Error updating scent:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث العطر'
    });
  }
}

/**
 * Delete a scent (Admin only)
 */
async function deleteScent(req, res) {
  try {
    const { id } = req.params;
    
    // Check if scent exists
    const existingScent = await prisma.scent.findUnique({
      where: { id }
    });
    
    if (!existingScent) {
      return res.status(404).json({
        success: false,
        message: 'العطر غير موجود'
      });
    }
    
    await prisma.scent.delete({
      where: { id }
    });
    
    res.json({
      success: true,
      message: 'تم حذف العطر بنجاح'
    });
  } catch (error) {
    console.error('[Scent] Error deleting scent:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حذف العطر'
    });
  }
}

/**
 * Seed default scents (Admin only - for initial setup)
 */
async function seedDefaultScents(req, res) {
  try {
    const defaultScents = [
      // Top Notes
      { layer: 'top', nameAr: 'برغموت إيطالي', icon: '🍋', description: 'حمضي منعش وفواح', color: '#FFE066', glowColor: 'rgba(255, 224, 102, 0.5)', boostSillage: 8, sortOrder: 1 },
      { layer: 'top', nameAr: 'لافندر فرنسي', icon: '🪻', description: 'أناقة وهدوء كلاسيكي', color: '#B388FF', glowColor: 'rgba(179, 136, 255, 0.5)', boostSillage: 5, sortOrder: 2 },
      { layer: 'top', nameAr: 'هيل وتوابل حارة', icon: '🌿', description: 'دفء وجاذبية آسرة', color: '#80E27E', glowColor: 'rgba(128, 226, 126, 0.5)', boostSillage: 7, sortOrder: 3 },
      { layer: 'top', nameAr: 'توت وفواكه برية', icon: '🍓', description: 'حيوية وبهجة حلوة', color: '#FF5252', glowColor: 'rgba(255, 82, 82, 0.5)', boostSillage: 6, sortOrder: 4 },
      { layer: 'top', nameAr: 'نسيم البحر المنعش', icon: '🌊', description: 'نقاء وانتعاش صيفي', color: '#40C4FF', glowColor: 'rgba(64, 196, 255, 0.5)', boostSillage: 9, sortOrder: 5 },
      { layer: 'top', nameAr: 'حمضيات استوائية', icon: '🍊', description: 'انتعاش وطاقة إيجابية', color: '#FFA726', glowColor: 'rgba(255, 167, 38, 0.5)', boostSillage: 7, sortOrder: 6 },
      
      // Heart Notes
      { layer: 'heart', nameAr: 'ياسمين دمشقي', icon: '🌸', description: 'رقة وأنوثة فتاكة', color: '#FFF9C4', glowColor: 'rgba(255, 249, 196, 0.4)', boostSillage: 6, sortOrder: 1 },
      { layer: 'heart', nameAr: 'ورد طائفي ملكي', icon: '🌹', description: 'أصالة وفخامة شرقية', color: '#FF4081', glowColor: 'rgba(255, 64, 129, 0.5)', boostSillage: 8, sortOrder: 2 },
      { layer: 'heart', nameAr: 'تونكا وكراميل', icon: '🌰', description: 'حلاوة دافئة ومثيرة', color: '#FFB74D', glowColor: 'rgba(255, 183, 77, 0.5)', boostSillage: 7, sortOrder: 3 },
      { layer: 'heart', nameAr: 'جلود وأخشاب فاخرة', icon: '🧥', description: 'طابع رجالي قوي', color: '#8D6E63', glowColor: 'rgba(141, 110, 99, 0.5)', boostSillage: 9, sortOrder: 4 },
      { layer: 'heart', nameAr: 'أوركيد سوداء', icon: '🌺', description: 'سحر وغموض ليلي', color: '#AB47BC', glowColor: 'rgba(171, 71, 188, 0.5)', boostSillage: 8, sortOrder: 5 },
      { layer: 'heart', nameAr: 'زهرة السوسن الفرنسية', icon: '🪷', description: 'نبل وأناقة راقية', color: '#9FA8DA', glowColor: 'rgba(159, 168, 218, 0.5)', boostSillage: 7, sortOrder: 6 },
      
      // Base Notes
      { layer: 'base', nameAr: 'عود كمبودي معتق', icon: '🪵', description: 'ثبات جبار وفخامة طاغية', color: '#4E342E', glowColor: 'rgba(78, 52, 46, 0.7)', boostLongevity: 12, sortOrder: 1 },
      { layer: 'base', nameAr: 'عنبر ملكي نادر', icon: '💎', description: 'دفء وفوحان يدوم لأيام', color: '#FF8F00', glowColor: 'rgba(255, 143, 0, 0.6)', boostLongevity: 10, sortOrder: 2 },
      { layer: 'base', nameAr: 'فانيليا مدغشقر', icon: '🍦', description: 'إغراء ونعومة ساحرة', color: '#FFE082', glowColor: 'rgba(255, 224, 130, 0.5)', boostLongevity: 8, sortOrder: 3 },
      { layer: 'base', nameAr: 'مسك الطهارة والحرير', icon: '🌫️', description: 'نقاء ونظافة تدوم', color: '#ECEFF1', glowColor: 'rgba(236, 239, 241, 0.5)', boostLongevity: 9, sortOrder: 4 },
      { layer: 'base', nameAr: 'خشب الصندل والأرز', icon: '🪵', description: 'عمق خشبي أرستقراطي', color: '#A1887F', glowColor: 'rgba(161, 136, 127, 0.6)', boostLongevity: 11, sortOrder: 5 },
      { layer: 'base', nameAr: 'باتشولي ترابي', icon: '🍂', description: 'عمق طبيعي وجاذبية ساحرة', color: '#6D4C41', glowColor: 'rgba(109, 76, 65, 0.6)', boostLongevity: 10, sortOrder: 6 }
    ];
    
    // Delete existing scents first
    await prisma.scent.deleteMany();
    
    // Insert default scents
    const created = await prisma.scent.createMany({
      data: defaultScents
    });
    
    res.json({
      success: true,
      message: `تم استعادة ${created.count} عطر افتراضي بنجاح`,
      data: { count: created.count }
    });
  } catch (error) {
    console.error('[Scent] Error seeding default scents:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء استعادة العطور الافتراضية'
    });
  }
}

module.exports = {
  getAllScents,
  getScentsByLayer,
  createScent,
  updateScent,
  deleteScent,
  seedDefaultScents
};
