import nodemailer from 'nodemailer';
import { config } from '../config/index.js';

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: false,
  auth: config.smtp.user && config.smtp.pass && !config.smtp.user.includes('your-') && !config.smtp.pass.includes('your-')
    ? { user: config.smtp.user, pass: config.smtp.pass }
    : undefined,
});

function shouldUseEmailTransport(): boolean {
  return Boolean(
    config.smtp.user &&
    config.smtp.pass &&
    !config.smtp.user.includes('your-') &&
    !config.smtp.pass.includes('your-')
  );
}

export async function sendOTPEmail(email: string, otp: string, type: 'VERIFY' | 'RESET'): Promise<void> {
  const subject = type === 'VERIFY' ? 'Verify your DevOps Learning account' : 'Reset your password';
  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #0f172a;">DevOps Learning Hub</h2>
      <p>Your verification code is:</p>
      <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #3b82f6; padding: 16px 0;">
        ${otp}
      </div>
      <p style="color: #64748b;">This code expires in 10 minutes.</p>
    </div>
  `;

  if (!shouldUseEmailTransport()) {
    console.warn(`[EMAIL] SMTP is not configured for ${email}; OTP was generated but not sent by email.`);
    console.log(`[DEV] OTP for ${email}: ${otp}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: config.smtp.from,
      to: email,
      subject,
      html,
    });
    console.log(`[EMAIL] OTP sent successfully to ${email}`);
  } catch (error) {
    console.error(`[EMAIL] SMTP failed for ${email}:`, error);
    console.log(`[DEV] OTP for ${email}: ${otp}`);
    throw error;
  }
}
