# 🔧 حلول سريعة للمشاكل الشائعة

## 🐛 المشاكل المحتملة وحلولها

### 1. ❌ السلة لا تعمل / "cart is not defined"

**السبب:** ترتيب تحميل ملفات JavaScript خاطئ

**الحل:**
تأكد أن الترتيب في HTML كالتالي:
```html
<script src="js/data.js"></script>     <!-- أولاً -->
<script src="js/main.js"></script>     <!-- ثانياً -->
```

---

### 2. ❌ Dark Mode لا يحفظ عند إعادة التحميل

**السبب:** المتصفح يمنع LocalStorage

**الحل:**
افتح `Developer Tools` → `Application` → تأكد أن LocalStorage مفعل

---

### 3. ❌ WhatsApp لا يفتح عند الطلب

**السبب:** Pop-up Blocker

**الحل:**
- اسمح للـ pop-ups من الموقع
- أو استخدم الموبايل للاختبار

---

### 4. ❌ الصور لا تظهر (Logo)

**السبب:** المسار خاطئ أو الملف مفقود

**الحل:**
تأكد من وجود الملف:
```
assets/logo.png
```

إذا كان مفقود، ضع أي صورة واسمها `logo.png` في مجلد `assets`

---

### 5. ❌ الـ Mobile Menu لا يفتح

**السبب:** JavaScript محمل بعد DOM

**الحل:**
تأكد أن `<script>` موجود قبل `</body>` مباشرة

---

### 6. ❌ اللغة لا تتغير

**السبب:** مفاتيح الترجمة `data-key` ناقصة

**الحل:**
تأكد أن كل نص له `data-key`:
```html
<h1 data-key="hero_title">لمسة تفرق</h1>
```

---

### 7. ❌ Confetti لا يظهر

**السبب:** الدالة لم تُستدعى

**الحل:**
تأكد من استدعاء `triggerConfetti()` في `submitOrder`

---

### 8. ❌ الألوان غريبة في Dark Mode

**السبب:** CSS Variables غير محدثة

**الحل:**
تأكد من وجود:
```css
[data-theme="dark"] {
  --bg-page: #150406;
  --text-dark: #FAF6F6;
  /* ... */
}
```

---

### 9. ❌ الـ Routine لا يعطي نتائج

**السبب:** بيانات المنتجات لا تحتوي على `skinType` أو `hairType`

**الحل:**
في `data.js` تأكد أن كل منتج له:
```javascript
{
  id: 'sk1',
  skinType: ['oily', 'combo'],  // مهم
  budget: ['eco', 'mid'],       // مهم
  // ...
}
```

---

### 10. ❌ صفحة بيضاء / Console Errors

**السبب:** خطأ JavaScript يوقف التنفيذ

**الحل:**
افتح `Console` (F12) واقرأ الخطأ، عادة:
- Missing semicolon
- Undefined variable
- Wrong function name

---

## 🚀 تحسينات سريعة

### تسريع التحميل:
```html
<!-- أضف في <head> -->
<link rel="preload" href="css/main.css" as="style">
<link rel="preload" href="js/main.js" as="script">
```

### تحسين SEO:
```html
<!-- أضف في <head> -->
<meta name="description" content="متجر لمسة للعناية الفاخرة">
<meta property="og:title" content="لمسة | LAMSA">
<meta property="og:image" content="assets/logo.png">
```

### إضافة Favicon:
```html
<link rel="icon" href="assets/logo.png" type="image/png">
```

---

## 🔍 كيف تكتشف المشكلة؟

### 1. افتح Developer Tools (F12)
### 2. اضغط على Tab "Console"
### 3. ابحث عن رسائل حمراء (Errors)
### 4. اقرأ السطر والملف
### 5. صلح المشكلة

---

## 🎨 تخصيصات سريعة

### تغيير اللون الأساسي:
في `main.css`:
```css
:root {
  --burgundy: #5C0E14;  /* غير هذا */
  --gold: #D4AF37;      /* وهذا */
}
```

### تغيير الخط:
```css
:root {
  --font-ar: 'Alexandria', sans-serif;  /* للعربي */
  --font-en: 'Plus Jakarta Sans', sans-serif;  /* للإنجليزي */
}
```

### تغيير Border Radius:
```css
:root {
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-xl: 40px;  /* غير الأرقام كما تحب */
}
```

---

## 💡 نصائح مهمة

### 1. اختبر على متصفحات مختلفة:
- ✅ Chrome
- ✅ Firefox
- ✅ Safari (Mac/iPhone)
- ✅ Edge

### 2. اختبر على أجهزة حقيقية:
- 📱 موبايل
- 📱 تابلت
- 💻 لابتوب
- 🖥️ ديسكتوب

### 3. استخدم DevTools Mobile Emulator:
- F12
- Toggle Device Toolbar (Ctrl+Shift+M)
- جرب مقاسات مختلفة

---

## 🆘 إذا فشل كل شيء...

### الحل النهائي:
1. احذف كل ملفات LocalStorage:
   - F12 → Application → Local Storage → Clear All
2. Hard Reload:
   - Ctrl+Shift+R (Windows)
   - Cmd+Shift+R (Mac)
3. جرب في Incognito Mode
4. جرب متصفح مختلف

---

## 📞 تحتاج مساعدة إضافية؟

تواصل معي أو راجع:
- `TEST_CHECKLIST.md` للاختبارات الشاملة
- `README.md` للوثائق الكاملة
- Console في المتصفح لرسائل الأخطاء

---

**آخر تحديث:** 22 أغسطس 2026 ✅

---

## 🎉 تحديث هام: تم إصلاح المشاكل الرئيسية!

### ✅ **Dark Mode والـ Language Toggle تم إصلاحهم**
- **المشكلة:** كان في تكرار في DOMContentLoaded event listeners
- **الحل:** تم حذف الـ duplicate وتوحيد جميع الـ listeners في قسم Init واحد
- **النتيجة:** الآن Dark Mode وتغيير اللغة يعملان بسلاسة تامة! 🌙✨

---
