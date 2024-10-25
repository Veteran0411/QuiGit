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
      const { uid, email, displayName,phoneNumber } = action.payload; // Extract necessary fields
      state.user = { uid, email, displayName,phoneNumber };
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

    // here i should get value from firebase store
    updateUser: (state, action) => {
      if (state.user) {
        state.user.displayName = action.payload.displayName;
        localStorage.setItem('user', JSON.stringify(state.user)); // Update localStorage with new displayName
      }
    }
  },
});

export const { login, logout,setUserFromLocalStorage,updateUser} = authSlice.actions;
export default authSlice.reducer;
