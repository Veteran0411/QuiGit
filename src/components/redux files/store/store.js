import { configureStore } from '@reduxjs/toolkit';
import counterReducer from "../slices/counterSlice";
import authReducer from "../slices/authSlice";
import gameDetailsReducer from "../slices/gameSlice";
import gamePinReducer from "../slices/gamePinSlice"

const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth:authReducer,
    gameDetails: gameDetailsReducer,
    gamePin:gamePinReducer,
  },
});

export default store;
