import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../lib/prisma.js';
import { config } from '../config/index.js';
import { AuthRequest, authenticate, validateBody } from '../middleware/auth.js';
import {
  registerSchema, verifySchema, loginSchema,
  forgotPasswordSchema, resetPasswordSchema, googleAuthSchema,
} from '../schemas/index.js';
import { generateOTP, signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/tokens.js';
import { sendOTPEmail } from '../utils/email.js';

const router = Router();
const googleClient = new OAuth2Client(config.google.clientId);

async function createTokens(userId: string, email: string, role: string) {
  const payload = { userId, email, role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: { token: refreshToken, userId, expiresAt },
  });

  return { accessToken, refreshToken };
}

router.post('/register', validateBody(registerSchema), async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing?.verified) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  const isDevelopment = (process.env.NODE_ENV || 'development').toLowerCase() === 'development';

  await prisma.oTP.deleteMany({ where: { email, type: 'VERIFY' } });
  await prisma.oTP.create({ data: { email, code: otp, type: 'VERIFY', expiresAt } });

  let user;
  if (existing) {
    user = await prisma.user.update({
      where: { email },
      data: { name, password: hashedPassword, verified: isDevelopment },
    });
  } else {
    user = await prisma.user.create({
      data: { name, email, password: hashedPassword, verified: isDevelopment },
    });
  }

  try {
    await sendOTPEmail(email, otp, 'VERIFY');
  } catch (error) {
    console.warn('OTP email send failed; OTP remains stored for manual verification.', error);
  }

  res.json({
    message: isDevelopment
      ? 'OTP generated. If email delivery is not configured, check the server console for the code.'
      : 'OTP sent to your email',
    email,
  });
});

router.post('/verify', validateBody(verifySchema), async (req, res) => {
  const { email, otp } = req.body;

  const otpRecord = await prisma.oTP.findFirst({
    where: { email, code: otp, type: 'VERIFY', expiresAt: { gt: new Date() } },
  });

  if (!otpRecord) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  const user = await prisma.user.update({
    where: { email },
    data: { verified: true },
  });

  await prisma.oTP.deleteMany({ where: { email, type: 'VERIFY' } });

  const tokens = await createTokens(user.id, user.email, user.role);
  res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    ...tokens,
  });
});

router.post('/login', validateBody(loginSchema), async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isDevelopment = (process.env.NODE_ENV || 'development').toLowerCase() === 'development';
  if (!user.verified && !isDevelopment) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const tokens = await createTokens(user.id, user.email, user.role);
  res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    ...tokens,
  });
});

router.post('/google', validateBody(googleAuthSchema), async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: config.google.clientId,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) {
      return res.status(400).json({ error: 'Invalid Google token' });
    }

    let user = await prisma.user.findUnique({ where: { email: payload.email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: payload.name || payload.email.split('@')[0],
          email: payload.email,
          googleId: payload.sub,
          verified: true,
          avatar: payload.picture,
        },
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId: payload.sub, avatar: user.avatar || payload.picture, verified: true },
      });
    }

    const tokens = await createTokens(user.id, user.email, user.role);
    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
      ...tokens,
    });
  } catch {
    return res.status(400).json({ error: 'Google authentication failed' });
  }
});

router.post('/forgot-password', validateBody(forgotPasswordSchema), async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.json({ message: 'If the email exists, an OTP has been sent' });
  }

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.oTP.deleteMany({ where: { email, type: 'RESET' } });
  await prisma.oTP.create({ data: { email, code: otp, type: 'RESET', expiresAt } });
  try {
    await sendOTPEmail(email, otp, 'RESET');
  } catch {
    console.warn('Reset OTP email send failed, continuing in development mode');
  }

  res.json({ message: 'If the email exists, an OTP has been sent' });
});

router.post('/reset-password', validateBody(resetPasswordSchema), async (req, res) => {
  const { email, otp, password } = req.body;

  const otpRecord = await prisma.oTP.findFirst({
    where: { email, code: otp, type: 'RESET', expiresAt: { gt: new Date() } },
  });

  if (!otpRecord) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.user.update({ where: { email }, data: { password: hashedPassword } });
  await prisma.oTP.deleteMany({ where: { email, type: 'RESET' } });

  res.json({ message: 'Password reset successfully' });
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token required' });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });

    if (!stored || stored.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const accessToken = signAccessToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });

    res.json({ accessToken });
  } catch {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
});

router.post('/logout', authenticate, async (req: AuthRequest, res: Response) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }
  res.json({ message: 'Logged out' });
});

router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true, name: true, email: true, role: true,
      avatar: true, streak: true, studyMinutes: true, createdAt: true,
    },
  });
  res.json(user);
});

export default router;
