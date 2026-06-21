import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import type { Resource } from '../../../types';
import { useAuth } from '../../../hooks/useAuth';



export function useResources(categoryId: string) {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !categoryId) {
      setResources([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'resources'),
      where('userId', '==', user.uid),
      where('categoryId', '==', categoryId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: Resource[] = [];
      snapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() } as Resource);
      });
      docs.sort((a, b) => b.createdAt - a.createdAt);
      setResources(docs);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching resources:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, categoryId]);

  return { resources, loading };
}
