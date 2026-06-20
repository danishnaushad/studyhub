import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as updateFirebaseProfile,
  sendPasswordResetEmail
} from 'firebase/auth';

import {
  doc,
  setDoc
} from 'firebase/firestore';

import type { UserProfile } from '../../../types';
import { auth, db } from '../../../config/firebase';

export const authService = {
  async register(email: string, pass: string, name: string) {
    console.log('REGISTER START');
    const { user } = await createUserWithEmailAndPassword(auth, email, pass);
    await updateFirebaseProfile(user, { displayName: name });

    const profile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: name,
      photoURL: null,
      onboardingComplete: false,
      createdAt: Date.now()
    };

    console.log('BEFORE setDoc', user.uid);
    await setDoc(doc(db, 'users', user.uid), profile);
    console.log('AFTER setDoc');

    return user;
  },

  async login(email: string, pass: string) {
    const { user } = await signInWithEmailAndPassword(auth, email, pass);
    return user;
  },

  async logout() {
    await signOut(auth);
  },

  async updateProfile(uid: string, data: Partial<UserProfile>) {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, data, { merge: true });
  },

  async resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
  }
};
