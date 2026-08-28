/* =============================================
   LAMSA — Language Translations & Main JS
   (Luxury + Dark Mode + QuickView + Checkout)
   ============================================= */

// ── Translations ──────────────────────────────
const t = {
  ar: {
    // Nav
    nav_skincare:  'العناية بالبشرة',
    nav_haircare:  'العناية بالشعر',
    nav_perfumes:  'العطور',
    nav_gifts:     'الهدايا',
    nav_sets:      'المجموعات',
    nav_shop:      'المتجر',
    nav_about:     'عن لمسة',
    nav_contact:   'تواصل معنا',
    nav_routine:   'اختارلي روتين',
    nav_gift:      'صمم هديتك',
    nav_perfume:   'اعمل برفانك',

    // Home Hero
    hero_tag:      '✨ عالم الجمال والعناية الفاخرة',
    hero_title:    'لمسة تفرق',
    hero_sub:      'عناية فائقة بالبشرة والشعر، تركيبات عطور حصرية نصنعها لك، وهدايا مميزة تليق بك — كل ما تحتاجينه في مكان واحد.',
    hero_cta:      'تسوقي الآن',
    hero_cta2:     'اكتشفي روتينك',

    // Feature Cards
    feat_routine_title:  'اختارلي روتين',
    feat_routine_sub:    'روتين عناية ذكي ومخصص بالكامل لبشرتك وشعرك وميزانيتك',
    feat_routine_btn:    'ابدئي الآن',
    feat_gift_title:     'صمم هديتك',
    feat_gift_sub:       'اختاري المناسبة وسنقوم بتنسيق هدية فاخرة تعبر عن ذوقك',
    feat_gift_btn:       'صممي هديتك',
    feat_perfume_title:  'اعمل برفانك',
    feat_perfume_sub:    'تركيبة عطرية يدوية خاصة نصنعها بحرفية وخبرة',
    feat_perfume_btn:    'ابدئي التركيبة',

    // Sections
    picks_title:    'مختارات لمسة',
    picks_sub:      'منتجات مختارة بعناية لمنحك أفضل تجربة إشراق وجمال',
    view_all:       'عرض الكل',
    about_title:    'عن متجرنا',
    why_title:      'لماذا لمسة؟',
    reviews_title:  'آراء عملاءنا',
    reviews_sub:    'ثقتكم ورضاكم هي أجمل لمسة نسعى لها دائماً',

    // Why Us
    why_1_title:  'عطور يدوية',
    why_1_desc:   'نصنع تركيبات عطرية فريدة بأيدينا خصيصاً لك',
    why_2_title:  'جودة مضمونة',
    why_2_desc:   'منتجات أصلية 100% مختارة بأعلى المعايير',
    why_3_title:  'تغليف فاخر',
    why_3_desc:   'كل طلب وهدية تُغلّف بعناية ورقي يعبر عن مشاعرك',
    why_4_title:  'خبرة واستشارة',
    why_4_desc:   'نساعدك خطوة بخطوة في اختيار الروتين الأنسب لك',

    // Shop
    shop_title:   'المتجر',
    shop_sub:     'اكتشفي مجموعتنا الفاخرة من منتجات العناية بالبشرة، الشعر، العطور، والهدايا',
    filter_all:   'الكل',
    filter_skin:  'البشرة',
    filter_hair:  'الشعر',
    filter_body:  'الجسم',
    filter_perf:  'العطور',
    filter_gifts: 'الهدايا',
    filter_acc:   'إكسسوارات',
    filter_dev:   'أجهزة',
    add_cart:     'أضف للسلة',
    added_cart:   'أُضيف ✓',
    sort_new:     'الأحدث',
    sort_low:     'السعر: الأقل',
    sort_high:    'السعر: الأعلى',

    // Cart
    cart_title:    'السلة',
    cart_empty:    'سلتك فارغة',
    cart_empty_sub: 'أضيفي منتجاتك المفضلة',
    cart_total:    'المجموع',
    cart_checkout: 'إتمام الطلب والشحن 🚀',
    cart_whatsapp: 'طلب سريع عبر واتساب 💬',

    // Routine Quiz
    routine_title:    'اختارلي روتين',
    routine_sub:      'أجيبي على 4 أسئلة بسيطة ونطلعلك روتينك المثالي',
    step:             'الخطوة',
    of:               'من',
    q1_title:         'ما هو نوع بشرتك؟',
    q1_sub:           'يساعدنا هذا في اختيار التركيبات والمكونات المناسبة لبشرتك بدقة',
    q1_dry:           'جافة',
    q1_dry_d:         'تحتاج ترطيب مكثف',
    q1_oily:          'دهنية',
    q1_oily_d:        'تحتاج تحكم في الدهون',
    q1_combo:         'مختلطة',
    q1_combo_d:       'جافة وزيتية معاً',
    q1_sensitive:     'حساسة',
    q1_sensitive_d:   'تحتاج منتجات لطيفة ومهدئة',
    q2_title:         'ما هو نوع شعرك؟',
    q2_sub:           'لنكمل روتين العناية المتكامل لشعرك أيضاً',
    q2_dry:           'جاف',
    q2_dry_d:         'يحتاج تغذية وترطيب عميق',
    q2_oily:          'دهني',
    q2_oily_d:        'يصبح زيتياً ومحتاج تنقية',
    q2_damaged:       'تالف / متقصف',
    q2_damaged_d:     'محتاج إصلاح وتقوية',
    q2_normal:        'عادي / صحي',
    q2_normal_d:      'يحتاج عناية متوازنة',
    q3_title:         'ما هي مشكلتك الأساسية؟',
    q3_sub:           'يمكنك اختيار أكثر من مشكلة لنعالجها معاً في روتينك',
    q4_title:         'ما هي الميزانية المناسبة لك؟',
    q4_sub:           'سنختار لك أفضل المنتجات المتوفرة في حدود ميزانيتك',
    q4_eco:           'اقتصادي (Eco)',
    q4_eco_d:         'أقل من 500 جنيه — أساسيات الروتين الفعالة',
    q4_mid:           'متوسط (Mid-range) ★',
    q4_mid_d:         '500 - 1000 جنيه — روتين متكامل بنتائج سريعة',
    q4_prem:          'بريميوم (Premium)',
    q4_prem_d:        'أكتر من 1000 جنيه — أقصى درجات الفخامة والنتائج',
    next:             'التالي ←',
    back:             '→ السابق',
    get_routine:      'اطلعيلي روتيني! 🌟',
    result_title:     'روتينك المثالي جاهز! 🎉',
    result_sub:       'اخترنا لك هذه المنتجات المتناغمة معاً للحصول على أفضل نتيجة بأسرع وقت',
    buy_routine:      'اشتري الروتين كامل 🛍️',
    share_routine:    'شاركي روتينك',
    restart:          'ابدأي من جديد',

    // Gift Builder
    gift_title:   'صمم هديتك',
    gift_sub:     'اصنع لحظة لا تُنسى. اختر التفاصيل وسنقوم بتنسيق هدية فاخرة تعبر عن مشاعرك.',
    gq1_title:    'لمن هذه الهدية؟',
    gq1_her:      'لها',
    gq1_him:      'له',
    gq1_mom:      'أمي',
    gq1_wife:     'زوجتي',
    gq1_bride:    'عروس',
    gq1_friend:   'صديق / صديقة',
    gq2_title:    'ما هي المناسبة؟',
    gq2_bday:     'عيد ميلاد',
    gq2_engage:   'خطوبة',
    gq2_wedding:  'زفاف',
    gq2_grad:     'تخرج',
    gq2_ramadan:  'رمضان / عيد',
    gq2_just:     'مجرد هدية ذوق',
    gq3_title:    'حددي الميزانية المناسبة',
    gq3_low:      'أقل من 300 جنيه',
    gq3_mid:      '300 - 700 جنيه ★ الأكثر طلباً',
    gq3_high:     'أكتر من 700 جنيه',
    gift_result:  'هديتك جاهزة! 🎁',
    gift_result_sub: 'سنقوم بتجهيز وتنسيق هذه الهدية الفاخرة بأعلى مستوى من التغليف والأناقة 🎀',
    order_gift:   'اطلبي تجهيز الهدية الآن 💬',
    gift_note:    '✨ جميع الهدايا تشمل كارت إهداء وتغليف شيك مجاناً',

    // Perfume Builder
    perf_title:   'تصميم عطرك الخاص',
    perf_sub:     'رحلة حسية لابتكار توقيعك العطري الفريد. اختر المكونات، التركيز، والتفاصيل لتجربة مصممة خصيصاً لك.',
    perf_family:  'العائلة العطرية',
    perf_conc:    'التركيز والثبات',
    perf_size:    'حجم الزجاجة',
    perf_oud:     'عود فاخر (Oud)',
    perf_musky:   'مسك نقي (Musky)',
    perf_floral:  'زهري أنيق (Floral)',
    perf_spicy:   'حار وجذاب (Spicy)',
    perf_fresh:   'منعش صيفي (Fresh)',
    perf_fruity:  'فاكهي حلو (Fruity)',
    perf_edt:     'خفيف (EDT)',
    perf_edt_d:   'مناسب للاستخدام اليومي والصباحي',
    perf_edp:     'متوسط (EDP) ★',
    perf_edp_d:   'ثبات عالي ومثالي للمناسبات والخروجات',
    perf_ext:     'قوي مكثف (Extrait)',
    perf_ext_d:   'أعلى تركيز زيت عطري وثبات يدوم لأيام',
    perf_summary: 'ملخص العطر الخاص بك',
    perf_est:     'السعر التقديري',
    perf_name_ph: 'اسمك الكريم',
    perf_phone_ph:'رقم التليفون / واتساب',
    perf_notes_ph:'أي روائح إضافية تحب نضيفها؟ مثلاً لمسة فانيليا أو صندل...',
    perf_submit:  'إرسال الطلب — سنقوم بتركيبه لك بحرفية 🌹',

    // Contact
    contact_title:   'تواصل معنا',
    contact_sub:     'نحن هنا للإجابة على استفساراتكم ومساعدتكم في اختيار ما يناسبكم من منتجاتنا الفاخرة',
    contact_phone:   'رقم الهاتف / واتساب',
    contact_address: 'العنوان',
    contact_social:  'تابعينا',
    contact_form:    'أرسل رسالة',
    contact_name:    'الاسم الكامل',
    contact_msg:     'الرسالة أو الاستفسار',
    contact_send:    'إرسال الرسالة ←',
    contact_location:'موقع المتجر',

    // About
    about_title:   'عن لمسة',

    // Footer
    footer_brand_desc: 'متجر لمسة — وجهتك الأولى للعناية الفاخرة بالبشرة، الشعر، تركيبات العطور الحصرية، والهدايا المميزة.',
    footer_shop:    'المتجر',
    footer_links:   'روابط مهمة',
    footer_copy:    '© 2024 لمسة (LAMSA). جميع الحقوق محفوظة.',

    currency: 'ج.م',
  },

  en: {
    // Nav
    nav_skincare: 'Skincare',
    nav_haircare: 'Haircare',
    nav_perfumes: 'Perfumes',
    nav_gifts:    'Gifts',
    nav_sets:     'Collections',
    nav_shop:     'Shop',
    nav_about:    'About',
    nav_contact:  'Contact',
    nav_routine:  'Find My Routine',
    nav_gift:     'Design a Gift',
    nav_perfume:  'Create My Perfume',

    // Home Hero
    hero_tag:   '✨ Luxury Beauty & Fragrance Atelier',
    hero_title: 'A Touch That Matters',
    hero_sub:   'Ultra-premium skincare, exclusive handcrafted perfumes, and memorable gifts — curated with perfection.',
    hero_cta:   'Shop Now',
    hero_cta2:  'Find My Routine',

    // Feature Cards
    feat_routine_title: 'Find My Routine',
    feat_routine_sub:   'Smart, customized skincare & haircare routine tailored to your skin and budget',
    feat_routine_btn:   'Start Now',
    feat_gift_title:    'Design a Gift',
    feat_gift_sub:      'Select the occasion and recipient, and we will craft a luxury gift package for you',
    feat_gift_btn:      'Design Gift',
    feat_perfume_title: 'Create My Perfume',
    feat_perfume_sub:   'Your own handcrafted signature fragrance blend crafted with expertise',
    feat_perfume_btn:   'Start Blending',

    // Sections
    picks_title:   "LAMSA's Curated Picks",
    picks_sub:     'Carefully handpicked items for your ultimate radiant beauty experience',
    view_all:      'View All',
    about_title:   'About Our Store',
    why_title:     'Why LAMSA?',
    reviews_title: 'Customer Reviews',
    reviews_sub:   'Your trust is our greatest compliment',

    // Why Us
    why_1_title: 'Handcrafted Fragrance',
    why_1_desc:  'We formulate unique, long-lasting perfume blends by hand, exclusively for you',
    why_2_title: 'Guaranteed Quality',
    why_2_desc:  '100% authentic products selected to the highest luxury standards',
    why_3_title: 'Luxury Packaging',
    why_3_desc:  'Every order and gift is wrapped with sophisticated care and elegance',
    why_4_title: 'Expert Consultation',
    why_4_desc:  'We guide you step-by-step to the exact routine that matches your profile',

    // Shop
    shop_title:   'The Shop',
    shop_sub:     'Explore our luxury catalog of skincare, haircare, perfumes, and gifts',
    filter_all:   'All',
    filter_skin:  'Skincare',
    filter_hair:  'Haircare',
    filter_body:  'Body Care',
    filter_perf:  'Perfumes',
    filter_gifts: 'Gifts',
    filter_acc:   'Accessories',
    filter_dev:   'Devices',
    add_cart:     'Add to Cart',
    added_cart:   'Added ✓',
    sort_new:     'Newest',
    sort_low:     'Price: Low',
    sort_high:    'Price: High',

    // Cart
    cart_title:    'Your Cart',
    cart_empty:    'Your cart is empty',
    cart_empty_sub: 'Add your favorite luxury products',
    cart_total:    'Total',
    cart_checkout: 'Proceed to Checkout 🚀',
    cart_whatsapp: 'Quick Order via WhatsApp 💬',

    // Routine Quiz
    routine_title:   'Find My Routine',
    routine_sub:     'Answer 4 simple questions and get your personalized complete routine',
    step:            'Step',
    of:              'of',
    q1_title:        'What is your skin type?',
    q1_sub:          'This allows us to select precision formulations for your skin',
    q1_dry:          'Dry',
    q1_dry_d:        'Needs intensive hydration',
    q1_oily:         'Oily',
    q1_oily_d:       'Needs oil & sebum control',
    q1_combo:        'Combination',
    q1_combo_d:      'Dry and oily simultaneously',
    q1_sensitive:    'Sensitive',
    q1_sensitive_d:  'Needs gentle, soothing care',
    q2_title:        'What is your hair type?',
    q2_sub:          'To complete your total head-to-toe beauty routine',
    q2_dry:          'Dry',
    q2_dry_d:        'Needs deep nourishment',
    q2_oily:         'Oily',
    q2_oily_d:       'Gets greasy and needs clarifying',
    q2_damaged:      'Damaged / Split',
    q2_damaged_d:    'Needs bond repair & strengthening',
    q2_normal:       'Normal / Balanced',
    q2_normal_d:     'Needs balanced maintenance',
    q3_title:        'What is your primary concern?',
    q3_sub:          'Select multiple concerns to address together',
    q4_title:        'What is your target budget?',
    q4_sub:          'We will curate the best products tailored within your budget',
    q4_eco:          'Economy (Eco)',
    q4_eco_d:        'Under 500 EGP — Essential active products',
    q4_mid:          'Mid-range ★ Best Value',
    q4_mid_d:        '500–1000 EGP — Comprehensive fast results',
    q4_prem:         'Premium Luxury',
    q4_prem_d:       'Over 1000 EGP — Ultimate results & luxury',
    next:            'Next →',
    back:            '← Back',
    get_routine:     'Get My Routine! 🌟',
    result_title:    'Your Perfect Routine is Ready! 🎉',
    result_sub:      'We harmonized these products together for optimal, fast results',
    buy_routine:     'Buy Full Routine 🛍️',
    share_routine:   'Share Routine',
    restart:         'Start Over',

    // Gift Builder
    gift_title:  'Design a Gift',
    gift_sub:    'Create an unforgettable moment. Pick your preferences and we will curate a luxury gift box.',
    gq1_title:   'Who is this gift for?',
    gq1_her:     'Her',
    gq1_him:     'Him',
    gq1_mom:     'Mom',
    gq1_wife:    'Wife',
    gq1_bride:   'Bride',
    gq1_friend:  'Friend',
    gq2_title:   'What is the occasion?',
    gq2_bday:    'Birthday',
    gq2_engage:  'Engagement',
    gq2_wedding: 'Wedding',
    gq2_grad:    'Graduation',
    gq2_ramadan: 'Ramadan / Eid',
    gq2_just:    'Just Because 🤍',
    gq3_title:   'Select your budget',
    gq3_low:     'Under 300 EGP',
    gq3_mid:     '300–700 EGP ★ Most Popular',
    gq3_high:    'Over 700 EGP',
    gift_result: 'Your Gift is Ready! 🎁',
    gift_result_sub: 'We will assemble this custom gift with premier luxury ribbon & packaging 🎀',
    order_gift:  'Order Gift via WhatsApp 💬',
    gift_note:   '✨ Complimentary greeting card and packaging included with every gift',

    // Perfume Builder
    perf_title:   'Create Your Signature Perfume',
    perf_sub:     'A bespoke atelier journey to craft your personal olfactory signature.',
    perf_family:  'Scent Family',
    perf_conc:    'Concentration & Longevity',
    perf_size:    'Bottle Size',
    perf_oud:     'Royal Oud',
    perf_musky:   'Pure Musk',
    perf_floral:  'Elegant Floral',
    perf_spicy:   'Alluring Spicy',
    perf_fresh:   'Summer Fresh',
    perf_fruity:  'Sweet Fruity',
    perf_edt:     'Light (EDT)',
    perf_edt_d:   'Ideal for daily and morning wear',
    perf_edp:     'Medium (EDP) ★',
    perf_edp_d:   'High sillage, perfect for occasions',
    perf_ext:     'Extrait de Parfum',
    perf_ext_d:   'Highest oil concentration, days of longevity',
    perf_summary: 'Your Bespoke Perfume Summary',
    perf_est:     'Estimated Price',
    perf_name_ph: 'Your full name',
    perf_phone_ph:'Phone / WhatsApp number',
    perf_notes_ph:'Any specific notes to include? (e.g. touch of vanilla, sandalwood...)',
    perf_submit:  'Submit Bespoke Order — We will craft it for you 🌹',

    // Contact
    contact_title:   'Contact Us',
    contact_sub:     'We are delighted to assist you and answer any questions regarding our luxury collections',
    contact_phone:   'Phone / WhatsApp',
    contact_address: 'Address',
    contact_social:  'Follow Us',
    contact_form:    'Send a Message',
    contact_name:    'Full Name',
    contact_msg:     'Message or Inquiry',
    contact_send:    'Send Message →',
    contact_location:'Store Location',

    // About
    about_title: 'About LAMSA',

    // Footer
    footer_brand_desc: 'LAMSA — Your premier destination for luxury skincare, haircare, bespoke perfumes, and signature gifts.',
    footer_shop:    'Shop',
    footer_links:   'Quick Links',
    footer_copy:    '© 2024 LAMSA. All rights reserved.',

    currency: 'EGP',
  }
};

