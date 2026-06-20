import { db } from '../../../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface DailyReflection {
  id: string; // usually userId_YYYY-MM-DD
  userId: string;
  date: string; // YYYY-MM-DD
  learned: string;
  confused: string;
  nextStudy: string;
  createdAt: number;
  updatedAt: number;
}

export const getReflection = async (userId: string, date: string): Promise<DailyReflection | null> => {
  const reflectionId = `${userId}_${date}`;
  const docRef = doc(db, 'reflections', reflectionId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as DailyReflection;
  }
  return null;
};

export const saveReflection = async (
  userId: string, 
  date: string, 
  data: { learned: string; confused: string; nextStudy: string }
): Promise<void> => {
  const reflectionId = `${userId}_${date}`;
  const docRef = doc(db, 'reflections', reflectionId);
  
  await setDoc(docRef, {
    id: reflectionId,
    userId,
    date,
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }, { merge: true });
};
