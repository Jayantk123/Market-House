// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNd4WCgmOA3LLoCFaaLvYaQhsSXUJ3Ilg",
  authDomain: "market-house-app-e7094.firebaseapp.com",
  projectId: "market-house-app-e7094",
  storageBucket: "market-house-app-e7094.appspot.com",
  messagingSenderId: "267564124954",
  appId: "1:267564124954:web:d707dac6d241512c77faa3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore()