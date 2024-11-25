    import { doc, setDoc ,getDoc} from "firebase/firestore";
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


// generate good gameId. 
export const createGameCollection = async (email, Data) => {
    const gameId="game3";
    const data={
        ...Data,
        players:[],
        isOnline:false
    }
  try {
    const docRef = doc(firestore, "games", email);

    // Fetch the existing document
    const docSnapshot = await getDoc(docRef);

    let updatedData = {};
    if (docSnapshot.exists()) {
      // Merge the new game data with the existing data
      updatedData = {
        ...docSnapshot.data(),
        [gameId]: data,
      };
    } else {
      // If the document doesn't exist, create it with the new game data
      updatedData = {
        [gameId]: data,
      };
    }

    // Set the updated data in the document
    await setDoc(docRef, updatedData);
    return true;
  } catch (error) {
    console.error("Error while posting details:", error);
    return false;
  }
};
