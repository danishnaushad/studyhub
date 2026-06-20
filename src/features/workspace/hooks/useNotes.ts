import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import type { Note } from '../../../types';
import { useAuth } from '../../../hooks/useAuth';
import { useDemo } from '../../../contexts/DemoContext';

const DEMO_NOTES: Note[] = [
  { id: 'note-1', categoryId: 'demo-cat-1', userId: 'demo-user', title: 'Linux Commands', content: 'ls, cd, pwd, grep, awk...', createdAt: Date.now() - 100000, updatedAt: Date.now() - 100000 },
  { id: 'note-2', categoryId: 'demo-cat-2', userId: 'demo-user', title: 'Python Variables', content: 'int, str, float, bool, list, dict, set, tuple...', createdAt: Date.now() - 200000, updatedAt: Date.now() - 200000 },
  { id: 'note-3', categoryId: 'demo-cat-1', userId: 'demo-user', title: 'OWASP Top 10', content: 'Injection, Broken Auth, Sensitive Data Exposure...', createdAt: Date.now() - 300000, updatedAt: Date.now() - 300000 },
  { id: 'note-4', categoryId: 'demo-cat-1', userId: 'demo-user', title: 'Study Planning', content: 'Focus on networking first, then move to web dev...', createdAt: Date.now() - 400000, updatedAt: Date.now() - 400000 }
];

export function useNotes(categoryId: string) {
  const { user } = useAuth();
  const { isDemo } = useDemo();
  const [notes, setNotes] = useState<Note[]>(isDemo ? DEMO_NOTES.filter(n => n.categoryId === categoryId) : []);
  const [loading, setLoading] = useState(!isDemo);

  useEffect(() => {
    if (isDemo) return;
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
