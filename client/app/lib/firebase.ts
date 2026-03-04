// client/app/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// --- PASTE YOUR KEYS FROM FIREBASE CONSOLE BELOW ---
const firebaseConfig = {
  apiKey: "AIzaSyDY9076IEMcWbQOf2Q1AAyt8_Sylq_n3pw", 
  authDomain: "smartfunnel-backend.firebaseapp.com",
  projectId: "smartfunnel-backend",
  storageBucket: "smartfunnel-backend.firebasestorage.app",
  messagingSenderId: "1073583281976",
  appId: "1:1073583281976:web:78b4b306169d4f3b8393cd"
};
// ---------------------------------------------------

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the tools we need
export const auth = getAuth(app);
export const db = getFirestore(app);