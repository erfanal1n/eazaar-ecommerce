import { apiSlice } from "@/redux/api/apiSlice";
import { userLoggedIn } from "./authSlice";
import Cookies from "js-cookie";
import { notifySuccess, notifyError, notifyLoading, dismissToast } from "@/utils/notifications";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const loadingToast = notifyLoading("Creating your account...");
        
        try {
          const result = await queryFulfilled;
          dismissToast(loadingToast);
          notifySuccess(result.data.message || "Account created successfully!");
          
          if (result.data.data?.user) {
            dispatch(userLoggedIn({
              user: result.data.data.user,
            }));
          }
        } catch (error) {
          dismissToast(loadingToast);
          const errorMessage = error?.error?.data?.message || "Registration failed!";
          notifyError(errorMessage);
        }
      },
    }),
    
    signUpProvider: builder.mutation({
      query: (token) => ({
        url: `/user/register/${token}`,
        method: "POST",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const loadingToast = notifyLoading("Signing up with Google...");
        
        try {
          const result = await queryFulfilled;
          dismissToast(loadingToast);
          notifySuccess("Google sign up successful!");

          Cookies.set(
            "userInfo",
            JSON.stringify({
              accessToken: result.data.data.token,
              user: result.data.data.user,
            }),
            { expires: 1 }
          );

          dispatch(
            userLoggedIn({
              accessToken: result.data.data.token,
              user: result.data.data.user,
            })
          );
        } catch (error) {
          dismissToast(loadingToast);
          const errorMessage = error?.error?.data?.message || "Google sign up failed!";
          notifyError(errorMessage);
        }
      },
    }),
    
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/user/login",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const loadingToast = notifyLoading("Signing you in...");
        
        try {
          const result = await queryFulfilled;
          dismissToast(loadingToast);
          notifySuccess(result.data.message || "Welcome back!");

          const { user, tokens } = result.data.data;
          
          Cookies.set(
            "userInfo",
            JSON.stringify({
              accessToken: tokens.accessToken,
              user: user,
            }),
            { expires: 1 }
          );

          dispatch(
            userLoggedIn({
              accessToken: tokens.accessToken,
              user: user,
            })
          );
        } catch (error) {
          dismissToast(loadingToast);
          const errorMessage = error?.error?.data?.message || "Login failed!";
          notifyError(errorMessage);
        }
      },
    }),
    
    getUser: builder.query({
      query: () => "/user/me",
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              user: result.data,
            })
          );
        } catch (err) {
          // Silent fail
        }
      },
    }),
    
    confirmEmail: builder.query({
      query: (token) => `/user/confirmEmail/${token}`,
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          Cookies.set(
            "userInfo",
            JSON.stringify({
              accessToken: result.data.data.token,
              user: result.data.data.user,
            }),
            { expires: 1 }
          );

          dispatch(
            userLoggedIn({
              accessToken: result.data.data.token,
              user: result.data.data.user,
            })
          );
        } catch (err) {
          // Silent fail
        }
      },
    }),
    
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/user/forget-password",
        method: "PATCH",
        body: data,
      }),
    }),
    
    confirmForgotPassword: builder.mutation({
      query: (data) => ({
        url: "/user/confirm-forget-password",
        method: "PATCH",
        body: data,
      }),
    }),
    
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/user/change-password",
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const loadingToast = notifyLoading("Updating your password...");
        
        try {
          const result = await queryFulfilled;
          dismissToast(loadingToast);
          notifySuccess(result.data.message || "Password updated successfully!");
        } catch (error) {
          dismissToast(loadingToast);
          const errorMessage = error?.error?.data?.message || "Failed to update password!";
          notifyError(errorMessage);
        }
      },
    }),
    
    updateProfile: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/user/update-user/${id}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const loadingToast = notifyLoading("Updating your profile...");
        
        try {
          const result = await queryFulfilled;
          dismissToast(loadingToast);
          notifySuccess(result.data.message || "Profile updated successfully!");

          Cookies.set(
            "userInfo",
            JSON.stringify({
              accessToken: result.data.data.token,
              user: result.data.data.user,
            }),
            { expires: 1 }
          );

          dispatch(
            userLoggedIn({
              accessToken: result.data.data.token,
              user: result.data.data.user,
            })
          );
        } catch (error) {
          dismissToast(loadingToast);
          const errorMessage = error?.error?.data?.message || "Failed to update profile!";
          notifyError(errorMessage);
          throw error;
        }
      },
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useConfirmEmailQuery,
  useResetPasswordMutation,
  useConfirmForgotPasswordMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useSignUpProviderMutation,
} = authApi;