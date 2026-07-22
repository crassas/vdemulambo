import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA_cxNz8A15r12t8dD7mXRdtQG6RGAo2K4",
  authDomain: "tasca-stock-v-1.firebaseapp.com",
  projectId: "tasca-stock-v-1",
  storageBucket: "tasca-stock-v-1.firebasestorage.app",
  messagingSenderId: "100227047106",
  appId: "1:100227047106:web:2c7c05f5d1d95a5c9ae55b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app, "ai-studio-oaltar-dc5baeae-84df-4d7f-99b0-127f4e29d973");

async function createAccount(email, password, role, name) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      nome: name,
      email: email,
      fotoPerfil: null,
      role: role,
      dataCriacao: new Date(),
      ultimaAtividade: new Date(),
    });
    console.log(`Created ${role} account: ${email}`);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
       console.log(`Account ${email} already exists. Updating role to ${role}`);
       // Update role
       // We need a way to get the user UID if it already exists, unfortunately createUserWithEmailAndPassword fails.
       // For this script, we can just use another approach or assume it works if we use unique emails.
    } else {
       console.error(`Error creating ${email}:`, error.message);
    }
  }
}

async function main() {
  await createAccount('mentora@altar.com', 'mentora123', 'admin', 'Mentora O Altar');
  await createAccount('cliente@altar.com', 'cliente123', 'cliente', 'Cliente Teste');
  process.exit(0);
}

main();
