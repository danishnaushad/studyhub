import { db, auth } from '../../../config/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  query,
  where,
  increment,
  getDoc
} from 'firebase/firestore';
import type { Sprint, SprintMetric } from '../../../types';
import { getLocalYYYYMMDD } from '../../../lib/date';

export const sprintsService = {
  createSprint: async (data: Omit<Sprint, 'id' | 'userId' | 'createdAt' | 'currentValue'>) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    // Verify no active sprint for this category
    const q = query(
      collection(db, 'sprints'), 
      where('userId', '==', user.uid),
      where('categoryId', '==', data.categoryId),
      where('status', '==', 'active')
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      throw new Error('An active sprint already exists for this category.');
    }

    const newSprint: any = {
      ...data,
      userId: user.uid,
      currentValue: data.initialValue,
      createdAt: Date.now()
    };

    const docRef = await addDoc(collection(db, 'sprints'), newSprint);
    return docRef.id;
  },

  updateSprint: async (id: string, data: Partial<Sprint>) => {
    const sprintRef = doc(db, 'sprints', id);
    
    // If setting to active, we must ensure no other active sprint exists for this category
    if (data.status === 'active') {
      const currentDoc = await getDoc(sprintRef);
      if (currentDoc.exists()) {
        const currentData = currentDoc.data() as Sprint;
        const q = query(
          collection(db, 'sprints'), 
          where('userId', '==', currentData.userId),
          where('categoryId', '==', currentData.categoryId),
          where('status', '==', 'active')
        );
        const snapshot = await getDocs(q);
        const hasOtherActive = snapshot.docs.some(d => d.id !== id);
        if (hasOtherActive) {
          throw new Error('An active sprint already exists for this category.');
        }
      }
    }

    await updateDoc(sprintRef, data);
  },

  deleteSprint: async (id: string) => {
    const sprintRef = doc(db, 'sprints', id);
    await deleteDoc(sprintRef);
  },

  incrementProgress: async (categoryId: string, metric: SprintMetric, amount: number) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const q = query(
        collection(db, 'sprints'),
        where('userId', '==', user.uid),
        where('categoryId', '==', categoryId),
        where('status', '==', 'active')
      );
      
      const snapshot = await getDocs(q);
      if (snapshot.empty) return;

      const activeSprint = snapshot.docs[0];
      const sprintData = activeSprint.data() as Sprint;

      if (sprintData.metric === metric) {
        const todayStr = getLocalYYYYMMDD();
        await updateDoc(activeSprint.ref, {
          currentValue: increment(amount),
          [`progressMap.${todayStr}`]: increment(amount)
        });
      }
    } catch (error) {
      console.error('Failed to increment sprint progress:', error);
    }
  }
};
