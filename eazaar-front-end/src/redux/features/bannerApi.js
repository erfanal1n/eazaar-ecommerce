import { apiSlice } from "../api/apiSlice";

export const bannerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get banner position with banners
    getBannersByPosition: builder.query({
      query: (positionKey) => `/api/banner-positions/${positionKey}/banners`,
      providesTags: (result, error, positionKey) => [
        { type: 'Banner', id: positionKey },
      ],
    }),

    // Get all banner positions
    getBannerPositions: builder.query({
      query: () => '/api/banner-positions',
      providesTags: ['BannerPosition'],
    }),

    // Get single banner
    getBanner: builder.query({
      query: (id) => `/api/banners/${id}`,
      providesTags: (result, error, id) => [{ type: 'Banner', id }],
    }),

    // Get banners by position ID
    getBannersByPositionId: builder.query({
      query: (positionId) => `/api/banners/position/${positionId}`,
      providesTags: (result, error, positionId) => [
        { type: 'Banner', id: `position-${positionId}` },
      ],
    }),
  }),
});

export const {
  useGetBannersByPositionQuery,
  useGetBannerPositionsQuery,
  useGetBannerQuery,
  useGetBannersByPositionIdQuery,
} = bannerApi;