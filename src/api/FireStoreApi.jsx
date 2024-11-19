    import { doc, setDoc } from "firebase/firestore";
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

export const createGameCollection=async(email,data)=>{
    try{
        const docRef=doc(firestore,"games",email);
        // makde this object and retain old values
        await setDoc(docRef,data);
        return true;
    }catch(error){
        console.log(error,"error while posting details");
        return false;
    }
}