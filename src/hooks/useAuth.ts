import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  nome: string | null;
  email: string | null;
  fotoPerfil: string | null;
  role: 'cliente' | 'admin';
  dataCriacao: any;
  ultimaAtividade: any;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    // Safety timeout to prevent infinite loading on mobile browsers / strict privacy modes
    const timer = setTimeout(() => {
      if (isMounted && loading) {
        console.warn("Auth loading timeout reached. Forcing loading to false.");
        setLoading(false);
      }
    }, 3000);

    // Check for dummy login first
    try {
      const dummyUser = localStorage.getItem('dummyUser');
      if (dummyUser) {
        const dummyProfile = JSON.parse(dummyUser);
        setUser({ uid: dummyProfile.uid, email: dummyProfile.email, displayName: dummyProfile.nome } as any);
        setProfile(dummyProfile);
        setLoading(false);
        clearTimeout(timer);
        return;
      }
    } catch (e) {
      console.error("LocalStorage error:", e);
    }

    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (!isMounted) return;
        try {
          setUser(firebaseUser);
          
          if (firebaseUser) {
            try {
              // Fetch or create user profile in Firestore
              const userRef = doc(db, 'users', firebaseUser.uid);
              const userSnap = await getDoc(userRef);
              
              if (userSnap.exists()) {
                let data = userSnap.data() as UserProfile;
                
                // Auto-promote if email matches admin email (case insensitive)
                if ((data.email?.toLowerCase() === 'beentoowell@gmail.com' || data.email?.toLowerCase() === 'mentora@altar.com') && data.role !== 'admin') {
                  data.role = 'admin';
                  await setDoc(userRef, { role: 'admin' }, { merge: true }).catch(() => {});
                }
                
                setProfile({ ...data });
                
                // Update last activity
                await setDoc(userRef, { ultimaAtividade: serverTimestamp() }, { merge: true }).catch(() => {});
              } else {
                // Create new profile
                const isAdmin = firebaseUser.email?.toLowerCase() === 'beentoowell@gmail.com' || firebaseUser.email?.toLowerCase() === 'mentora@altar.com';
                const newProfile: UserProfile = {
                  uid: firebaseUser.uid,
                  nome: firebaseUser.displayName || 'Novo Utilizador',
                  email: firebaseUser.email,
                  fotoPerfil: firebaseUser.photoURL,
                  role: isAdmin ? 'admin' : 'cliente',
                  dataCriacao: serverTimestamp(),
                  ultimaAtividade: serverTimestamp(),
                };
                await setDoc(userRef, newProfile).catch(() => {});
                setProfile(newProfile);
              }
            } catch (firestoreErr) {
              console.error("Firestore Profile Error:", firestoreErr);
              // Fallback profile if Firestore fails (e.g. offline / permission / quota)
              const isAdmin = firebaseUser.email?.toLowerCase() === 'beentoowell@gmail.com' || firebaseUser.email?.toLowerCase() === 'mentora@altar.com';
              setProfile({
                uid: firebaseUser.uid,
                nome: firebaseUser.displayName || 'Utilizador',
                email: firebaseUser.email,
                fotoPerfil: firebaseUser.photoURL,
                role: isAdmin ? 'admin' : 'cliente',
                dataCriacao: new Date(),
                ultimaAtividade: new Date(),
              });
            }
          } else {
            setProfile(null);
          }
        } catch (error) {
          console.error("Auth Hook Error:", error);
        } finally {
          if (isMounted) {
            setLoading(false);
            clearTimeout(timer);
          }
        }
      }, (authErr) => {
        console.error("Auth State Error:", authErr);
        if (isMounted) {
          setLoading(false);
          clearTimeout(timer);
        }
      });
    } catch (initErr) {
      console.error("Auth Init Error:", initErr);
      if (isMounted) {
        setLoading(false);
        clearTimeout(timer);
      }
    }

    return () => {
      isMounted = false;
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  return { user, profile, loading };
}
