// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrX34GHOFGQsn4eJpd0CaZ8wkvKEtBZjo",
  authDomain: "dooraid.firebaseapp.com",
  projectId: "dooraid",
  storageBucket: "dooraid.appspot.com",
  messagingSenderId: "40111671558",
  appId: "1:40111671558:web:3a5adda6efa3e52869b687",
  measurementId: "G-BHHTX8LQY8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };