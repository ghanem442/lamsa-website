const { z } = require('zod');
require('dotenv').config();

// List of forbidden placeholder values for secrets
const FORBIDDEN_JWT_SECRETS = [
  'replace-with-a-secure-random-secret-key-min-32-chars',
  'lamsa-local-dev-jwt-secret-key-32-characters-minimum',
  'development-secret-key-at-least-16-chars',
  'change-this-to-a-random-secret',
  'your-secret-key-here',
];

const FORBIDDEN_PASSWORDS = [
  'ChangeThisPassword@2026',
  'admin',
  'password',
  '123456',
];

const envSchema = z.object({
  // Non-secret config (can have defaults)
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  ADMIN_NAME: z.string().default('LAMSA Admin'),
  CORS_ORIGIN: z.string().default('*'),
  
  // Rate Limiting (configurable from .env)
  ORDER_RATE_LIMIT_MAX: z.string().default('5'),
  ORDER_RATE_LIMIT_WINDOW_MINUTES: z.string().default('15'),
  AUTH_RATE_LIMIT_MAX: z.string().default('5'),
  AUTH_RATE_LIMIT_WINDOW_MINUTES: z.string().default('15'),

  // SECRETS - NO DEFAULTS ALLOWED
  DATABASE_URL: z.string({
    required_error: '❌ DATABASE_URL is required in .env file',
  }),
  
  JWT_SECRET: z.string({
    required_error: '❌ JWT_SECRET is required in .env file',
  }).min(32, '❌ JWT_SECRET must be at least 32 characters long'),
  
  ADMIN_EMAIL: z.string({
    required_error: '❌ ADMIN_EMAIL is required in .env file',
  }).email('❌ ADMIN_EMAIL must be a valid email address'),
  
  ADMIN_PASSWORD: z.string({
    required_error: '❌ ADMIN_PASSWORD is required in .env file',
  }).min(10, '❌ ADMIN_PASSWORD must be at least 10 characters long'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('\n❌ Environment configuration error:\n');
  const errors = parsed.error.format();
  Object.keys(errors).forEach(key => {
    if (key !== '_errors' && errors[key]._errors) {
      errors[key]._errors.forEach(err => {
        console.error(`   ${err}`);
      });
    }
  });
  console.error('\n💡 Please check your .env file and ensure all required variables are set.\n');
  process.exit(1);
}

// Additional validation: Check for forbidden placeholder values
const data = parsed.data;

if (FORBIDDEN_JWT_SECRETS.includes(data.JWT_SECRET)) {
  console.error('\n❌ JWT_SECRET contains a placeholder value!');
  console.error('   Current value looks like a placeholder or example.');
  console.error('   Please generate a secure random secret (at least 32 characters).\n');
  console.error('💡 Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"\n');
  process.exit(1);
}

if (FORBIDDEN_PASSWORDS.includes(data.ADMIN_PASSWORD)) {
  console.error('\n❌ ADMIN_PASSWORD contains a forbidden default value!');
  console.error(`   "${data.ADMIN_PASSWORD}" is not allowed.`);
  console.error('   Please set a strong, unique password (at least 10 characters).\n');
  process.exit(1);
}

module.exports = data;
