import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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


// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);