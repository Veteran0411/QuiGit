    import { 
      doc, 
      setDoc ,
      getDocs,
      getDoc,
      collection,
      updateDoc,
      arrayUnion
    } from "firebase/firestore";

import { auth,firestore } from "../firebaseConfig";


export const createUserCollection=async(email,userName)=>{
    const data={
        userName:userName,
        email:email,
        gamesCreated:[]
    }
    try{
        const docRef=doc(firestore,"users",email);
        await setDoc(docRef,data);
        return true;
    }catch(error){
        console.log(error,"error while posting details");
        return false;
    }
};


// test game id
export const createGameCollection = async (email, Data) => {
  try {
    const docRef = doc(firestore, "games", email);

    // Fetch the existing document
    const docSnapshot = await getDoc(docRef);

    let count = 0;

    if (docSnapshot.exists()) {
      // Count the number of existing objects in the document
      const existingData = docSnapshot.data();
      count = Object.keys(existingData).length;
    }

    // Replace periods (.) in the email with underscores (_) for gameId
    const sanitizedEmail = email.replace(/\./g, "_"); // Replaces all periods with underscores
    const gameId = `${sanitizedEmail}-${count}`; // Create the game ID with sanitized email

    const now = new Date();
    const date = now.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const time = now.toTimeString().split(" ")[0]; // Format: HH:MM:SS

    // New game data
    const data = {
      ...Data,
      players: [],
      isOnline: false,
      date, // Adding date
      time, // Adding time
    };

    // Update the document with the new game
    const updatedData = docSnapshot.exists()
      ? {
          ...docSnapshot.data(),
          [gameId]: data,
        }
      : {
          [gameId]: data,
        };

    // Set the updated data in the document
    await setDoc(docRef, updatedData);

    return true;
  } catch (error) {
    console.error("Error while creating game collection:", error);
    return false;
  }
};


export const joinGame = async (email, gamePin) => {
  try {
    // Reference to the "games" collection
    const gamesCollection = collection(firestore,"games");

    // Fetch all documents in the "games" collection
    const gamesSnapshot = await getDocs(gamesCollection);

    // Iterate through each document (user's email as document ID)
    for (const gameDoc of gamesSnapshot.docs) {
      const gameData = gameDoc.data();

      // Iterate through each game ID in the document
      for (const [gameId, gameDetails] of Object.entries(gameData)) {
        // Check if the gamePin matches
        if (String(gameDetails.gamePin) === String(gamePin)) {
          // If a match is found, add the player's email to the players array
          const gameRef = doc(firestore, "games", gameDoc.id);
          await updateDoc(gameRef, {
            [`${gameId}.players`]: arrayUnion(email),
          });

          return true; // Successfully joined the game
        }
      }
    }

    // If no matching gamePin is found
    return false;
  } catch (error) {
    console.error("Error while joining game:", error);
    return false;
  }
};

