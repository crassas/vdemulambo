import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence, inMemoryPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyA_cxNz8A15r12t8dD7mXRdtQG6RGAo2K4",
  authDomain: "tasca-stock-v-1.firebaseapp.com",
  projectId: "tasca-stock-v-1",
  storageBucket: "tasca-stock-v-1.firebasestorage.app",
  messagingSenderId: "100227047106",
  appId: "1:100227047106:web:2c7c05f5d1d95a5c9ae55b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Safe persistence for iOS Safari / Private mode
try {
  setPersistence(auth, browserLocalPersistence).catch(() => {
    setPersistence(auth, inMemoryPersistence).catch(() => {});
  });
} catch (e) {
  // Ignore persistence errors on strict browsers
}

export const db = getFirestore(app, "ai-studio-oaltar-dc5baeae-84df-4d7f-99b0-127f4e29d973");
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Messaging might not work in all environments, but we export it for the future
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;
