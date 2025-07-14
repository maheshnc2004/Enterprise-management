
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
      localStorage.setItem("currentUser", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("currentUser");
    },
    // ✅ Add this:
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("currentUser", JSON.stringify(action.payload));
    },
  },
});

export const { login, logout, setUser } = authSlice.actions; 
export default authSlice.reducer;
