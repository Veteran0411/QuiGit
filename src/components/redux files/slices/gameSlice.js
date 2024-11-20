// import { createSlice } from '@reduxjs/toolkit';

// const gameDetailsSlice = createSlice({
//   name: 'gameDetails',
//   initialState: {
//     gameId: '',
//     gamePin: '',
//     createdBy: '',
//     questions: [],
//     players: []
//   },
//   reducers: {
//     setGameDetails: (state, action) => {
//       const { gameId, gamePin, createdBy } = action.payload;
//       state.gameId = gameId;
//       state.gamePin = gamePin;
//       state.createdBy = createdBy;
//     },
//     addQuestion: (state, action) => {
//       state.questions.push(action.payload);
//     },
//     setQuestions: (state, action) => {
//       state.questions = action.payload;
//     },
//     addPlayer: (state, action) => {
//       state.players.push(action.payload);
//     },
//     setPlayers: (state, action) => {
//       state.players = action.payload;
//     },
//     resetGameDetails: (state) => {
//       state.gameId = '';
//       state.gamePin = '';
//       state.createdBy = '';
//       state.questions = [];
//       state.players = [];
//     },
//   },
// });

// export const { setGameDetails, addQuestion, setQuestions, addPlayer, setPlayers, resetGameDetails } = gameDetailsSlice.actions;
// export default gameDetailsSlice.reducer;


import { createSlice } from '@reduxjs/toolkit';

// Load initial state from localStorage, if available
const loadFromLocalStorage = () => {
  const data = localStorage.getItem('gameDetails');
  return data ? JSON.parse(data) : {
    gameId: '',
    gamePin: '',
    createdBy: '',
    questions: [],
    players: []
  };
};

const saveToLocalStorage = (state) => {
  localStorage.setItem('gameDetails', JSON.stringify(state));
};

const gameDetailsSlice = createSlice({
  name: 'gameDetails',
  initialState: loadFromLocalStorage(),
  reducers: {
    setGameDetails: (state, action) => {
      const { gameId, gamePin, createdBy } = action.payload;
      state.gameId = gameId;
      state.gamePin = gamePin;
      state.createdBy = createdBy;
      saveToLocalStorage(state);
    },
    addQuestion: (state, action) => {
      state.questions.push(action.payload);
      saveToLocalStorage(state);
    },
    setQuestions: (state, action) => {
      state.questions = action.payload;
      saveToLocalStorage(state);
    },
    addPlayer: (state, action) => {
      state.players.push(action.payload);
      saveToLocalStorage(state);
    },
    setPlayers: (state, action) => {
      state.players = action.payload;
      saveToLocalStorage(state);
    },
    resetGameDetails: (state) => {
      state.gameId = '';
      state.gamePin = '';
      state.createdBy = '';
      state.questions = [];
      state.players = [];
      localStorage.removeItem('gameDetails'); // Clear localStorage
    },
  },
});

export const { setGameDetails, addQuestion, setQuestions, addPlayer, setPlayers, resetGameDetails } = gameDetailsSlice.actions;
export default gameDetailsSlice.reducer;
