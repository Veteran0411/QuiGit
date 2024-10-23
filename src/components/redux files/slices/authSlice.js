import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: { 
    isAuthenticated: false,
    isAnonymous:false
   },
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
      state.isAnonymous=false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.isAnonymous=false;
    },
    loginAnonymously:(state)=>{
      state.isAnonymous=true;
      state.isAuthenticated=true;
    }
  },
});

export const { login, logout,loginAnonymously } = authSlice.actions;
export default authSlice.reducer;
