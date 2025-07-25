import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  accessToken: undefined,
  user: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLoggedIn: (state, { payload }) => {
      state.accessToken = payload.accessToken;
      state.user = payload.user;
    },
    userLoggedOut: (state) => {
      state.accessToken = undefined;
      state.user = undefined;
      Cookies.remove('userInfo');
    },
  },
});

export const { 
  userLoggedIn, 
  userLoggedOut
} = authSlice.actions;
export default authSlice.reducer;
