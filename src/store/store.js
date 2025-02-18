import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice"; // Ensure correct path
import authReducer from "./authSlice"; // Import authSlice

const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
