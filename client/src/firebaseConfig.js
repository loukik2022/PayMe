import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBwjtVBJDD6NEk58MB0w9xAHCRmy8WNQus",
  authDomain: "auth-699f1.firebaseapp.com",
  projectId: "auth-699f1",
  storageBucket: "auth-699f1.appspot.com",
  messagingSenderId: "675384783253",
  appId: "1:675384783253:web:68180ed7e9e9d3d7ac069c"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth();
const provider = new GoogleAuthProvider();

export { auth, provider };