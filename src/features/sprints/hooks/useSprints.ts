import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../../config/firebase';
import type { Sprint } from '../../../types';

import { useDemo } from '../../../contexts/DemoContext';

const DEMO_SPRINTS: Sprint[] = [
  {
    id: 'demo-sprint-1',
    userId: 'demo-user',
    categoryId: 'demo-cat-1',
    name: 'Complete Cyber Security 101',
    targetValue: 20 * 60, // 20 hours in minutes
    currentValue: 12 * 60, // 12 hours in minutes
    targetDate: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
    startDate: Date.now() - 5 * 24 * 60 * 60 * 1000,
    status: 'active',
    sprintType: 'course',
    metric: 'hours',
    initialValue: 0,
    createdAt: Date.now()
  }
];

export function useSprints(categoryId?: string) {
  const { isDemo } = useDemo();
  const [sprints, setSprints] = useState<Sprint[]>(isDemo ? (categoryId && categoryId !== 'demo-cat-1' ? [] : DEMO_SPRINTS) : []);
  const [loading, setLoading] = useState(!isDemo);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isDemo) return;
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    let q;
    if (categoryId) {
      q = query(
        collection(db, 'sprints'),
        where('userId', '==', user.uid),
        where('categoryId', '==', categoryId)
        // Removed orderBy('createdAt', 'desc') to avoid requiring composite indexes temporarily
      );
    } else {
      q = query(
        collection(db, 'sprints'),
        where('userId', '==', user.uid)
        // Removed orderBy('createdAt', 'desc') to avoid requiring composite indexes temporarily
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sprintData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Sprint[];
      
      // Client-side sorting as a temporary fallback to bypass composite index requirement
      sprintData.sort((a, b) => b.createdAt - a.createdAt);
      
      setSprints(sprintData);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error("Error fetching sprints:", err);
      setError(err.message || "Failed to load sprints");
      setSprints([]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [categoryId, auth.currentUser?.uid]);

  return { sprints, loading, error };
}
