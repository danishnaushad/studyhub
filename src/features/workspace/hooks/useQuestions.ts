import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import type { Question } from '../../../types';
import { useAuth } from '../../../hooks/useAuth';

export function useQuestions(categoryId: string) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !categoryId) {
      setQuestions([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'questions'),
      where('userId', '==', user.uid),
      where('categoryId', '==', categoryId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: Question[] = [];
      snapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() } as Question);
      });
      // Fallback: Client-side sorting to bypass composite index requirement
      docs.sort((a, b) => b.createdAt - a.createdAt);
      setQuestions(docs);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error('Error fetching questions:', err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid, categoryId]);

  return { questions, loading, error };
}

export function useAllQuestions() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setQuestions([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'questions'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: Question[] = [];
      snapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() } as Question);
      });
      // Fallback: Client-side sorting to bypass composite index requirement
      docs.sort((a, b) => b.createdAt - a.createdAt);
      setQuestions(docs);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error('Error fetching all questions:', err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  return { questions, loading, error };
}
