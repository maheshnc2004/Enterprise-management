// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const savedUser = JSON.parse(localStorage.getItem("currentUser"));

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: savedUser || null,
    isAuthenticated: !!savedUser,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("currentUser", JSON.stringify(action.payload)); // ✅ persist login
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("currentUser"); // ✅ clear on logout
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
