import { API_TAGS, API_URL } from '@/app/app.constants';
import type { CommonResponse } from '@/types/types';
import { appServiceApi } from '../../apis/app-service.api';
import type { CreateLinkResponse, LinkData } from './shortener.types';

export const shortenerApi = appServiceApi.injectEndpoints({
  endpoints: (builder) => ({
    createLink: builder.mutation<
      CommonResponse<CreateLinkResponse>,
      { original_link: string }
    >({
      query: (data) => ({
        url: API_URL.createLink,
        body: data,
        method: 'POST',
      }),
      invalidatesTags: [{ type: API_TAGS.GET_LINKS }],
    }),
    getAllLinks: builder.query<CommonResponse<LinkData[]>, void>({
      query: () => ({
        url: API_URL.getAllLinks,
      }),
      providesTags: [{ type: API_TAGS.GET_LINKS }],
    }),
    deleteLink: builder.mutation<
      CommonResponse<{ message: string }>,
      { linkId: string }
    >({
      query: ({ linkId }) => ({
        url: `${API_URL.deleteLink}/${linkId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: API_TAGS.GET_LINKS }],
    }),
  }),
});

export const {
  useCreateLinkMutation,
  useGetAllLinksQuery,
  useDeleteLinkMutation,
} = shortenerApi;
