import { APP_URL } from '@/config/config';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_TAGS } from '../app.constants';

export const appServiceApi = createApi({
  reducerPath: 'app-service-api',
  baseQuery: async (args, api, extraOptions) => {
    const baseQuery = fetchBaseQuery({
      baseUrl: APP_URL,
      prepareHeaders: async (headers, { getState }) => {
        const token = (getState() as any)?.auth?.accessToken;
        const defaultHeader: Headers = headers;
        if (token) {
          defaultHeader.set('Authorization', `Bearer ${token}`);
        }
      },
    });

    const result = await baseQuery(args, api, extraOptions);
    return result;
  },

  tagTypes: Object.values(API_TAGS),
  keepUnusedDataFor: 2,
  endpoints: () => ({}),
});
