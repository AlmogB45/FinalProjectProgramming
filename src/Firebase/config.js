// Import the functions you need from the SDKs you need
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

//TODO Change to .env file in future! 
const firebaseConfig = {
  apiKey: "AIzaSyBqYkViDhR2aZRc7A7Ouqit_L8AV1dWRWk",
  authDomain: "lendloop-7bb59.firebaseapp.com",
  projectId: "lendloop-7bb59",
  storageBucket: "lendloop-7bb59.appspot.com",
  messagingSenderId: "935610457910",
  appId: "1:935610457910:web:3fc3d8e0ede83d8d165d97"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();

