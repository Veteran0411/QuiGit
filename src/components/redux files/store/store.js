// import { configureStore } from '@reduxjs/toolkit';
// import counterReducer from "../slices/counterSlice";
// import authReducer from "../slices/authSlice";

// const store = configureStore({
//   reducer: {
//     counter: counterReducer,
//     auth:authReducer
//   },
// });

// export default store;

// src/store/store.js

import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../slices/counterSlice";
import authReducer from "../slices/authSlice";
import gamePinReducer from "../slices/gamePinSlice"; // Import the new slice

const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    gamePin: gamePinReducer, // Add the new slice to the store
  },
});

export default store;
