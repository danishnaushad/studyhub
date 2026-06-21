import { db, auth } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import type { CompletedSession } from '../store/focusStore';

export const analyticsService = {
  saveSession: async (session: CompletedSession) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const sessionRef = doc(db, 'sessions', session.id);
      await setDoc(sessionRef, {
        ...session,
        userId: user.uid
      });
    } catch (error) {
      console.error('Failed to sync session to cloud:', error);
      // Fails silently, Firebase offline persistence will handle retry
    }
  },

  saveStudySession: async (session: Omit<import('../types').StudySession, 'userId'>) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const sessionRef = doc(db, 'study_sessions', session.id);
      await setDoc(sessionRef, {
        ...session,
        userId: user.uid
      });
    } catch (error) {
      console.error('Failed to sync study session to cloud:', error);
    }
  },

  updateStreakTransaction: async (userId: string, todayStr: string, yesterdayStr: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      
      // Dynamic import to avoid top-level bundle errors with transactions if not used
      const { runTransaction } = await import('firebase/firestore');
      
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) return;

        const data = userDoc.data();
        const currentStreak = data.streak || 0;
        const longestStreak = data.longestStreak || 0;
        const lastSessionDate = data.lastSessionDate || '';

        // Calculate new streak
        let newStreak = currentStreak;
        if (lastSessionDate === yesterdayStr) {
          newStreak = currentStreak + 1;
        } else if (lastSessionDate !== todayStr) {
          newStreak = 1;
        }

        const newLongestStreak = Math.max(longestStreak, newStreak);

        // Only update if changes occurred to save writes
        if (lastSessionDate !== todayStr || currentStreak !== newStreak || longestStreak !== newLongestStreak) {
          transaction.update(userRef, {
            streak: newStreak,
            longestStreak: newLongestStreak,
            lastSessionDate: todayStr
          });
        }
      });
    } catch (error) {
      console.error('Failed to run streak transaction:', error);
    }
  },

  updateStudyStreakTransaction: async (userId: string, todayStr: string, yesterdayStr: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      
      const { runTransaction } = await import('firebase/firestore');
      
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) return;

        const data = userDoc.data();
        const currentStreak = data.studyStreak || 0;
        const longestStreak = data.longestStudyStreak || 0;
        const lastStudyDate = data.lastStudyDate || '';

        let newStreak = currentStreak;
        if (lastStudyDate === yesterdayStr) {
          newStreak = currentStreak + 1;
        } else if (lastStudyDate !== todayStr) {
          newStreak = 1;
        }

        const newLongestStreak = Math.max(longestStreak, newStreak);

        if (lastStudyDate !== todayStr || currentStreak !== newStreak || longestStreak !== newLongestStreak) {
          transaction.update(userRef, {
            studyStreak: newStreak,
            longestStudyStreak: newLongestStreak,
            lastStudyDate: todayStr
          });
        }
      });
    } catch (error) {
      console.error('Failed to run study streak transaction:', error);
    }
  }
};
