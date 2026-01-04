import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import type { Application } from 'express-serve-static-core';
import httpStatus from 'http-status';
import GlobalError from './app/middlewares/GlobalError.js';
import NotFound from './app/middlewares/NotFound.js';
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
    // origin: ['http://localhost:5173'],
  }),
);

// Define a GET route for the root URL
app.get(
  '/',

  catchAsync((req, res) => {
    sendResponse(res, {
      success: true,
      status: httpStatus.OK,
      message: 'Server Running Smoothly.',
    });
  }),
);

// Middleware to handle 404 (Not Found) errors
app.use(/.*/, NotFound);

// Middleware to handle global errors
app.use(GlobalError);

export default app;
