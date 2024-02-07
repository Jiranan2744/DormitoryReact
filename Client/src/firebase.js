// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCec9ceAYzLCORW9FdY3qnSLnpawzgF8ho",
  authDomain: "dormitory-3420f.firebaseapp.com",
  projectId: "dormitory-3420f",
  storageBucket: "dormitory-3420f.appspot.com",
  messagingSenderId: "478185195166",
  appId: "1:478185195166:web:741f443708d8a6e4521d8f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };