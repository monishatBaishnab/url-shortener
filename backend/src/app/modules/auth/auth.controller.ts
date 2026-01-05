import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import { AuthServices } from './auth.service.js';

export const AuthControllers = {
  login: catchAsync(async (req, res) => {
    const { refreshToken, accessToken } = await AuthServices.loginIntoDB(
      req.body,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User logged in successfully',
      data: { accessToken },
    });
  }),

  getMe: catchAsync(async (req, res) => {
    const result = await AuthServices.getMeFromDB(req.user?.email as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User details fetched successfully.',
      data: result,
    });
  }),
};
