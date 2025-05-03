import nodemailer from "nodemailer";
import { Resend } from 'resend';

let resend: Resend | null = null;

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

// Nodemailer transport for fallback
const smtpTransport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Boolean(process.env.SMTP_SECURE === "true"),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface SendEmailProps {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: SendEmailProps) {
  const fromEmail = from || process.env.EMAIL_FROM || "noreply@yourchurch.org";
  
  try {
    // Try using Resend first
    if (resend) {
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to,
        subject,
        html,
      });
      
      if (error) throw new Error(error.message);
      return data;
    }
    
    // Fall back to nodemailer
    const result = await smtpTransport.sendMail({
      from: fromEmail,
      to,
      subject,
      html,
    });
    
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export function createVerificationHtml(name: string, verificationLink: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Verify your email address</h2>
      <p>Hello ${name || "there"},</p>
      <p>Thank you for registering with our church. Please verify your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationLink}" style="background-color: #4F46E5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Verify Email Address
        </a>
      </div>
      <p>Or copy and paste this link in your browser:</p>
      <p style="word-break: break-all; color: #4F46E5;">${verificationLink}</p>
      <p>If you did not create an account, please ignore this email.</p>
      <p>Thanks,<br>Your Church Team</p>
    </div>
  `;
}

export function createPasswordResetHtml(name: string, resetLink: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Reset your password</h2>
      <p>Hello ${name || "there"},</p>
      <p>We received a request to reset your password. Click the button below to set a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #4F46E5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Reset Password
        </a>
      </div>
      <p>Or copy and paste this link in your browser:</p>
      <p style="word-break: break-all; color: #4F46E5;">${resetLink}</p>
      <p>If you didn't request a password reset, please ignore this email.</p>
      <p>Thanks,<br>Your Church Team</p>
    </div>
  `;
}
