import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import type { Application } from 'express-serve-static-core';
import httpStatus from 'http-status';
import prismaClient from './app/lib/prisma.js';
import GlobalError from './app/middlewares/GlobalError.js';
import NotFound from './app/middlewares/NotFound.js';
import { AppRoutes } from './app/routes/index.js';
import catchAsync from './app/utils/catchAsync.js';
import sendResponse from './app/utils/sendResponse.js';

// Create an instance of the Express application
const app: Application = express();

// Middlewares to parse json and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Enable Cross-Origin Resource Sharing (CORS) with specified options
app.use(
  cors({
    credentials: true,
    origin: [
      'http://localhost:5173',
      'https://url-shortener-sandy-three.vercel.app',
    ],
  }),
);

// Define a GET route for the root URL
app.get(
  '/',

  catchAsync((req, res) => {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Server Running Smoothly.',
      data: null,
    });
  }),
);

// Redirect to the original URL
app.get(
  '/:key',
  catchAsync(async (req, res) => {
    const { key } = req.params;
    const link = await prismaClient.link.findFirst({
      where: {
        keyword: key as string,
        is_deleted: false,
      },
    });

    if (link) {
      await prismaClient.link.update({
        where: { id: link.id },
        data: { clicks: { increment: 1 } },
      });
      res.redirect(link.original_url);
    }
  }),
);

app.use('/api/v1/', AppRoutes);

// Middleware to handle 404 (Not Found) errors
app.use(/.*/, NotFound);

// Middleware to handle global errors
app.use(GlobalError);

export default app;
