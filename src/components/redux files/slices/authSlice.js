import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      const { uid, email, displayName } = action.payload; // Extract necessary fields
      state.user = { uid, email, displayName };
      localStorage.setItem('user', JSON.stringify(action.payload)); 
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('user');
    },
    setUserFromLocalStorage: (state) => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
          state.isAuthenticated = true;
          state.user = user;
      }
    },
  },
});

export const { login, logout,setUserFromLocalStorage } = authSlice.actions;
export default authSlice.reducer;
