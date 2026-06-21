import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import type { Note } from '../../../types';
import { useAuth } from '../../../hooks/useAuth';


export function useNotes(categoryId: string) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !categoryId) {
      setNotes([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'notes'),
      where('userId', '==', user.uid),
      where('categoryId', '==', categoryId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: Note[] = [];
      snapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() } as Note);
      });
      docs.sort((a, b) => b.updatedAt - a.updatedAt);
      setNotes(docs);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching notes:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, categoryId]);

  return { notes, loading };
}
