import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDi3H6dr-oHbDwO2Vx97WN_NF3X0aHlDLQ",
  authDomain: "campusnest-f2933.firebaseapp.com",
  projectId: "campusnest-f2933",
  storageBucket: "campusnest-f2933.firebasestorage.app",
  messagingSenderId: "2824502361",
  appId: "1:2824502361:web:0103ed2f0a816c52488548",
  measurementId: "G-RZQVDE90PH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); 