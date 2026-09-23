/* =============================================
   LAMSA — Store Settings (single source of truth)
   Edit ONLY this file to change the WhatsApp number
   or the shipping fees. It must be loaded BEFORE
   js/main.js on every page.
   ============================================= */

window.LAMSA_CONFIG = {
  // WhatsApp number in international format, digits only (no + and no spaces).
  // Example: 201012345678  = 0101 234 5678 in Egypt
  whatsappNumber: '201080239612',

  shipping: {
    // Fee used when a governorate is not listed below (EGP)
    defaultFee: 35,

    // Governorates shown in the checkout form, in this order.
    // "name" is what the customer sees, "fee" is the shipping cost in EGP.
    // (All fees are 35 for now = the previous flat rate. Set your real prices here.)
    cities: [
      { name: 'القاهرة',              fee: 35 },
      { name: 'الجيزة',               fee: 35 },
      { name: 'الإسكندرية',           fee: 35 },
      { name: 'المنصورة / الدقهلية',  fee: 35 },
      { name: 'طنطا / الغربية',       fee: 35 },
      { name: 'الشرقية',              fee: 35 },
      { name: 'باقي المحافظات',       fee: 35 }
    ]
  }
};

// Local display format (e.g. 01080239612), derived from the number above.
window.LAMSA_CONFIG.phoneDisplay =
  '0' + window.LAMSA_CONFIG.whatsappNumber.replace(/^20/, '');
