import type { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { config } from '../../config/index.js';
import AppError from '../../errors/AppError.js';
import transporter from '../../lib/email.js';
import prismaClient from '../../lib/prisma.js';
import { generateOtp, isOtpExpired } from '../../utils/otp.js';
import sentOtp from '../../utils/sendOtp.js';
import { createToken, verifyToken } from '../../utils/token.js';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const AuthServices = {
  registerIntoDB: async (payload: RegisterPayload) => {
    // Check if user already exists
    const existingUser = await prismaClient.user.findUnique({
      where: { email: payload.email },
    });

    if (existingUser) {
      throw new AppError(
        httpStatus.CONFLICT,
        'User already exists with this email.',
      );
    }

    // Hash password with salt rounds (12 is recommended for security)
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(payload.password, saltRounds);

    // Create user with hashed password
    const user = await prismaClient.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
      },
    });

    // Create JWT token
    const accessToken = createToken(
      user,
      config.ACCESS_TOKEN_SECRET as string,
      '15m',
    );
    const refreshToken = createToken(
      user,
      config.REFRESH_TOKEN_SECRET as string,
      '15d',
    );

    // Return token
    return { accessToken, refreshToken };
  },

  loginIntoDB: async (payload: User) => {
    // Lookup user by e‑mail (throws 404 if not found)
    const user = await prismaClient.user.findUniqueOrThrow({
      where: { email: payload.email },
    });

    //  Verify password (constant‑time compare)
    const isMatchedPassword = bcrypt.compareSync(
      payload.password,
      user.password,
    );

    if (!isMatchedPassword) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Password not matched.');
    }

    // Create JWT token
    const accessToken = createToken(
      user,
      config.ACCESS_TOKEN_SECRET as string,
      '15m',
    );
    const refreshToken = createToken(
      user,
      config.REFRESH_TOKEN_SECRET as string,
      '15d',
    );

    if (user?.otp_verified) {
      await prismaClient.user.update({
        where: { id: user.id },
        data: {
          otp_code: null,
          otp_expired_at: null,
          otp_verified: false,
        },
      });
    }

    // Return token
    return { accessToken, refreshToken };
  },

  // Get authenticated user details
  getMeFromDB: async (email: string) => {
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User does not exist.');
    }

    return user;
  },

  // Generate new access token from refresh token
  refreshTokenFromDB: async (token: string) => {
    if (!token) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Refresh token not found.');
    }

    let decoded;
    try {
      decoded = verifyToken(token, config.REFRESH_TOKEN_SECRET as string);
    } catch (err) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Invalid or expired refresh token.',
      );
    }

    if (!decoded) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient permissions...');
    }

    // Get user data for token creation
    const user = await prismaClient.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
    }

    const accessToken = createToken(
      user,
      config.ACCESS_TOKEN_SECRET as string,
      '15m',
    );

    return { accessToken };
  },

  // Change user password with validation
  changePasswordIntoDB: async (
    email: string,
    current_password: string,
    new_password: string,
  ) => {
    if (!current_password || !new_password) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Please provide new & current password.',
      );
    }

    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const currentPassMatched = bcrypt.compareSync(
      current_password,
      user.password,
    );
    if (!currentPassMatched) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Current password not matched.',
      );
    }

    const newPassMatched = bcrypt.compareSync(new_password, user.password);
    if (newPassMatched) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'New password must be different from current password.',
      );
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(new_password, saltRounds);

    await prismaClient.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully.' };
  },

  // Send OTP to user email for password reset
  forgotPasswordIntoDB: async (email: string) => {
    const user = await prismaClient.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        otp_code: true,
        otp_expired_at: true,
      },
    });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const { verificationCode, expireAt } = generateOtp();

    // TODO: Send email with OTP
    if (config.EMAIL_USER && config.EMAIL_PASS) {
      const mailOptions = {
        from: config.EMAIL_USER,
        to: user.email,
        subject: 'Password Change OTP',
        text: `Your OTP code is ${verificationCode}. It will expire in 5 minutes.`,
        html: sentOtp({ verificationCode, userName: user.name }),
      };

      const sendEmail = await transporter.sendMail(mailOptions);
      if (!sendEmail?.accepted?.length) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to send Email');
      }
    }

    await prismaClient.user.update({
      where: { id: user.id },
      data: {
        otp_code: String(verificationCode),
        otp_expired_at: expireAt,
        otp_verified: false,
      },
    });

    return {
      message: 'Verification Email Send. Check inbox with spam/junk',
      data: !(config.EMAIL_USER && config.EMAIL_PASS)
        ? { otp: verificationCode }
        : {},
    };
  },

  // Verify OTP code for password reset
  verifyOtpIntoDB: async (email: string, otp: string) => {
    const user = await prismaClient.user.findUnique({
      where: { email },
      select: {
        id: true,
        otp_code: true,
        otp_expired_at: true,
        otp_verified: true,
      },
    });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const { otp_code, otp_expired_at } = user;

    if (!otp_code) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'No OTP found. Please request a new one.',
      );
    }

    if (isOtpExpired(otp_expired_at)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'OTP has expired. Please request a new one.',
      );
    }

    if (otp_code.toString() !== otp.toString()) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'OTP does not match. Please try again.',
      );
    }

    await prismaClient.user.update({
      where: { email },
      data: { otp_verified: true },
    });

    return { message: 'OTP verified successfully.' };
  },

  // Reset password after OTP verification
  resetPasswordIntoDB: async (email: string, new_password: string) => {
    const user = await prismaClient.user.findUnique({
      where: { email },
      select: {
        id: true,
        otp_verified: true,
      },
    });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (!user.otp_verified) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'OTP not verified. Cannot reset password.',
      );
    }

    if (!new_password) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Please provide password field.',
      );
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(new_password, saltRounds);

    await prismaClient.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        otp_code: null,
        otp_expired_at: null,
        otp_verified: false,
      },
    });

    return { message: 'Password reset successfully.' };
  },
};
