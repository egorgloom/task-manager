import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Activity } from "react";

export type UserType = {
  id: number;
  email: string;
};

export type AuthStateType = {
  token: string | null;
  user: UserType | null;
};

const initialState: AuthStateType = {
  token: localStorage.getItem("access_token"),
  user: null,
};

const authStateSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: UserType }>,
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem("access_token", action.payload.token);
    },
    logout: (state) => {
      ((state.token = null), (state.user = null));
      localStorage.removeItem("access_token");
    },
  },
});

export const { setCredentials, logout } = authStateSlice.actions;
export const authReducer = authStateSlice.reducer;
