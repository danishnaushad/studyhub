import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './useAuth';

export interface Category {
  id: string;
  userId: string;
  name: string;
  color: string;
  createdAt: number;
}

export function useCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCategories([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'categories'), where('userId', '==', user.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("Current UID:", user?.uid);
      snapshot.docs.forEach(doc => {
        console.log("Category:", doc.id, doc.data());
      });

      const data = snapshot.docs.map((doc) => doc.data() as Category);
      // Sort by createdAt client-side to avoid needing a composite index immediately
      data.sort((a, b) => a.createdAt - b.createdAt);
      setCategories(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching categories:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { categories, loading };
}
