import { API_URL } from '@/app/app.constants';
import type { CommonResponse } from '@/types/types';
import { appServiceApi } from '../../apis/app-service.api';
import { setAuth } from './auth.slice';
import type { LoginResponse } from './auth.types';

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
  }),
});

export const { useLoginMutation } = authApi;
