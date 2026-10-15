const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

// Forbidden placeholder passwords
const FORBIDDEN_PASSWORDS = [
  'ChangeThisPassword@2026',
  'admin',
  'password',
  '123456',
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Validate required environment variables
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || 'LAMSA Admin';
  const seedSampleProducts = process.env.SEED_SAMPLE_PRODUCTS === 'true';

  if (!adminEmail) {
    console.error('\n❌ ADMIN_EMAIL is required in .env file for seeding.');
    console.error('   Please set ADMIN_EMAIL in your .env file.\n');
    process.exit(1);
  }

  if (!adminPassword) {
    console.error('\n❌ ADMIN_PASSWORD is required in .env file for seeding.');
    console.error('   Please set ADMIN_PASSWORD in your .env file.\n');
    process.exit(1);
  }

  if (adminPassword.length < 10) {
    console.error('\n❌ ADMIN_PASSWORD must be at least 10 characters long.');
    console.error(`   Current length: ${adminPassword.length}\n`);
    process.exit(1);
  }

  if (FORBIDDEN_PASSWORDS.includes(adminPassword)) {
    console.error('\n❌ ADMIN_PASSWORD contains a forbidden default value!');
    console.error(`   "${adminPassword}" is not allowed.`);
    console.error('   Please set a strong, unique password (at least 10 characters) in .env\n');
    process.exit(1);
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(adminEmail)) {
    console.error('\n❌ ADMIN_EMAIL must be a valid email address.');
    console.error(`   Provided: ${adminEmail}\n`);
    process.exit(1);
  }

  // 1. Seed or Upsert Admin User from environment variables
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: 'admin',
      isVerified: true,
      name: adminName,
    },
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash,
      role: 'admin',
      isVerified: true,
    },
  });
  console.log(`✅ Admin user seeded: ${adminUser.email} (Role: ${adminUser.role})`);

  // 2. Seed Default Perfume Pricing Settings
  const defaultPerfumeMatrix = {
    '30ml': { edt: 250, edp: 350, ext: 450 },
    '50ml': { edt: 400, edp: 500, ext: 650 },
    '100ml': { edt: 600, edp: 750, ext: 950 },
  };

  await prisma.setting.upsert({
    where: { key: 'perfume_prices' },
    update: { value: defaultPerfumeMatrix },
    create: {
      key: 'perfume_prices',
      value: defaultPerfumeMatrix,
    },
  });
  console.log('✅ Perfume pricing settings seeded.');

  // 3. Optionally Seed Sample Products (only if SEED_SAMPLE_PRODUCTS=true)
  if (!seedSampleProducts) {
    console.log('ℹ️  Skipping sample products (set SEED_SAMPLE_PRODUCTS=true to enable)');
    console.log('🎉 Seeding complete! (Admin user + perfume settings only)');
    return;
  }

  console.log('📦 Seeding sample products...');

  // Sample products with correct field names (skinType, concern, hairType, budget)
  const sampleProducts = [
    // Skincare
    { id: 'sk1', nameAr: 'غسول الوجه المنقي', nameEn: 'Purifying Face Wash', category: 'skin', price: 180, emoji: '🧴', badge: 'new', skinType: ['oily', 'combo'], concern: ['acne'], budget: ['eco', 'mid'] },
    { id: 'sk2', nameAr: 'غسول مرطب للبشرة الجافة', nameEn: 'Hydrating Cleanser', category: 'skin', price: 220, emoji: '💧', skinType: ['dry', 'sensitive'], concern: ['dry_skin'], budget: ['eco', 'mid'] },
    { id: 'sk3', nameAr: 'سيروم فيتامين سي', nameEn: 'Vitamin C Serum', category: 'skin', price: 350, emoji: '✨', badge: 'popular', skinType: ['all'], concern: ['dull', 'dark_spots'], budget: ['mid', 'prem'] },
    
    // Haircare
    { id: 'hr1', nameAr: 'شامبو للشعر الجاف والتالف', nameEn: 'Repair Shampoo', category: 'hair', price: 150, emoji: '🧖', hairType: ['dry', 'damaged'], budget: ['eco', 'mid'] },
    { id: 'hr2', nameAr: 'شامبو للشعر الدهني', nameEn: 'Oil-Control Shampoo', category: 'hair', price: 140, emoji: '🌊', hairType: ['oily'], budget: ['eco', 'mid'] },
    
    // Gifts
    { id: 'gf1', nameAr: 'مجموعة الإطراقة الملكية', nameEn: 'Royal Pampering Set', category: 'gifts', price: 650, emoji: '🎁', badge: 'popular', forWhom: ['her', 'wife', 'bride'], occasion: ['wedding', 'bday', 'engage'], budget: 'high' },
    { id: 'gf2', nameAr: 'باقة العناية الكاملة', nameEn: 'Full Care Bundle', category: 'gifts', price: 420, emoji: '🎀', forWhom: ['her', 'mom', 'friend'], occasion: ['bday', 'grad'], budget: 'mid' },
    
    // Perfumes
    { id: 'pf1', nameAr: 'عطر أوركيد الليل', nameEn: 'Night Orchid', category: 'perfumes', price: 450, emoji: '🌙', badge: 'popular', family: 'floral' },
    { id: 'pf2', nameAr: 'عود الملكي', nameEn: 'Royal Oud', category: 'perfumes', price: 600, emoji: '🪵', family: 'oud' },
    
    // Body
    { id: 'bd1', nameAr: 'بادي لوشن الحرير المرطب', nameEn: 'Silk Body Lotion', category: 'body', price: 120, emoji: '🌺' },
  ];

  let seededCount = 0;
  for (const p of sampleProducts) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        nameAr: p.nameAr,
        nameEn: p.nameEn,
        category: p.category,
        subCategory: p.subCategory || null,
        price: parseFloat(p.price) || 0,
        stockQty: 100,
        emoji: p.emoji || null,
        badge: p.badge || null,
        skinType: p.skinType || null,
        concern: p.concern || null,
        hairType: p.hairType || null,
        budget: p.budget || null,
        forWhom: p.forWhom || null,
        occasion: p.occasion || null,
        family: p.family || null,
      },
      create: {
        id: p.id,
        nameAr: p.nameAr,
        nameEn: p.nameEn,
        category: p.category,
        subCategory: p.subCategory || null,
        price: parseFloat(p.price) || 0,
        stockQty: 100,
        emoji: p.emoji || null,
        badge: p.badge || null,
        skinType: p.skinType || null,
        concern: p.concern || null,
        hairType: p.hairType || null,
        budget: p.budget || null,
        forWhom: p.forWhom || null,
        occasion: p.occasion || null,
        family: p.family || null,
      },
    });
    seededCount++;
  }

  console.log(`🎉 Successfully seeded ${seededCount} sample products!`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
