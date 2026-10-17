# 🌹 مصدر بيانات صفحة العطور (perfume.html)

## 📍 من أين تأتي البيانات؟

### 1️⃣ **بيانات الروائح والتركيبات (Hardcoded في perfume.html)**

البيانات موجودة **مباشرة** في ملف `perfume.html` في صورة 3 Arrays ثابتة:

#### 🔸 المقدمة (Top Notes):
```javascript
const TOP_NOTES = [
  { id: 'top_bergamot', name: 'برغموت إيطالي', icon: '🍋', desc: '...', ... },
  { id: 'top_lavender', name: 'لافندر فرنسي', icon: '🪻', desc: '...', ... },
  // ... المزيد
];
```
**العدد الحالي:** 6 عطور (بعد إضافة "حمضيات استوائية")

#### 🔸 القلب (Heart Notes):
```javascript
const HEART_NOTES = [
  { id: 'heart_jasmine', name: 'ياسمين دمشقي', icon: '🌸', desc: '...', ... },
  { id: 'heart_rose', name: 'ورد طائفي ملكي', icon: '🌹', desc: '...', ... },
  // ... المزيد
];
```
**العدد الحالي:** 6 عطور (بعد إضافة "زهرة السوسن الفرنسية")

#### 🔸 القاعدة (Base Notes):
```javascript
const BASE_NOTES = [
  { id: 'base_oud', name: 'عود كمبودي معتق', icon: '🪵', desc: '...', ... },
  { id: 'base_amber', name: 'عنبر ملكي نادر', icon: '💎', desc: '...', ... },
  // ... المزيد
];
```
**العدد الحالي:** 6 عطور (بعد إضافة "باتشولي ترابي")

---

### 2️⃣ **التركيبات الجاهزة (Presets)**

موجودة في دالة `renderPresetsGrid()` كـ array ثابت أيضاً:
```javascript
const PRESETS = [
  { name: 'سوفاج الملكي (Sauvage Blend)', top: '...', heart: '...', base: '...', vibe: '...' },
  { name: 'كريد أفينتوس الأرستقراطي (Aventus)', top: '...', heart: '...', base: '...', vibe: '...' },
  // ... المزيد
];
```

---

### 3️⃣ **الأسعار فقط من الـ Backend (API)**

```javascript
const data = await LAMSA_API.getPerfumePrices();
// يسحب أسعار الأحجام والتركيزات من:
// GET /api/settings/perfume-prices
```

**الأسعار المدارة من لوحة التحكم:**
- 30ml EDT
- 30ml EDP
- 30ml Extrait
- 50ml EDT
- 50ml EDP
- 50ml Extrait
- 100ml EDT
- 100ml EDP
- 100ml Extrait

---

## 📝 كيفية إضافة عطور جديدة؟

### خطوات إضافة عطر جديد:

1. **افتح ملف `perfume.html`**
2. **ابحث عن المتغير المناسب:**
   - `TOP_NOTES` للمقدمة
   - `HEART_NOTES` للقلب
   - `BASE_NOTES` للقاعدة

3. **أضف عنصر جديد بهذا الشكل:**
```javascript
{
  id: 'top_unique_id',           // معرف فريد (يجب أن يبدأ بـ top_ أو heart_ أو base_)
  name: 'اسم العطر بالعربي',     // الاسم المعروض
  icon: '🌺',                     // إيموجي للأيقونة
  desc: 'وصف قصير للعطر',        // وصف مختصر
  color: '#FF5733',              // لون الخلفية (Hex code)
  glow: 'rgba(255,87,51,0.5)',   // لون التوهج عند التحديد
  boostSillage: 7                // قوة الانتشار (للمقدمة والقلب)
  // أو
  boostLongevity: 10             // قوة الثبات (للقاعدة فقط)
}
```

---

## ✅ التعديلات المُنفَّذة للتجربة:

تم إضافة **3 عطور جديدة** كبيانات تجريبية:

### 🆕 المقدمة (Top Notes):
- ✅ **حمضيات استوائية** 🍊 - "انتعاش وطاقة إيجابية"

### 🆕 القلب (Heart Notes):
- ✅ **زهرة السوسن الفرنسية** 🪷 - "نبل وأناقة راقية"

### 🆕 القاعدة (Base Notes):
- ✅ **باتشولي ترابي** 🍂 - "عمق طبيعي وجاذبية ساحرة"

---

## 🎯 الخلاصة:

| المكون | المصدر | قابل للتعديل |
|--------|--------|--------------|
| **الروائح (Top/Heart/Base)** | Hardcoded في `perfume.html` | ✅ نعم - عدّل مباشرة في الملف |
| **التركيبات الجاهزة (Presets)** | Hardcoded في `perfume.html` | ✅ نعم - عدّل في دالة `renderPresetsGrid()` |
| **الأسعار (Prices)** | Backend API | ✅ نعم - من لوحة التحكم في admin.html |

---

## 🔮 مستقبلاً - إذا أردت نقل البيانات للباك إند:

يمكنك إنشاء:
1. **جدول `Scents` في قاعدة البيانات**
2. **API endpoints:**
   - `GET /api/scents` - جلب جميع الروائح
   - `POST /api/admin/scents` - إضافة عطر جديد
   - `PUT /api/admin/scents/:id` - تعديل عطر
   - `DELETE /api/admin/scents/:id` - حذف عطر

3. **صفحة في admin.html** لإدارة قائمة العطور (مثل إدارة المنتجات)

**لكن حالياً:** البيانات ثابتة في الـ Frontend وهذا جيد للبساطة والسرعة! ✨

---

**آخر تحديث:** 2026-10-17  
**العدد الحالي:** 6 + 6 + 6 = **18 عطر** مختلف
