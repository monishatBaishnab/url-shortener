import type { RequestHandler } from 'express';
import sendResponse from '../utils/sendResponse.js';

const NotFound: RequestHandler = (req, res) => {
  sendResponse(res, {
    success: false,
    statusCode: 404,
    message: 'API NOT FOUND',
    data: null,
  });
};

export default NotFound;