// ── Current State ─────────────────────────────
let currentLang = localStorage.getItem('lamsa_lang') || 'ar';
let currentTheme = localStorage.getItem('lamsa_theme') || 'light';
let activeQuickViewProduct = null;
let selectedPaymentMethod = 'cod';

// ── Apply Theme ───────────────────────────────
function applyTheme(theme) {
  currentTheme = theme;
  localStorage.setItem('lamsa_theme', theme);
  document.documentElement.setAttribute('data-theme', theme);

  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    btn.title = theme === 'dark' ? 'الوضع المضيء' : 'الوضع الليلي';
  });
}

function toggleTheme() {
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

// ── Apply Language ────────────────────────────
function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('lamsa_lang', lang);

  document.documentElement.lang = lang;
  document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
  document.body.classList.toggle('lang-en', lang === 'en');
  document.body.classList.toggle('lang-ar', lang === 'ar');

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.dataset.key;
    if (t[lang] && t[lang][key] !== undefined) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = t[lang][key];
      } else {
        el.innerHTML = t[lang][key];
      }
    }
  });

  document.dispatchEvent(new CustomEvent('langChanged', { detail: { lang } }));
}

// ── Cart State ────────────────────────────────
let cart = JSON.parse(localStorage.getItem('lamsa_cart') || '[]');

