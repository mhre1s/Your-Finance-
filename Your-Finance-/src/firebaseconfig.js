// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAp8SCzEe0EMgW3hz_hS7RE1ZeBch7pOZY",
  authDomain: "your-finances-db.firebaseapp.com",
  databaseURL: "https://your-finances-db-default-rtdb.firebaseio.com",
  projectId: "your-finances-db",
  storageBucket: "your-finances-db.firebasestorage.app",
  messagingSenderId: "449765606754",
  appId: "1:449765606754:web:8e27ad07bbbe412216583b",
  measurementId: "G-ZQF46P5HVY"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };