import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.js';
import validateRequest from '../../utils/vaildateRequest.js';
import { AuthControllers } from './auth.controller.js';
import { AuthValidation } from './auth.validation.js';

const router = Router();

/**
 * @route   GET /api/v1/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post(
  '/register',
  validateRequest(AuthValidation.registerSchema),
  AuthControllers.register,
);

/**
 * @route   GET /api/v1/auth/login
 * @desc    Login with email & password
 * @access  Public
 */
router.post(
  '/login',
  validateRequest(AuthValidation.loginSchema),
  AuthControllers.login,
);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current authenticated user
 * @access  Private
 */
router.get('/me', authenticate, AuthControllers.getMe);

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refresh access token using refresh token
 * @access  Public
 */
router.post('/refresh-token', AuthControllers.refreshToken);

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change user password (requires current password)
 * @access  Private
 */
router.post(
  '/change-password',
  authenticate,
  validateRequest(AuthValidation.changePasswordSchema),
  AuthControllers.changePassword,
);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Send OTP to user email for password reset
 * @access  Public
 */
router.post(
  '/forgot-password',
  validateRequest(AuthValidation.forgotPasswordSchema),
  AuthControllers.forgotPassword,
);

/**
 * @route   POST /api/v1/auth/verify-otp
 * @desc    Verify OTP code for password reset
 * @access  Public
 */
router.post(
  '/verify-otp',
  validateRequest(AuthValidation.verifyOtpSchema),
  AuthControllers.verifyOtp,
);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password after OTP verification
 * @access  Public
 */
router.post(
  '/reset-password',
  validateRequest(AuthValidation.resetPasswordSchema),
  AuthControllers.resetPassword,
);

export const AuthRoutes = router;
