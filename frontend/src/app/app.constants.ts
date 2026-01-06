export const API_TAGS = {
  GET_ME: 'get-me',
} as const;
export type TTagTypes = (typeof API_TAGS)[keyof typeof API_TAGS];

export const API_URL = {
  // ------ Auth URL's ------
  login: '/auth/login',
  register: '/auth/register',
  verifyOtp: '/auth/verify-otp',
  refreshToken: '/auth/refresh-token',
  resetPassword: '/auth/reset-password',
  changePassword: '/auth/change-password',
  forgotPassword: '/auth/forgot-password',
  getProfileInfo: '/auth/get-me',
};
