import { db } from '../config/firebase';
import { collection, doc, writeBatch, getCountFromServer, updateDoc } from 'firebase/firestore';
import { useFocusStore } from '../store/focusStore';
import { useAuthStore } from '../store/authStore';

export const migrationService = {
  migrateToCloud: async (userId: string) => {
    try {
      const userState = useAuthStore.getState().user;
      if (!userState || userState.hasMigratedToCloud) return;

      const { history, dailyTargets } = useFocusStore.getState();
      if (history.length === 0) {
        // If they have no history, just mark as migrated and skip
        await updateDoc(doc(db, 'users', userId), { hasMigratedToCloud: true });
        useAuthStore.setState({ user: { ...userState, hasMigratedToCloud: true } });
        return;
      }

      // 1. Check current cloud count
      const sessionsRef = collection(db, 'sessions');
      const countSnapshot = await getCountFromServer(sessionsRef);
      if (countSnapshot.data().count > 0) {
        // Already has data, mark migrated to prevent duplication
        await updateDoc(doc(db, 'users', userId), { hasMigratedToCloud: true });
        useAuthStore.setState({ user: { ...userState, hasMigratedToCloud: true } });
        return;
      }

      // 2. Perform Migration Batch
      const batch = writeBatch(db);

      // Add Sessions (permanently keeping local history intact as fallback)
      history.forEach(session => {
        const sessionRef = doc(db, 'sessions', session.id);
        batch.set(sessionRef, { ...session, userId });
      });

      // Update Category Targets (moving from local to cloud)
      for (const [catId, target] of Object.entries(dailyTargets)) {
        const catRef = doc(db, 'categories', catId);
        batch.update(catRef, { targetMinutes: target });
      }

      await batch.commit();

      // 3. Verify Migration using getCountFromServer before flagging true
      const newCountSnapshot = await getCountFromServer(sessionsRef);
      if (newCountSnapshot.data().count >= history.length) {
        await updateDoc(doc(db, 'users', userId), { hasMigratedToCloud: true });
        useAuthStore.setState({ user: { ...userState, hasMigratedToCloud: true } });
        console.log('Migration verified and complete.');
      } else {
        console.warn('Migration verification failed: Cloud count mismatch. Retrying later.');
      }
    } catch (err) {
      console.error('Cloud migration failed:', err);
    }
  }
};
