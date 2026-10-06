const { z } = require('zod');
require('dotenv').config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().min(16).default('development-secret-key-at-least-16-chars'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  ADMIN_EMAIL: z.string().email().default('admin@lamsa.com'),
  ADMIN_PASSWORD: z.string().min(6).default('ChangeThisPassword@2026'),
  ADMIN_NAME: z.string().default('LAMSA Admin'),
  CORS_ORIGIN: z.string().default('*'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

module.exports = parsed.data;
