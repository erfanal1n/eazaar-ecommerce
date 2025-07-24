import { apiSlice } from "../api/apiSlice";
import { IAddress } from "@/utils/addressUtils";

interface IUser {
  _id: string;
  name: string;
  email: string;
  contactNumber?: string;
  phone?: string;
  address?: string | IAddress;
  shippingAddress?: string | IAddress;
  imageURL?: string;
  bio?: string;
  status: 'active' | 'inactive' | 'blocked';
  role: 'user' | 'admin';
  orderCount: number;
  createdAt: string;
  updatedAt: string;
}

interface IUserResponse {
  success: boolean;
  message: string;
  data: IUser[];
}

interface IUserUpdateResponse {
  success: boolean;
  message: string;
  data: IUser;
}

interface IUserDeleteResponse {
  success: boolean;
  message: string;
}

export const userApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get all users
    getAllUsers: builder.query<IUserResponse, void>({
      query: () => `/user/admin/all-users`,
      providesTags: ["Users"],
      keepUnusedDataFor: 600,
    }),
    
    // Update user by admin
    updateUserByAdmin: builder.mutation<
      IUserUpdateResponse,
      { id: string; data: Partial<IUser> }
    >({
      query({ id, data }) {
        return {
          url: `/user/admin/update-user/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["Users"],
    }),
    
    // Delete user
    deleteUser: builder.mutation<IUserDeleteResponse, string>({
      query(id: string) {
        return {
          url: `/user/admin/delete-user/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Users"],
    }),
    
    // Block/Unblock user
    toggleUserBlock: builder.mutation<
      IUserUpdateResponse,
      { id: string; action: 'block' | 'unblock' }
    >({
      query({ id, action }) {
        return {
          url: `/user/admin/toggle-block/${id}`,
          method: "PATCH",
          body: { action },
        };
      },
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useUpdateUserByAdminMutation,
  useDeleteUserMutation,
  useToggleUserBlockMutation,
} = userApi;