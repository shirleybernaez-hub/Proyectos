import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDE_N7A_I3Yv8v7f_A_I3Yv8v7f_A",
  authDomain: "marcador-pool-jam.firebaseapp.com",
  projectId: "marcador-pool-jam",
  storageBucket: "marcador-pool-jam.firebasestorage.app",
  messagingSenderId: "69901829645",
  appId: "1:69901829645:web:86f6a7d6e4b8a2c1d0f3e2",
  measurementId: "G-ESLCX7XEDG"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);