import { apiSlice } from "../api/apiSlice";

export const adminRoleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all admin roles
    getAdminRoles: builder.query<any, void>({
      query: () => `/admin-role/all`,
      providesTags: ["AdminRole"],
    }),

    // Get available pages for role creation
    getAvailablePages: builder.query<any, void>({
      query: () => `/admin-role/available-pages`,
      providesTags: ["AdminRole"],
    }),

    // Get admin role by ID
    getAdminRoleById: builder.query<any, string>({
      query: (id) => `/admin-role/${id}`,
      providesTags: ["AdminRole"],
    }),

    // Create admin role
    createAdminRole: builder.mutation<any, any>({
      query: (data) => ({
        url: `/admin-role/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AdminRole"],
    }),

    // Update admin role
    updateAdminRole: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/admin-role/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["AdminRole"],
    }),

    // Delete admin role
    deleteAdminRole: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin-role/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminRole"],
    }),
  }),
});

export const {
  useGetAdminRolesQuery,
  useGetAvailablePagesQuery,
  useGetAdminRoleByIdQuery,
  useCreateAdminRoleMutation,
  useUpdateAdminRoleMutation,
  useDeleteAdminRoleMutation,
} = adminRoleApi;