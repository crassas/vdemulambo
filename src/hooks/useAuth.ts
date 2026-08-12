import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';

const ADMIN_EMAIL = 'veusdemulambo@gmail.com';

function isAdminAccount(email: string | null | undefined) {
  return email?.trim().toLowerCase() === ADMIN_EMAIL;
}

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
                const isAdmin = isAdminAccount(firebaseUser.email);
                const newProfile: UserProfile = {
                  uid: firebaseUser.uid,
                  nome: firebaseUser.displayName || (isAdmin ? 'Kris Ty Oya' : 'Consulente'),
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
                  const data = docSnap.data() as UserProfile;
                  const trustedRole: UserProfile['role'] = isAdminAccount(firebaseUser.email) ? 'admin' : 'cliente';
                  const trustedProfile = {
                    ...data,
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    role: trustedRole,
                    nome: data.nome || (trustedRole === 'admin' ? 'Kris Ty Oya' : firebaseUser.displayName || 'Consulente'),
                  };

                  if (data.role !== trustedRole) {
                    setDoc(userRef, { role: trustedRole }, { merge: true }).catch(() => {});
                  }

                  if (trustedRole === 'admin' && (!trustedProfile.fotoPerfil || trustedProfile.fotoPerfil.includes('unsplash'))) {
                    trustedProfile.fotoPerfil = '/images/avatar.png';
                  }
                  
                  setProfile(trustedProfile);
                }
              }, (err) => {
                console.error("Profile Snapshot Error:", err);
              });
              
              // Update last activity
              await setDoc(userRef, { ultimaAtividade: serverTimestamp() }, { merge: true }).catch(() => {});
            } catch (firestoreErr) {
              console.error("Firestore Profile Error:", firestoreErr);
              // Fallback profile if Firestore fails (e.g. offline / permission / quota)
              const isAdmin = isAdminAccount(firebaseUser.email);
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
