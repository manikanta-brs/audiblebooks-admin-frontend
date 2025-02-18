import { createSlice } from "@reduxjs/toolkit";

// Load data from localStorage if available
const storedToken = localStorage.getItem("token");
const storedUserData = localStorage.getItem("userData")
  ? JSON.parse(localStorage.getItem("userData"))
  : null;
const storedProfileData = localStorage.getItem("profileData")
  ? JSON.parse(localStorage.getItem("profileData"))
  : null;
const storedIsAuthorLogin = localStorage.getItem("isAuthorLogin")
  ? JSON.parse(localStorage.getItem("isAuthorLogin"))
  : false;

const initialState = {
  token: storedToken || null,
  isAuthorLogin: storedIsAuthorLogin || false,
  userData: storedUserData || null,
  profileData: storedProfileData || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { token, isAuthorLogin, userData, profileData } = action.payload;
      state.token = token;
      state.isAuthorLogin = isAuthorLogin;
      state.userData = userData;
      state.profileData = profileData;

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("isAuthorLogin", JSON.stringify(isAuthorLogin));
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("profileData", JSON.stringify(profileData));
    },
    logout: (state) => {
      state.token = null;
      state.isAuthorLogin = false;
      state.userData = null;
      state.profileData = null;

      // Remove from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("isAuthorLogin");
      localStorage.removeItem("userData");
      localStorage.removeItem("profileData");
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
