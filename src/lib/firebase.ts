
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// For development - these are mock config values
const firebaseConfig = {
  apiKey: "AIzaSyA1234567890-mock-key",
  authDomain: "shukchail-alumni.firebaseapp.com",
  projectId: "shukchail-alumni",
  storageBucket: "shukchail-alumni.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:1234567890abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
