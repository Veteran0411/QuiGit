import {signInWithEmailAndPassword,createUserWithEmailAndPassword,sendEmailVerification,signOut} from "firebase/auth";
import { auth } from "../firebaseConfig";


export const LoginApi=async (email,password)=>{
    try{
        let response=await signInWithEmailAndPassword(auth,email,password);
        return response;
    }catch(error){
        return error;
    }
};

export const RegisterApi=async (email,password)=>{
    try{
        let response=await createUserWithEmailAndPassword(auth,email,password);
        await sendEmailVerification(auth.currentUser);
        return {success:true,data:response};
    }catch(error){
        console.error("Registration error:", error); // Better error logging
        if (error.code === 'auth/email-already-in-use') {
            return { success: false, error: "Email already in use" };
        } else {
            return { success: false, error: error.message };
        }
    }
};

export const SignOutApi=async()=>{
    try{
        await signOut(auth);
        return console.log("signed out")
    }catch(error){
        console.log("error while sign out",error);
    }
}