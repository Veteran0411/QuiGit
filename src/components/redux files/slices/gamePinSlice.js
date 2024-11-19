// src/redux/slices/gamePinSlice.js

import { createSlice } from "@reduxjs/toolkit";

const gamePinSlice = createSlice({
  name: "gamePin",
  initialState: {
    pin: null,
    isPinSet: false,
  },
  reducers: {
    setGamePin: (state, action) => {
      state.pin = action.payload; // Set the game pin
      state.isPinSet = true; // Mark that the pin has been set
      localStorage.setItem("gamePin", action.payload); // Store in localStorage
    },
    clearGamePin: (state) => {
      state.pin = null; // Clear the game pin
      state.isPinSet = false; // Mark that the pin has been cleared
      localStorage.removeItem("gamePin"); // Remove from localStorage
    },
    loadGamePinFromLocalStorage: (state) => {
      const pin = localStorage.getItem("gamePin");
      if (pin) {
        state.pin = pin; // Load pin from localStorage if it exists
        state.isPinSet = true;
      }
    },
  },
});

export const { setGamePin, clearGamePin, loadGamePinFromLocalStorage } =
  gamePinSlice.actions;
export default gamePinSlice.reducer;