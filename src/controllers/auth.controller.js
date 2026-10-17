const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { withRetry } = require('../utils/prismaRetry');
const env = require('../config/env');
const { OAuth2Client } = require('google-auth-library');
const { z } = require('zod');
const crypto = require('crypto');
const { sendOtpEmail } = require('../utils/emailService');

// Initialize Google OAuth client
const googleClient = env.GOOGLE_CLIENT_ID 
  ? new OAuth2Client(env.GOOGLE_CLIENT_ID) 
  : null;

// OTP Configuration
const OTP_EXPIRY_MINUTES = 5;
const MAX_OTP_ATTEMPTS = 3;
const OTP_LENGTH = 4;

/**
 * Generate random OTP code
 */
function generateOtpCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * POST /api/auth/register
 * Register a new customer account (Step 1: Send OTP)
 */
async function register(req, res, next) {
  try {
    const { name, email, password, phone } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء إدخال جميع الحقول المطلوبة',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
      });
    }

    // Check if user already exists
    const existingUser = await withRetry(async () => {
      return await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني مسجل بالفعل',
      });
    }

    // Check if email service is configured
    if (!env.EMAIL_USER || !env.EMAIL_PASS) {
      // Fallback: Create account immediately without OTP
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await withRetry(async () => {
        return await prisma.user.create({
          data: {
            name,
            email: email.toLowerCase(),
            passwordHash: hashedPassword,
            phone: phone || null,
            role: 'customer',
            isVerified: true,
          },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            isVerified: true,
            createdAt: true,
          },
        });
      });

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN }
      );

      return res.status(201).json({
        success: true,
        message: 'تم إنشاء الحساب بنجاح',
        data: {
          user,
          token,
        },
      });
    }

    // Generate OTP
    const otpCode = generateOtpCode();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Delete any existing OTP for this email
    await withRetry(async () => {
      await prisma.otp.deleteMany({
        where: { email: email.toLowerCase() }
      });
    });

    // Store OTP in database
    await withRetry(async () => {
      await prisma.otp.create({
        data: {
          email: email.toLowerCase(),
          otpCode,
          expiresAt,
          attempts: 0,
        },
      });
    });

    // Send OTP email (async, non-blocking)
    sendOtpEmail(email, otpCode).catch(err => {
      console.error('[Auth] Failed to send OTP email:', err);
    });

    // Store registration data temporarily in response
    res.status(200).json({
      success: true,
      message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني',
      data: {
        email: email.toLowerCase(),
        requiresOtp: true,
        expiresIn: OTP_EXPIRY_MINUTES * 60, // seconds
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/login
 * Login with email and password
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور',
      });
    }

    // Find user by email
    const user = await withRetry(async () => {
      return await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });
    });

    // Generic error message (don't reveal if email exists)
    const invalidMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';

    if (!user) {
      return res.status(401).json({
        success: false,
        message: invalidMessage,
      });
    }

    // Check if user has a password (Google users don't)
    if (!user.passwordHash) {
      return res.status(401).json({
        success: false,
        message: 'هذا الحساب مسجل عبر Google. يرجى استخدام زر "تسجيل الدخول بـ Google"'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: invalidMessage,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    // Return user data (without password)
    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/auth/me
 * Get current user info (requires authentication)
 */
async function getMe(req, res, next) {
  try {
    // req.user is set by auth middleware
    const userId = req.user.userId;

    const user = await withRetry(async () => {
      return await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          isVerified: true,
          passwordHash: true,
          createdAt: true,
        },
      });
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود',
      });
    }

    // Determine if user is Google user (no password)
    const isGoogleUser = !user.passwordHash;

    // Remove password hash from response
    const { passwordHash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        ...userWithoutPassword,
        isGoogleUser,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getMe,
};


/**
 * POST /api/auth/google
 * Authenticate with Google ID token
 */
async function googleLogin(req, res, next) {
  try {
    // Check if Google OAuth is configured
    if (!env.GOOGLE_CLIENT_ID || !googleClient) {
      return res.status(503).json({
        success: false,
        message: 'تسجيل الدخول عبر Google غير متاح حالياً'
      });
    }

    // Validate request body with zod
    const googleAuthSchema = z.object({
      credential: z.string().min(1, 'رمز التحقق مطلوب')
    });

    const validatedData = googleAuthSchema.parse(req.body);
    const { credential } = validatedData;

    // Verify the Google ID token
    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: env.GOOGLE_CLIENT_ID
      });
    } catch (error) {
      console.error('[Google Auth] Token verification failed:', error);
      return res.status(401).json({
        success: false,
        message: 'فشل التحقق من حساب Google. يرجى المحاولة مرة أخرى'
      });
    }

    const payload = ticket.getPayload();
    
    // Verify issuer
    if (!['accounts.google.com', 'https://accounts.google.com'].includes(payload.iss)) {
      return res.status(401).json({
        success: false,
        message: 'رمز التحقق غير صحيح'
      });
    }

    // Verify email is verified by Google
    if (!payload.email_verified) {
      return res.status(401).json({
        success: false,
        message: 'البريد الإلكتروني غير مؤكد من Google. يرجى التحقق من حسابك'
      });
    }

    const googleEmail = payload.email.toLowerCase();
    const googleName = payload.name || payload.given_name || 'مستخدم Google';

    // Find or create user
    let user = await withRetry(async () => {
      return await prisma.user.findUnique({
        where: { email: googleEmail }
      });
    });

    if (user) {
      // Existing user - just log them in
      // Role ALWAYS comes from database, never from Google or client
    } else {
      // New user - create account
      // Role is ALWAYS 'customer' for new Google users, never admin
      const unusablePassword = crypto.randomBytes(32).toString('hex');
      
      user = await withRetry(async () => {
        return await prisma.user.create({
          data: {
            name: googleName,
            email: googleEmail,
            passwordHash: unusablePassword, // Unusable random hash
            role: 'customer', // ALWAYS customer, never admin
            isVerified: true // Email verified by Google
          }
        });
      });
    }

    // Generate JWT token with user's DATABASE role (not from Google/client)
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role // From database only
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    // Return same shape as email login
    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified,
          createdAt: user.createdAt
        },
        token
      }
    });
  } catch (error) {
    // Handle zod validation errors
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: error.errors[0]?.message || 'بيانات غير صحيحة'
      });
    }
    next(error);
  }
}

