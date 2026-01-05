import { z } from 'zod';

const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must be at most 50 characters long')
    .trim(),

  email: z.string().email('Invalid email format').toLowerCase().trim(),

  password: z
    .string()
    .min(6, 'Password must be at least 8 characters long')
    .max(128, 'Password must be at most 128 characters long'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),

  password: z
    .string()
    .min(1, 'Password is required')
    .max(128, 'Password is too long'),
});

const changePasswordSchema = z.object({
  current_password: z
    .string()
    .min(1, 'Current password is required')
    .max(128, 'Current password is too long'),

  new_password: z
    .string()
    .min(6, 'New password must be at least 6 characters long')
    .max(128, 'New password must be at most 128 characters long'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),
});

const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),

  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only numbers'),
});

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),

  new_password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(128, 'Password must be at most 128 characters long'),
});

export const AuthValidation = {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
};