function saveCart() {
  localStorage.setItem('lamsa_cart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(product, qty = 1) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...product, qty: qty });
  }
  saveCart();
  showToast(currentLang === 'ar' ? `✓ أُضيف ${product.name}` : `✓ ${product.nameEn} added`);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
}

function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else saveCart();
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function orderViaWhatsApp() {
  const phone = '201080239612';
  const lang = currentLang;
  let msg = lang === 'ar' ? 'مرحبا لمسة، أود طلب هذه المنتجات:\n' : 'Hello LAMSA, I would like to order:\n';
  cart.forEach(item => {
    msg += `• ${item.name} × ${item.qty} — ${item.price * item.qty} ${t[lang].currency}\n`;
  });
  msg += `\n${lang === 'ar' ? 'المجموع' : 'Total'}: ${getCartTotal()} ${t[lang].currency}`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
}

function updateCartUI() {
  const count = getCartCount();
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.classList.toggle('visible', count > 0);
  });
  renderCartItems();
}

function renderCartItems() {
  const body = document.getElementById('cartBody');
  if (!body) return;
  const lang = currentLang;

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon" style="font-size:3rem; margin-bottom:12px;">🛍️</div>
        <p>${t[lang].cart_empty}</p>
        <small style="color:var(--text-light);">${t[lang].cart_empty_sub}</small>
      </div>`;
    document.querySelectorAll('.cart-total-row, #cartCheckout, #cartQuickWhatsApp').forEach(el => {
      el.style.display = 'none';
    });
    return;
  }

  document.querySelectorAll('.cart-total-row, #cartCheckout, #cartQuickWhatsApp').forEach(el => {
    el.style.removeProperty('display');
  });

  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">${item.emoji || '🧴'}</div>
      <div style="flex:1;">
        <div class="cart-item-name">${lang === 'ar' ? item.name : item.nameEn}</div>
        <div class="cart-item-price">${item.price} ${t[lang].currency}</div>
        <div class="flex gap-8 mt-8" style="align-items:center;">
          <button class="cart-close" style="width:26px; height:26px; font-size:0.9rem;" onclick="updateQty('${item.id}', -1)">−</button>
          <span style="font-weight:700; color:var(--text-dark); min-width:20px; text-align:center;">${item.qty}</span>
          <button class="cart-close" style="width:26px; height:26px; font-size:0.9rem;" onclick="updateQty('${item.id}', 1)">+</button>
          <button style="margin-inline-start:auto; background:none; border:none; color:#D32F2F; cursor:pointer; font-size:0.85rem;" onclick="removeFromCart('${item.id}')">حذف 🗑️</button>
        </div>
      </div>
    </div>
  `).join('');

  const totalEl = document.getElementById('cartTotal');
  if (totalEl) totalEl.textContent = `${getCartTotal()} ${t[lang].currency}`;
}

