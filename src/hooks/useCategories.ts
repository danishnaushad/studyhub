import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './useAuth';
import { categoriesService } from '../features/categories/services/categories.service';

export interface Category {
  id: string;
  userId: string;
  name: string;
  color: string;
  targetMinutes: number;
  isArchived?: boolean;
  createdAt: number;
}


export function useCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTimeout(() => {
        setCategories([]);
        setLoading(false);
      }, 0);
      return;
    }

    const q = query(collection(db, 'categories'), where('userId', '==', user.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("CURRENT USER UID:", user?.uid);

      snapshot.docs.forEach(doc => {
        console.log({
          category: doc.data().name,
          userId: doc.data().userId
        });
      });

      const data = snapshot.docs.map((doc) => doc.data() as Category);
      // Sort by createdAt client-side to avoid needing a composite index immediately
      data.sort((a, b) => a.createdAt - b.createdAt);
      setCategories(data);
      setLoading(false);

      // Async migration for legacy hex colors
      categoriesService.migrateCategoryColors(data).catch(console.error);
    }, (error) => {
      console.error('Error fetching categories:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { categories, loading };
}
