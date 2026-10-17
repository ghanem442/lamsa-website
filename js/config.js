/* =============================================
   LAMSA — Store Settings (single source of truth)
   Edit ONLY this file to change the WhatsApp number.
   Shipping fee is now loaded from the API.
   ============================================= */

window.LAMSA_CONFIG = {
  // WhatsApp number in international format, digits only (no + and no spaces).
  // Example: 201012345678  = 0101 234 5678 in Egypt
  whatsappNumber: '201080239612'
};

// Local display format (e.g. 01080239612), derived safely
const _num = window.LAMSA_CONFIG.whatsappNumber.replace(/\D/g, '');
window.LAMSA_CONFIG.phoneDisplay = _num.startsWith('20') ? '0' + _num.slice(2) : _num;

// حماية: لو حد لعب في الملف والرقم باظ
window.LAMSA_CONFIG.whatsappNumber = _num;

// تجميد الإعدادات عشان مفيش كود تاني يغيرها بالغلط
Object.freeze(window.LAMSA_CONFIG);