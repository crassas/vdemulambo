import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence, inMemoryPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import firebaseAppletConfig from '../../firebase-applet-config.json';

const firebaseConfig = firebaseAppletConfig;

const app = initializeApp(firebaseConfig);

// Initialize App Check (reCAPTCHA Enterprise / v3)
let appCheck = null;
if (typeof window !== 'undefined') {
  try {
    const recaptchaKey = firebaseAppletConfig.recaptchaSiteKey;
    if (recaptchaKey) {
      appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider(recaptchaKey),
        isTokenAutoRefreshEnabled: true
      });
    }
  } catch (error) {
    console.error("App Check failed to initialize", error);
  }
}

export const auth = getAuth(app);

// Safe persistence for iOS Safari / Private mode
try {
  setPersistence(auth, browserLocalPersistence).catch(() => {
    setPersistence(auth, inMemoryPersistence).catch(() => {});
  });
} catch (e) {
  // Ignore persistence errors on strict browsers
}

const dbId = firebaseAppletConfig.firestoreDatabaseId || "(default)";
export const db = getFirestore(app, dbId);
export const googleProvider = new GoogleAuthProvider();

export { app, appCheck };
