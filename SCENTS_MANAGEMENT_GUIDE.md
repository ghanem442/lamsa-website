# 🌹 دليل إدارة العطور من لوحة التحكم

## ✅ تم إنشاء نظام كامل لإدارة العطور!

الآن يمكنك **إضافة، تعديل، وحذف العطور** مباشرة من لوحة التحكم بدلاً من التعديل اليدوي في الكود!

---

## 📋 ما تم تنفيذه:

### 1️⃣ **قاعدة البيانات**
- ✅ إنشاء جدول `scents` في PostgreSQL
- ✅ الحقول: الطبقة، الاسم، الرمز، الوصف، الألوان، القوة، الحالة، الترتيب
- ✅ Migration file جاهز في: `prisma/migrations/20261017000000_add_scents_table/`

### 2️⃣ **Backend API**
ملفات جديدة تم إنشاؤها:
- ✅ `src/controllers/scent.controller.js` - 6 endpoints
- ✅ `src/routes/scent.routes.js` - Routes للعطور
- ✅ تسجيل الـ routes في `src/routes/index.js`

**Endpoints المتاحة:**
```
GET    /api/scents                    - جلب جميع العطور (عام)
GET    /api/scents/by-layer          - جلب العطور مقسمة حسب الطبقة
POST   /api/scents                    - إضافة عطر جديد (Admin)
PUT    /api/scents/:id                - تعديل عطر (Admin)
DELETE /api/scents/:id                - حذف عطر (Admin)
POST   /api/scents/seed-defaults      - استعادة 18 عطر افتراضي (Admin)
```

### 3️⃣ **Frontend (admin.html)**
- ✅ واجهة كاملة لإدارة العطور
- ✅ Modal لإضافة/تعديل العطور
- ✅ جدول يعرض جميع العطور مع تفاصيلها
- ✅ فلاتر للطبقات (الكل / المقدمة / القلب / القاعدة)
- ✅ زر "استعادة العطور الافتراضية"

### 4️⃣ **API Helper (js/api.js)**
تم إضافة 6 functions:
```javascript
LAMSA_API.getAllScents()
LAMSA_API.getScentsByLayer()
LAMSA_API.adminCreateScent()
LAMSA_API.adminUpdateScent()
LAMSA_API.adminDeleteScent()
LAMSA_API.adminSeedDefaultScents()
```

---

## 🚀 كيفية الاستخدام:

### خطوة 1: تطبيق Migration على قاعدة البيانات

```bash
cd c:\Users\GHANEM\Desktop\lamsa-website
npx prisma migrate deploy
```

أو إذا لم يعمل (بسبب الاتصال):
```bash
npx prisma db push
```

### خطوة 2: إعادة تشغيل السيرفر

```bash
npm run dev
```

### خطوة 3: فتح لوحة التحكم

1. اذهب إلى: `http://localhost:3000/admin.html`
2. سجل دخول كـ Admin
3. اسكرول لأسفل إلى قسم "🌹 قائمة العطور والتركيبات"

---

## 🎨 إدارة العطور من لوحة التحكم:

### ➕ إضافة عطر جديد:
1. اضغط "➕ إضافة عطر جديد"
2. املأ البيانات:
   - **الطبقة**: اختر (المقدمة / القلب / القاعدة)
   - **الاسم بالعربية**: مثل "برغموت إيطالي"
   - **الرمز التعبيري**: مثل 🍋
   - **اللون**: Hex code مثل `#FFE066`
   - **لون التوهج**: RGBA مثل `rgba(255, 224, 102, 0.5)`
   - **الوصف**: نص قصير
   - **قوة الانتشار**: للمقدمة والقلب (1-15)
   - **قوة الثبات**: للقاعدة فقط (1-15)
   - **الحالة**: نشط (يظهر للزبائن) أو مخفي
   - **ترتيب العرض**: رقم (الأقل يظهر أولاً)
3. اضغط "💾 حفظ العطر"

### ✏️ تعديل عطر موجود:
1. اضغط ✏️ بجانب العطر
2. عدّل البيانات
3. احفظ

### 🗑️ حذف عطر:
1. اضغط 🗑️ بجانب العطر
2. أكد الحذف

