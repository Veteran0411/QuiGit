import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../firebaseConfig";

export const createUserCollection = async (email, userName) => {
  const data = {
    userName: userName,
    email: email,
    gamesCreated: [],
  };
  try {
    const docRef = doc(firestore, "users", email);
    await setDoc(docRef, data);
    return true;
  } catch (error) {
    console.log(error, "error while posting details");
    return false;
  }
};
// //Somling
// export const createGameCollection = async (email, data) => {
//   try {
//     const docRef = doc(firestore, "games", email);
//     // makde this object and retain old values
//     await setDoc(docRef, { id2: data });
//     return true;
//   } catch (error) {
//     console.log(error, "error while posting details");
//     return false;
//   }
// };

//Rohit working

export const createGameCollection = async (email, submittedData) => {
  try {
    const docRef = doc(firestore, "games", email);

    // Fetch existing game data
    const existingDoc = await getDoc(docRef);
    let existingData = {};

    if (existingDoc.exists()) {
      // If the document exists, get the current data
      existingData = existingDoc.data();
    }

    // Create a new game ID based on the current number of games
    const newGameId = `gameId${Object.keys(existingData).length + 1}`;

    // Construct the new game entry
    const newGameEntry = {
      gamePin: submittedData.gamePin,
      questions: submittedData.questions,
    };

    // Merge existing data with the new game entry
    const updatedData = {
      ...existingData,
      [newGameId]: newGameEntry,
    };

    // Set the updated document with merged data
    await setDoc(docRef, updatedData);

    console.log("Game collection updated successfully!");
    return true;
  } catch (error) {
    console.error("Error while posting details:", error);
    return false;
  }
};
