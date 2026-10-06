const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const prisma = new PrismaClient();

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

  // 1. Seed or Upsert Admin User from environment variables
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@lamsa.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeThisPassword@2026';
  const adminName = process.env.ADMIN_NAME || 'LAMSA Admin';

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
    where: { key: 'perfume_pricing_matrix' },
    update: { value: defaultPerfumeMatrix },
    create: {
      key: 'perfume_pricing_matrix',
      value: defaultPerfumeMatrix,
    },
  });
  console.log('✅ Perfume pricing matrix seeded.');

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
