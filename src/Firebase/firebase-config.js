import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAw4rQkZ__S1NqsBiTFW__SDZBibDa7Lhc",
  authDomain: "auth-6247e.firebaseapp.com",
  projectId: "auth-6247e",
  storageBucket: "auth-6247e.appspot.com",
  messagingSenderId: "1088400897860",
  appId: "1:1088400897860:web:14285d1d05016850590911",
  measurementId: "G-Z19EEST18S"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);