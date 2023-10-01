// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth,GoogleAuthProvider} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNf9gPljPao2kW43HkQXzVUDd8GMp7dJ4",
  authDomain: "login-29ec3.firebaseapp.com",
  projectId: "login-29ec3",
  storageBucket: "login-29ec3.appspot.com",
  messagingSenderId: "264167581719",
  appId: "1:264167581719:web:7c0939ea8ceb1238e85452",
  measurementId: "G-MWTHWF7XC1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const analytics = getAnalytics(app);

export {auth,provider};