// ── Toast ─────────────────────────────────────
function showToast(msg, duration = 2500) {
  let toast = document.getElementById('lamsaToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'lamsaToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ── Cart Sidebar ──────────────────────────────
function openCart() {
  document.getElementById('cartSidebar')?.classList.add('open');
  document.getElementById('overlay')?.classList.add('active');
  renderCartItems();
}

function closeCart() {
  document.getElementById('cartSidebar')?.classList.remove('open');
  document.getElementById('overlay')?.classList.remove('active');
}

// ── Quick View Modal ──────────────────────────
function openQuickView(productId) {
  const product = window.LAMSA.PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  activeQuickViewProduct = product;

  let modal = document.getElementById('quickViewModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'quickViewModal';
    modal.className = 'luxury-modal-backdrop';
    document.body.appendChild(modal);
  }

  const lang = currentLang;
  const name = lang === 'ar' ? product.name : product.nameEn;
  const desc = product.description || (lang === 'ar' 
    ? 'منتج فاخر وأصلي 100% مختار بعناية من أفضل التركيبات لمنحك نتائج مبهرة وعناية متكاملة تدوم طويلاً.' 
    : '100% Authentic luxury formulation handpicked to deliver exceptional radiance and long-lasting care.');

  modal.innerHTML = `
    <div class="luxury-modal-box">
      <button class="cart-close" style="position:absolute; top:20px; left:20px;" onclick="closeQuickView()">✕</button>
      
      <div class="quickview-grid">
        <div class="quickview-img-box">
          ${product.emoji || '🧴'}
        </div>

        <div>
          <span class="quickview-feature-pill">✨ منتج أصلي 100%</span>
          <h2 style="font-size:1.6rem; color:var(--text-dark); margin-bottom:8px;">${name}</h2>
          <div style="font-size:1.4rem; font-weight:800; color:var(--burgundy); margin-bottom:16px;" id="qvPrice">
            ${product.price} ${t[lang].currency}
          </div>
          
          <p style="font-size:0.92rem; color:var(--text-mid); line-height:1.7; margin-bottom:20px;">
            ${desc}
          </p>

          <div style="background:var(--bg-subtle); padding:12px 16px; border-radius:var(--radius-md); margin-bottom:20px; font-size:0.85rem;">
            <strong>💡 نصيحة الاستخدام:</strong> يستخدم يومياً للحصول على أفضل نتائج ملحوظة وإشراقة طبيعية.
          </div>

          <div class="flex gap-12" style="align-items:center;">
            <div class="flex gap-8" style="background:var(--bg-subtle); padding:8px 12px; border-radius:var(--radius-xl); border:1px solid var(--border); align-items:center;">
              <button class="cart-close" style="width:28px; height:28px;" onclick="changeQvQty(-1)">−</button>
              <span id="qvQtyVal" style="font-weight:800; min-width:24px; text-align:center;">1</span>
              <button class="cart-close" style="width:28px; height:28px;" onclick="changeQvQty(1)">+</button>
            </div>

            <button class="btn btn-primary flex-1" onclick="addFromQuickView()">
              أضف للسلة 🛍️
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

let qvCurrentQty = 1;
function changeQvQty(delta) {
  qvCurrentQty = Math.max(1, qvCurrentQty + delta);
  const el = document.getElementById('qvQtyVal');
  if (el) el.textContent = qvCurrentQty;
}

function addFromQuickView() {
  if (!activeQuickViewProduct) return;
  addToCart(activeQuickViewProduct, qvCurrentQty);
  closeQuickView();
  openCart();
}

function closeQuickView() {
  document.getElementById('quickViewModal')?.classList.remove('active');
  qvCurrentQty = 1;
}

// ── Full Checkout Modal ───────────────────────
function openCheckoutModal() {
  closeCart();

  let modal = document.getElementById('checkoutModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'checkoutModal';
    modal.className = 'luxury-modal-backdrop';
    document.body.appendChild(modal);
  }

  const lang = currentLang;
  const subtotal = getCartTotal();
  const shipping = 35; // Default shipping in EGP
  const grandTotal = subtotal + shipping;

  modal.innerHTML = `
    <div class="luxury-modal-box" style="max-width:620px;">
      <div class="flex-between mb-20">
        <h2 style="font-size:1.6rem; color:var(--burgundy);">إتمام الطلب والشحن 🚀</h2>
        <button class="cart-close" onclick="closeCheckoutModal()">✕</button>
      </div>

      <p style="color:var(--text-light); font-size:0.9rem; margin-bottom:24px;">
        من فضلك اكتبي بيانات التوصيل وسنقوم بتجهيز وتغليف طلبك فوراً بعناية لمسة الفاخرة 🎀
      </p>

      <form id="checkoutForm" onsubmit="submitOrder(event)">
        
        <div class="input-group">
          <label>الاسم بالكامل *</label>
          <input type="text" class="form-input" id="coName" required placeholder="اسمك الكريم">
        </div>

        <div class="grid-2">
          <div class="input-group">
            <label>رقم الهاتف الأساسي *</label>
            <input type="tel" class="form-input" id="coPhone" required placeholder="01xxxxxxxxx">
          </div>
          <div class="input-group">
            <label>رقم واتساب إضافي</label>
            <input type="tel" class="form-input" id="coWhatsapp" placeholder="01xxxxxxxxx (اختياري)">
          </div>
        </div>

        <div class="grid-2">
          <div class="input-group">
            <label>المحافظة *</label>
            <select class="form-select" id="coCity" required>
              <option value="القاهرة">القاهرة</option>
              <option value="الجيزة">الجيزة</option>
              <option value="الإسكندرية">الإسكندرية</option>
              <option value="المنصورة / الدقهلية">المنصورة / الدقهلية</option>
              <option value="طنطا / الغربية">طنطا / الغربية</option>
              <option value="الشرقية">الشرقية</option>
              <option value="باقي المحافظات">باقي المحافظات</option>
            </select>
          </div>

          <div class="input-group">
            <label>المنطقة / الحي *</label>
            <input type="text" class="form-input" id="coArea" required placeholder="مثال: المعادي / النزهة">
          </div>
        </div>

        <div class="input-group">
          <label>العنوان بالتفصيل (الشارع، العمارة، الشقة) *</label>
          <input type="text" class="form-input" id="coAddress" required placeholder="رقم العمارة واسم الشارع والشقة...">
        </div>

        <label style="font-weight:700; margin-bottom:8px; display:block;">طريقة الدفع المفضلة:</label>
        <div class="payment-grid">
          <div class="payment-card selected" onclick="selectPayment('cod', this)">
            <span class="payment-card-icon">💵</span>
            <div class="payment-card-title">كاش عند الاستلام</div>
          </div>
          <div class="payment-card" onclick="selectPayment('instapay', this)">
            <span class="payment-card-icon">⚡</span>
            <div class="payment-card-title">إنستاباي (InstaPay)</div>
          </div>
          <div class="payment-card" onclick="selectPayment('voda', this)">
            <span class="payment-card-icon">📱</span>
            <div class="payment-card-title">فودافون كاش</div>
          </div>
        </div>

        <div style="background:var(--bg-subtle); padding:16px 20px; border-radius:var(--radius-lg); margin-bottom:24px; border:1px solid var(--border);">
          <div class="flex-between mb-8" style="font-size:0.95rem;">
            <span>مجموع المنتجات (${getCartCount()} قطع):</span>
            <strong>${subtotal} ج.م</strong>
          </div>
          <div class="flex-between mb-8" style="font-size:0.95rem; color:var(--text-mid);">
            <span>مصاريف الشحن والتوصيل:</span>
            <span>${shipping} ج.م</span>
          </div>
          <div class="divider" style="margin:10px 0;"></div>
          <div class="flex-between" style="font-size:1.2rem; font-weight:800; color:var(--burgundy);">
            <span>المجموع النهائي:</span>
            <span>${grandTotal} ج.م</span>
          </div>
        </div>

        <button type="submit" class="btn btn-primary btn-full btn-lg" style="font-size:1.1rem;">
          تأكيد الطلب وإرسال الفاتورة عبر واتساب 💬
        </button>
      </form>
    </div>
  `;

  modal.classList.add('active');
}

function selectPayment(method, el) {
  selectedPaymentMethod = method;
  document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

function closeCheckoutModal() {
  document.getElementById('checkoutModal')?.classList.remove('active');
}

function submitOrder(e) {
  e.preventDefault();
  const name = document.getElementById('coName').value;
  const phone = document.getElementById('coPhone').value;
  const whatsapp = document.getElementById('coWhatsapp').value || phone;
  const city = document.getElementById('coCity').value;
  const area = document.getElementById('coArea').value;
  const address = document.getElementById('coAddress').value;

  const paymentMap = {
    cod: '💵 كاش عند الاستلام',
    instapay: '⚡ إنستاباي (InstaPay)',
    voda: '📱 محفظة فودافون كاش'
  };

  const orderNum = 'LMS-' + Math.floor(100000 + Math.random() * 900000);
  const subtotal = getCartTotal();
  const shipping = 35;
  const total = subtotal + shipping;

  let msg = `🛍️ *طلب جديد من متجر لمسة (LAMSA)*\n`;
  msg += `🔖 *رقم الطلب:* ${orderNum}\n`;
  msg += `👤 *الاسم:* ${name}\n`;
  msg += `📞 *الهاتف:* ${phone}\n`;
  msg += `📍 *العنوان:* ${city} - ${area} - ${address}\n`;
  msg += `💳 *طريقة الدفع:* ${paymentMap[selectedPaymentMethod]}\n\n`;
  msg += `📦 *المنتجات المطلوبة:*\n`;

  cart.forEach(item => {
    msg += `• ${item.name} × ${item.qty} = ${item.price * item.qty} ج.م\n`;
  });

  msg += `\n💰 *المجموع:* ${subtotal} ج.م`;
  msg += `\n🚚 *الشحن:* ${shipping} ج.م`;
  msg += `\n✨ *الإجمالي المطلوب:* ${total} ج.م`;

  // Clear cart and close modal
  cart = [];
  saveCart();
  closeCheckoutModal();
  triggerConfetti();

  // Show Confirmation Receipt
  showOrderSuccessModal(orderNum, name, total);

  // Open WhatsApp with order details
  setTimeout(() => {
    window.open(`https://wa.me/201080239612?text=${encodeURIComponent(msg)}`, '_blank');
  }, 1200);
}

