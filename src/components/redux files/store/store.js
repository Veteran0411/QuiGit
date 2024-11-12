import { configureStore } from '@reduxjs/toolkit';
import counterReducer from "../slices/counterSlice";
import authReducer from "../slices/authSlice";
import gameDetailsReducer from "../slices/gameSlice";

const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth:authReducer,
    gameDetails: gameDetailsReducer,
  },
});

export default store;
