import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated:localStorage.getItem("isAuthenticated") || null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.data;
      // console.log(action.payload);
      state.isAuthenticated = true
      localStorage.setItem("isAuthenticated",true)
    },
 
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false
      localStorage.clear()
    },
}
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