function showOrderSuccessModal(orderNum, name, total) {
  let modal = document.createElement('div');
  modal.className = 'luxury-modal-backdrop active';
  modal.innerHTML = `
    <div class="luxury-modal-box" style="max-width:480px; text-align:center;">
      <span style="font-size:4rem; display:block; margin-bottom:16px;">✅</span>
      <h2 style="color:var(--burgundy); margin-bottom:12px;">تم استلام طلبك بنجاح!</h2>
      <p style="color:var(--text-mid); margin-bottom:20px;">رقم الطلب: <strong>${orderNum}</strong></p>
      <p style="color:var(--text-mid); margin-bottom:20px;">عزيزتي <strong>${name}</strong>، شكراً لثقتك في لمسة! سيتم التواصل معك قريباً لتأكيد الطلب والشحن.</p>
      <div style="background:var(--bg-subtle); padding:16px; border-radius:var(--radius-lg); margin-bottom:24px;">
        <div style="font-size:1.3rem; font-weight:800; color:var(--burgundy);">المبلغ الإجمالي: ${total} ج.م</div>
      </div>
      <button class="btn btn-primary btn-lg" onclick="closeSuccessModal(this.parentElement.parentElement)">تمام 🎉</button>
    </div>
  `;
  document.body.appendChild(modal);
}

