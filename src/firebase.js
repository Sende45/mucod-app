// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions"; // <--- AJOUT : Service pour Stripe

const firebaseConfig = {
  apiKey: "AIzaSyBMvMCaDUC-QNzlXN5VFXvVO6pKR5F942g",
  authDomain: "mucod-app.firebaseapp.com",
  projectId: "mucod-app",
  storageBucket: "mucod-app.firebasestorage.app",
  messagingSenderId: "561201413611",
  appId: "1:561201413611:web:37f3de53f59f3abc6d6dae",
  measurementId: "G-1JXXSZJPVE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// --- EXPORTS POUR TON APPLICATION ---
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app); // <--- AJOUT : Exportation pour Stripe

export default app;