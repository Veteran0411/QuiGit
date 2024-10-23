// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjosiSN-F7l1ytuCCI-VoDTQjAaiHJ3d8",
  authDomain: "game-app-ee3ee.firebaseapp.com",
  projectId: "game-app-ee3ee",
  storageBucket: "game-app-ee3ee.appspot.com",
  messagingSenderId: "661900614123",
  appId: "1:661900614123:web:a25bf3dc562f7c3bb9a1ae",
  measurementId: "G-4D4ZKSMFS4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth=getAuth(app);

export {auth};