function closeSuccessModal(modal) {
  modal.remove();
}

function triggerConfetti() {
  // Simple confetti animation effect using CSS
  const colors = ['#D4AF37', '#5C0E14', '#F5E6BE', '#7E1D26'];
  const confettiCount = 50;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background-color: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}%;
      top: -10px;
      opacity: 1;
      transform: rotate(${Math.random() * 360}deg);
      animation: confetti-fall ${2 + Math.random() * 2}s linear forwards;
      pointer-events: none;
      z-index: 9999;
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
    `;
    
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 4000);
  }
  
  // Add confetti animation keyframe if not exists
  if (!document.getElementById('confetti-style')) {
    const style = document.createElement('style');
    style.id = 'confetti-style';
    style.textContent = `
      @keyframes confetti-fall {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(720deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// ── Initialize on DOMContentLoaded ────────────
// (Removed duplicate - see Init section below)

// ── Confetti Explosion ────────────────────────
function triggerConfetti() {
  const colors = ['#D4AF37', '#7E1D26', '#FFFFFF', '#F5E6BE', '#AA820A'];
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width = `${Math.random() * 8 + 6}px`;
    piece.style.height = `${Math.random() * 8 + 6}px`;
    piece.style.animationDuration = `${Math.random() * 2 + 1.5}s`;
    piece.style.animationDelay = `${Math.random() * 0.3}s`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3000);
  }
}

