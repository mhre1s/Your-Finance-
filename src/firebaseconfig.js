// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app)
