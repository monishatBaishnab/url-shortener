import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { config } from '../config/index.js';
import AppError from '../errors/AppError.js';
import { verifyToken } from '../utils/token.js';
import catchAsync from '../utils/catchAsync.js';

export const authenticate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    let decoded;
    try {
      decoded = verifyToken(token, config.ACCESS_TOKEN_SECRET as string);
    } catch (err) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token!');
    }

    if (!decoded) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token!');
    }

    req.user = decoded;
    next();
  },
);
