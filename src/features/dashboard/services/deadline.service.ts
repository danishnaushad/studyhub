import { db } from '../../../config/firebase';
import { collection, query, where, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';

export interface Deadline {
  id: string;
  userId: string;
  title: string;
  targetDate: string; // YYYY-MM-DD format usually, or ISO
  categoryId?: string;
  type?: 'event' | 'deadline';
  createdAt: number;
}

export const getDeadlines = async (userId: string): Promise<Deadline[]> => {
  const q = query(collection(db, 'deadlines'), where('userId', '==', userId));
  const snap = await getDocs(q);
  const deadlines: Deadline[] = [];
  snap.forEach(doc => deadlines.push(doc.data() as Deadline));
  return deadlines.sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());
};

export const createDeadline = async (data: Omit<Deadline, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = doc(collection(db, 'deadlines'));
  const newDeadline: Deadline = {
    ...data,
    id: docRef.id,
    createdAt: Date.now()
  };
  await setDoc(docRef, newDeadline);
  return docRef.id;
};

export const updateDeadline = async (id: string, data: Partial<Deadline>): Promise<void> => {
  const docRef = doc(db, 'deadlines', id);
  await updateDoc(docRef, data);
};

export const deleteDeadline = async (id: string): Promise<void> => {
  const docRef = doc(db, 'deadlines', id);
  await deleteDoc(docRef);
};
