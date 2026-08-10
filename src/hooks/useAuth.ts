import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';

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
        let dummyProfile = JSON.parse(dummyUser);
        // Sanitize old names
        if (dummyProfile.nome === 'Kris Ty Oya' || dummyProfile.nome === 'Kris') {
          dummyProfile.nome = 'Krys Ty Oya';
          localStorage.setItem('dummyUser', JSON.stringify(dummyProfile));
        } else if (dummyProfile.nome === 'Consulente Convidado' || dummyProfile.nome === 'Consulente' || dummyProfile.nome === 'Cliente') {
          dummyProfile.nome = 'Visitante Convidado';
          localStorage.setItem('dummyUser', JSON.stringify(dummyProfile));
        }
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
    let unsubscribeProfile: (() => void) | null = null;
    try {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (unsubscribeProfile) {
          unsubscribeProfile();
          unsubscribeProfile = null;
        }
        if (!isMounted) return;
        try {
          setUser(firebaseUser);
          
          if (firebaseUser) {
            try {
              // Check and fetch user profile in Firestore
              const userRef = doc(db, 'users', firebaseUser.uid);
              const userSnap = await getDoc(userRef);
              
              if (!userSnap.exists()) {
                // Create new profile
                const isAdmin = firebaseUser.email?.toLowerCase() === 'beentoowell@gmail.com' || firebaseUser.email?.toLowerCase() === 'cartomante@veusdemulambo.com' || firebaseUser.email?.toLowerCase() === 'veusdemulambo@gmail.com';
                const newProfile: UserProfile = {
                  uid: firebaseUser.uid,
                  nome: firebaseUser.displayName || (isAdmin ? 'Krys Ty Oya' : 'Visitante Convidada'),
                  email: firebaseUser.email,
                  fotoPerfil: isAdmin ? '/images/avatar.png' : firebaseUser.photoURL,
                  role: isAdmin ? 'admin' : 'cliente',
                  dataCriacao: serverTimestamp(),
                  ultimaAtividade: serverTimestamp(),
                };
                await setDoc(userRef, newProfile).catch(() => {});
              }

              // Listen to profile updates in real-time
              unsubscribeProfile = onSnapshot(userRef, (docSnap) => {
                if (!isMounted) return;
                if (docSnap.exists()) {
                  let data = docSnap.data() as UserProfile;
                  
                  // Auto-promote if email matches admin email (case insensitive)
                  if ((data.email?.toLowerCase() === 'beentoowell@gmail.com' || data.email?.toLowerCase() === 'cartomante@veusdemulambo.com' || data.email?.toLowerCase() === 'veusdemulambo@gmail.com') && data.role !== 'admin') {
                    data.role = 'admin';
                    setDoc(userRef, { role: 'admin' }, { merge: true }).catch(() => {});
                  }

                  if (data.role === 'admin' && (data.nome === 'Kris Ty Oya' || data.nome === 'Kris' || !data.nome)) {
                    data.nome = 'Krys Ty Oya';
                  }
                  if (data.role === 'cliente' && (data.nome === 'Consulente' || data.nome === 'Consulente Convidado' || !data.nome)) {
                    data.nome = 'Visitante Convidada';
                  }

                  if (data.role === 'admin' && (!data.fotoPerfil || data.fotoPerfil.includes('unsplash'))) {
                    data.fotoPerfil = '/images/avatar.png';
                  }
                  
                  setProfile({ ...data });
                }
              }, (err) => {
                console.error("Profile Snapshot Error:", err);
              });
              
              // Update last activity
              await setDoc(userRef, { ultimaAtividade: serverTimestamp() }, { merge: true }).catch(() => {});
            } catch (firestoreErr) {
              console.error("Firestore Profile Error:", firestoreErr);
              // Fallback profile if Firestore fails (e.g. offline / permission / quota)
              const isAdmin = firebaseUser.email?.toLowerCase() === 'beentoowell@gmail.com' || firebaseUser.email?.toLowerCase() === 'cartomante@veusdemulambo.com' || firebaseUser.email?.toLowerCase() === 'veusdemulambo@gmail.com';
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
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, []);

  return { user, profile, loading };
}
