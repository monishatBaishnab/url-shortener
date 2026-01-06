import httpStatus from 'http-status';
import AppError from '../../errors/AppError.js';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import { LinkServices } from './link.service.js';

export const LinkControllers = {
  createLink: catchAsync(async (req, res) => {
    if (!req.user?.id) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }

    const result = await LinkServices.createLinkIntoDB({
      user_id: req.user.id,
      original_url: req.body.original_link,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Link created successfully',
      data: result,
    });
  }),

  getAllLinks: catchAsync(async (req, res) => {
    if (!req.user?.id) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }

    const result = await LinkServices.getAllLinksFromDB(req.user.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Links fetched successfully',
      data: result,
    });
  }),

  getLinkByKey: catchAsync(async (req, res) => {
    if (!req.user?.id) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }

    if (!req.params.key) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Link key is required');
    }

    const result = await LinkServices.getLinkByKeyFromDB(
      req.params.key,
      req.user.id,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Link fetched successfully',
      data: result,
    });
  }),

  deleteLink: catchAsync(async (req, res) => {
    if (!req.user?.id) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }

    if (!req.params.id) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Link ID is required');
    }

    const result = await LinkServices.deleteLinkFromDB(
      req.params.id,
      req.user.id,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: result.message,
      data: null,
    });
  }),
};
