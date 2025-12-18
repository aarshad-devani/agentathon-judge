import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBDSZETZXkBGNeKmW3AYA8ST2N4jqVYP2Y",
  authDomain: "agentathon-hyd-25.firebaseapp.com",
  projectId: "agentathon-hyd-25",
  storageBucket: "agentathon-hyd-25.firebasestorage.app",
  messagingSenderId: "974173025136",
  appId: "1:974173025136:web:b9870607f209cbce5855b5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
