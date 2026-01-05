import type { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { config } from '../../config/index.js';
import AppError from '../../errors/AppError.js';
import prismaClient from '../../lib/prisma.js';
import { createToken } from '../../utils/token.js';

export const AuthServices = {
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
};
