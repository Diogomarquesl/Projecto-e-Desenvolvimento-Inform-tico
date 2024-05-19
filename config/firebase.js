// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {getFirestore, initializeFirestore} from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyBr8V7MezJSBXJ_omEor_a1DiW-n35j4ew",
  authDomain: "pdinon2.firebaseapp.com",
  projectId: "pdinon2",
  storageBucket: "pdinon2.appspot.com",
  messagingSenderId: "479385363922",
  appId: "1:479385363922:web:cc369b1a68d5948453540b",
  measurementId: "G-DC9XYHNW4E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {experimentalForceLongPolling  : true}
  )
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
//const auth = getAuth(app);
console.log("app");
export {app,db,auth};