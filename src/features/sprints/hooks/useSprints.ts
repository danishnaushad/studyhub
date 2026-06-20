import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../../config/firebase';
import type { Sprint } from '../../../types';

export function useSprints(categoryId?: string) {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
