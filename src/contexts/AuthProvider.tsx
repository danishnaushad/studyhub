import React, { createContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { useAuthStore } from '../store/authStore';
import type { UserProfile } from '../types';

export const AuthContext = createContext<{}>({});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      // Clean up previous snapshot listener if auth state changes
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = undefined;
      }

      if (firebaseUser) {
        // Subscribe to the user's Firestore document
        unsubscribeSnapshot = onSnapshot(
          doc(db, 'users', firebaseUser.uid),
          (userDoc) => {
            if (userDoc.exists()) {
              const loadedUser = { uid: firebaseUser.uid, ...userDoc.data() } as UserProfile;
              setUser(loadedUser);
              
              // Trigger cloud migration if needed
              if (!loadedUser.hasMigratedToCloud) {
                import('../services/migration.service').then(({ migrationService }) => {
                  migrationService.migrateToCloud(firebaseUser.uid);
                });
              }
            } else {
              // Fallback right after registration before the Firestore doc is created
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                onboardingComplete: false,
                createdAt: Date.now(),
              });
            }
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching user profile:", error);
            setUser(null);
            setLoading(false);
          }
        );
      } else {
        // No user logged in
        setUser(null);
        setLoading(false);
      }
    });

    // Cleanup both listeners when the provider unmounts
    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, [setUser, setLoading]);

  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  );
};
