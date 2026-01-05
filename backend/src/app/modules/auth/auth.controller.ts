import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import { AuthServices } from './auth.service.js';

export const AuthControllers = {
  register: catchAsync(async (req, res) => {
    const { refreshToken, accessToken } = await AuthServices.registerIntoDB(
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
      message: 'User registered successfully',
      data: { accessToken },
    });
  }),

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

  refreshToken: catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    const { accessToken } = await AuthServices.refreshTokenFromDB(refreshToken);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Access token refreshed successfully',
      data: { accessToken },
    });
  }),

  changePassword: catchAsync(async (req, res) => {
    const result = await AuthServices.changePasswordIntoDB(
      req.user?.email as string,
      req.body.current_password,
      req.body.new_password,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: result.message,
      data: null,
    });
  }),

  forgotPassword: catchAsync(async (req, res) => {
    const result = await AuthServices.forgotPasswordIntoDB(req.body.email);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: result.message,
      data: result.data,
    });
  }),

  verifyOtp: catchAsync(async (req, res) => {
    const result = await AuthServices.verifyOtpIntoDB(
      req.body.email,
      req.body.otp,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: result.message,
      data: null,
    });
  }),

  resetPassword: catchAsync(async (req, res) => {
    const result = await AuthServices.resetPasswordIntoDB(
      req.body.email,
      req.body.new_password,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: result.message,
      data: null,
    });
  }),
};
