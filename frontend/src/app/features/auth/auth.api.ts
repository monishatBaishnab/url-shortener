import { API_TAGS, API_URL } from '@/app/app.constants';
import { logger } from '@/lib/logger';
import type { CommonResponse } from '@/types/types';
import { appServiceApi } from '../../apis/app-service.api';
import { clearAuthInfo, setAuth, setProfileInfo } from './auth.slice';
import type { LoginResponse, UserData } from './auth.types';

export const authApi = appServiceApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      CommonResponse<LoginResponse>,
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: API_URL.login,
        body: credentials,
        method: 'POST',
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          const accessToken = data?.data?.accessToken;

          if (accessToken) {
            // Store accessToken using setAuth reducer
            dispatch(setAuth(accessToken));
            // After storing token, call getProfileInfo API
            // dispatch(authApi.endpoints.getProfileInfo.initiate(undefined));
          }
        } catch {
          // Handle login error
        }
      },
    }),
    getProfileInfo: builder.query<CommonResponse<UserData>, void>({
      query: () => ({
        url: API_URL.getProfileInfo,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          // Store profileInfo using setProfileInfo reducer
          dispatch(setProfileInfo(data?.data));
          // toast('success', 'Login successful!');
        } catch (err) {
          logger.log(err);
          dispatch(clearAuthInfo());
        }
      },
      providesTags: () => [{ type: API_TAGS.GET_ME }],
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: API_URL.forgotPassword,
        method: 'POST',
        body: data,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: API_URL.verifyOtp,
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: API_URL.resetPassword,
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: API_URL.register,
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          const accessToken = data?.data?.accessToken;

          if (accessToken) {
            // Store accessToken using setAuth reducer
            dispatch(setAuth(accessToken));
          }
        } catch {
          // Handle register error
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useGetProfileInfoQuery,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useRegisterMutation,
} = authApi;