// ── Easter Egg Meme Generator ─────────────────
const FUNNY_MEMES = [
  "😂 نصيحة اليوم: متنزليش من غير واقي شمس عشان الشمس في مصر ملهاش كتالوج!",
  "😎 رشة من برفان التركيب بتاعنا كفيلة تخلي الكراش يرجع في كلامه!",
  "💀 البشرة اللي مش مترطبة بتعيط في صمت.. الحقها بمرطب لمسة دلوقتي!",
  "💸 الروتين عندنا معمول بحيث يفضل معاك فلوس تركب مواصلات بعد ما تشتريه 😂",
  "🎁 سر السعادة: تهادي تحابوا.. خصوصاً لو الهدية فيها بادي سبلاش ولمسة شياكة!",
  "🤫 بيني وبينك.. لو مش عارف تختار برفان، اطلب تركيبة العود مع الزهور وهتدعيلي!"
];

function showSecretMeme() {
  const randomMeme = FUNNY_MEMES[Math.floor(Math.random() * FUNNY_MEMES.length)];
  triggerConfetti();
  showToast(randomMeme, 4000);
}

// ── Mobile Menu ───────────────────────────────
function toggleMobileMenu() {
  const nav = document.getElementById('mobileNav');
  const toggle = document.getElementById('menuToggle');
  if (!nav) return;
  nav.classList.toggle('open');
  toggle?.classList.toggle('open');
}

