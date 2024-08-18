// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAnalytics} from 'firebase/analytics'
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCBVUXozQbmTblJHfTUifXbmThfYhWqRQE",
    authDomain: "flashcards-f9e30.firebaseapp.com",
    projectId: "flashcards-f9e30",
    storageBucket: "flashcards-f9e30.appspot.com",
    messagingSenderId: "166067547179",
    appId: "1:166067547179:web:3cb929c95bdfaa52208e6e",
    measurementId: "G-V8P0RPXCQ8"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app)

export {db}