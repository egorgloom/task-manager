import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../entities/auth/authSlice";
import { tasksApi } from "../entities/task";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tasksApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