// ── Init ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Apply saved theme & lang
  applyTheme(currentTheme);
  applyLang(currentLang);
  updateCartUI();

  // Lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang));
  });

  // Dark mode buttons
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  // Cart toggle
  document.getElementById('cartToggle')?.addEventListener('click', openCart);
  document.getElementById('cartClose')?.addEventListener('click', closeCart);
  
  // Cart WhatsApp button
  document.getElementById('cartCheckout')?.addEventListener('click', openCheckoutModal);
  
  // Quick WhatsApp from cart (if exists)
  document.getElementById('cartQuickWhatsApp')?.addEventListener('click', orderViaWhatsApp);

  // Overlay click - close everything
  document.getElementById('overlay')?.addEventListener('click', () => {
    closeCart();
    closeQuickView();
    closeCheckoutModal();
    const mobileNav = document.getElementById('mobileNav');
    const menuToggle = document.getElementById('menuToggle');
    mobileNav?.classList.remove('open');
    menuToggle?.classList.remove('active');
    document.getElementById('overlay')?.classList.remove('active');
  });

  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  menuToggle?.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileNav?.classList.toggle('open');
    document.getElementById('overlay')?.classList.toggle('active');
  });

  // Close mobile nav when clicking outside
  document.addEventListener('click', (e) => {
    if (mobileNav?.classList.contains('open') && 
        !mobileNav.contains(e.target) && 
        !menuToggle.contains(e.target)) {
      menuToggle.classList.remove('active');
      mobileNav.classList.remove('open');
      document.getElementById('overlay')?.classList.remove('active');
    }
  });

  // Active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Add floating meme button on every page
  const memeBtn = document.createElement('div');
  memeBtn.className = 'meme-easter-egg';
  memeBtn.innerHTML = '<span class="meme-icon">🤫</span> سر المحل';
  memeBtn.title = 'اضغط لسر خطير 😂';
  memeBtn.onclick = showSecretMeme;
  document.body.appendChild(memeBtn);
});
