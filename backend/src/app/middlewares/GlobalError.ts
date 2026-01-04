import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import httpStatus from 'http-status';
import { ZodError } from 'zod';
import AppError from '../errors/AppError.js';
import SanitizePrismaError from '../errors/PrismaError.js';
import type { NextFunction, Request, Response } from 'express';

const GlobalError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const success: boolean = false;
  let status: number = err?.statusCode || httpStatus.BAD_REQUEST;
  let message: string = err?.name || 'Something want wrong.';

  if (err instanceof ZodError) {
    message = 'Validation failed, check the input data for errors.';
  } else if (err instanceof PrismaClientKnownRequestError) {
    const prismaError = SanitizePrismaError(err);

    message = prismaError.message;
    status = prismaError.statusCode;
  } else if (err instanceof AppError) {
    status = err.statusCode;
    message = err.message;
  }

  res.status(status).send({
    success,
    status,
    message,
  });
};

export default GlobalError;