module.exports = {
  register,
  login,
  getMe,
  googleLogin
};


/**
 * POST /api/auth/verify-otp
 * Verify OTP and create account (Step 2: Verify OTP)
 */
async function verifyOtp(req, res, next) {
  try {
    const { email, otpCode, name, password, phone } = req.body;

    // Validate input
    if (!email || !otpCode || !name || !password) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء إدخال جميع البيانات المطلوبة',
      });
    }

    // Find OTP record
    const otpRecord = await withRetry(async () => {
      return await prisma.otp.findFirst({
        where: {
          email: email.toLowerCase(),
          expiresAt: {
            gte: new Date() // Not expired
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'رمز التحقق غير صحيح أو منتهي الصلاحية',
      });
    }

    // Check max attempts
    if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
      await withRetry(async () => {
        await prisma.otp.delete({ where: { id: otpRecord.id } });
      });
      
      return res.status(400).json({
        success: false,
        message: 'تجاوزت الحد الأقصى للمحاولات. يرجى طلب رمز جديد',
      });
    }

    // Verify OTP code
    if (otpRecord.otpCode !== otpCode) {
      // Increment attempts
      await withRetry(async () => {
        await prisma.otp.update({
          where: { id: otpRecord.id },
          data: { attempts: otpRecord.attempts + 1 }
        });
      });

      return res.status(400).json({
        success: false,
        message: `رمز التحقق غير صحيح. المحاولات المتبقية: ${MAX_OTP_ATTEMPTS - otpRecord.attempts - 1}`,
      });
    }

    // OTP is correct - create user account
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await withRetry(async () => {
      return await prisma.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          passwordHash: hashedPassword,
          phone: phone || null,
          role: 'customer',
          isVerified: true,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          isVerified: true,
          createdAt: true,
        },
      });
    });

    // Delete used OTP
    await withRetry(async () => {
      await prisma.otp.delete({ where: { id: otpRecord.id } });
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: 'تم التحقق بنجاح وإنشاء حسابك',
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/resend-otp
 * Resend OTP code
 */
async function resendOtp(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني مطلوب',
      });
    }

    // Check if email service is configured
    if (!env.EMAIL_USER || !env.EMAIL_PASS) {
      return res.status(503).json({
        success: false,
        message: 'خدمة البريد الإلكتروني غير متاحة',
      });
    }

    // Check if user already exists
    const existingUser = await withRetry(async () => {
      return await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني مسجل بالفعل',
      });
    }

    // Generate new OTP
    const otpCode = generateOtpCode();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Delete any existing OTP for this email
    await withRetry(async () => {
      await prisma.otp.deleteMany({
        where: { email: email.toLowerCase() }
      });
    });

    // Create new OTP
    await withRetry(async () => {
      await prisma.otp.create({
        data: {
          email: email.toLowerCase(),
          otpCode,
          expiresAt,
          attempts: 0,
        },
      });
    });

    // Send OTP email (async)
    sendOtpEmail(email, otpCode).catch(err => {
      console.error('[Auth] Failed to send OTP email:', err);
    });

    res.json({
      success: true,
      message: 'تم إعادة إرسال رمز التحقق',
      data: {
        email: email.toLowerCase(),
        expiresIn: OTP_EXPIRY_MINUTES * 60,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/auth/update-name
 * Update user name (requires authentication)
 */
async function updateName(req, res, next) {
  try {
    const userId = req.user.userId;
    const { name } = req.body;

    // Validate input
    if (!name || name.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'الاسم يجب أن يكون 3 أحرف على الأقل',
      });
    }

    // Update user name
    const updatedUser = await withRetry(async () => {
      return await prisma.user.update({
        where: { id: userId },
        data: { name: name.trim() },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          isVerified: true,
          createdAt: true,
        },
      });
    });

    res.json({
      success: true,
      message: 'تم تحديث الاسم بنجاح',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/auth/change-password
 * Change user password (requires authentication)
 */
async function changePassword(req, res, next) {
  try {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;

    // Validate input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء إدخال كلمة المرور الحالية والجديدة',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل',
      });
    }

    // Get user with password
    const user = await withRetry(async () => {
      return await prisma.user.findUnique({
        where: { id: userId },
      });
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود',
      });
    }

    // Check if user has a password (Google users don't)
    if (!user.passwordHash) {
      return res.status(400).json({
        success: false,
        message: 'حسابك مسجل عبر Google وليس له كلمة مرور حالية. استخدم "إنشاء كلمة مرور" بدلاً من ذلك',
      });
    }

    // Verify old password
    const isValidPassword = await bcrypt.compare(oldPassword, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'كلمة المرور الحالية غير صحيحة',
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await withRetry(async () => {
      await prisma.user.update({
        where: { id: userId },
        data: { passwordHash: hashedPassword },
      });
    });

    res.json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/auth/set-password
 * Set password for Google users (requires authentication)
 */
async function setPassword(req, res, next) {
  try {
    const userId = req.user.userId;
    const { newPassword } = req.body;

    // Validate input
    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء إدخال كلمة المرور الجديدة',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
      });
    }

    // Get user
    const user = await withRetry(async () => {
      return await prisma.user.findUnique({
        where: { id: userId },
      });
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود',
      });
    }

    // Check if user already has a password
    if (user.passwordHash) {
      return res.status(400).json({
        success: false,
        message: 'لديك كلمة مرور بالفعل. استخدم "تغيير كلمة المرور" بدلاً من ذلك',
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Set password
    await withRetry(async () => {
      await prisma.user.update({
        where: { id: userId },
        data: { passwordHash: hashedPassword },
      });
    });

    res.json({
      success: true,
      message: 'تم إنشاء كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول باستخدامها',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getMe,
  googleLogin,
  verifyOtp,
  resendOtp,
  updateName,
  changePassword,
  setPassword,
};
