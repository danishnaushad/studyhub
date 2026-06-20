import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './useAuth';
import { categoriesService } from '../features/categories/services/categories.service';
import { useDemo } from '../contexts/DemoContext';

export interface Category {
  id: string;
  userId: string;
  name: string;
  color: string;
  targetMinutes: number;
  isArchived?: boolean;
  createdAt: number;
}

const DEMO_CATEGORIES: Category[] = [
  { id: 'demo-cat-1', userId: 'demo-user', name: 'Cyber Security', color: 'blue', targetMinutes: 90, createdAt: Date.now() - 100000 },
  { id: 'demo-cat-2', userId: 'demo-user', name: 'Python Fundamentals', color: 'green', targetMinutes: 60, createdAt: Date.now() - 80000 },
  { id: 'demo-cat-3', userId: 'demo-user', name: 'Web Development', color: 'yellow', targetMinutes: 45, createdAt: Date.now() - 60000 },
  { id: 'demo-cat-4', userId: 'demo-user', name: 'Networking', color: 'purple', targetMinutes: 30, createdAt: Date.now() - 40000 },
];

export function useCategories() {
  const { user } = useAuth();
  const { isDemo } = useDemo();
  const [categories, setCategories] = useState<Category[]>(isDemo ? DEMO_CATEGORIES : []);
  const [loading, setLoading] = useState(!isDemo);

  useEffect(() => {
    if (isDemo) return;
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
