const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const prisma = new PrismaClient();

// Forbidden placeholder passwords
const FORBIDDEN_PASSWORDS = [
  'ChangeThisPassword@2026',
  'admin',
  'password',
  '123456',
];

// Extract PRODUCTS from js/data.js safely
function parseProductsFromDataJs() {
  const dataJsPath = path.join(__dirname, '..', 'js', 'data.js');
  const content = fs.readFileSync(dataJsPath, 'utf8');

  // Match the PRODUCTS array block
  const match = content.match(/const\s+PRODUCTS\s*=\s*(\[[\s\S]*?\]);/);
  if (!match) {
    throw new Error('Could not find const PRODUCTS array in js/data.js');
  }

  // Evaluate safely in isolated context
  const arrayCode = match[1];
  const fn = new Function(`return ${arrayCode};`);
  return fn();
}

async function main() {
  console.log('🌱 Starting database seed...');

  // Validate required environment variables
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || 'LAMSA Admin';

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

  // 3. Seed Products from js/data.js
  const rawProducts = parseProductsFromDataJs();
  console.log(`📦 Found ${rawProducts.length} products in js/data.js to seed...`);

  let seededCount = 0;
  for (const p of rawProducts) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        nameAr: p.name,
        nameEn: p.nameEn,
        category: p.category,
        subCategory: p.subCategory || null,
        price: parseFloat(p.price) || 0,
        emoji: p.emoji || null,
        badge: p.badge || null,
        skinTypes: p.skinType ? p.skinType : null,
        concerns: p.concern ? p.concern : null,
        hairTypes: p.hairType ? p.hairType : null,
        budgetTier: p.budget ? (Array.isArray(p.budget) ? p.budget : [p.budget]) : null,
        forWhom: p.forWhom ? p.forWhom : null,
        occasion: p.occasion ? p.occasion : null,
        family: p.family || null,
      },
      create: {
        id: p.id,
        nameAr: p.name,
        nameEn: p.nameEn,
        category: p.category,
        subCategory: p.subCategory || null,
        price: parseFloat(p.price) || 0,
        emoji: p.emoji || null,
        badge: p.badge || null,
        skinTypes: p.skinType ? p.skinType : null,
        concerns: p.concern ? p.concern : null,
        hairTypes: p.hairType ? p.hairType : null,
        budgetTier: p.budget ? (Array.isArray(p.budget) ? p.budget : [p.budget]) : null,
        forWhom: p.forWhom ? p.forWhom : null,
        occasion: p.occasion ? p.occasion : null,
        family: p.family || null,
      },
    });
    seededCount++;
  }

  console.log(`🎉 Successfully seeded ${seededCount} products into database!`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
