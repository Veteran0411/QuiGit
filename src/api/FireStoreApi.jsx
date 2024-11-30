    import { 
      doc, 
      setDoc ,
      addDoc,
      getDocs,
      getDoc,
      collection,
      updateDoc,
      arrayUnion,
      arrayRemove,
      deleteField
    } from "firebase/firestore";

import { auth,firestore } from "../firebaseConfig";

import { getDatabase, ref, onDisconnect, set, remove } from "firebase/database";


export const createUserCollection=async(email,userName)=>{
    const data={
        userName:userName,
        email:email,
        gamesCreated:[],
        gamesPlayed: 0,
        totalScore:0,
        lastGameId:""
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
      createdBy:email,
      isOnline: false,
      currentPage:"",// can modify page to questions
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


export const joinGame = async (email, gamePin,displayName) => {
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
        if (String(gameDetails.gamePin) === String(gamePin) && gameDetails.isOnline===true) {
          // If a match is found, add the player's email to the players array
          const gameRef = doc(firestore, "games", gameDoc.id);
          await updateDoc(gameRef, {
            [`${gameId}.players`]: arrayUnion({email:email,displayName:displayName,score:0}),
          });

          return {status:true,message:"Joined the game"}; // Successfully joined the game
        }
      }
    }

    // If no matching gamePin is found
    return {status:false,message:"Game has not started yet"};
  } catch (error) {
    console.error("Error while joining game:", error);
    return {status:false,message:"Error while joining game"};
  }
};


// modify code later so that display name is displayed on the screen
export const getAllPlayers=async(email,gamePin)=>{
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
          return {
            status:true,
            details:gameDetails
          }; // Successfully joined the game
        }
      }
    }
    // If no matching gamePin is found
    return false;
  } catch (error) {
    console.error("Error while joining game:", error);
    return false;
  }
}

export const trackPlayerStatus = async (email, gamePin, player) => {
  try {
    const db = getDatabase(); // Initialize Realtime Database
    const onlineRef = ref(db, `gameStatus/${gamePin}/${player}`);

    // Mark the player as online in the Realtime Database
    await set(onlineRef, true);

    // Set a listener to remove the player when they disconnect
    onDisconnect(onlineRef).remove();

    // Cleanup in Firestore when the player disconnects
    onDisconnect(onlineRef).then(async () => {
      const gameDocRef = doc(firestore, "games", email);
      await updateDoc(gameDocRef, {
        [`${gamePin}.players`]: arrayRemove(player),
      });
    });
  } catch (error) {
    console.error("Error setting up online status tracking:", error);
  }
};


export const getGamesCreated = async (userEmail) => {
  try {
    // Reference to the user's document using email as the document ID
    const userDocRef = doc(firestore, "games", userEmail);
    const userDocSnapshot = await getDoc(userDocRef); // Fetch the document

    if (userDocSnapshot.exists()) {
      const gamesData = userDocSnapshot.data(); // Get the data of the document

      // Get the keys (which are the email IDs) and map through games data
      const fetchedGames = Object.keys(gamesData).map((gameId) => ({
        gamePin: gamesData[gameId].gamePin,
        gameName: gamesData[gameId].gameName,
        gameId: gameId, // This will store the key name (email)
      }));

      return fetchedGames;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching games:", error);
    return []; // Return an empty array in case of an error
  }
};


export const startGame = async (email, gamePin, gameId) => {
  try {
    // Reference to the specific user's document in the `games` collection
    const gameDocRef = doc(firestore, "games", email);
    // Fetch the current document data
    const userDocSnapshot = await getDoc(gameDocRef);

    if (userDocSnapshot.exists()) {
      // Get the data of the user's document
      const gamesData = userDocSnapshot.data();

      // Check if the game exists within the data using the gameId
      if (gamesData[gameId]) {
        // Update only the `isOnline` field for the specific game
        await updateDoc(gameDocRef, {
          [`${gameId}.isOnline`]: true,  // Update the `isOnline` field for the game
        });

        return { success: true, message: "Game started successfully!" };
      } else {
        return { success: false, message: "Game not found!" };
      }
    } else {
      return { success: false, message: "User document not found!" };
    }
  } catch (error) {
    console.error("Error starting game:", error);
    return { success: false, message: "Error starting game!" };
  }
};


export const deleteGame = async (email,gamePin, gameId) => {
  try {
    // Reference to the document with the user's email as the document ID
    const gameDocRef = doc(firestore, "games", email); // Document ID is the email
    
    // Fetch the document to check if the gameId exists
    const gameDocSnapshot = await getDoc(gameDocRef);

    if (!gameDocSnapshot.exists()) {
      throw new Error("Game data not found.");
    }

    const gameData = gameDocSnapshot.data();
    // console.log(gameData[gameId]);

    // Check if the specific gameId exists in the document
    if (gameData[gameId]) {
      // Proceed to delete the game entry by the gameId key
      await updateDoc(gameDocRef, {
        [gameId]: deleteField(), // Delete the game object with the specified gameId key
      });

      return {success:true,message:"Deleted the game"};
    } else {
      return {success:false,message:"Failed deleted the game"};
    }
  } catch (error) {
    console.error("Error deleting game:", error.message);
    throw new Error("Failed to delete the game.");
  }
};


// use this collection for players
export const createResponseCollection = async () => {
  try {
    // Define the collection name
    const responsesRef = collection(firestore, "responses");

    // Create a placeholder document with default values
    const placeholderDoc = {
      gameId: null,        // Placeholder for gameId
      playerEmail: null,   // Placeholder for playerEmail
      answers: [],         // Initialize empty answers array
      score: 0,            // Default score
      createdAt: new Date().toISOString(), // Timestamp
    };

    // Add the document to the collection with an auto-generated ID
    const docRef = await addDoc(responsesRef, placeholderDoc);

    console.log("Document created with ID:", docRef.id);
  } catch (error) {
    console.error("Error creating responses collection:", error);
  }
};

export const updateCurrentPageAttribute = async (email, gamePin, page) => {
  try {
    // Reference to the user's document in the 'games' collection
    const userDocRef = doc(firestore, "games", email);

    // Fetch the user's document to find the game with the matching gamePin
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      
      // Loop through each game to find the game with the matching gamePin
      let gameUpdated = false;
      for (const [gameId, gameDetails] of Object.entries(userData)) {
        if (String(gameDetails.gamePin) === String(gamePin)) {
          // Update the currentPage for the game (either "hostView" or "playerView")
          await updateDoc(userDocRef, {
            [`${gameId}.currentPage`]: page // Update the currentPage for this specific game
          });
          gameUpdated = true;
          break;
        }
      }

      if (gameUpdated) {
        console.log("Current page updated for game with gamePin:", gamePin);
      } else {
        console.log("No game found with the matching gamePin:", gamePin);
      }
    } else {
      console.error("User document not found.");
    }
  } catch (error) {
    console.error("Error updating current page:", error);
  }
};