### 🔄 استعادة العطور الافتراضية:
اضغط "🔄 استعادة العطور الافتراضية" لحذف كل العطور واستبدالها بـ **18 عطر افتراضي**:
- 6 عطور للمقدمة (Top Notes)
- 6 عطور للقلب (Heart Notes)
- 6 عطور للقاعدة (Base Notes)

---

## 🌐 استخدام العطور في perfume.html:

حالياً، `perfume.html` مازال يستخدم البيانات المكتوبة فيه مباشرة (hardcoded).

**لربطه بقاعدة البيانات لاحقاً:**
1. استبدل `const TOP_NOTES = [...]` بـ:
```javascript
let TOP_NOTES = [];
let HEART_NOTES = [];
let BASE_NOTES = [];

async function loadScentsFromAPI() {
  try {
    const data = await LAMSA_API.getScentsByLayer(true);
    TOP_NOTES = data.data.top;
    HEART_NOTES = data.data.heart;
    BASE_NOTES = data.data.base;
    
    // إعادة تهيئة العطور المختارة
    selectedTop = TOP_NOTES[0];
    selectedHeart = HEART_NOTES[1];
    selectedBase = BASE_NOTES[0];
    
    renderNotesGrid();
  } catch (error) {
    console.error('[Perfume] Error loading scents:', error);
    // Fallback to hardcoded if API fails
  }
}

// استدعاء عند تحميل الصفحة
loadScentsFromAPI();
```

---

## 📊 بنية البيانات:

### Scent Object:
```javascript
{
  id: "uuid",
  layer: "top" | "heart" | "base",
  nameAr: "برغموت إيطالي",
  nameEn: "Bergamot",
  icon: "🍋",
  description: "حمضي منعش وفواح",
  color: "#FFE066",
  glowColor: "rgba(255, 224, 102, 0.5)",
  boostSillage: 8,        // للمقدمة والقلب فقط
  boostLongevity: null,   // للقاعدة فقط
  isActive: true,
  sortOrder: 1,
  createdAt: "2026-10-17T...",
  updatedAt: "2026-10-17T..."
}
```

---

## 🔒 الأمان:

- ✅ جميع endpoints الـ Admin محمية بـ `authenticate` + `requireAdmin`
- ✅ Validation على جميع الحقول
- ✅ SQL Injection آمن (Prisma ORM)
- ✅ XSS Protection (escapeHtml في الواجهة)

---

## ⚡ المميزات:

✅ **إدارة كاملة من Admin Panel** - بدون تعديل كود  
✅ **تصنيف حسب الطبقة** - Top / Heart / Base  
✅ **حالة النشاط** - إخفاء/إظهار للزبائن  
✅ **ترتيب مخصص** - تحكم في ترتيب الظهور  
✅ **استعادة سريعة** - 18 عطر افتراضي بضغطة زر  
✅ **ثنائي اللغة** - دعم عربي وإنجليزي  
✅ **معلومات مفصلة** - رموز، ألوان، أوصاف، قوة الانتشار/الثبات  

---

## 📝 الملفات المُعدَّلة:

### ✨ ملفات جديدة:
1. `src/controllers/scent.controller.js`
2. `src/routes/scent.routes.js`
3. `prisma/migrations/20261017000000_add_scents_table/migration.sql`
4. `SCENTS_MANAGEMENT_GUIDE.md` (هذا الملف)

### 🔧 ملفات مُحدَّثة:
1. `prisma/schema.prisma` - إضافة model Scent و enum ScentLayer
2. `src/routes/index.js` - تسجيل scent routes
3. `js/api.js` - إضافة 6 API functions
4. `admin.html` - استبدال نظام localStorage بنظام Database
5. `perfume.html` - إضافة 3 عطور تجريبية (اختياري)

---

## 🎯 الخطوة التالية (اختياري):

إذا أردت ربط `perfume.html` بقاعدة البيانات بدلاً من Hardcoded arrays:
1. اتبع التعليمات في قسم "استخدام العطور في perfume.html" أعلاه
2. هذا سيجعل أي تغيير في Admin Panel يظهر فوراً في صفحة العطور

---

**آخر تحديث:** 2026-10-17  
**الحالة:** ✅ جاهز للاستخدام (بعد تطبيق Migration)
