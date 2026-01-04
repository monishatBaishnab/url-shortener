import type { RequestHandler } from 'express';
import sendResponse from '../utils/sendResponse.js';

const NotFound: RequestHandler = (req, res) => {
  sendResponse(res, {
    success: false,
    status: 404,
    message: `The API endpoint '${req?.baseUrl}' was not found.`,
  });
};

export default NotFound;
